export type Perfil = {
  id: number | null;
  nome: string;
  username: string;
  cargo: string;
  resumo: string;
  fotoUrl: string | null;
  disponibilidade: string;
  emailContato: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  xUrl: string | null;
  tiktokUrl: string | null;
  palavrasChave: string | null;
};

export type Experiencia = {
  id: number;
  empresa: string;
  cargo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string | null;
  atual: boolean;
};

export type Conquista = {
  id: number;
  titulo: string;
  descricao: string;
  data: string | null;
};

export type Certificacao = {
  id: number;
  nome: string;
  emissor: string;
  dataEmissao: string | null;
  link: string | null;
};

export type Projeto = {
  id: number;
  nome: string;
  descricao: string;
  tecnologias: string;
  githubUrl: string;
  deployUrl: string | null;
  destaque: boolean;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tipo: string;
  email: string;
  precisaAlterarCredenciais: boolean;
};

export type AuthSessao = {
  email: string;
  precisaAlterarCredenciais: boolean;
};
