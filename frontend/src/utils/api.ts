import apiBaseUrl from './apiBaseUrl';

// A generic API call function
export const apiCall = async (endpoint: string, method: string, body: any = null, token: string | null = null) => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  if (token) {
    (options.headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBaseUrl}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Something went wrong with the request' }));
    throw new Error(errorData.message || 'Something went wrong');
  }

  // Handle cases where the response might be empty
  const responseText = await response.text();
  if (!responseText) {
    return null;
  }

  return JSON.parse(responseText);
};
