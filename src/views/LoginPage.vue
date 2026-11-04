
<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="login-container">
        <h1>Control Finan</h1>
        <p>Entre na sua conta para controlar suas finanças.</p>

        <ion-item>
          <ion-input
            v-model="email"
            label="E-mail"
            label-placement="floating"
            type="email"
            placeholder="Digite seu e-mail"
          />
        </ion-item>

        <ion-item>
          <ion-input
            v-model="senha"
            label="Senha"
            label-placement="floating"
            type="password"
            placeholder="Digite sua senha"
          />
        </ion-item>

        <ion-button expand="block" @click="entrar">
          Entrar
        </ion-button>

        <ion-button expand="block" fill="clear" @click="recuperarSenha">
          Esqueci minha senha
        </ion-button>

        <ion-button expand="block" fill="clear" @click="irCadastro">
          Criar uma conta
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  alertController
} from '@ionic/vue';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'vue-router';

const email = ref('');
const senha = ref('');
const router = useRouter();

async function entrar() {
  if (!email.value || !senha.value) {
    const alerta = await alertController.create({
      header: 'Atenção',
      message: 'Preencha o e-mail e a senha.',
      buttons: ['OK']
    });
    await alerta.present();
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: senha.value
  });

  if (error) {
    const alerta = await alertController.create({
      header: 'Erro no login',
      message: error.message,
      buttons: ['OK']
    });
    await alerta.present();
    return;
  }

  router.replace('/tabs/dashboard');
}

async function recuperarSenha() {
  if (!email.value) {
    const alerta = await alertController.create({
      header: 'Atenção',
      message: 'Digite seu e-mail primeiro.',
      buttons: ['OK']
    });
    await alerta.present();
    return;
  }

  const emailLimpo = email.value.trim().toLowerCase();

  const { error } = await supabase.auth.resetPasswordForEmail(
    emailLimpo
  );

  const alerta = await alertController.create({
    header: error ? 'Erro' : 'E-mail enviado',
    message: error
      ? error.message
      : 'Confira sua caixa de entrada para recuperar sua senha.',
    buttons: ['OK']
  });

  await alerta.present();
}

function irCadastro() {
  router.push('/cadastro');
}
</script>

<style scoped>
.login-container {
  max-width: 420px;
  margin: 80px auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

h1 {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  color: #16a36a;
}

p {
  text-align: center;
  color: #777;
}

ion-button {
  margin-top: 10px;
}
</style>
