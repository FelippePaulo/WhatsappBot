# 🤖 WhatsApp Chatbot com QR Code

Um chatbot automático para WhatsApp construído com **Node.js** e **whatsapp-web.js**, com geração de **QR Code** para fácil conexão.

## ✨ Funcionalidades

- ✅ Geração de QR Code automático para conexão ao WhatsApp
- ✅ Interface web intuitiva para visualizar o QR Code
- ✅ Respostas automáticas a comandos
- ✅ Suporte a múltiplas interações
- ✅ Dashboard web com status de conexão
- ✅ Auto-refresh da página durante conexão
- ✅ Logging de mensagens no console

## 📋 Pré-requisitos

- **Node.js** versão 14 ou superior
- **npm** ou **yarn**
- **WhatsApp** instalado no celular

## 🚀 Instalação

### 1. Clonar ou baixar o projeto

```bash
cd "chatbot test"
```

### 2. Instalar dependências

```bash
npm install
```

> Nota: A primeira instalação pode levar alguns minutos, pois o Puppeteer será baixado.

### 3. Iniciar o servidor

**Modo desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Modo produção:**
```bash
npm start
```

Você verá algo como:
```
🚀 Servidor iniciado em http://localhost:3000
📱 Abra http://localhost:3000 no navegador
```

### 4. Conectar ao WhatsApp

1. Abra o navegador em `http://localhost:3000`
2. Você verá a página com o QR Code
3. No seu celular, abra **WhatsApp**
4. Toque em **Mais opções (⋮)** → **Dispositivos vinculados** → **Vincular um dispositivo**
5. Aponte a câmera do celular para o QR Code na tela
6. Aguarde a conexão (o QR Code desaparecerá quando conectado)
7. Pronto! O bot está pronto para responder mensagens

## 💬 Opções Disponíveis

O chatbot da Urbana Fit responde com uma mensagem de boas-vindas única:

| Ação | Resultado |
|------|-----------|
| Qualquer mensagem | Exibe boas-vindas, horários de funcionamento e opções |
| Digite `1` | Envia o catálogo em PDF |
| Digite `catálogo` | Envia o catálogo em PDF |

**Nota**: O bot responde com a mesma mensagem padrão para qualquer texto, facilitando o atendimento inicial!

## 📁 Estrutura do Projeto

```
chatbot test/
├── index.js                    # Servidor principal do bot
├── bot.js                      # Lógica do chatbot (mensagens)
├── package.json                # Dependências do projeto
├── .env                        # Variáveis de ambiente
├── .gitignore                  # Arquivos ignorados pelo Git
├── catalogo.pdf                # Arquivo de catálogo (você adiciona)
├── CATALOGO_INSTRUCOES.md      # Como adicionar o catálogo
├── qrcode.png                  # QR Code gerado (automático)
├── .wwebjs_auth/               # Sessão de autenticação (automático)
└── README.md                   # Este arquivo
```

## 🔧 Dependências

- **whatsapp-web.js**: Biblioteca para automação do WhatsApp Web
- **qrcode**: Geração de QR Codes
- **express**: Framework web
- **dotenv**: Gerenciamento de variáveis de ambiente
- **axios**: Cliente HTTP (para requisições)
- **nodemon**: Auto-reload em desenvolvimento

## 🛠️ Personalização

### Editar a mensagem de boas-vindas

Abra o arquivo `bot.js` e modifique a seção `getHorarioFuncionamento()`:

```javascript
getHorarioFuncionamento() {
  return `
📋 *URBANA FIT*

Boa tarde! Você está falando com a Urbana Fit 💪

⏰ *Horário de Funcionamento:*
Segunda a Sexta: 6h à 22h
Sábado: 8h à 18h
Domingo: 8h à 16h

Você será atendido em breve!

📋 Digite *1* para ver nosso catálogo de produtos
  `.trim();
}
```

### Adicionar o arquivo de catálogo

1. Coloque seu arquivo PDF na pasta do projeto
2. Renomeie para exatamente: `catalogo.pdf`
3. Reinicie o servidor
4. Pronto! O arquivo será enviado quando alguém digitar `1`

**Veja [CATALOGO_INSTRUCOES.md](CATALOGO_INSTRUCOES.md) para mais detalhes.**

## 🐛 Solução de Problemas

### "QR Code não aparece"
- Verifique se o servidor está rodando
- Tente atualizar a página (F5)
- Reinicie o servidor

### "Erro ao conectar ao WhatsApp"
- Certifique-se de que o WhatsApp está instalado no celular
- Verifique a conexão de internet
- Tente digitalizar o QR Code novamente

### "Catálogo não é enviado quando digito 1"
- Verifique se o arquivo está nomeado exatamente como `catalogo.pdf`
- Certifique-se de que está na pasta raiz do projeto
- Reinicie o servidor com `npm start`
- Tente novamente

### "Puppeteer não instalou"
- Execute: `npm install --save-dev puppeteer`
- Verifique se tem espaço em disco suficiente

### "Porta 3000 já em uso"
- Altere a porta no arquivo `.env`
- Ou encerre o processo usando a porta: `netstat -ano | findstr :3000`

## 📚 Recursos Úteis

- [whatsapp-web.js Documentation](https://wwebjs.dev/)
- [QRCode.js](https://davidshimjs.github.io/qrcodejs/)
- [Express.js](https://expressjs.com/)

## 📝 Notas Importantes

⚠️ **Termos de Serviço do WhatsApp**
- Este bot usa o WhatsApp Web que é oficialmente apenas para navegação pessoal
- Use com responsabilidade e considere os termos de serviço
- Não recomendado para produção em larga escala

⚠️ **Segurança**
- Mantenha seu `.env` privado
- Não compartilhe o QR Code com terceiros
- A pasta `.wwebjs_auth/` contém credenciais de sessão

## 🤝 Contribuições

Sinta-se livre para melhorar este projeto!

## 📄 Licença

MIT License - Veja LICENSE para mais detalhes

---

**Desenvolvido com ❤️ para automatizar conversas no WhatsApp**
