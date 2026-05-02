import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { portfolioApi } from '../api/portfolioApi';

type AuthContextValue = {
  token: string | null;
  email: string | null;
  precisaAlterarCredenciais: boolean;
  carregandoSessao: boolean;
  autenticado: boolean;
  login: (email: string, senha: string) => Promise<void>;
  atualizarPrimeiroAcesso: (payload: { novoEmail: string; senhaAtual: string; novaSenha: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem('portfolio_token'));
  const [email, setEmail] = useState(() => localStorage.getItem('portfolio_email'));
  const [precisaAlterarCredenciais, setPrecisaAlterarCredenciais] = useState(
    () => localStorage.getItem('portfolio_precisa_alterar_credenciais') === 'true',
  );
  const [carregandoSessao, setCarregandoSessao] = useState(() => Boolean(localStorage.getItem('portfolio_token')));

  useEffect(() => {
    if (!token) {
      setCarregandoSessao(false);
      return;
    }

    setCarregandoSessao(true);
    portfolioApi
      .buscarSessao()
      .then((sessao) => {
        localStorage.setItem('portfolio_email', sessao.email);
        localStorage.setItem('portfolio_precisa_alterar_credenciais', String(sessao.precisaAlterarCredenciais));
        setEmail(sessao.email);
        setPrecisaAlterarCredenciais(sessao.precisaAlterarCredenciais);
      })
      .catch(() => {
        localStorage.removeItem('portfolio_token');
        localStorage.removeItem('portfolio_refresh_token');
        localStorage.removeItem('portfolio_email');
        localStorage.removeItem('portfolio_precisa_alterar_credenciais');
        setToken(null);
        setEmail(null);
        setPrecisaAlterarCredenciais(false);
      })
      .finally(() => setCarregandoSessao(false));
  }, [token]);

  async function login(emailInformado: string, senha: string) {
    const response = await portfolioApi.login(emailInformado, senha);
    localStorage.setItem('portfolio_token', response.accessToken);
    localStorage.setItem('portfolio_refresh_token', response.refreshToken);
    localStorage.setItem('portfolio_email', response.email);
    localStorage.setItem('portfolio_precisa_alterar_credenciais', String(response.precisaAlterarCredenciais));
    setToken(response.accessToken);
    setEmail(response.email);
    setPrecisaAlterarCredenciais(response.precisaAlterarCredenciais);
  }

  async function atualizarPrimeiroAcesso(payload: { novoEmail: string; senhaAtual: string; novaSenha: string }) {
    const response = await portfolioApi.atualizarPrimeiroAcesso(payload);
    localStorage.setItem('portfolio_token', response.accessToken);
    localStorage.setItem('portfolio_refresh_token', response.refreshToken);
    localStorage.setItem('portfolio_email', response.email);
    localStorage.setItem('portfolio_precisa_alterar_credenciais', 'false');
    setToken(response.accessToken);
    setEmail(response.email);
    setPrecisaAlterarCredenciais(false);
  }

  function logout() {
    localStorage.removeItem('portfolio_token');
    localStorage.removeItem('portfolio_refresh_token');
    localStorage.removeItem('portfolio_email');
    localStorage.removeItem('portfolio_precisa_alterar_credenciais');
    setToken(null);
    setEmail(null);
    setPrecisaAlterarCredenciais(false);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      email,
      precisaAlterarCredenciais,
      carregandoSessao,
      autenticado: Boolean(token),
      login,
      atualizarPrimeiroAcesso,
      logout,
    }),
    [token, email, precisaAlterarCredenciais, carregandoSessao],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
