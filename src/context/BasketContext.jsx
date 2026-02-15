import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { finalPrice } from "../constants/api";

const BasketContext = createContext(null);
const LS_KEY = "vegefoods_basket_v1";

function readLS() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        const parsed = raw ? JSON.parse(raw) : { items: [] };
        if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
        return parsed;
    } catch {
        return { items: [] };
    }
}

function writeLS(state) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch { }
}

function reducer(state, action) {
    switch (action.type) {
        case "ADD": {
            const { product, qty } = action.payload;
            const q = Math.max(1, Math.min(99, Number(qty || 1)));
            const idx = state.items.findIndex((x) => x.id === product.id);
            if (idx >= 0) {
                const items = state.items.map((x) => (x.id === product.id ? { ...x, qty: Math.min(99, x.qty + q) } : x));
                return { ...state, items };
            }
            return { ...state, items: [...state.items, { ...product, qty: q }] };
        }
        case "REMOVE":
            return { ...state, items: state.items.filter((x) => x.id !== action.payload) };
        case "QTY": {
            const { id, qty } = action.payload;
            const q = Math.max(1, Math.min(99, Number(qty || 1)));
            return { ...state, items: state.items.map((x) => (x.id === id ? { ...x, qty: q } : x)) };
        }
        case "CLEAR":
            return { items: [] };
        default:
            return state;
    }
}

export function BasketProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, undefined, readLS);

    useEffect(() => writeLS(state), [state]);

    const totals = useMemo(() => {
        const totalItems = state.items.reduce((s, x) => s + Number(x.qty || 0), 0);
        const totalPrice = state.items.reduce((s, x) => s + finalPrice(x.price, x.discount) * Number(x.qty || 0), 0);
        return { totalItems, totalPrice: Number(totalPrice.toFixed(2)) };
    }, [state.items]);

    const value = useMemo(
        () => ({
            items: state.items,
            totalItems: totals.totalItems,
            totalPrice: totals.totalPrice,
            addToBasket: (product, qty = 1) => dispatch({ type: "ADD", payload: { product, qty } }),
            removeFromBasket: (id) => dispatch({ type: "REMOVE", payload: id }),
            setQty: (id, qty) => dispatch({ type: "QTY", payload: { id, qty } }),
            clearBasket: () => dispatch({ type: "CLEAR" })
        }),
        [state.items, totals]
    );

    return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
    const ctx = useContext(BasketContext);
    if (!ctx) throw new Error("useBasket must be used within BasketProvider");
    return ctx;
}
