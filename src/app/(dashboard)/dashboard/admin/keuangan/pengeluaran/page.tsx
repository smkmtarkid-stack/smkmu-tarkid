"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, FileDown, FileText, Loader2, Plus, RotateCcw, WalletCards } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { printSchoolReport } from "@/lib/report-print";
import { siteConfig } from "@/constants/site";

type Expense = {
  id: string;
  tanggal: string;
  kategori: string;
  deskripsi: string;
  nominal: number | string;
  metode_pembayaran: string;
  status: "active" | "void";
  alasan_void: string | null;
};

type Income = { id: string; tanggal_bayar: string; nominal_bayar: number | string; metode_pembayaran: string };
type LedgerRow = { id: string; tanggal: string; jenis: "Pemasukan" | "Pengeluaran"; keterangan: string; metode: string; nominal: number; status: string };

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export default function PengeluaranPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [schoolAddress, setSchoolAddress] = useState(siteConfig.contact.address);
  const [form, setForm] = useState({ kategori: "Operasional", deskripsi: "", nominal: "", metode_pembayaran: "CASH", tanggal: new Date().toISOString().slice(0, 10) });

  const loadLedger = useCallback(async () => {
    setIsLoading(true);
    const [{ data: expenseData, error: expenseError }, { data: incomeData, error: incomeError }] = await Promise.all([
      supabase.from("pengeluaran_keuangan").select("id, tanggal, kategori, deskripsi, nominal, metode_pembayaran, status, alasan_void").order("tanggal", { ascending: false }),
      supabase.from("transaksi_pembayaran").select("id, tanggal_bayar, nominal_bayar, metode_pembayaran").order("tanggal_bayar", { ascending: false }),
    ]);

    if (expenseError || incomeError) {
      toast.error(`Gagal memuat buku kas: ${(expenseError || incomeError)?.message}`);
    } else {
      setExpenses((expenseData || []) as Expense[]);
      setIncomes((incomeData || []) as Income[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const loadInitialLedger = async () => {
      await loadLedger();
    };
    void loadInitialLedger();
  }, [loadLedger]);

  useEffect(() => {
    const loadSchoolAddress = async () => {
      const { data } = await supabase.from("pengaturan").select("alamat").eq("id", 1).maybeSingle();
      if (data?.alamat?.trim()) setSchoolAddress(data.alamat.trim());
    };
    void loadSchoolAddress();
  }, []);

  const totalPemasukan = incomes.reduce((total, item) => total + Number(item.nominal_bayar), 0);
  const totalPengeluaran = expenses.filter((item) => item.status === "active").reduce((total, item) => total + Number(item.nominal), 0);
  const saldo = totalPemasukan - totalPengeluaran;

  const ledger = useMemo<LedgerRow[]>(() => [
    ...incomes.map((item) => ({ id: `in-${item.id}`, tanggal: item.tanggal_bayar, jenis: "Pemasukan" as const, keterangan: "Pembayaran tagihan siswa", metode: item.metode_pembayaran, nominal: Number(item.nominal_bayar), status: "active" })),
    ...expenses.map((item) => ({ id: `out-${item.id}`, tanggal: item.tanggal, jenis: "Pengeluaran" as const, keterangan: `${item.kategori} — ${item.deskripsi}`, metode: item.metode_pembayaran, nominal: Number(item.nominal), status: item.status })),
  ].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()), [expenses, incomes]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nominal = Number(form.nominal);
    if (!form.kategori.trim() || !form.deskripsi.trim() || !Number.isFinite(nominal) || nominal <= 0) {
      toast.error("Lengkapi kategori, deskripsi, dan nominal pengeluaran yang valid.");
      return;
    }

    setIsSaving(true);
    const { error } = await supabase.from("pengeluaran_keuangan").insert({
      kategori: form.kategori.trim(),
      deskripsi: form.deskripsi.trim(),
      nominal,
      metode_pembayaran: form.metode_pembayaran,
      tanggal: new Date(`${form.tanggal}T12:00:00`).toISOString(),
      dibuat_oleh: (await supabase.auth.getUser()).data.user?.email || null,
    });
    setIsSaving(false);

    if (error) {
      toast.error(`Gagal mencatat pengeluaran: ${error.message}`);
      return;
    }

    toast.success("Pengeluaran berhasil dicatat.");
    setForm((current) => ({ ...current, deskripsi: "", nominal: "" }));
    loadLedger();
  };

  const voidExpense = async (expense: Expense) => {
    const reason = window.prompt("Alasan pembatalan pengeluaran:");
    if (!reason?.trim()) return;
    const { error } = await supabase.from("pengeluaran_keuangan").update({ status: "void", alasan_void: reason.trim(), updated_at: new Date().toISOString() }).eq("id", expense.id);
    if (error) toast.error(`Gagal membatalkan pengeluaran: ${error.message}`);
    else { toast.success("Pengeluaran dibatalkan. Saldo telah dihitung ulang."); loadLedger(); }
  };

  const exportLedger = () => {
    if (ledger.length === 0) {
      toast.error("Belum ada transaksi untuk diekspor.");
      return;
    }

    let runningBalance = 0;
    const exportRows: Record<string, string | number>[] = [...ledger]
      .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
      .map((item, index) => {
        const isVoided = item.status === "void";
        const income = item.jenis === "Pemasukan" ? item.nominal : 0;
        const expense = item.jenis === "Pengeluaran" && !isVoided ? item.nominal : 0;
        runningBalance += income - expense;

        return {
          No: index + 1,
          Tanggal: new Date(item.tanggal).toLocaleString("id-ID"),
          Jenis: item.jenis,
          Keterangan: item.keterangan,
          Metode: item.metode,
          Status: isVoided ? "DIBATALKAN" : "AKTIF",
          "Pemasukan (Rp)": income,
          "Pengeluaran (Rp)": expense,
          "Saldo Berjalan (Rp)": runningBalance,
        };
      });

    exportRows.push({
      No: "",
      Tanggal: "",
      Jenis: "RINGKASAN",
      Keterangan: "Total pemasukan",
      Metode: "",
      Status: "",
      "Pemasukan (Rp)": totalPemasukan,
      "Pengeluaran (Rp)": "",
      "Saldo Berjalan (Rp)": "",
    });
    exportRows.push({
      No: "",
      Tanggal: "",
      Jenis: "RINGKASAN",
      Keterangan: "Total pengeluaran aktif",
      Metode: "",
      Status: "",
      "Pemasukan (Rp)": "",
      "Pengeluaran (Rp)": totalPengeluaran,
      "Saldo Berjalan (Rp)": "",
    });
    exportRows.push({
      No: "",
      Tanggal: "",
      Jenis: "RINGKASAN",
      Keterangan: "Saldo kas tersisa",
      Metode: "",
      Status: "",
      "Pemasukan (Rp)": "",
      "Pengeluaran (Rp)": "",
      "Saldo Berjalan (Rp)": saldo,
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    worksheet["!cols"] = [
      { wch: 6 }, { wch: 22 }, { wch: 15 }, { wch: 42 }, { wch: 14 },
      { wch: 16 }, { wch: 18 }, { wch: 20 }, { wch: 22 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Buku Kas");
    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Laporan_Buku_Kas_${today}.xlsx`);
    toast.success("Laporan buku kas berhasil diunduh.");
  };

  const printLedger = () => {
    const rows = [...ledger]
      .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
      .map((item, index) => ({
        no: index + 1,
        tanggal: new Date(item.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
        uraian: item.keterangan,
        jenis: item.jenis,
        metode: item.metode,
        pemasukan: item.jenis === "Pemasukan" ? formatRupiah(item.nominal) : "-",
        pengeluaran: item.jenis === "Pengeluaran" && item.status !== "void" ? formatRupiah(item.nominal) : "-",
        status: item.status === "void" ? "DIBATALKAN" : "AKTIF",
      }));

    if (!printSchoolReport({
      title: "Laporan Buku Kas",
      subtitle: "Rekapitulasi pemasukan dan pengeluaran sekolah",
      period: "Seluruh periode transaksi",
      address: schoolAddress,
      columns: [
        { key: "no", label: "No.", align: "center" }, { key: "tanggal", label: "Tanggal" },
        { key: "uraian", label: "Uraian" }, { key: "jenis", label: "Jenis" }, { key: "metode", label: "Metode" },
        { key: "pemasukan", label: "Pemasukan", align: "right" }, { key: "pengeluaran", label: "Pengeluaran", align: "right" },
        { key: "status", label: "Status", align: "center" },
      ],
      rows,
      summary: [
        { label: "Total Pemasukan", value: formatRupiah(totalPemasukan) },
        { label: "Total Pengeluaran Aktif", value: formatRupiah(totalPengeluaran) },
        { label: "Saldo Kas Tersisa", value: formatRupiah(saldo) },
      ],
    })) toast.error("Popup diblokir browser. Izinkan popup untuk mencetak laporan.");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengeluaran & Buku Kas</h1>
        <p className="text-muted-foreground mt-1">Pemasukan berasal otomatis dari pembayaran siswa. Catat pengeluaran operasional untuk mendapatkan saldo kas berjalan.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total Pemasukan" value={totalPemasukan} icon={<ArrowUpRight className="h-5 w-5 text-emerald-600" />} color="text-emerald-700" />
        <SummaryCard label="Total Pengeluaran" value={totalPengeluaran} icon={<ArrowDownRight className="h-5 w-5 text-rose-600" />} color="text-rose-700" />
        <SummaryCard label="Saldo Kas Tersisa" value={saldo} icon={<WalletCards className="h-5 w-5 text-blue-600" />} color={saldo >= 0 ? "text-blue-700" : "text-rose-700"} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Catat Pengeluaran</CardTitle><CardDescription>Pengeluaran tercatat sebagai kas keluar dan dapat dibatalkan, bukan dihapus.</CardDescription></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Tanggal"><Input type="date" value={form.tanggal} onChange={(event) => setForm({ ...form, tanggal: event.target.value })} required /></Field>
              <Field label="Kategori"><Input value={form.kategori} onChange={(event) => setForm({ ...form, kategori: event.target.value })} placeholder="Contoh: ATK, Listrik" required /></Field>
              <Field label="Deskripsi"><Textarea value={form.deskripsi} onChange={(event) => setForm({ ...form, deskripsi: event.target.value })} placeholder="Rincian pengeluaran" required /></Field>
              <Field label="Nominal"><Input type="number" min="1" value={form.nominal} onChange={(event) => setForm({ ...form, nominal: event.target.value })} placeholder="0" required /></Field>
              <Field label="Metode"><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.metode_pembayaran} onChange={(event) => setForm({ ...form, metode_pembayaran: event.target.value })}><option>CASH</option><option>TRANSFER</option><option>QRIS</option></select></Field>
              <Button type="submit" disabled={isSaving} className="w-full bg-rose-600 hover:bg-rose-700">{isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}Catat Pengeluaran</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Laporan Buku Kas</CardTitle><CardDescription>Riwayat pemasukan dan pengeluaran terbaru.</CardDescription></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={printLedger} disabled={isLoading}><FileText className="mr-2 h-4 w-4" />Cetak / PDF</Button><Button variant="outline" size="sm" onClick={exportLedger} disabled={isLoading || ledger.length === 0}><FileDown className="mr-2 h-4 w-4" />Unduh Excel</Button><Button variant="outline" size="sm" onClick={loadLedger} disabled={isLoading}><RotateCcw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />Refresh</Button></div></CardHeader>
          <CardContent>
            {isLoading ? <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-emerald-600" /></div> : <div className="max-h-[560px] overflow-auto rounded-lg border"><table className="w-full text-sm"><thead className="sticky top-0 bg-muted"><tr><th className="p-3 text-left">Tanggal</th><th className="p-3 text-left">Keterangan</th><th className="p-3 text-left">Jenis</th><th className="p-3 text-right">Nominal</th><th className="p-3 text-right">Aksi</th></tr></thead><tbody>{ledger.map((item) => <tr key={item.id} className="border-t"><td className="p-3 text-xs whitespace-nowrap">{new Date(item.tanggal).toLocaleDateString("id-ID")}</td><td className="p-3"><p className="font-medium">{item.keterangan}</p><p className="text-xs text-muted-foreground">{item.metode}{item.status === "void" ? " • Dibatalkan" : ""}</p></td><td className={`p-3 font-medium ${item.jenis === "Pemasukan" ? "text-emerald-700" : "text-rose-700"}`}>{item.jenis}</td><td className={`p-3 text-right font-mono font-semibold ${item.status === "void" ? "line-through text-muted-foreground" : item.jenis === "Pemasukan" ? "text-emerald-700" : "text-rose-700"}`}>{item.jenis === "Pemasukan" ? "+" : "-"}{formatRupiah(item.nominal)}</td><td className="p-3 text-right">{item.jenis === "Pengeluaran" && item.status === "active" ? <Button variant="ghost" size="sm" className="text-rose-600" onClick={() => voidExpense(expenses.find((expense) => `out-${expense.id}` === item.id)!)}>Batalkan</Button> : "-"}</td></tr>)}</tbody></table></div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function SummaryCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  return <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>{icon}</CardHeader><CardContent><p className={`text-2xl font-bold ${color}`}>{formatRupiah(value)}</p></CardContent></Card>;
}
