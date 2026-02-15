import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL } from "../constants/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 12000
});

function normalizeError(err) {
    if (axios.isAxiosError(err)) {
        const msg =
            err.response?.data?.message ||
            err.response?.statusText ||
            err.message ||
            "Network error";
        return new Error(msg);
    }
    return new Error("Unexpected error");
}

export function useDebounce(value, delay = 500) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setV(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return v;
}

function useQuery(fn, deps) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortRef = useRef(false);

    const run = useCallback(async () => {
        setLoading(true);
        setError(null);
        abortRef.current = false;
        try {
            const res = await fn();
            if (!abortRef.current) setData(res);
        } catch (e) {
            if (!abortRef.current) setError(normalizeError(e));
        } finally {
            if (!abortRef.current) setLoading(false);
        }
    }, deps);

    useEffect(() => {
        run();
        return () => {
            abortRef.current = true;
        };
    }, [run]);

    return { data, loading, error, refetch: run };
}

export function useProducts() {
    return useQuery(async () => {
        const { data } = await api.get("/products");
        return data;
    }, []);
}

export function useProduct(id) {
    return useQuery(async () => {
        const { data } = await api.get(`/products/${id}`);
        return data;
    }, [id]);
}

export async function createProduct(payload) {
    const { data } = await api.post("/products", payload);
    return data;
}

export async function updateProduct(id, payload) {
    const { data } = await api.put(`/products/${id}`, payload);
    return data;
}

export async function deleteProduct(id) {
    const { data } = await api.delete(`/products/${id}`);
    return data;
}
