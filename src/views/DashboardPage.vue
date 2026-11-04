
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
        <h1>{{ formatarValor(saldo) }}</h1>
        <span>Seu resumo financeiro</span>
      </div>

      <!-- Receitas e despesas -->
      <ion-grid class="resumo">
        <ion-row>
          <ion-col size="6">
            <div class="info-card">
              <ion-icon :icon="trendingUpOutline" color="success" />
              <p>Receitas</p>
              <h2>{{ formatarValor(totalReceitas) }}</h2>
            </div>
          </ion-col>

          <ion-col size="6">
            <div class="info-card">
              <ion-icon :icon="trendingDownOutline" color="danger" />
              <p>Despesas</p>
              <h2>{{ formatarValor(totalDespesas) }}</h2>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Indicadores -->
      <h2 class="section-title">Indicadores financeiros</h2>

      <div class="indicadores">
        <div class="indicador-card">
          <p>Maior categoria de gasto</p>
          <strong>{{ maiorCategoria }}</strong>
        </div>

        <div class="indicador-card">
          <p>Total de lançamentos</p>
          <strong>{{ quantidadeLancamentos }}</strong>
        </div>

        <div class="indicador-card">
          <p>Despesas sobre receitas</p>
          <strong>{{ percentualDespesas }}%</strong>
        </div>
      </div>

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

      <!-- Gráficos -->
      <h2 class="section-title">Visão financeira</h2>

      <div class="grafico-card">
        <ion-icon :icon="barChartOutline" />
        <p>Gráficos financeiros</p>
        <span>Adicionaremos os gráficos na próxima etapa.</span>
      </div>

      <!-- Movimentações -->
      <h2 class="section-title">Últimas movimentações</h2>

      <div v-if="movimentacoes.length === 0" class="vazio">
        <ion-icon :icon="receiptOutline" />
        <p>Nenhuma movimentação encontrada.</p>
        <span>Suas receitas e despesas aparecerão aqui.</span>
      </div>

      <ion-card v-for="item in movimentacoes" :key="item.id + item.tipo">
        <ion-card-content>
          <div class="movimentacao">
            <div>
              <strong>{{ item.descricao }}</strong>
              <p>{{ item.categoria }} • {{ formatarData(item.data) }}</p>
            </div>

            <strong :class="item.tipo">
              {{ item.tipo === 'receita' ? '+' : '-' }}
              {{ formatarValor(item.valor) }}
            </strong>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-button expand="block" fill="clear" @click="carregarDados">
        Atualizar informações
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent,
  alertController
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

import { supabase } from '@/lib/supabase';

interface Lancamento {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  tipo: 'receita' | 'despesa';
}

const receitas = ref<Lancamento[]>([]);
const despesas = ref<Lancamento[]>([]);

const totalReceitas = computed(() =>
  receitas.value.reduce((total, item) => total + Number(item.valor), 0)
);

const totalDespesas = computed(() =>
  despesas.value.reduce((total, item) => total + Number(item.valor), 0)
);

const saldo = computed(() => totalReceitas.value - totalDespesas.value);

const quantidadeLancamentos = computed(() =>
  receitas.value.length + despesas.value.length
);

const percentualDespesas = computed(() => {
  if (totalReceitas.value === 0) return '0,00';

  return (
    (totalDespesas.value / totalReceitas.value) * 100
  ).toFixed(2).replace('.', ',');
});

const maiorCategoria = computed(() => {
  if (despesas.value.length === 0) return 'Nenhuma';

  const categorias: Record<string, number> = {};

  despesas.value.forEach((despesa) => {
    categorias[despesa.categoria] =
      (categorias[despesa.categoria] || 0) + Number(despesa.valor);
  });

  return Object.entries(categorias)
    .sort((a, b) => b[1] - a[1])[0][0];
});

const movimentacoes = computed(() =>
  [...receitas.value, ...despesas.value]
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 5)
);

onMounted(() => {
  carregarDados();
});

async function carregarDados() {
  const [resultadoReceitas, resultadoDespesas] = await Promise.all([
    supabase.from('receitas').select('*').order('data', { ascending: false }),
    supabase.from('despesas').select('*').order('data', { ascending: false })
  ]);

  if (resultadoReceitas.error || resultadoDespesas.error) {
    const erro = resultadoReceitas.error || resultadoDespesas.error;
    return mostrarAlerta('Erro ao carregar dados', erro.message);
  }

  receitas.value = (resultadoReceitas.data || []).map(item => ({
    ...item,
    tipo: 'receita' as const
  }));

  despesas.value = (resultadoDespesas.data || []).map(item => ({
    ...item,
    tipo: 'despesa' as const
  }));
}

function formatarValor(valor: number) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function formatarData(data: string) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

async function mostrarAlerta(titulo: string, mensagem: string) {
  const alerta = await alertController.create({
    header: titulo,
    message: mensagem,
    buttons: ['OK']
  });

  await alerta.present();
}
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

.info-card,
.indicador-card {
  background: white;
  padding: 16px;
  border-radius: 15px;
  box-shadow: 0 2px 8px #00000008;
  height: 100%;
}

.info-card ion-icon {
  font-size: 25px;
}

.info-card p,
.indicador-card p {
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

.indicadores {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.indicador-card strong {
  font-size: 17px;
  color: #15965b;
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

.grafico-card,
.vazio {
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

.grafico-card p,
.vazio p {
  font-weight: 600;
  color: #444;
}

.grafico-card span,
.vazio span {
  font-size: 12px;
}

.movimentacao {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.movimentacao p {
  color: #777;
  font-size: 12px;
}

.receita {
  color: #15965b;
}

.despesa {
  color: #eb445a;
}
</style>
