
<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom">

        <ion-tab-button tab="dashboard" href="/tabs/dashboard">
          <ion-icon :icon="home" />
          <ion-label>Início</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="receitas" href="/tabs/receitas">
          <ion-icon :icon="arrowUpCircle" />
          <ion-label>Receitas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="despesas" href="/tabs/despesas">
          <ion-icon :icon="arrowDownCircle" />
          <ion-label>Despesas</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="perfil" href="/tabs/perfil">
          <ion-icon :icon="person" />
          <ion-label>Perfil</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet
} from '@ionic/vue';

import {
  home,
  arrowUpCircle,
  arrowDownCircle,
  person
} from 'ionicons/icons';
</script>
