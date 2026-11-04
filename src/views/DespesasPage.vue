
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="danger">
        <ion-title>Minhas Despesas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div class="topo">
        <h1>Despesas</h1>
        <p>Controle seus gastos.</p>
      </div>

      <div class="form-card">
        <h2>{{ editando ? 'Editar despesa' : 'Nova despesa' }}</h2>

        <ion-item>
          <ion-label position="stacked">Descrição</ion-label>
          <ion-input v-model="descricao" placeholder="Ex: Mercado" />
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Valor (R$)</ion-label>
          <ion-input v-model="valor" type="number" placeholder="Ex: 150" />
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Categoria</ion-label>
          <ion-select v-model="categoria" placeholder="Selecione">
            <ion-select-option value="Alimentação">Alimentação</ion-select-option>
            <ion-select-option value="Transporte">Transporte</ion-select-option>
            <ion-select-option value="Moradia">Moradia</ion-select-option>
            <ion-select-option value="Educação">Educação</ion-select-option>
            <ion-select-option value="Lazer">Lazer</ion-select-option>
            <ion-select-option value="Saúde">Saúde</ion-select-option>
            <ion-select-option value="Outros">Outros</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Data</ion-label>
          <ion-input v-model="data" type="date" />
        </ion-item>

        <ion-button expand="block" color="danger" class="botao" @click="salvarDespesa">
          {{ editando ? 'Salvar alterações' : 'Adicionar despesa' }}
        </ion-button>

        <ion-button v-if="editando" expand="block" fill="clear" color="medium" @click="limparFormulario">
          Cancelar edição
        </ion-button>
      </div>

      <h2 class="titulo-lista">Histórico de despesas</h2>

      <div v-if="despesas.length === 0" class="vazio">
        <ion-icon :icon="walletOutline" />
        <p>Nenhuma despesa cadastrada.</p>
      </div>

      <div v-for="despesa in despesas" :key="despesa.id" class="despesa-card">
        <div>
          <h3>{{ despesa.descricao }}</h3>
          <p>{{ despesa.categoria }} • {{ despesa.data }}</p>
          <strong>{{ formatarValor(despesa.valor) }}</strong>
        </div>

        <div class="acoes">
          <ion-button fill="clear" color="primary" @click="editarDespesa(despesa)">
            <ion-icon :icon="createOutline" />
          </ion-button>

          <ion-button fill="clear" color="danger" @click="excluirDespesa(despesa.id)">
            <ion-icon :icon="trashOutline" />
          </ion-button>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonButton, IonIcon, alertController
} from '@ionic/vue';

import {
  walletOutline, createOutline, trashOutline
} from 'ionicons/icons';

interface Despesa {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
}

const despesas = ref<Despesa[]>([]);

const descricao = ref('');
const valor = ref('');
const categoria = ref('');
const data = ref('');

const editando = ref(false);
const idEditando = ref<number | null>(null);

function limparFormulario() {
  descricao.value = '';
  valor.value = '';
  categoria.value = '';
  data.value = '';
  editando.value = false;
  idEditando.value = null;
}

async function salvarDespesa() {
  if (
    !descricao.value.trim() ||
    !valor.value ||
    !categoria.value ||
    !data.value ||
    Number(valor.value) <= 0
  ) {
    const alerta = await alertController.create({
      header: 'Atenção',
      message: 'Preencha todos os campos corretamente.',
      buttons: ['OK']
    });

    await alerta.present();
    return;
  }

  if (editando.value && idEditando.value !== null) {
    const indice = despesas.value.findIndex(
      d => d.id === idEditando.value
    );

    if (indice !== -1) {
      despesas.value[indice] = {
        id: idEditando.value,
        descricao: descricao.value,
        valor: Number(valor.value),
        categoria: categoria.value,
        data: data.value
      };
    }
  } else {
    despesas.value.push({
      id: Date.now(),
      descricao: descricao.value,
      valor: Number(valor.value),
      categoria: categoria.value,
      data: data.value
    });
  }

  limparFormulario();
}

function editarDespesa(despesa: Despesa) {
  descricao.value = despesa.descricao;
  valor.value = String(despesa.valor);
  categoria.value = despesa.categoria;
  data.value = despesa.data;
  editando.value = true;
  idEditando.value = despesa.id;
}

async function excluirDespesa(id: number) {
  const alerta = await alertController.create({
    header: 'Excluir despesa',
    message: 'Deseja realmente excluir esta despesa?',
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Excluir',
        role: 'destructive',
        handler: () => {
          despesas.value = despesas.value.filter(
            despesa => despesa.id !== id
          );
        }
      }
    ]
  });

  await alerta.present();
}

function formatarValor(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}
</script>

<style scoped>
ion-content {
  --background: #f5f7f6;
}

.topo h1 {
  font-size: 25px;
  font-weight: 800;
  color: #202a24;
}

.topo p {
  color: #777;
}

.form-card {
  background: white;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 2px 10px #00000008;
}

.form-card h2 {
  font-size: 19px;
  font-weight: 700;
}

ion-item {
  --background: white;
  --padding-start: 0;
  margin-bottom: 10px;
}

.botao {
  margin-top: 20px;
  height: 46px;
}

.titulo-lista {
  font-size: 19px;
  font-weight: 700;
  margin: 25px 0 15px;
}

.despesa-card {
  background: white;
  border-radius: 14px;
  padding: 15px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.despesa-card h3 {
  font-size: 16px;
  margin: 0 0 5px;
}

.despesa-card p {
  color: #777;
  font-size: 12px;
}

.despesa-card strong {
  color: #dc3545;
}

.acoes {
  display: flex;
}

.vazio {
  text-align: center;
  padding: 30px;
  color: #888;
}

.vazio ion-icon {
  font-size: 40px;
  color: #dc3545;
}
</style>
