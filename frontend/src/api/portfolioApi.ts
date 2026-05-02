import { api } from './client';
import type { AuthResponse, AuthSessao, Certificacao, Conquista, Experiencia, Perfil, Projeto } from '../types/api';

export const portfolioApi = {
  login: async (email: string, senha: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, senha });
    return data;
  },

  refresh: async (refreshToken: string) => {
    const { data } = await api.post<AuthResponse>('/auth/refresh', { refreshToken });
    return data;
  },

  atualizarPrimeiroAcesso: async (payload: { novoEmail: string; senhaAtual: string; novaSenha: string }) => {
    const { data } = await api.put<AuthResponse>('/auth/primeiro-acesso', payload);
    return data;
  },

  buscarSessao: async () => {
    const { data } = await api.get<AuthSessao>('/auth/sessao');
    return data;
  },

  buscarPerfil: async () => {
    const { data } = await api.get<Perfil>('/perfil');
    return data;
  },

  atualizarPerfil: async (payload: Omit<Perfil, 'id'>) => {
    const { data } = await api.put<Perfil>('/perfil', payload);
    return data;
  },

  uploadFotoPerfil: async (arquivo: File) => {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    const { data } = await api.post<Perfil>('/perfil/foto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  listarExperiencias: async () => {
    const { data } = await api.get<Experiencia[]>('/experiencias');
    return data;
  },

  salvarExperiencia: async (payload: Omit<Experiencia, 'id'>, id?: number) => {
    const response = id
      ? await api.put<Experiencia>(`/experiencias/${id}`, payload)
      : await api.post<Experiencia>('/experiencias', payload);
    return response.data;
  },

  removerExperiencia: async (id: number) => {
    await api.delete(`/experiencias/${id}`);
  },

  listarConquistas: async () => {
    const { data } = await api.get<Conquista[]>('/conquistas');
    return data;
  },

  salvarConquista: async (payload: Omit<Conquista, 'id'>, id?: number) => {
    const response = id
      ? await api.put<Conquista>(`/conquistas/${id}`, payload)
      : await api.post<Conquista>('/conquistas', payload);
    return response.data;
  },

  removerConquista: async (id: number) => {
    await api.delete(`/conquistas/${id}`);
  },

  listarCertificacoes: async () => {
    const { data } = await api.get<Certificacao[]>('/certificacoes');
    return data;
  },

  salvarCertificacao: async (payload: Omit<Certificacao, 'id'>, id?: number) => {
    const response = id
      ? await api.put<Certificacao>(`/certificacoes/${id}`, payload)
      : await api.post<Certificacao>('/certificacoes', payload);
    return response.data;
  },

  removerCertificacao: async (id: number) => {
    await api.delete(`/certificacoes/${id}`);
  },

  listarProjetos: async () => {
    const { data } = await api.get<Projeto[]>('/projetos');
    return data;
  },

  salvarProjeto: async (payload: Omit<Projeto, 'id'>, id?: number) => {
    const response = id
      ? await api.put<Projeto>(`/projetos/${id}`, payload)
      : await api.post<Projeto>('/projetos', payload);
    return response.data;
  },

  removerProjeto: async (id: number) => {
    await api.delete(`/projetos/${id}`);
  },
};
