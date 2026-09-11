"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Printer, Smartphone } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ReceiptItem = { name: string; amount: number | string };
type ReceiptData = { id: string; date: string; studentName: string; nisn: string; className: string; items: ReceiptItem[]; total: number; cashier: string; paymentMethod: string };

// Code 39 is broadly readable by standard barcode scanners and needs no third-party library.
const CODE_39: Record<string, string> = {
  "0": "nnnwwnwnn", "1": "wnnwnnnnw", "2": "nnwwnnnnw", "3": "wnwwnnnnn", "4": "nnnwwnnnw", "5": "wnnwwnnnn", "6": "nnwwwnnnn", "7": "nnnwnnwnw", "8": "wnnwnnwnn", "9": "nnwwnnwnn", "A": "wnnnnwnnw", "B": "nnwnnwnnw", "C": "wnwnnwnnn", "D": "nnnnwwnnw", "E": "wnnnwwnnn", "F": "nnwnwwnnn", "-": "nnnnwnnww", "*": "nwnnwnwnn",
};

function ReceiptBarcode({ value }: { value: string }) {
  const units = `*${value.toUpperCase()}*`.split("").flatMap((character) => [...(CODE_39[character] || CODE_39["-"]), "n"]);
  const width = units.reduce((total, unit) => total + (unit === "w" ? 3 : 1), 0) + 20;
  let x = 10;
  return <div className="barcode" aria-label={`Barcode nomor transaksi ${value}`}><svg viewBox={`0 0 ${width} 52`} role="img" preserveAspectRatio="none">{units.map((unit, index) => {
    const unitWidth = unit === "w" ? 3 : 1; const isBar = index % 2 === 0;
    const bar = isBar ? <rect key={index} x={x} y="0" width={unitWidth} height="44" fill="#000" /> : null;
    x += unitWidth; return bar;
  })}</svg><div className="barcode-value">{value}</div></div>;
}

export default function PrintStrukPage() {
  const params = useParams();
  const txId = params.id as string;
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { void fetchData(); }, [txId]);

  const fetchData = async () => {
    try {
      const cleanId = decodeURIComponent(txId).replace("RECEIPT-", "");
      const txIds = cleanId.split(",");
      const transactionFields = "id, nominal_bayar, tanggal_bayar, petugas, id_siswa, id_tagihan, metode_pembayaran";
      let { data: txDataList } = await supabase.from("transaksi_pembayaran").select(transactionFields).in("id", txIds);
      if (!txDataList?.length) {
        const { data: fallbackData } = await supabase.from("transaksi_pembayaran").select(transactionFields).in("id_tagihan", txIds);
        txDataList = fallbackData;
      }
      if (!txDataList?.length) return;

      const firstTx = txDataList[0];
      const finalData: ReceiptData = { id: `TX-${firstTx.id.substring(0, 8).toUpperCase()}`, date: new Date(firstTx.tanggal_bayar).toLocaleString("id-ID"), studentName: "-", nisn: "-", className: "-", items: [], total: 0, cashier: firstTx.petugas || "Admin TU", paymentMethod: firstTx.metode_pembayaran || "CASH" };
      if (firstTx.id_siswa) {
        const { data: siswaData } = await supabase.from("siswa").select("nama, nis, kelas").eq("id", firstTx.id_siswa).single();
        if (siswaData) { finalData.studentName = siswaData.nama; finalData.nisn = siswaData.nis || "-"; finalData.className = siswaData.kelas || "-"; }
      }
      for (const tx of txDataList) {
        let itemName = "Pembayaran Tagihan";
        if (tx.id_tagihan) {
          const { data: tagihanData } = await supabase.from("tagihan_siswa").select("bulan_tagihan, kategori_tagihan(nama_kategori)").eq("id", tx.id_tagihan).single();
          const categoryRelation = tagihanData?.kategori_tagihan as { nama_kategori: string }[] | null | undefined;
          const category = categoryRelation?.[0];
          if (category) { itemName = category.nama_kategori; if (tagihanData?.bulan_tagihan) itemName += ` (${new Date(tagihanData.bulan_tagihan).toLocaleDateString("id-ID", { month: "short", year: "numeric" })})`; }
        }
        finalData.items.push({ name: itemName, amount: tx.nominal_bayar }); finalData.total += Number(tx.nominal_bayar);
      }
      setReceiptData(finalData);
    } catch (error) { console.error("Gagal mengambil data struk", error); } finally { setIsLoading(false); }
  };

  return <>
    <style dangerouslySetInnerHTML={{ __html: `
      @page { size: 80mm auto; margin: 0; } * { box-sizing: border-box; } body { margin: 0; background: #e2e8f0; }
      .receipt-container { width: min(100%, 80mm); min-height: 100vh; margin: 0 auto; padding: 5mm; background: #fff; color: #000; font-family: "Courier New", monospace; font-size: 12px; line-height: 1.35; }
      .receipt-logo { display: block; width: 17mm; height: 17mm; object-fit: contain; margin: 0 auto 2mm; } .school-name { font-family: Arial, sans-serif; font-size: 13px; font-weight: 800; line-height: 1.15; } .school-address { font-size: 10px; line-height: 1.3; margin-top: 1mm; }
      .text-center { text-align: center; } .text-right { text-align: right; } .font-bold { font-weight: bold; } .divider { border-top: 1px dashed #000; margin: 5px 0; } .row { display: flex; justify-content: space-between; gap: 8px; } .row > :last-child { text-align: right; } .item { margin: 4px 0; } .item-name { padding-right: 8px; }
      .barcode { width: 52mm; margin: 5mm auto 0; text-align: center; } .barcode svg { display: block; width: 100%; height: 15mm; } .barcode-value { font-family: Arial, sans-serif; letter-spacing: 1px; font-size: 9px; margin-top: 1px; }
      .print-panel { position: sticky; top: 0; z-index: 10; padding: 12px; background: #064e3b; color: white; font-family: Arial, sans-serif; box-shadow: 0 2px 8px #0003; } .print-panel-inner { display: flex; max-width: 80mm; margin: auto; align-items: center; gap: 10px; } .print-panel p { margin: 0; font-size: 12px; line-height: 1.35; flex: 1; } .print-button { appearance: none; border: 0; border-radius: 8px; padding: 10px 12px; background: #fff; color: #065f46; font-weight: 700; white-space: nowrap; cursor: pointer; }
      .bluetooth-note { max-width: 80mm; margin: 8px auto 0; padding: 0 12px; font: 11px/1.4 Arial, sans-serif; color: #334155; }
      @media print { body { background: #fff; } .no-print { display: none !important; } .receipt-container { width: 80mm; min-height: auto; margin: 0; box-shadow: none; } }
    ` }} />
    <section className="no-print print-panel"><div className="print-panel-inner"><Smartphone size={22} aria-hidden="true" /><p>Pilih printer Bluetooth yang sudah dipasangkan pada perangkat Anda.</p><button className="print-button" type="button" onClick={() => window.print()}><Printer size={16} style={{ verticalAlign: "-3px", marginRight: 5 }} />Cetak</button></div></section>
    <p className="no-print bluetooth-note">Di HP/tablet, tombol ini membuka dialog cetak perangkat. Pilih printer thermal Bluetooth di sana. Pastikan printer telah dipasangkan terlebih dahulu melalui pengaturan Bluetooth perangkat.</p>
    <main className="receipt-container">
      {isLoading ? <div className="text-center" style={{ padding: "40px 0", fontFamily: "Arial" }}>Memuat data transaksi...</div> : !receiptData ? <div className="text-center" style={{ padding: "40px 0", color: "#dc2626", fontFamily: "Arial" }}>Transaksi tidak ditemukan.</div> : <>
        <header className="text-center"><img className="receipt-logo" src="/logo.png" alt="Logo SMK Muhammadiyah Tarogong Kidul" /><div className="school-name">SMK MUHAMMADIYAH TAROGONG KIDUL</div><div className="school-address">Kp. Panawuan RT.02/RW.11, Kel. Sukajaya<br />Kec. Tarogong Kidul, Kab. Garut, Jawa Barat</div><div className="divider" /><div className="font-bold">BUKTI PEMBAYARAN</div></header>
        <div className="divider" /><div>Tgl&nbsp;&nbsp;&nbsp;: {receiptData.date}</div><div>Kasir : {receiptData.cashier}</div><div>No. Tx : {receiptData.id}</div><div className="divider" /><div>Siswa : {receiptData.studentName}</div><div>NISN&nbsp;&nbsp;: {receiptData.nisn}</div><div>Kelas : {receiptData.className}</div><div className="divider" />
        {receiptData.items.map((item, index) => <div key={`${item.name}-${index}`} className="item"><div className="item-name">{item.name}</div><div className="text-right">Rp {Number(item.amount).toLocaleString("id-ID")}</div></div>)}
        <div className="divider" /><div className="row font-bold" style={{ fontSize: 14 }}><span>TOTAL</span><span>Rp {receiptData.total.toLocaleString("id-ID")}</span></div><div className="row"><span>BAYAR ({receiptData.paymentMethod.toUpperCase()})</span><span>Rp {receiptData.total.toLocaleString("id-ID")}</span></div><div className="divider" />
        <div className="text-center" style={{ marginTop: 8 }}>Terima kasih<br />Harap simpan struk ini sebagai bukti pembayaran yang sah.</div><ReceiptBarcode value={receiptData.id} /><div className="text-center" style={{ marginTop: 8, fontSize: 10 }}>-- Sistem Informasi Sekolah --</div>
      </>}
    </main>
  </>;
}
