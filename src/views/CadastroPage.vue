
<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="cadastro-container">
        <h1>Criar conta</h1>
        <p>Cadastre-se para começar a controlar suas finanças.</p>

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
            placeholder="Mínimo de 6 caracteres"
          />
        </ion-item>

        <ion-item>
          <ion-input
            v-model="confirmarSenha"
            label="Confirmar senha"
            label-placement="floating"
            type="password"
            placeholder="Repita sua senha"
          />
        </ion-item>

        <ion-button expand="block" @click="cadastrar">
          Criar conta
        </ion-button>

        <ion-button expand="block" fill="clear" @click="voltarLogin">
          Já tenho uma conta
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
const confirmarSenha = ref('');
const router = useRouter();

async function cadastrar() {
  if (!email.value || !senha.value || !confirmarSenha.value) {
    return mostrarAlerta('Atenção', 'Preencha todos os campos.');
  }

  if (senha.value.length < 6) {
    return mostrarAlerta('Atenção', 'A senha precisa ter pelo menos 6 caracteres.');
  }

  if (senha.value !== confirmarSenha.value) {
    return mostrarAlerta('Atenção', 'As senhas não coincidem.');
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: senha.value
  });

  if (error) {
    return mostrarAlerta('Erro no cadastro', error.message);
  }

  if (data.session) {
    await mostrarAlerta('Sucesso', 'Conta criada com sucesso!');
    router.replace('/tabs/dashboard');
  } else {
    await mostrarAlerta(
      'Cadastro realizado',
      'Verifique seu e-mail para confirmar a conta antes de entrar.'
    );
    router.replace('/login');
  }
}

async function mostrarAlerta(titulo: string, mensagem: string) {
  const alerta = await alertController.create({
    header: titulo,
    message: mensagem,
    buttons: ['OK']
  });
  await alerta.present();
}

function voltarLogin() {
  router.push('/login');
}
</script>

<style scoped>
.cadastro-container {
  max-width: 420px;
  margin: 65px auto;
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
