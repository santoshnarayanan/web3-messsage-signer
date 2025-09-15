export type HistoryItem = {
  id: string;
  message: string;
  signature: string;
  isValid: boolean;
  signer: string | null;
  at: number;
};

const KEY = 'signed-messages';

export function loadHistory(): HistoryItem[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
export function saveHistory(items: HistoryItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}
