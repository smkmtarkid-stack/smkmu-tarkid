"use client";

export type ReportCell = string | number | null | undefined;

export type PrintableReport = {
  title: string;
  subtitle?: string;
  period?: string;
  address: string;
  columns: Array<{ key: string; label: string; align?: "left" | "right" | "center" }>;
  rows: Array<Record<string, ReportCell>>;
  summary?: Array<{ label: string; value: string }>;
};

const escapeHtml = (value: ReportCell) => String(value ?? "-")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

export function printSchoolReport(report: PrintableReport) {
  const popup = window.open("", "_blank", "width=1120,height=800");
  if (!popup) return false;

  const logoUrl = `${window.location.origin}/logo.png`;
  const generatedAt = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date());
  const headers = report.columns.map((column) => `<th class="${column.align ?? "left"}">${escapeHtml(column.label)}</th>`).join("");
  const body = report.rows.length
    ? report.rows.map((row) => `<tr>${report.columns.map((column) => `<td class="${column.align ?? "left"}">${escapeHtml(row[column.key])}</td>`).join("")}</tr>`).join("")
    : `<tr><td colspan="${report.columns.length}" class="empty">Tidak ada data pada periode ini.</td></tr>`;
  const summaries = report.summary?.length
    ? `<section class="summary">${report.summary.map((item) => `<div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong></div>`).join("")}</section>`
    : "";

  popup.document.write(`<!doctype html><html lang="id"><head><meta charset="utf-8" />
    <title>${escapeHtml(report.title)}</title><style>
      @page { size: A4 landscape; margin: 14mm; }
      * { box-sizing: border-box; } body { color: #172033; font-family: Arial, Helvetica, sans-serif; font-size: 10pt; margin: 0; }
      .letterhead { align-items: center; border-bottom: 4px solid #057a55; display: flex; gap: 18px; padding: 0 3px 12px; }
      .letterhead img { height: 70px; object-fit: contain; width: 70px; }
      .school { flex: 1; } .school h1 { color: #075b43; font-family: Georgia, "Times New Roman", serif; font-size: 20pt; letter-spacing: .3px; margin: 0 0 5px; text-transform: uppercase; }
      .school p { color: #475569; font-size: 9.5pt; line-height: 1.45; margin: 0; }
      .report-title { margin: 22px 0 16px; text-align: center; }.report-title h2 { font-size: 15pt; margin: 0; text-transform: uppercase; }.report-title p { color: #526176; margin: 6px 0 0; }
      table { border-collapse: collapse; width: 100%; } th { background: #075b43; color: #fff; font-size: 8.5pt; letter-spacing: .15px; padding: 9px 8px; text-transform: uppercase; } td { border-bottom: 1px solid #d8e1df; padding: 8px; vertical-align: top; } tr:nth-child(even) td { background: #f2faf7; }
      .left { text-align: left; }.right { text-align: right; }.center { text-align: center; }.empty { color: #64748b; padding: 28px; text-align: center; }
      .summary { display: flex; flex-direction: column; gap: 5px; margin: 16px 0 0 auto; max-width: 360px; }.summary div { background: #edf8f3; display: flex; justify-content: space-between; padding: 8px 10px; }.summary strong { color: #075b43; }
      footer { border-top: 1px solid #d8e1df; color: #64748b; display: flex; font-size: 8pt; justify-content: space-between; margin-top: 24px; padding-top: 9px; }
      @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    </style></head><body><header class="letterhead"><img src="${escapeHtml(logoUrl)}" alt="Logo sekolah" /><div class="school"><h1>SMK Muhammadiyah Tarogong Kidul</h1><p>${escapeHtml(report.address)}</p></div></header>
    <section class="report-title"><h2>${escapeHtml(report.title)}</h2>${report.subtitle ? `<p>${escapeHtml(report.subtitle)}</p>` : ""}${report.period ? `<p>${escapeHtml(report.period)}</p>` : ""}</section>
    <table><thead><tr>${headers}</tr></thead><tbody>${body}</tbody></table>${summaries}
    <footer><span>Dokumen resmi SMK Muhammadiyah Tarogong Kidul</span><span>Dicetak: ${escapeHtml(generatedAt)}</span></footer>
    <script>window.onload = () => window.print();<\/script></body></html>`);
  popup.document.close();
  return true;
}
