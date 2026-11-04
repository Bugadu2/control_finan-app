
<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Receitas x Despesas por mês</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <div v-if="carregando" class="mensagem">
        Carregando gráfico...
      </div>

      <div v-else-if="!temDados" class="mensagem">
        Nenhuma movimentação cadastrada para exibir.
      </div>

      <apexchart
        v-else
        type="bar"
        height="300"
        :options="opcoes"
        :series="series"
      />
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/vue';

const props = defineProps<{
  receitas: { valor: number; data: string }[];
  despesas: { valor: number; data: string }[];
  carregando?: boolean;
}>();
const dadosPorMes = computed(() => {
  const meses: Record<string, { receitas: number; despesas: number }> = {};

  function adicionarLancamentos(
    lancamentos: { valor: number; data: string }[],
    tipo: 'receitas' | 'despesas'
  ) {
    lancamentos.forEach((item) => {
      const mes = item.data.slice(0, 7);

      if (!meses[mes]) {
        meses[mes] = { receitas: 0, despesas: 0 };
      }

      meses[mes][tipo] += Number(item.valor);
    });
  }

  adicionarLancamentos(props.receitas, 'receitas');
  adicionarLancamentos(props.despesas, 'despesas');

  return meses;
});

const mesesOrdenados = computed(() => Object.keys(dadosPorMes.value).sort());
const temDados = computed(() => mesesOrdenados.value.length > 0);

const opcoes = computed(() => ({
  chart: {
    toolbar: { show: false }
  },
  xaxis: {
    categories: mesesOrdenados.value.map((mes) => {
      const [ano, numeroMes] = mes.split('-');
      return `${numeroMes}/${ano}`;
    })
  },
  plotOptions: {
    bar: {
      borderRadius: 5,
      columnWidth: '50%'
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    position: 'bottom' as const
  }
}));

const series = computed(() => [
    {
      name: 'Receitas',
      data: mesesOrdenados.value.map((mes) => dadosPorMes.value[mes].receitas)
    },
    {
      name: 'Despesas',
      data: mesesOrdenados.value.map((mes) => dadosPorMes.value[mes].despesas)
    }
  ]);
</script>

<style scoped>
ion-card {
  border-radius: 15px;
}

.mensagem {
  text-align: center;
  padding: 30px 10px;
  color: #777;
}
</style>
