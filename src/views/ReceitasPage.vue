
<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="container">
        <h1>Minhas Receitas</h1>
        <p>Gerencie suas entradas de dinheiro.</p>

        <ion-card>
          <ion-card-header>
            <ion-card-title>
              {{ editando ? 'Editar receita' : 'Nova receita' }}
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-item>
              <ion-input
                v-model="descricao"
                label="Descrição"
                label-placement="floating"
                placeholder="Ex: Salário"
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
                <ion-select-option value="Salário">Salário</ion-select-option>
                <ion-select-option value="Freelance">Freelance</ion-select-option>
                <ion-select-option value="Investimentos">Investimentos</ion-select-option>
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

            <ion-button expand="block" @click="salvarReceita">
              {{ editando ? 'Atualizar receita' : 'Cadastrar receita' }}
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

        <h2>Histórico de receitas</h2>

        <ion-card v-for="receita in receitas" :key="receita.id">
          <ion-card-content>
            <h3>{{ receita.descricao }}</h3>
            <p>Categoria: {{ receita.categoria }}</p>
            <p>Data: {{ receita.data }}</p>
            <strong>{{ formatarValor(receita.valor) }}</strong>

            <div class="botoes">
              <ion-button size="small" @click="editarReceita(receita)">
                Editar
              </ion-button>

              <ion-button
                size="small"
                color="danger"
                @click="excluirReceita(receita.id)"
              >
                Excluir
              </ion-button>
            </div>
          </ion-card-content>
        </ion-card>

        <p v-if="receitas.length === 0">
          Nenhuma receita cadastrada.
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

interface Receita {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  user_id: string;
}

const receitas = ref<Receita[]>([]);

const descricao = ref('');
const valor = ref('');
const categoria = ref('');
const data = ref(new Date().toISOString().slice(0, 10));

const editando = ref<string | null>(null);

onMounted(() => {
  carregarReceitas();
});

async function carregarReceitas() {
  const { data, error } = await supabase
    .from('receitas')
    .select('*')
    .order('data', { ascending: false });

  if (error) {
    return mostrarAlerta('Erro', error.message);
  }

  receitas.value = data || [];
}

async function salvarReceita() {
  if (!descricao.value.trim() || !valor.value ||
      Number(valor.value) <= 0 || !categoria.value || !data.value) {
    return mostrarAlerta('Atenção', 'Preencha todos os campos corretamente.');
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

  let error;

  if (editando.value) {
    ({ error } = await supabase
      .from('receitas')
      .update(dados)
      .eq('id', editando.value));
  } else {
    ({ error } = await supabase
      .from('receitas')
      .insert(dados));
  }

  if (error) {
    return mostrarAlerta('Erro ao salvar', error.message);
  }

  limparFormulario();
  await carregarReceitas();
}

function editarReceita(receita: Receita) {
  editando.value = receita.id;
  descricao.value = receita.descricao;
  valor.value = String(receita.valor);
  categoria.value = receita.categoria;
  data.value = receita.data;
}

async function excluirReceita(id: string) {
  const alerta = await alertController.create({
    header: 'Excluir receita?',
    message: 'Deseja realmente excluir esta receita?',
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Excluir',
        role: 'destructive',
        handler: async () => {
          const { error } = await supabase
            .from('receitas')
            .delete()
            .eq('id', id);

          if (error) {
            await mostrarAlerta('Erro', error.message);
            return;
          }

          await carregarReceitas();
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
