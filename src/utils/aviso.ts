import { toastController } from '@ionic/vue';

export async function mostrarAviso(
  mensagem: string,
  cor: 'success' | 'danger' | 'medium' = 'medium',
) {
  const toast = await toastController.create({
    message: mensagem,
    duration: 3000,
    color: cor,
    position: 'top',
  });
  await toast.present();
}
