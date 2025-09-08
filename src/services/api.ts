export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = options.headers ? new Headers(options.headers) : new Headers();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${process.env.REACT_APP_API_BASE_URL ?? ''}${endpoint}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'API Error');
  }
  return res.json();
}

