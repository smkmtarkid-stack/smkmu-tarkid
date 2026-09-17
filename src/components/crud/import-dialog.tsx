"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2, FileSpreadsheet, XCircle } from "lucide-react";
import { FieldDef } from "./form-dialog";
import { toast } from "sonner";
import * as XLSX from "xlsx";

function normalizeHeader(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function formatImportedValue(value: unknown, type?: FieldDef["type"]) {
  if (type === "date" && typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
    }
  }

  return String(value).trim();
}

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>[]) => Promise<void>;
  fields: FieldDef[];
  title?: string;
}

export function ImportDialog({
  open,
  onClose,
  onSubmit,
  fields,
  title = "Import Data dari Excel/CSV",
}: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<Record<string, any>[]>([]);
  const [mappingError, setMappingError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter fields to only get data entry fields (exclude file fields for now as they can't be imported easily)
  const dataFields = fields.filter(f => f.type !== "file");

  const resetState = () => {
    setFile(null);
    setPreviewData([]);
    setMappingError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    resetState();
    onClose();
  };

  const processFile = async (selectedFile: File) => {
    setIsProcessing(true);
    setFile(selectedFile);
    
    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Some school templates put a title above the table. Find the first row
      // that contains a known field name, then use that row as the Excel header.
      const acceptedHeaders = dataFields.flatMap((field) =>
        [field.key, field.label, ...(field.importAliases || [])].map(normalizeHeader)
      );
      const sheetRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
        header: 1,
        defval: "",
      });
      const headerRowIndex = sheetRows.findIndex((row) =>
        row.some((cell) => acceptedHeaders.includes(normalizeHeader(String(cell))))
      );

      if (headerRowIndex === -1) {
        const message = "Kolom file tidak dikenali. Gunakan header yang ditampilkan atau variasi seperti Nama Guru, NIP, NUPTK, dan Jabatan.";
        setMappingError(message);
        toast.error(message);
        return;
      }

      const json = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
        range: headerRowIndex,
        defval: "",
      });
      if (json.length === 0) {
        toast.error("File Excel/CSV kosong atau format tidak sesuai.");
        setFile(null);
        return;
      }

      const headers = Object.keys(json[0]);
      const matchedHeaders = new Map(
        dataFields.map((field) => {
          const fieldHeaders = [field.key, field.label, ...(field.importAliases || [])]
            .map(normalizeHeader);
          const header = headers.find((headerName) => fieldHeaders.includes(normalizeHeader(headerName)));
          return [field.key, header] as const;
        })
      );

      // Map headers after removing differences in capitalization, spaces, underscores, and punctuation.
      const normalizedData = json.map(row => {
        const newRow: Record<string, any> = {};

        dataFields.forEach(field => {
          const matchedKey = matchedHeaders.get(field.key);

          if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== "") {
            newRow[field.key] = formatImportedValue(row[matchedKey], field.type);
          }
        });
        
        return newRow;
      });

      // Filter out completely empty rows
      const validData = normalizedData.filter(row => Object.keys(row).length > 0);
      if (validData.length === 0) {
        const message = "Tidak ada nilai data yang dapat diimpor dari file ini.";
        setMappingError(message);
        toast.error(message);
        return;
      }

      setMappingError("");
      setPreviewData(validData);
    } catch (error) {
      console.error(error);
      toast.error("Gagal membaca file. Pastikan format file adalah .xlsx atau .csv");
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (previewData.length === 0) return;
    
    setIsProcessing(true);
    try {
      await onSubmit(previewData);
      handleClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Unggah file .xlsx atau .csv untuk menambahkan banyak data sekaligus.
            Pastikan baris pertama berisi nama kolom seperti: 
            <span className="font-mono text-xs bg-slate-100 p-1 rounded ml-1 text-slate-800">
              {dataFields.map(f => f.key).join(", ")}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {!file ? (
            <div 
              className="border-2 border-dashed border-slate-300 rounded-lg p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".xlsx, .xls, .csv" 
                className="hidden" 
              />
              <FileUp className="w-10 h-10 text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Klik untuk memilih file Excel / CSV</p>
              <p className="text-xs text-slate-500 mt-1">Maksimal 5MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-md">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-sm text-emerald-800">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={resetState}>
                  <XCircle className="h-4 w-4 text-slate-400 hover:text-rose-500" />
                </Button>
              </div>

              {mappingError && (
                <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                  {mappingError}
                </p>
              )}

              {previewData.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-slate-100 p-2 text-xs font-semibold border-b text-slate-600 flex justify-between">
                    <span>Preview Data ({previewData.length} baris terbaca)</span>
                  </div>
                  <div className="max-h-[300px] overflow-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left border-b w-10">#</th>
                          {dataFields.map(f => (
                            <th key={f.key} className="px-3 py-2 text-left border-b">{f.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.slice(0, 50).map((row, idx) => (
                          <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                            <td className="px-3 py-2 text-slate-500">{idx + 1}</td>
                            {dataFields.map(f => (
                              <td key={f.key} className="px-3 py-2">
                                {row[f.key] ? (
                                  <span className="text-slate-800">{row[f.key]}</span>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {previewData.length > 50 && (
                      <div className="p-2 text-center text-xs text-slate-500 bg-slate-50 border-t">
                        Menampilkan 50 data pertama dari {previewData.length} data.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isProcessing}>Batal</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!file || previewData.length === 0 || isProcessing}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...
              </>
            ) : (
              <>Simpan {previewData.length > 0 ? previewData.length : ""} Data</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
