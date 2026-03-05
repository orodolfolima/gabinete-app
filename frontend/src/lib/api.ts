const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// eslint-disable-next-line no-undef
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.erro || errorData.error || `Erro ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('text/csv')) {
    return response.text() as unknown as T;
  }

  return response.json();
}
