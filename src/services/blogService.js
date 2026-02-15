import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
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

export function useBlogs() {
    return useQuery(async () => {
        const { data } = await api.get("/blogs");
        return data;
    }, []);
}

export function useBlog(id) {
    return useQuery(async () => {
        const { data } = await api.get(`/blogs/${id}`);
        return data;
    }, [id]);
}

export async function createBlog(payload) {
    const { data } = await api.post("/blogs", payload);
    return data;
}

export async function updateBlog(id, payload) {
    const { data } = await api.put(`/blogs/${id}`, payload);
    return data;
}

export async function deleteBlog(id) {
    const { data } = await api.delete(`/blogs/${id}`);
    return data;
}
