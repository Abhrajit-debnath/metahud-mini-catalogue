type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const request = async (url: string, method: Method, data?: any) => {
  const response = await fetch(url, {
    method,
    credentials: 'include', 
    headers: { 'Content-Type': 'application/json' },
    body: data ? JSON.stringify(data) : undefined,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || `HTTP error! status: ${response.status}`);
  }

  return result;
};

export const apiClient = {
  get: (url: string) => request(url, 'GET'),
  post: (url: string, data: any) => request(url, 'POST', data),
  put: (url: string, data: any) => request(url, 'PUT', data),
  del: (url: string) => request(url, 'DELETE'),
};