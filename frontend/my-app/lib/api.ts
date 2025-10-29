export const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function api<T>(
    path: string,
    opts: RequestInit = {},
    token?: string
): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...opts,
        headers: {
            'Content-Type': 'application/json',
            ...(opts.headers as Record<string, string>),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // If your backend uses self-signed HTTPS in dev, you may need to trust it in browser
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
    }
    return res.json() as Promise<T>;
}
