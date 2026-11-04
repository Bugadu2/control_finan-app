
<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Despesas por categoria</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <div v-if="carregando" class="mensagem">
        Carregando gráfico...
      </div>

      <div v-else-if="series.length === 0" class="mensagem">
        Nenhuma despesa cadastrada para exibir.
      </div>

      <apexchart
        v-else
        type="pie"
        height="300"
        :options="opcoes"
        :series="series"
      />
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';
import { supabase } from '@/lib/supabase';

const series = ref<number[]>([]);
const categorias = ref<string[]>([]);
const carregando = ref(true);

const opcoes = ref({
  labels: categorias.value,
  legend: {
    position: 'bottom' as const
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 250
      },
      legend: {
        position: 'bottom' as const
      }
    }
  }]
});

async function carregarDespesas() {
  carregando.value = true;

  const { data, error } = await supabase
    .from('despesas')
    .select('categoria, valor');

  if (error) {
    console.error('Erro ao carregar despesas:', error.message);
    carregando.value = false;
    return;
  }

  const totais: Record<string, number> = {};

  data?.forEach((despesa) => {
    totais[despesa.categoria] =
      (totais[despesa.categoria] || 0) + Number(despesa.valor);
  });

  categorias.value = Object.keys(totais);
  series.value = Object.values(totais);

  opcoes.value = {
    ...opcoes.value,
    labels: categorias.value
  };

  carregando.value = false;
}

onMounted(() => {
  carregarDespesas();
});
</script>

<style scoped>
.mensagem {
  text-align: center;
  padding: 30px 10px;
  color: #777;
}

ion-card {
  border-radius: 15px;
}
</style>
