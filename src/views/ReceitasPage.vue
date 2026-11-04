
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="success">
        <ion-title>Minhas Receitas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div class="topo">
        <h1>Receitas</h1>
        <p>Controle suas entradas de dinheiro.</p>
      </div>

      <div class="form-card">
        <h2>{{ editando ? 'Editar receita' : 'Nova receita' }}</h2>

        <ion-item>
          <ion-label position="stacked">Descrição</ion-label>
          <ion-input
            v-model="descricao"
            placeholder="Ex: Salário"
          />
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Valor (R$)</ion-label>
          <ion-input
            v-model="valor"
            type="number"
            placeholder="Ex: 1500"
          />
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Categoria</ion-label>
          <ion-select v-model="categoria" placeholder="Selecione">
            <ion-select-option value="Salário">Salário</ion-select-option>
            <ion-select-option value="Freelance">Freelance</ion-select-option>
            <ion-select-option value="Investimentos">Investimentos</ion-select-option>
            <ion-select-option value="Outros">Outros</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Data</ion-label>
          <ion-input v-model="data" type="date" />
        </ion-item>

        <ion-button
          expand="block"
          color="success"
          class="botao"
          @click="salvarReceita"
        >
          {{ editando ? 'Salvar alterações' : 'Adicionar receita' }}
        </ion-button>

        <ion-button
          v-if="editando"
          expand="block"
          fill="clear"
          color="medium"
          @click="limparFormulario"
        >
          Cancelar edição
        </ion-button>
      </div>

      <h2 class="titulo-lista">Histórico de receitas</h2>

      <div v-if="receitas.length === 0" class="vazio">
        <ion-icon :icon="walletOutline" />
        <p>Nenhuma receita cadastrada.</p>
      </div>

      <div
        v-for="receita in receitas"
        :key="receita.id"
        class="receita-card"
      >
        <div>
          <h3>{{ receita.descricao }}</h3>
          <p>{{ receita.categoria }} • {{ receita.data }}</p>
          <strong>
            {{ formatarValor(receita.valor) }}
          </strong>
        </div>

        <div class="acoes">
          <ion-button
            fill="clear"
            color="primary"
            @click="editarReceita(receita)"
          >
            <ion-icon :icon="createOutline" />
          </ion-button>

          <ion-button
            fill="clear"
            color="danger"
            @click="excluirReceita(receita.id)"
          >
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
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  alertController
} from '@ionic/vue';

import {
  walletOutline,
  createOutline,
  trashOutline
} from 'ionicons/icons';

interface Receita {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
}

const receitas = ref<Receita[]>([]);

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

async function salvarReceita() {
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
    const indice = receitas.value.findIndex(
      r => r.id === idEditando.value
    );

    if (indice !== -1) {
      receitas.value[indice] = {
        id: idEditando.value,
        descricao: descricao.value,
        valor: Number(valor.value),
        categoria: categoria.value,
        data: data.value
      };
    }
  } else {
    receitas.value.push({
      id: Date.now(),
      descricao: descricao.value,
      valor: Number(valor.value),
      categoria: categoria.value,
      data: data.value
    });
  }

  limparFormulario();
}

function editarReceita(receita: Receita) {
  descricao.value = receita.descricao;
  valor.value = String(receita.valor);
  categoria.value = receita.categoria;
  data.value = receita.data;

  editando.value = true;
  idEditando.value = receita.id;
}

async function excluirReceita(id: number) {
  const alerta = await alertController.create({
    header: 'Excluir receita',
    message: 'Deseja realmente excluir esta receita?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Excluir',
        role: 'destructive',
        handler: () => {
          receitas.value = receitas.value.filter(
            receita => receita.id !== id
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
  margin-bottom: 15px;
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

.receita-card {
  background: white;
  border-radius: 14px;
  padding: 15px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.receita-card h3 {
  font-size: 16px;
  margin: 0 0 5px;
}

.receita-card p {
  color: #777;
  font-size: 12px;
}

.receita-card strong {
  color: #15965b;
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
  color: #15965b;
}
</style>
