<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="auth-wrap">
        <h1>Criar conta</h1>
        <p>Use um e-mail e uma senha para começar.</p>

        <form @submit.prevent="criarConta">
          <ion-input
            v-model="email"
            type="email"
            label="E-mail"
            label-placement="floating"
            fill="outline"
            autocomplete="email"
          />
          <ion-input
            v-model="senha"
            type="password"
            label="Senha"
            label-placement="floating"
            fill="outline"
            autocomplete="new-password"
          >
            <ion-input-password-toggle slot="end" />
          </ion-input>
          <ion-input
            v-model="confirmacao"
            type="password"
            label="Confirmar senha"
            label-placement="floating"
            fill="outline"
            autocomplete="new-password"
          />

          <ion-button type="submit" expand="block" :disabled="carregando">
            <ion-spinner v-if="carregando" name="dots" />
            <span v-else>Criar conta</span>
          </ion-button>
        </form>

        <div class="auth-links">
          <router-link to="/login">Já tenho uma conta</router-link>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonButton,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
  IonSpinner,
} from '@ionic/vue';
import { cadastrar, traduzirErro } from '@/services/auth';
import { mostrarAviso } from '@/utils/aviso';

const router = useRouter();
const email = ref('');
const senha = ref('');
const confirmacao = ref('');
const carregando = ref(false);

async function criarConta() {
  if (!email.value || !senha.value) {
    mostrarAviso('Preencha e-mail e senha.', 'danger');
    return;
  }
  if (senha.value !== confirmacao.value) {
    mostrarAviso('As senhas não são iguais.', 'danger');
    return;
  }

  carregando.value = true;
  try {
    await cadastrar(email.value.trim(), senha.value);
    mostrarAviso('Conta criada! Agora complete seu perfil.', 'success');
    router.replace('/perfil');
  } catch (erro) {
    mostrarAviso(traduzirErro(erro), 'danger');
  } finally {
    carregando.value = false;
  }
}
</script>
