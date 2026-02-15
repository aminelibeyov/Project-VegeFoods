export const API_BASE_URL = "http://localhost:3001";

export const CATEGORIES = ["Vegetables", "Fruits", "Juice", "Dried"];

export function formatMoney(value) {
    const n = Number(value || 0);
    return `$${n.toFixed(2)}`;
}

export function finalPrice(price, discount) {
    const p = Number(price || 0);
    const d = Number(discount || 0);
    const fp = p - (p * d) / 100;
    return Math.max(0, Number(fp.toFixed(2)));
}
