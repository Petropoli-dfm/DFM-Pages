# DFM - Digital Financial Market

Uma plataforma completa de investimentos digitais com sistema de níveis, ganhos automáticos e sistema de referência.

## 🚀 Características

- **Interface Moderna**: Design responsivo com tema escuro e detalhes dourados
- **Sistema de Autenticação**: Registro e login com Firebase
- **Níveis de Investimento**: 11 níveis diferentes com ganhos variados
- **Ganhos Automáticos**: Sistema de ganhos diários após 24h
- **Sistema de Referência**: Links de convite com bônus de 600 Kz
- **Depósitos e Saques**: Integração com bancos angolanos
- **Dashboard Completo**: Interface administrativa para usuários
- **Banco de Dados MySQL**: Armazenamento seguro de dados

## 📋 Requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- NPM ou Yarn

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd dfm-market
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
```bash
# Acesse o MySQL
mysql -u root -p

# Crie o banco de dados
CREATE DATABASE dfm_market;
```

### 4. Configure as variáveis de ambiente
Copie o arquivo `config.env` e ajuste as configurações:
```bash
cp config.env .env
```

Edite o arquivo `.env` com suas configurações:
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=dfm_market
```

### 5. Inicie o servidor
```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 🏗️ Estrutura do Projeto

```
dfm-market/
├── public/                 # Arquivos públicos
│   ├── css/               # Estilos CSS
│   ├── js/                # JavaScript do frontend
│   ├── index.html         # Página inicial
│   ├── login.html         # Página de login
│   ├── registro.html      # Página de registro
│   └── dashboard.html     # Dashboard do usuário
├── uploads/               # Uploads de comprovantes
├── server.js              # Servidor principal
├── package.json           # Dependências do projeto
├── config.env             # Configurações de ambiente
└── README.md              # Documentação
```

## 🎯 Funcionalidades

### Sistema de Níveis
- **Nível 1**: 4.000 Kz → 500 Kz/dia (35 dias)
- **Nível 2**: 10.000 Kz → 1.200 Kz/dia (35 dias)
- **Nível 3**: 15.000 Kz → 1.600 Kz/dia (50 dias)
- **Nível 4**: 25.000 Kz → 4.000 Kz/dia (50 dias)
- **Nível 5**: 30.000 Kz → 5.000 Kz/dia (50 dias)
- **Nível 6**: 45.000 Kz → 6.500 Kz/dia (50 dias)
- **Nível 7**: 50.000 Kz → 8.000 Kz/dia (50 dias)
- **Nível 8**: 60.000 Kz → 11.200 Kz/dia (40 dias)
- **Nível 9**: 100.000 Kz → 13.500 Kz/dia (40 dias)
- **Nível 10**: 120.000 Kz → 14.200 Kz/dia (40 dias)
- **Nível 11**: 130.000 Kz → 20.000 Kz/dia (40 dias)

### Bancos Suportados
- BAI
- BFA
- BIC
- ATLÂNTICO
- BCI
- YETU
- BPC
- ECONÔMICO
- KEVE
- SOL
- UNITEL MONEY

### Sistema de Pagamento
- **Entidade**: 10116
- **Referência**: 942345333
- **WhatsApp**: +2449423453330

## 🔧 API Endpoints

### Autenticação
- `POST /api/registro` - Registro de usuário
- `POST /api/login` - Login de usuário

### Níveis
- `GET /api/niveis` - Listar níveis disponíveis
- `POST /api/comprar-nivel` - Comprar nível

### Transações
- `POST /api/deposito` - Solicitar depósito
- `POST /api/saque` - Solicitar saque

### Usuário
- `GET /api/perfil` - Obter perfil do usuário
- `GET /api/bancos` - Listar bancos disponíveis

## 🎨 Design System

### Cores
- **Fundo**: Preto/brilhante (#000000, #1a1a1a)
- **Texto**: Amarelado (#FFD700, #FFA500)
- **Fonte**: Times New Roman

### Componentes
- Cards com bordas douradas
- Botões com gradiente dourado
- Animações suaves
- Interface responsiva

## 🔒 Segurança

- Autenticação JWT
- Hash de senhas com bcrypt
- Validação de uploads
- Proteção contra CSRF
- Sanitização de dados

## 📱 Responsividade

O site é totalmente responsivo e funciona em:
- Desktop
- Tablet
- Mobile

## 🚀 Deploy

### Heroku
```bash
# Configure as variáveis de ambiente no Heroku
heroku config:set DB_HOST=seu_host
heroku config:set DB_USER=seu_usuario
heroku config:set DB_PASSWORD=sua_senha
heroku config:set DB_NAME=seu_banco

# Deploy
git push heroku main
```

### VPS
```bash
# Instale PM2
npm install -g pm2

# Inicie o servidor
pm2 start server.js --name dfm

# Configure para iniciar com o sistema
pm2 startup
pm2 save
```

## 📞 Suporte

- **Email**: suporte@dfm-market.com
- **Telefone**: +244 925395361
- **WhatsApp**: +244 9423453330

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📈 Roadmap

- [ ] Sistema de notificações push
- [ ] App mobile nativo
- [ ] Integração com mais bancos
- [ ] Sistema de chat em tempo real
- [ ] Dashboard administrativo
- [ ] Relatórios avançados
- [ ] Sistema de afiliados em múltiplos níveis

## 🐛 Problemas Conhecidos

- Nenhum problema conhecido no momento

## 📝 Changelog

### v1.0.0 (2025-01-XX)
- Lançamento inicial
- Sistema de níveis completo
- Dashboard do usuário
- Sistema de referência
- Integração Firebase
- Design responsivo

---

**DFM - Digital Financial Market** - Transformando o futuro financeiro de Angola 🇦🇴 