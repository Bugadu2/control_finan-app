# Control Finan - João Vitor Resin Nogueira

Aplicativo de controle financeiro pessoal desenvolvido como projeto acadêmico. O objetivo é permitir que os usuários organizem suas receitas e despesas, acompanhem seu saldo e visualizem informações financeiras por meio de gráficos.

##  Tecnologias utilizadas

- Ionic Framework
- Vue.js
- TypeScript
- Supabase
- Supabase Authentication
- Supabase Database
- ApexCharts
- Vue3-ApexCharts

##  Funcionalidades

### Autenticação
- Cadastro de usuários.
- Login com e-mail e senha.
- Recuperação de senha.
- Logout.

### Receitas
- Cadastrar receitas.
- Listar receitas.
- Editar receitas.
- Excluir receitas.

### Despesas
- Cadastrar despesas.
- Listar despesas.
- Editar despesas.
- Excluir despesas.

### Dashboard
- Visualização do total de receitas.
- Visualização do total de despesas.
- Saldo atual.
- Gráfico de despesas por categoria.
- Gráfico de receitas e despesas por mês.
- Indicadores financeiros.
- Filtro por período.

### Orçamento mensal
- Definição de limite de gastos.
- Acompanhamento das despesas mensais.
- Cálculo do valor restante.
- Aviso quando o limite é ultrapassado.
- Atualização automática dos valores ao retornar à tela.

##  Banco de dados

O projeto utiliza o Supabase para armazenar os dados.

Tabelas principais:
- `receitas`
- `despesas`
- `orcamentos`

O sistema utiliza autenticação e políticas de segurança (RLS) para proteger os dados de cada usuário.

##  Como executar o projeto

1. Instale o Node.js.
2. Clone o repositório.
3. Entre na pasta do projeto.
4. Instale as dependências:

```bash
npm install
```

5. Configure as variáveis de ambiente no arquivo `.env`:

```env
VITE_SUPABASE_URL=sua_url
VITE_SUPABASE_KEY=sua_chave_publica
```

6. Inicie o projeto:

```bash
ionic serve
```

##  Desenvolvedor

Projeto acadêmico desenvolvido como atividade de desenvolvimento de aplicações móveis.