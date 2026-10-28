<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="auth-wrap">
        <h1>Recuperar senha</h1>
        <p>Informe seu e-mail e enviaremos um link para você criar uma nova senha.</p>

        <form @submit.prevent="enviarLink">
          <ion-input
            v-model="email"
            type="email"
            label="E-mail"
            label-placement="floating"
            fill="outline"
            autocomplete="email"
          />

          <ion-button type="submit" expand="block" :disabled="carregando">
            <ion-spinner v-if="carregando" name="dots" />
            <span v-else>Enviar link</span>
          </ion-button>
        </form>

        <div class="auth-links">
          <router-link to="/login">Voltar para o login</router-link>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonButton, IonContent, IonInput, IonPage, IonSpinner } from '@ionic/vue';
import { recuperarSenha, traduzirErro } from '@/services/auth';
import { mostrarAviso } from '@/utils/aviso';

const email = ref('');
const carregando = ref(false);

async function enviarLink() {
  if (!email.value) {
    mostrarAviso('Informe seu e-mail.', 'danger');
    return;
  }

  carregando.value = true;
  try {
    await recuperarSenha(email.value.trim());
    mostrarAviso('Se o e-mail estiver cadastrado, você receberá o link em instantes.', 'success');
  } catch (erro) {
    mostrarAviso(traduzirErro(erro), 'danger');
  } finally {
    carregando.value = false;
  }
}
</script>
