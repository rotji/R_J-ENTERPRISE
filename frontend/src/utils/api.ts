import apiBaseUrl from './apiBaseUrl';

// A generic API call function
export const apiCall = async <T>(endpoint: string, method: string, body: unknown = null, token: string | null = null): Promise<T> => {
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
    (options.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBaseUrl}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Something went wrong with the request' }));
    throw new Error(errorData.message || 'Something went wrong');
  }

  // Handle cases where the response might be empty
  const responseText = await response.text();
  if (!responseText) {
    return null as T;
  }

  return JSON.parse(responseText) as T;
};

export const getUserDashboardData = (token: string) => {
    return apiCall<any>('/api/dashboards/user', 'GET', null, token);
};

export const getAdminDashboardData = (token: string) => {
    return apiCall<any>('/api/dashboards/admin', 'GET', null, token);
};

export const getSupplierDashboardData = (token: string) => {
    return apiCall<any>('/api/dashboards/supplier', 'GET', null, token);
};
