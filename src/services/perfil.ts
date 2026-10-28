import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export interface Perfil {
  nome: string;
  dataNascimento: string;
  nickname: string;
}

export async function buscarPerfil(uid: string): Promise<Perfil | null> {
  const snapshot = await getDoc(doc(db, 'users', uid));
  return snapshot.exists() ? (snapshot.data() as Perfil) : null;
}

export async function salvarPerfil(uid: string, perfil: Perfil): Promise<void> {
  await setDoc(doc(db, 'users', uid), perfil);
}

export async function buscarImagem(uid: string): Promise<string | null> {
  const snapshot = await getDoc(doc(db, 'images', uid));
  return snapshot.exists() ? (snapshot.data().image as string) : null;
}

export async function salvarImagem(uid: string, image: string): Promise<void> {
  await setDoc(doc(db, 'images', uid), { image });
}
