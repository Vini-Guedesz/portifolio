import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let renovandoToken: Promise<string | null> | null = null;

async function obterNovoAccessToken() {
  const refreshToken = localStorage.getItem('portfolio_refresh_token');
  if (!refreshToken) {
    return null;
  }

  if (!renovandoToken) {
    renovandoToken = axios
      .post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken })
      .then((response) => {
        const data = response.data as {
          accessToken: string;
          refreshToken: string;
          email: string;
          precisaAlterarCredenciais: boolean;
        };
        localStorage.setItem('portfolio_token', data.accessToken);
        localStorage.setItem('portfolio_refresh_token', data.refreshToken);
        localStorage.setItem('portfolio_email', data.email);
        localStorage.setItem('portfolio_precisa_alterar_credenciais', String(data.precisaAlterarCredenciais));
        return data.accessToken;
      })
      .catch(() => null)
      .finally(() => {
        renovandoToken = null;
      });
  }

  return renovandoToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestOriginal = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    const status = error.response?.status;
    const url = requestOriginal?.url ?? '';

    const rotaIgnorada =
      url.includes('/auth/login') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/primeiro-acesso');

    if (status === 401 && requestOriginal && !requestOriginal._retry && !rotaIgnorada) {
      requestOriginal._retry = true;
      const novoToken = await obterNovoAccessToken();
      if (novoToken) {
        requestOriginal.headers = requestOriginal.headers ?? {};
        requestOriginal.headers.Authorization = `Bearer ${novoToken}`;
        return api(requestOriginal);
      }
    }

    if (status === 401) {
      localStorage.removeItem('portfolio_token');
      localStorage.removeItem('portfolio_refresh_token');
      localStorage.removeItem('portfolio_email');
      localStorage.removeItem('portfolio_precisa_alterar_credenciais');
    }

    return Promise.reject(error);
  },
);
