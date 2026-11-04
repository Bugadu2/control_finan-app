
<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="container">
        <h1>Minhas Despesas</h1>
        <p>Gerencie seus gastos.</p>

        <ion-card>
          <ion-card-header>
            <ion-card-title>
              {{ editando ? 'Editar despesa' : 'Nova despesa' }}
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-item>
              <ion-input
                v-model="descricao"
                label="Descrição"
                label-placement="floating"
                placeholder="Ex: Alimentação"
              />
            </ion-item>

            <ion-item>
              <ion-input
                v-model="valor"
                label="Valor (R$)"
                label-placement="floating"
                type="number"
              />
            </ion-item>

            <ion-item>
              <ion-select
                v-model="categoria"
                label="Categoria"
                label-placement="floating"
                placeholder="Selecione"
              >
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
              <ion-input
                v-model="data"
                label="Data"
                label-placement="floating"
                type="date"
              />
            </ion-item>

            <ion-button expand="block" @click="salvarDespesa">
              {{ editando ? 'Atualizar despesa' : 'Cadastrar despesa' }}
            </ion-button>

            <ion-button
              v-if="editando"
              expand="block"
              fill="outline"
              color="medium"
              @click="limparFormulario"
            >
              Cancelar edição
            </ion-button>
          </ion-card-content>
        </ion-card>

        <h2>Histórico de despesas</h2>

        <ion-card v-for="despesa in despesas" :key="despesa.id">
          <ion-card-content>
            <h3>{{ despesa.descricao }}</h3>
            <p>Categoria: {{ despesa.categoria }}</p>
            <p>Data: {{ despesa.data }}</p>
            <strong>{{ formatarValor(despesa.valor) }}</strong>

            <div class="botoes">
              <ion-button size="small" @click="editarDespesa(despesa)">
                Editar
              </ion-button>

              <ion-button
                size="small"
                color="danger"
                @click="excluirDespesa(despesa.id)"
              >
                Excluir
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>

        <p v-if="despesas.length === 0">
          Nenhuma despesa cadastrada.
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonPage, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonItem, IonInput,
  IonSelect, IonSelectOption, IonButton, alertController
} from '@ionic/vue';

import { supabase } from '@/lib/supabase';

interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  user_id: string;
}

const despesas = ref<Despesa[]>([]);
const descricao = ref('');
const valor = ref('');
const categoria = ref('');
const data = ref(new Date().toISOString().slice(0, 10));
const editando = ref<string | null>(null);

onMounted(() => {
  carregarDespesas();
});

async function carregarDespesas() {
  const { data, error } = await supabase
    .from('despesas')
    .select('*')
    .order('data', { ascending: false });

  if (error) {
    return mostrarAlerta('Erro', error.message);
  }

  despesas.value = data || [];
}

async function salvarDespesa() {
  if (
    !descricao.value.trim() ||
    !valor.value ||
    Number(valor.value) <= 0 ||
    !categoria.value ||
    !data.value
  ) {
    return mostrarAlerta(
      'Atenção',
      'Preencha todos os campos corretamente.'
    );
  }

  const { data: usuario } = await supabase.auth.getUser();

  if (!usuario.user) {
    return mostrarAlerta('Erro', 'Você precisa estar logado.');
  }

  const dados = {
    descricao: descricao.value.trim(),
    valor: Number(valor.value),
    categoria: categoria.value,
    data: data.value,
    user_id: usuario.user.id
  };

  const resultado = editando.value
    ? await supabase
        .from('despesas')
        .update(dados)
        .eq('id', editando.value)
    : await supabase
        .from('despesas')
        .insert(dados);

  if (resultado.error) {
    return mostrarAlerta('Erro ao salvar', resultado.error.message);
  }

  limparFormulario();
  await carregarDespesas();
}

function editarDespesa(despesa: Despesa) {
  editando.value = despesa.id;
  descricao.value = despesa.descricao;
  valor.value = String(despesa.valor);
  categoria.value = despesa.categoria;
  data.value = despesa.data;
}

async function excluirDespesa(id: string) {
  const alerta = await alertController.create({
    header: 'Excluir despesa?',
    message: 'Deseja realmente excluir esta despesa?',
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Excluir',
        role: 'destructive',
        handler: async () => {
          const { error } = await supabase
            .from('despesas')
            .delete()
            .eq('id', id);

          if (error) {
            await mostrarAlerta('Erro', error.message);
            return;
          }

          await carregarDespesas();
        }
      }
    ]
  });

  await alerta.present();
}

function limparFormulario() {
  descricao.value = '';
  valor.value = '';
  categoria.value = '';
  data.value = new Date().toISOString().slice(0, 10);
  editando.value = null;
}

function formatarValor(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
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
.container {
  max-width: 650px;
  margin: auto;
}

h1 {
  color: #16a36a;
  font-weight: bold;
}

h2 {
  margin-top: 30px;
}

ion-card {
  border-radius: 14px;
}

.botoes {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
</style>
