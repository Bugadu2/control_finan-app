
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
import { computed } from 'vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';

const props = defineProps<{
  despesas: { categoria: string; valor: number }[];
  carregando: boolean;
}>();

const totaisPorCategoria = computed(() => {
  const totais: Record<string, number> = {};

  props.despesas.forEach((despesa) => {
    totais[despesa.categoria] =
      (totais[despesa.categoria] || 0) + Number(despesa.valor);
  });

  return totais;
});

const series = computed(() => Object.values(totaisPorCategoria.value));

const opcoes = computed(() => ({
  labels: Object.keys(totaisPorCategoria.value),
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
}));
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
