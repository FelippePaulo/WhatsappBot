const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const path = require('path');
require('dotenv').config();

const ChatBot = require('./bot');

const app = express();
const PORT = process.env.PORT || 3000;

let currentQrCode = null;
let clientReady = false;
const chatBot = new ChatBot();

// Rastrear quando cada usuário primeiro interage com o bot
const userIntroductionTime = new Map();

// Criar cliente WhatsApp
const client = new Client({
  // Salva a sessão em .wwebjs_auth/ para não pedir QR code a cada reinício
  authStrategy: new LocalAuth({
    dataPath: path.join(__dirname, '.wwebjs_auth')
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  }
});

// Event: QR Code recebido
client.on('qr', async (qr) => {
  console.log('\n================================');
  console.log('QR Code recebido!');
  console.log('Escaneie o código QR acima com seu WhatsApp');
  console.log('================================\n');
  
  try {
    // Gerar QR code como URL de dados (data URL)
    currentQrCode = await qrcode.toDataURL(qr);
    
    // Também salvar como arquivo PNG
    await qrcode.toFile(path.join(__dirname, 'qrcode.png'), qr, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    console.log('QR code salvo em: ./qrcode.png');
    console.log(`Acesse http://localhost:${PORT} para visualizar o QR code\n`);
  } catch (err) {
    console.error('Erro ao gerar QR code:', err);
  }
});

// Event: Cliente pronto
client.on('ready', () => {
  console.log('✅ Cliente WhatsApp conectado com sucesso!');
  clientReady = true;
  currentQrCode = null;
});

// Event: Mensagem recebida
client.on('message', async (message) => {
  console.log(`\n📨 Mensagem de ${message.from}: ${message.body}`);
  
  const userId = message.from;
  const now = Date.now();
  const lastIntroductionTime = userIntroductionTime.get(userId) || 0;
  const isFirstMessage = lastIntroductionTime === 0; // É primeira mensagem se nunca enviou
  
  // Processar mensagem com o ChatBot
  try {
    const response = await chatBot.processMessage(message.body, isFirstMessage);
    
    // Se resposta for null, não responder
    if (response === null) {
      console.log('⏭️ Mensagem ignorada - bot não responde');
      return;
    }
    
    // Atualizar timestamp se enviou a mensagem de introdução
    if (isFirstMessage) {
      userIntroductionTime.set(userId, now);
    }
    
    // Verificar se é uma requisição de catálogo
    if (typeof response === 'object' && response.type === 'catalog') {
      await message.reply(response.message);
      
      // Enviar o arquivo de catálogo
      const catalogPath = path.join(__dirname, 'catalogo.pdf');
      try {
        const fs = require('fs');
        if (fs.existsSync(catalogPath)) {
          const media = await MessageMedia.fromFilePath(catalogPath);
          await message.reply(media);
          console.log('📄 Catálogo enviado com sucesso');
        } else {
          await message.reply('Desculpe, o catálogo não está disponível no momento. Tente novamente mais tarde.');
          console.warn('⚠️ Arquivo catalogo.pdf não encontrado');
        }
      } catch (err) {
        console.error('Erro ao enviar catálogo:', err);
        await message.reply('Desculpe, houve um erro ao enviar o catálogo.');
      }
    } else {
      // Resposta normal (texto)
      await message.reply(response);
    }
  } catch (err) {
    console.error('Erro ao processar mensagem:', err);
    await message.reply('Desculpe, ocorreu um erro ao processar sua mensagem. 😔');
  }
});

// Event: Desconexão
client.on('disconnected', () => {
  console.log('❌ Cliente desconectado');
  clientReady = false;
});

// Rota para visualizar QR code
app.get('/', (req, res) => {
  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WhatsApp Chatbot - QR Code</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .container {
          background: white;
          border-radius: 15px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          padding: 40px;
          text-align: center;
          max-width: 500px;
          animation: slideUp 0.5s ease-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        h1 {
          color: #333;
          margin-bottom: 10px;
          font-size: 28px;
        }
        
        .status {
          font-size: 16px;
          margin-bottom: 30px;
          padding: 15px;
          border-radius: 8px;
        }
        
        .status.waiting {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .status.connected {
          background-color: #d4edda;
          color: #155724;
        }
        
        .qr-container {
          margin: 20px 0;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 10px;
          display: flex;
          justify-content: center;
        }
        
        .qr-container img {
          max-width: 300px;
          height: auto;
          border: 2px solid #667eea;
          border-radius: 10px;
        }
        
        .instructions {
          text-align: left;
          margin-top: 30px;
          padding: 20px;
          background-color: #f0f4ff;
          border-left: 4px solid #667eea;
          border-radius: 8px;
        }
        
        .instructions h3 {
          color: #667eea;
          margin-bottom: 10px;
        }
        
        .instructions ol {
          margin-left: 20px;
          line-height: 1.8;
          color: #555;
        }
        
        .spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .refresh-hint {
          margin-top: 20px;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🤖 WhatsApp Chatbot</h1>
        <div class="status ${clientReady ? 'connected' : 'waiting'}">
          ${clientReady ? '✅ Conectado ao WhatsApp' : '⏳ Aguardando conexão...'}
        </div>
        
        ${!clientReady ? `
          <div class="qr-container">
            ${currentQrCode ? `
              <img src="${currentQrCode}" alt="QR Code">
            ` : `
              <div>
                <div class="spinner"></div>
                <p>Gerando QR Code...</p>
              </div>
            `}
          </div>
          
          <div class="instructions">
            <h3>📱 Como conectar:</h3>
            <ol>
              <li>Abra o WhatsApp no seu celular</li>
              <li>Toque em Mais opções (⋮) → Dispositivos vinculados</li>
              <li>Toque em Vincular um dispositivo</li>
              <li>Aponte a câmera para o QR Code acima</li>
              <li>Aguarde a conexão</li>
            </ol>
          </div>
          
          <div class="refresh-hint">
            🔄 A página atualiza automaticamente a cada 3 segundos
          </div>
        ` : `
          <div style="margin: 20px 0;">
            <h2>✅ Pronto para usar!</h2>
            <p>Seu chatbot está conectado e respondendo mensagens.</p>
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              Teste enviando uma mensagem para este número no WhatsApp.
            </p>
          </div>
        `}
      </div>
      
      ${!clientReady ? `
        <script>
          // Auto-refresh a cada 20 segundos
          setTimeout(() => {
            location.reload();
          }, 20000);
        </script>
      ` : ''}
    </body>
    </html>
  `;
  
  res.send(html);
});

// Rota para obter QR code como JSON
app.get('/api/qr', (req, res) => {
  if (currentQrCode) {
    res.json({ qrCode: currentQrCode, ready: clientReady });
  } else {
    res.json({ qrCode: null, ready: clientReady, message: 'QR Code não disponível' });
  }
});

// Rota para verificar status
app.get('/api/status', (req, res) => {
  res.json({ ready: clientReady });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor iniciado em http://localhost:${PORT}`);
  console.log(`📱 Abra http://localhost:${PORT} no navegador\n`);
});

// Inicializar cliente WhatsApp
client.initialize();

// Tratamento de erros
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
