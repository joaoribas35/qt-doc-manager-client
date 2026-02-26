# BR Quality - Gestão de Documentos

Aplicação frontend para gestão de documentos, desenvolvida com React e Vite.

## Pré-requisitos

- **Node.js** (versão 22 ou superior)
- **npm** (geralmente instalado junto com o Node.js)

## Como iniciar a aplicação

### 1. Instalar dependências

No diretório do projeto, execute:

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores conforme necessário:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:

| Variável                | Descrição                                              |
| ----------------------- | ------------------------------------------------------ |
| `VITE_ENVIRONMENT`      | Ambiente de execução (ex.: `development`)              |
| `VITE_API_URL`          | URL base da API (ex.: `http://localhost:5001/api`)     |
| `VITE_USER_STORAGE_KEY` | Chave usada para armazenamento do usuário no navegador |

### 3. Rodar em modo desenvolvimento

Para iniciar o servidor de desenvolvimento com recarregamento automático:

```bash
npm run dev
```

A aplicação ficará disponível em **http://localhost:5173** (ou na URL exibida no terminal). O servidor usa `--host`, então você também pode acessar pelo IP da máquina na rede local.

### 4. Outros comandos úteis

- **Build para produção:**

  ```bash
  npm run build
  ```

- **Visualizar o build de produção localmente:**

  ```bash
  npm run start
  ```

  (disponível em http://localhost:3000)

- **Verificar formatação do código:**

  ```bash
  npm run format:check
  ```

- **Formatar o código:**

  ```bash
  npm run format
  ```

- **Executar o linter:**
  ```bash
  npm run lint
  ```

## Observação

A aplicação depende de uma API backend. Certifique-se de que o backend esteja rodando na URL configurada em `VITE_API_URL` (por padrão `http://localhost:5001/api`) para que login e demais funcionalidades funcionem corretamente.
