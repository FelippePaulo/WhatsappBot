# 📋 Instruções do Catálogo

## Como adicionar o catálogo PDF

1. **Renomeie seu arquivo PDF** para: `catalogo.pdf`

2. **Coloque-o na raiz do projeto**, junto com os arquivos:
   - index.js
   - bot.js
   - package.json
   - catalogo.pdf ← **AQUI**

3. **Reinicie o servidor** (npm start)

4. **Teste**: Quando alguém digitar `1` no WhatsApp, o bot enviará o arquivo automaticamente!

## Estrutura esperada

```
chatbot test/
├── index.js
├── bot.js
├── package.json
├── .env
├── catalogo.pdf          ← Seu arquivo
├── CATALOGO_INSTRUCOES.md
└── ...outros arquivos
```

## Informações do catálogo

- **Formato**: PDF
- **Nome do arquivo**: `catalogo.pdf` (exatamente assim)
- **Tamanho máximo**: Recomendado até 16MB (limite do WhatsApp)
- **Ativação**: Usuário digita `1` ou `catálogo`

---

**Pronto!** Seu chatbot agora envia o catálogo automaticamente via WhatsApp.
