const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    org_id: number | null;
  };
}

export async function loginApi(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? `HTTP ${res.status}`,
    );
  }
  const body = await res.json();
  return body.data as AuthResponse;
}

export async function registerApi(dto: {
  name: string;
  email: string;
  password: string;
  org_name?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? `HTTP ${res.status}`,
    );
  }
  const body = await res.json();
  return body.data as AuthResponse;
}
