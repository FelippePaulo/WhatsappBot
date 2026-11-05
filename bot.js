/**
 * Lógica do Chatbot - Urbana Fit
 * Mensagem de boas-vindas única com opção de catálogo
 */

class ChatBot {
  constructor() {
    this.horarioFuncionamento = this.getHorarioFuncionamento();
  }

  getHorarioFuncionamento() {
    return `
📍 *URBANA FIT*

Boa tarde! Você está falando com a Urbana Fit 💪

⏰ *Horário de Funcionamento:*
Segunda a Quinta: 8h às 17h
Segunda a Quinta: 8h às 16h

Você será atendido em breve!

📋 Digite *1* para ver nosso catálogo de produtos
    `.trim();
  }

  async processMessage(messageBody, isFirstMessage = false) {
    const input = messageBody.toLowerCase().trim();

    // Se digitar "1" ou "catálogo", retornar requisição de envio de arquivo
    if (input === '1' || input.includes('catálogo') || input.includes('catalogo')) {
      return { type: 'catalog', message: '📂 Enviando catálogo...' };
    }

    // Se é a primeira mensagem do usuário, enviar introdução
    if (isFirstMessage) {
      return this.horarioFuncionamento;
    }

    // Qualquer outra mensagem: não responder
    return null;
  }

  addCommand(name, patterns, response) {
    // Método mantido para compatibilidade futura
  }

  removeCommand(name) {
    // Método mantido para compatibilidade futura
  }

  listCommands() {
    return ['1 - Catálogo'];
  }
}

module.exports = ChatBot;
