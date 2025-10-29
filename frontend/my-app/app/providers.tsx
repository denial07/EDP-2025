'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthCtx = {
    token: string | null;
    setToken: (t: string | null) => void;
};

const Ctx = createContext<AuthCtx>({ token: null, setToken: () => { } });
export const useAuth = () => useContext(Ctx);

export default function Providers({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const t = localStorage.getItem('jwt');
        if (t) setToken(t);
    }, []);

    useEffect(() => {
        if (token) localStorage.setItem('jwt', token);
        else localStorage.removeItem('jwt');
    }, [token]);

    return <Ctx.Provider value={{ token, setToken }}>{children}</Ctx.Provider>;
}
