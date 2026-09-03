"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
import { uploadFile } from "@/lib/api";
import { toast } from "sonner";

export interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "textarea" | "url" | "email" | "number" | "date" | "file" | "select";
  options?: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
}

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  fields: FieldDef[];
  title: string;
  description?: string;
  initialData?: Record<string, string> | null;
}

export function FormDialog({
  open,
  onClose,
  onSubmit,
  fields,
  title,
  description,
  initialData,
}: FormDialogProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      const empty: Record<string, string> = {};
      fields.forEach((f) => (empty[f.key] = ""));
      setFormData(empty);
    }
  }, [initialData, open, fields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent submit if still uploading
    if (Object.values(uploadingFields).some((isUploading) => isUploading)) {
      toast.error("Harap tunggu hingga semua file selesai diunggah.");
      return;
    }
    setIsLoading(true);
    await onSubmit(formData);
    setIsLoading(false);
    onClose();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set uploading state for this specific field
    setUploadingFields((prev) => ({ ...prev, [fieldKey]: true }));

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64String = (reader.result as string).split(",")[1];
        const res = await uploadFile(base64String, file.name, file.type);
        
        if (res.status === "success" && res.url) {
          setFormData((prev) => ({ ...prev, [fieldKey]: res.url as string }));
          toast.success(`File ${file.name} berhasil diunggah!`);
        } else {
          toast.error("Gagal mengunggah file: " + res.message);
        }
      } catch (err) {
        toast.error("Terjadi kesalahan saat mengunggah file.");
      } finally {
        setUploadingFields((prev) => ({ ...prev, [fieldKey]: false }));
      }
    };
    reader.onerror = () => {
      toast.error("Gagal membaca file lokal.");
      setUploadingFields((prev) => ({ ...prev, [fieldKey]: false }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="flex justify-between">
                <span>
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </span>
                {field.type === "file" && uploadingFields[field.key] && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Mengunggah...
                  </span>
                )}
                {field.type === "file" && !uploadingFields[field.key] && formData[field.key] && formData[field.key].startsWith("http") && (
                  <span className="text-xs text-green-600 flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Terunggah
                  </span>
                )}
              </Label>
              
              {field.type === "textarea" ? (
                <textarea
                  id={field.key}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder={field.placeholder || field.label}
                  value={formData[field.key] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  required={field.required}
                />
              ) : field.type === "file" ? (
                <div className="flex flex-col gap-2">
                  <Input
                    id={field.key}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => handleFileUpload(e, field.key)}
                    required={field.required && !formData[field.key]}
                    disabled={uploadingFields[field.key]}
                  />
                  {formData[field.key] && formData[field.key].startsWith("http") && (
                    <div className="text-xs text-muted-foreground break-all">
                      File URL: <a href={formData[field.key]} target="_blank" className="text-brand-primary hover:underline">{formData[field.key]}</a>
                    </div>
                  )}
                </div>
              ) : field.type === "select" ? (
                <select
                  id={field.key}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
                  value={formData[field.key] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  required={field.required}
                >
                  <option value="">
                    {field.placeholder || `-- Pilih ${field.label} --`}
                  </option>
                  {field.options?.map((opt, idx) => (
                    <option key={`${opt.value}-${idx}`} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  id={field.key}
                  type={field.type || "text"}
                  placeholder={field.placeholder || field.label}
                  value={formData[field.key] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  required={field.required}
                />
              )}
            </div>
          ))}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading || Object.values(uploadingFields).some(v => v)}
              className="bg-brand-primary hover:bg-brand-primary-dark text-white"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Simpan Perubahan" : "Tambah Data"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
