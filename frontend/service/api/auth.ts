'use client';
const getApiUrl = (endpoint: string) => {
  const baseUrl = 'https://dewordle.onrender.com/api/v1';
  return `${baseUrl}${endpoint}`;
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(getApiUrl('/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await fetch(getApiUrl('/api/auth/signup'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    return response.json();
  },

  verify: async (token: string): Promise<{ valid: boolean }> => {
    const response = await fetch(getApiUrl('/auth/verify'), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { valid: response.ok };
  },

  logout: async (token: string): Promise<void> => {
    await fetch(getApiUrl('/auth/logout'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
