<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Início</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="sairDaConta">
            <ion-icon slot="icon-only" :icon="logOutOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="auth-wrap" style="padding-top: 2vh">
        <ion-avatar class="avatar-grande">
          <img v-if="imagem" :src="imagem" alt="Foto de perfil" />
          <ion-icon v-else :icon="personOutline" />
        </ion-avatar>

        <h1 class="ion-text-center">Olá, {{ nomeExibido }}</h1>
        <p v-if="perfil" class="ion-text-center">Que bom ter você por aqui.</p>
        <p v-else class="ion-text-center">Complete seu perfil para personalizar sua conta.</p>

        <ion-list v-if="perfil" lines="full" inset>
          <ion-item>
            <ion-label>
              <p>Nome</p>
              <h2>{{ perfil.nome }}</h2>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <p>Data de nascimento</p>
              <h2>{{ dataFormatada }}</h2>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <p>E-mail</p>
              <h2>{{ email }}</h2>
            </ion-label>
          </ion-item>
        </ion-list>

        <ion-button expand="block" @click="router.push('/perfil')">
          {{ perfil ? 'Editar perfil' : 'Completar perfil' }}
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
} from '@ionic/vue';
import { logOutOutline, personOutline } from 'ionicons/icons';
import { sair, usuarioAtual } from '@/services/auth';
import { buscarImagem, buscarPerfil, type Perfil } from '@/services/perfil';
import { mostrarAviso } from '@/utils/aviso';

const router = useRouter();

const email = ref('');
const perfil = ref<Perfil | null>(null);
const imagem = ref<string | null>(null);

const nomeExibido = computed(() => perfil.value?.nickname || perfil.value?.nome || email.value);

const dataFormatada = computed(() => {
  if (!perfil.value?.dataNascimento) return '';
  const [ano, mes, dia] = perfil.value.dataNascimento.split('-');
  return `${dia}/${mes}/${ano}`;
});

onIonViewWillEnter(async () => {
  const usuario = usuarioAtual();
  if (!usuario) return;

  email.value = usuario.email ?? '';
  try {
    const [dadosPerfil, foto] = await Promise.all([
      buscarPerfil(usuario.uid),
      buscarImagem(usuario.uid),
    ]);
    perfil.value = dadosPerfil;
    imagem.value = foto;
  } catch {
    mostrarAviso('Não foi possível carregar seus dados.', 'danger');
  }
});

async function sairDaConta() {
  await sair();
  perfil.value = null;
  imagem.value = null;
  router.replace('/login');
}
</script>
