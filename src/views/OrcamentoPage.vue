
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Orçamento mensal</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Definir orçamento</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Mês</ion-label>
            <ion-input
              type="month"
              v-model="mes"
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Limite de gastos (R$)</ion-label>
            <ion-input
              type="number"
              v-model="limite"
              placeholder="Ex: 1000"
            />
          </ion-item>

          <ion-button expand="block" @click="salvarOrcamento">
            Salvar orçamento
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card v-if="orcamento">
        <ion-card-header>
          <ion-card-title>Resumo do mês</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <p>Limite: {{ formatar(limiteAtual) }}</p>
          <p>Gastos: {{ formatar(totalDespesas) }}</p>
          <p>Restante: {{ formatar(restante) }}</p>

          <ion-progress-bar
            :value="progresso"
            :color="ultrapassou ? 'danger' : 'success'"
          />

          <p v-if="ultrapassou" class="alerta">
            Você ultrapassou seu orçamento!
          </p>

          <p v-else class="sucesso">
            Você ainda está dentro do orçamento.
          </p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { onIonViewWillEnter } from '@ionic/vue';
import { supabase } from '../lib/supabase';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton, IonProgressBar,
  alertController
} from '@ionic/vue';

const mes = ref(new Date().toISOString().slice(0, 7));
const limite = ref('');
const limiteAtual = ref(0);
const totalDespesas = ref(0);
const orcamento = ref(false);

const restante = computed(() => limiteAtual.value - totalDespesas.value);

const ultrapassou = computed(() => restante.value < 0);

const progresso = computed(() => {
  if (limiteAtual.value <= 0) return 0;
  return Math.min(totalDespesas.value / limiteAtual.value, 1);
});

function formatar(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

async function carregarDados() {
  if (!mes.value) return;

  const inicio = `${mes.value}-01`;
  const [ano, numeroMes] = mes.value.split('-').map(Number);
  const ultimoDia = new Date(ano, numeroMes, 0).getDate();
  const fim = `${mes.value}-${String(ultimoDia).padStart(2, '0')}`;

  const { data: dadosOrcamento, error } = await supabase
    .from('orcamentos')
    .select('limite')
    .eq('mes', inicio)
    .maybeSingle();

  if (error) {
    console.error(error);
    return;
  }

  orcamento.value = !!dadosOrcamento;
  limiteAtual.value = Number(dadosOrcamento?.limite || 0);
  limite.value = dadosOrcamento ? String(dadosOrcamento.limite) : '';

  const { data: despesas, error: erroDespesas } = await supabase
    .from('despesas')
    .select('valor')
    .gte('data', inicio)
    .lte('data', fim);

  if (erroDespesas) {
    console.error(erroDespesas);
    return;
  }

  totalDespesas.value = (despesas || []).reduce(
    (total, item) => total + Number(item.valor), 0
  );
}

async function salvarOrcamento() {
  const valor = Number(limite.value);

  if (!mes.value || !Number.isFinite(valor) || valor <= 0) {
    const alerta = await alertController.create({
      header: 'Atenção',
      message: 'Informe um mês e um limite maior que zero.',
      buttons: ['OK']
    });
    await alerta.present();
    return;
  }

  const { data: usuario } = await supabase.auth.getUser();

  if (!usuario.user) return;

  const { error } = await supabase
    .from('orcamentos')
    .upsert({
      limite: valor,
      mes: `${mes.value}-01`,
      user_id: usuario.user.id
    }, {
      onConflict: 'user_id,mes'
    });

  if (error) {
    console.error(error);
    const alerta = await alertController.create({
      header: 'Erro',
      message: 'Não foi possível salvar o orçamento.',
      buttons: ['OK']
    });
    await alerta.present();
    return;
  }

  await carregarDados();
}

watch(mes, carregarDados);
onMounted(carregarDados);
onIonViewWillEnter(carregarDados);
</script>

<style scoped>
ion-card {
  border-radius: 15px;
}

.alerta {
  color: var(--ion-color-danger);
  font-weight: bold;
}

.sucesso {
  color: var(--ion-color-success);
  font-weight: bold;
}
</style>
