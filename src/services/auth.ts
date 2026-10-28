import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '@/firebase/config';

export function aguardarUsuario(): Promise<User | null> {
  return new Promise((resolve) => {
    const cancelar = onAuthStateChanged(auth, (usuario) => {
      cancelar();
      resolve(usuario);
    });
  });
}

export const usuarioAtual = () => auth.currentUser;

export const cadastrar = (email: string, senha: string) =>
  createUserWithEmailAndPassword(auth, email, senha);

export const entrar = (email: string, senha: string) =>
  signInWithEmailAndPassword(auth, email, senha);

export const sair = () => signOut(auth);

export const recuperarSenha = (email: string) => sendPasswordResetEmail(auth, email);

const mensagensDeErro: Record<string, string> = {
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/invalid-email': 'O e-mail informado não é válido.',
  'auth/email-already-in-use': 'Já existe uma conta com esse e-mail.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/user-disabled': 'Essa conta foi desativada.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente de novo.',
  'auth/network-request-failed': 'Sem conexão com a internet.',
};

export function traduzirErro(erro: unknown): string {
  const codigo = (erro as { code?: string })?.code ?? '';
  return mensagensDeErro[codigo] ?? 'Algo deu errado. Tente novamente.';
}
