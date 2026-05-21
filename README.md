# Painel Mensal de Eventos - Porto Mais

Sistema de gestão e controle de eventos automotivos com análise de custos, KPIs e relatórios.

## 🚀 Demo

**Acesse o sistema:** [painel-eventos.vercel.app](https://painel-eventos.vercel.app)

## ✨ Funcionalidades

- 📊 **Dashboard com KPIs**
  - Total de eventos (finalizados e em aberto)
  - Custos por categoria (mão de obra, peças, vidros, acordos)
  - Cálculo de custo líquido (total - cota participação)
  - Eventos negados e vidros

- 📋 **Gestão de Eventos**
  - Cadastro completo de eventos
  - Edição e exclusão de registros
  - Filtros por filial, tipo de pessoa, tipo de evento e mês
  - Rascunho automático do formulário

- 📈 **Gráficos Interativos**
  - Eventos por mês
  - Associado x Terceiro
  - Eventos por tipo
  - Custos por categoria
  - Eventos por filial
  - **Clique nos gráficos para visualizar em tela cheia**

- 💾 **Import/Export**
  - Exportar base em JSON
  - Importar base de dados via JSON
  - Armazenamento local no navegador (localStorage)

## 🛠️ Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Gráficos:** Chart.js
- **Armazenamento:** LocalStorage
- **Deploy:** Vercel

## 📝 Como Usar

1. Acesse o sistema pelo link acima
2. Preencha o formulário para lançar eventos
3. Visualize os KPIs e gráficos atualizados automaticamente
4. Use os filtros para analisar períodos e categorias específicas
5. Exporte seus dados em JSON para backup

## 📌 Estrutura de Dados

Cada evento contém:
- Informações básicas (filial, placa, nome, oficina)
- Tipo de pessoa (Associado/Terceiro)
- Tipo de evento (Regular/Negado/Vidro/Acordo)
- Datas (entrada e saída)
- Valores (mão de obra, peças, vidros, acordos, cota)
- Observações

## 🔒 Privacidade

Todos os dados são armazenados localmente no seu navegador. Nenhuma informação é enviada para servidores externos.

## 💻 Desenvolvimento Local

```bash
git clone https://github.com/Maralmhz/painel-eventos.git
cd painel-eventos
# Abra o index.html no navegador
```

## 📦 Licença

MIT

---

Desenvolvido com ❤️ para Porto Mais
