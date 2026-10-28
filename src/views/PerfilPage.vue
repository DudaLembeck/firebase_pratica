<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/bem-vindo" text="Voltar" />
        </ion-buttons>
        <ion-title>Meu perfil</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="auth-wrap" style="padding-top: 0">
        <ion-avatar class="avatar-grande">
          <img v-if="imagem" :src="imagem" alt="Foto de perfil" />
          <ion-icon v-else :icon="personOutline" />
        </ion-avatar>

        <input ref="campoArquivo" type="file" accept="image/*" hidden @change="escolherArquivo" />
        <ion-button fill="outline" expand="block" @click="campoArquivo?.click()">
          <ion-icon slot="start" :icon="cameraOutline" />
          {{ imagem ? 'Trocar foto' : 'Escolher foto' }}
        </ion-button>

        <form @submit.prevent="salvar">
          <ion-input
            v-model="nome"
            label="Nome"
            label-placement="floating"
            fill="outline"
            autocomplete="name"
          />
          <ion-input
            v-model="dataNascimento"
            type="date"
            label="Data de nascimento"
            label-placement="stacked"
            fill="outline"
          />
          <ion-input
            v-model="nickname"
            label="Nickname"
            label-placement="floating"
            fill="outline"
            autocapitalize="off"
          />

          <ion-button type="submit" expand="block" :disabled="salvando || carregando">
            <ion-spinner v-if="salvando" name="dots" />
            <span v-else>Salvar perfil</span>
          </ion-button>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
} from '@ionic/vue';
import { cameraOutline, personOutline } from 'ionicons/icons';
import { usuarioAtual } from '@/services/auth';
import { buscarImagem, buscarPerfil, salvarImagem, salvarPerfil } from '@/services/perfil';
import { arquivoParaBase64 } from '@/utils/imagem';
import { mostrarAviso } from '@/utils/aviso';

const router = useRouter();

const nome = ref('');
const dataNascimento = ref('');
const nickname = ref('');
const imagem = ref<string | null>(null);
const imagemAlterada = ref(false);
const carregando = ref(false);
const salvando = ref(false);
const campoArquivo = ref<HTMLInputElement | null>(null);

onIonViewWillEnter(async () => {
  const usuario = usuarioAtual();
  if (!usuario) return;

  carregando.value = true;
  imagemAlterada.value = false;
  try {
    const [perfil, foto] = await Promise.all([buscarPerfil(usuario.uid), buscarImagem(usuario.uid)]);
    nome.value = perfil?.nome ?? '';
    dataNascimento.value = perfil?.dataNascimento ?? '';
    nickname.value = perfil?.nickname ?? '';
    imagem.value = foto;
  } catch {
    mostrarAviso('Não foi possível carregar seu perfil.', 'danger');
  } finally {
    carregando.value = false;
  }
});

async function escolherArquivo(evento: Event) {
  const campo = evento.target as HTMLInputElement;
  const arquivo = campo.files?.[0];
  if (!arquivo) return;

  if (!arquivo.type.startsWith('image/')) {
    mostrarAviso('Escolha um arquivo de imagem.', 'danger');
    return;
  }

  try {
    imagem.value = await arquivoParaBase64(arquivo);
    imagemAlterada.value = true;
  } catch (erro) {
    mostrarAviso((erro as Error).message, 'danger');
  } finally {
    campo.value = '';
  }
}

async function salvar() {
  const usuario = usuarioAtual();
  if (!usuario) return;

  if (!nome.value.trim() || !dataNascimento.value || !nickname.value.trim()) {
    mostrarAviso('Preencha nome, data de nascimento e nickname.', 'danger');
    return;
  }

  salvando.value = true;
  try {
    await salvarPerfil(usuario.uid, {
      nome: nome.value.trim(),
      dataNascimento: dataNascimento.value,
      nickname: nickname.value.trim(),
    });

    if (imagemAlterada.value && imagem.value) {
      await salvarImagem(usuario.uid, imagem.value);
    }

    mostrarAviso('Perfil salvo!', 'success');
    router.replace('/bem-vindo');
  } catch {
    mostrarAviso('Não foi possível salvar. Tente novamente.', 'danger');
  } finally {
    salvando.value = false;
  }
}
</script>
