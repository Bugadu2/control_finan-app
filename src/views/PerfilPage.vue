
<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="perfil-container">
        <h1>Meu Perfil</h1>
        <p>Gerencie sua conta do Control Finan.</p>

        <ion-button
          expand="block"
          color="danger"
          @click="sair"
        >
          Sair da conta
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonButton,
  alertController
} from '@ionic/vue';

import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';

const router = useRouter();

async function sair() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    const alerta = await alertController.create({
      header: 'Erro',
      message: error.message,
      buttons: ['OK']
    });

    await alerta.present();
    return;
  }

  router.replace('/login');
}
</script>

<style scoped>
.perfil-container {
  max-width: 420px;
  margin: 60px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h1 {
  color: #16a36a;
  font-weight: bold;
}

p {
  color: #777;
}
</style>
