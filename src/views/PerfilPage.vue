
<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="perfil-container">
        <h1>Meu Perfil</h1>
        <p>Gerencie sua conta do Control Finan.</p>

        <div class="perfil-card">
          <h2>Informações da conta</h2>

          <p><strong>E-mail:</strong></p>
          <p>{{ email }}</p>

          <p><strong>ID do usuário:</strong></p>
          <p class="id-usuario">{{ userId }}</p>
        </div>

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
import { ref, onMounted } from 'vue';
import {
  IonPage,
  IonContent,
  IonButton,
  alertController
} from '@ionic/vue';

import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';

const router = useRouter();

const email = ref('');
const userId = ref('');

onMounted(async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    router.replace('/login');
    return;
  }

  email.value = data.user.email || '';
  userId.value = data.user.id;
});

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
  overflow-wrap: anywhere;
}

.perfil-card {
  background: #f3f7f5;
  padding: 20px;
  border-radius: 12px;
}

.perfil-card h2 {
  color: #16a36a;
  font-size: 20px;
}

.id-usuario {
  font-size: 12px;
}
</style>
