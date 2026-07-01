export const DAY_KEYS = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

export const TIME_SLOTS = (() => {
  const slots = [];
  for (let h = 14; h <= 21; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
})();

export function formatCurrency(amount, currency, lang) {
  try {
    return new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: currency || "EGP",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  } catch {
    return `${amount} ${currency || "EGP"}`;
  }
}

export function exportToCSV(filename, rows, columns) {
  // columns: [{ key, label }]
  const header = columns.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(",");
  const lines = rows.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key] ?? "";
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  const csv = [header, ...lines].join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const AGE_CATEGORIES = [
  { value: "6-9", labelEn: "6 – 9 years", labelAr: "6 – 9 سنوات" },
  { value: "10-13", labelEn: "10 – 13 years", labelAr: "10 – 13 سنة" },
  { value: "14-17", labelEn: "14 – 17 years", labelAr: "14 – 17 سنة" },
  { value: "18-25", labelEn: "18 – 25 years", labelAr: "18 – 25 سنة" },
];
