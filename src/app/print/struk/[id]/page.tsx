"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PrintStrukPage() {
  const params = useParams();
  const txId = params.id as string;
  const [isClient, setIsClient] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetchData();
  }, [txId]);

  const fetchData = async () => {
    try {
      const decodedId = decodeURIComponent(txId);
      const cleanId = decodedId.replace('RECEIPT-', '');
      const txIds = cleanId.split(',');

      // 1. Ambil data dari tabel transaksi berdasarkan ID Transaksi
      let { data: txDataList, error: txError } = await supabase
        .from("transaksi_pembayaran")
        .select(`
          id,
          nominal_bayar,
          tanggal_bayar,
          petugas,
          id_siswa,
          id_tagihan
        `)
        .in("id", txIds);

      // Fallback: Jika tidak ketemu, mungkin ID yang dikirim adalah ID Tagihan
      if (!txDataList || txDataList.length === 0) {
        const { data: fallbackData } = await supabase
          .from("transaksi_pembayaran")
          .select(`
            id,
            nominal_bayar,
            tanggal_bayar,
            petugas,
            id_siswa,
            id_tagihan
          `)
          .in("id_tagihan", txIds);
          
        txDataList = fallbackData;
      }

      if (!txDataList || txDataList.length === 0) {
        setIsLoading(false);
        return;
      }

      // Gunakan transaksi pertama sebagai basis data (siswa, kasir, tanggal)
      const firstTx = txDataList[0];

      let finalData: any = {
        id: firstTx.id.substring(0, 8).toUpperCase(),
        date: new Date(firstTx.tanggal_bayar).toLocaleString("id-ID"),
        studentName: "-",
        nisn: "-",
        className: "-",
        items: [],
        total: 0,
        cashier: firstTx.petugas || "Admin TU"
      };

      // 2. Fetch data Siswa
      if (firstTx.id_siswa) {
        const { data: siswaData } = await supabase
          .from("siswa")
          .select("nama, nis, kelas")
          .eq("id", firstTx.id_siswa)
          .single();
          
        if (siswaData) {
          finalData.studentName = siswaData.nama;
          finalData.nisn = siswaData.nis || "-";
          finalData.className = siswaData.kelas || "-";
        }
      }

      // 3. Process setiap item transaksi
      let totalAmount = 0;
      const receiptItems: any[] = [];

      for (const tx of txDataList) {
        totalAmount += Number(tx.nominal_bayar);
        
        let itemName = "Pembayaran Tagihan";
        
        if (tx.id_tagihan) {
           const { data: tagihanData } = await supabase
             .from("tagihan_siswa")
             .select("bulan_tagihan, kategori_tagihan(nama_kategori)")
             .eq("id", tx.id_tagihan)
             .single();
             
           if (tagihanData && tagihanData.kategori_tagihan) {
             let label = (tagihanData.kategori_tagihan as any).nama_kategori;
             if (tagihanData.bulan_tagihan) {
               const m = new Date(tagihanData.bulan_tagihan).getMonth();
               const names = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
               label += ` (Bln ${m + 1} - ${names[m]})`;
             }
             itemName = label;
           }
        }
        
        receiptItems.push({
          name: itemName,
          amount: tx.nominal_bayar
        });
      }

      finalData.items = receiptItems;
      finalData.total = totalAmount;

      setReceiptData(finalData);

      // Auto trigger print dialog
      setTimeout(() => {
        window.print();
      }, 800);
      
    } catch (err) {
      console.error("Gagal mengambil data struk", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @page {
          size: 80mm 297mm;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          background: #f1f5f9;
        }
        @media print {
          body {
            background: #fff;
          }
          .no-print {
            display: none !important;
          }
        }
        .receipt-container {
          width: 80mm;
          margin: 0 auto;
          background: #fff;
          padding: 5mm;
          font-family: monospace;
          color: #000;
          font-size: 12px;
          line-height: 1.2;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .divider {
          border-top: 1px dashed #000;
          margin: 4px 0;
        }
        .flex { display: flex; justify-content: space-between; }
      `}} />

      <div className="no-print p-4 bg-emerald-100 text-emerald-800 text-center text-sm font-sans fixed top-0 left-0 right-0 z-50">
        Menyiapkan dokumen untuk cetak. Jika dialog print tidak muncul otomatis, tekan <strong>Ctrl + P</strong>.
      </div>

      <div className="receipt-container mt-12 sm:mt-4 shadow-xl sm:shadow-none mx-auto pb-8">
        {isLoading ? (
          <div className="text-center py-10 font-sans">Memuat data transaksi...</div>
        ) : !receiptData ? (
          <div className="text-center py-10 font-sans text-red-600">Transaksi tidak ditemukan.</div>
        ) : (
          <>
            <div className="text-center font-bold" style={{ fontSize: "14px" }}>
              SMK Muhammadiyah Tarogong Kidul
            </div>
            <div className="text-center">
              Kp. Panawuan RT.02/RW.11, Kel. Sukajaya<br/>
              Kec. Tarogong Kidul, Kab. Garut Jawa Barat
            </div>
            
            <div className="divider mt-2"></div>
            
            <div>Tgl   : {receiptData.date}</div>
            <div>Kasir : {receiptData.cashier}</div>
            <div>No.Tx : {receiptData.id}</div>
            
            <div className="divider"></div>
            
            <div>Siswa : {receiptData.studentName}</div>
            <div>NISN  : {receiptData.nisn}</div>
            <div>Kelas : {receiptData.className}</div>
            
            <div className="divider"></div>
            
            {receiptData.items.map((item: any, idx: number) => (
              <div key={idx} className="mb-1">
                <div>{item.name}</div>
                <div className="text-right">Rp {Number(item.amount).toLocaleString('id-ID')}</div>
              </div>
            ))}
            
            <div className="divider mt-2"></div>
            
            <div className="flex font-bold" style={{ fontSize: "14px" }}>
              <span>TOTAL</span>
              <span>Rp {Number(receiptData.total).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex mt-1">
              <span>BAYAR (CASH)</span>
              <span>Rp {Number(receiptData.total).toLocaleString('id-ID')}</span>
            </div>
            
            <div className="divider mt-2"></div>
            <div className="text-center mt-2">
              Terima kasih<br/>
              Harap simpan struk ini<br/>
              sebagai bukti pembayaran yang sah.
            </div>
            <div className="text-center mt-4" style={{ fontSize: "10px" }}>
              -- Sistem Informasi Sekolah --
            </div>
          </>
        )}
      </div>
    </>
  );
}
