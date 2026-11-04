
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
import { ref, onMounted } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/vue';

import { supabase } from '@/lib/supabase';

const carregando = ref(true);
const temDados = ref(false);

const series = ref([
  { name: 'Receitas', data: [] as number[] },
  { name: 'Despesas', data: [] as number[] }
]);

const opcoes = ref({
  chart: {
    toolbar: { show: false }
  },
  xaxis: {
    categories: [] as string[]
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
});

async function carregarDados() {
  carregando.value = true;

  const [resultadoReceitas, resultadoDespesas] = await Promise.all([
    supabase.from('receitas').select('valor, data'),
    supabase.from('despesas').select('valor, data')
  ]);

  if (resultadoReceitas.error || resultadoDespesas.error) {
    console.error(
      resultadoReceitas.error || resultadoDespesas.error
    );

    carregando.value = false;
    return;
  }

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

  adicionarLancamentos(resultadoReceitas.data || [], 'receitas');
  adicionarLancamentos(resultadoDespesas.data || [], 'despesas');

  const mesesOrdenados = Object.keys(meses).sort();

  opcoes.value = {
    ...opcoes.value,
    xaxis: {
      categories: mesesOrdenados.map((mes) => {
        const [ano, numeroMes] = mes.split('-');
        return `${numeroMes}/${ano}`;
      })
    }
  };

  series.value = [
    {
      name: 'Receitas',
      data: mesesOrdenados.map((mes) => meses[mes].receitas)
    },
    {
      name: 'Despesas',
      data: mesesOrdenados.map((mes) => meses[mes].despesas)
    }
  ];

  temDados.value = mesesOrdenados.length > 0;
  carregando.value = false;
}

onMounted(() => {
  carregarDados();
});
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
