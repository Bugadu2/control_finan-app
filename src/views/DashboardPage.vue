
<template>
  <ion-page>
    <ion-content class="ion-padding">

      <div class="header">
        <div>
          <p class="saudacao">Bem-vindo de volta!</p>
          <h1>Control Finan</h1>
        </div>
        <ion-icon :icon="walletOutline" class="wallet-icon" />
      </div>

      <!-- Saldo -->
      <div class="saldo-card">
        <p>Saldo atual</p>
        <h1>R$ 0,00</h1>
        <span>Seu resumo financeiro</span>
      </div>

      <!-- Receitas e despesas -->
      <ion-grid class="resumo">
        <ion-row>
          <ion-col size="6">
            <div class="info-card">
              <ion-icon :icon="trendingUpOutline" color="success" />
              <p>Receitas</p>
              <h2>R$ 0,00</h2>
            </div>
          </ion-col>

          <ion-col size="6">
            <div class="info-card">
              <ion-icon :icon="trendingDownOutline" color="danger" />
              <p>Despesas</p>
              <h2>R$ 0,00</h2>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Ações rápidas -->
      <h2 class="section-title">Acesso rápido</h2>

      <div class="acoes">
        <ion-button
          expand="block"
          color="success"
          router-link="/tabs/receitas"
        >
          <ion-icon slot="start" :icon="addCircleOutline" />
          Nova receita
        </ion-button>

        <ion-button
          expand="block"
          color="danger"
          fill="outline"
          router-link="/tabs/despesas"
        >
          <ion-icon slot="start" :icon="removeCircleOutline" />
          Nova despesa
        </ion-button>
      </div>

      <!-- Gráfico -->
      <h2 class="section-title">Visão financeira</h2>

      <div class="grafico-card">
        <ion-icon :icon="barChartOutline" />
        <p>Seus gráficos aparecerão aqui.</p>
        <span>Adicionaremos os gráficos na próxima etapa.</span>
      </div>

      <!-- Movimentações -->
      <h2 class="section-title">Últimas movimentações</h2>

      <div class="vazio">
        <ion-icon :icon="receiptOutline" />
        <p>Nenhuma movimentação encontrada.</p>
        <span>Suas receitas e despesas aparecerão aqui.</span>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton
} from '@ionic/vue';

import {
  walletOutline,
  trendingUpOutline,
  trendingDownOutline,
  addCircleOutline,
  removeCircleOutline,
  barChartOutline,
  receiptOutline
} from 'ionicons/icons';
</script>

<style scoped>
ion-content {
  --background: #f5f7f6;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 5px 25px;
}

.saudacao {
  color: #777;
  margin-bottom: 5px;
}

.header h1 {
  font-size: 25px;
  font-weight: 800;
  margin: 0;
  color: #202a24;
}

.wallet-icon {
  font-size: 35px;
  color: #15965b;
}

.saldo-card {
  background: linear-gradient(135deg, #087c49, #16a36a);
  padding: 24px;
  border-radius: 18px;
  color: white;
  box-shadow: 0 5px 15px #087c4930;
}

.saldo-card p {
  margin: 0;
  opacity: 0.85;
}

.saldo-card h1 {
  font-size: 32px;
  font-weight: 800;
  margin: 12px 0;
}

.saldo-card span {
  font-size: 13px;
  opacity: 0.8;
}

.resumo {
  padding: 15px 0;
}

.info-card {
  background: white;
  padding: 16px;
  border-radius: 15px;
  box-shadow: 0 2px 8px #00000008;
}

.info-card ion-icon {
  font-size: 25px;
}

.info-card p {
  color: #777;
  font-size: 13px;
  margin-bottom: 8px;
}

.info-card h2 {
  font-size: 17px;
  margin: 0;
  color: #222;
  font-weight: 700;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #252d28;
  margin: 20px 5px 12px;
}

.acoes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.acoes ion-button {
  height: 45px;
  margin: 0;
  font-weight: 600;
}

.grafico-card, .vazio {
  background: white;
  border-radius: 15px;
  padding: 25px 15px;
  text-align: center;
  color: #777;
}

.grafico-card ion-icon,
.vazio ion-icon {
  font-size: 35px;
  color: #15965b;
}

.grafico-card p, .vazio p {
  font-weight: 600;
  color: #444;
}

.grafico-card span, .vazio span {
  font-size: 12px;
}
</style>

