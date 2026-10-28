<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="auth-wrap">
        <h1>Entrar</h1>
        <p>Acesse sua conta para ver e editar seu perfil.</p>

        <form @submit.prevent="entrarNaConta">
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
            autocomplete="current-password"
          >
            <ion-input-password-toggle slot="end" />
          </ion-input>

          <ion-button type="submit" expand="block" :disabled="carregando">
            <ion-spinner v-if="carregando" name="dots" />
            <span v-else>Entrar</span>
          </ion-button>
        </form>

        <div class="auth-links">
          <router-link to="/recuperar-senha">Esqueci minha senha</router-link>
          <router-link to="/cadastro">Criar uma conta</router-link>
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
import { entrar, traduzirErro } from '@/services/auth';
import { mostrarAviso } from '@/utils/aviso';

const router = useRouter();
const email = ref('');
const senha = ref('');
const carregando = ref(false);

async function entrarNaConta() {
  if (!email.value || !senha.value) {
    mostrarAviso('Preencha e-mail e senha.', 'danger');
    return;
  }

  carregando.value = true;
  try {
    await entrar(email.value.trim(), senha.value);
    router.replace('/bem-vindo');
  } catch (erro) {
    mostrarAviso(traduzirErro(erro), 'danger');
  } finally {
    carregando.value = false;
  }
}
</script>
