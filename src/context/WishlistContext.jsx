import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const WishlistContext = createContext(null);
const LS_KEY = "vegefoods_wishlist_v1";

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
        case "TOGGLE": {
            const product = action.payload;
            const exists = state.items.some((x) => x.id === product.id);
            if (exists) return { ...state, items: state.items.filter((x) => x.id !== product.id) };
            return { ...state, items: [...state.items, product] };
        }
        case "REMOVE":
            return { ...state, items: state.items.filter((x) => x.id !== action.payload) };
        case "CLEAR":
            return { items: [] };
        default:
            return state;
    }
}

export function WishlistProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, undefined, readLS);
    useEffect(() => writeLS(state), [state]);

    const value = useMemo(
        () => ({
            items: state.items,
            totalItems: state.items.length,
            toggleWishlist: (product) => dispatch({ type: "TOGGLE", payload: product }),
            removeFromWishlist: (id) => dispatch({ type: "REMOVE", payload: id }),
            clearWishlist: () => dispatch({ type: "CLEAR" }),
            isInWishlist: (id) => state.items.some((x) => x.id === id)
        }),
        [state.items]
    );

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
    return ctx;
}
