export const extractDate = (iso: string | null | undefined) => {
  if (!iso) return '';               // لا قيمة
  // iso = 2025-05-30T00:46:02.8939049+02:00
  return iso.split('T')[0];          // ← 2025-05-30
};