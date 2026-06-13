# Estratégias de Monetização — Regicide Tracker

## Objetivo

Definir caminhos de monetização para o **Regicide Tracker** sem prejudicar a experiência cooperativa do jogo, aproveitando os modos já existentes no app:

- **Jogo digital**
- **Multiplayer**
- **Tracker físico**
- **Instruções / onboarding**

---

## Resumo Executivo

A melhor direção para este produto é um modelo **freemium com compra única ou upgrade Pro**, evitando monetização agressiva durante a partida.

Recomendação principal:

1. Manter **tracker** e **instruções** grátis para aquisição de usuários.
2. Monetizar **jogo digital completo** e **multiplayer avançado**.
3. Usar **cosméticos**, **packs de apoio** e **estatísticas premium** como receita complementar.
4. Evitar depender de **anúncios intrusivos** e evitar **assinatura desde o dia 1**.

O produto tem cara de app companion/utilitário para um público nichado e engajado. Nesse contexto, tende a funcionar melhor vender:

- conveniência
- recursos sociais
- personalização
- status de apoiador

do que bloquear a diversão básica com fricção.

---

## Contexto do Produto

Pelo estado atual do repositório, o app já possui alguns ativos fortes para monetização:

- **Valor imediato**: tracker físico resolve um problema real de mesa.
- **Modo digital**: cria uma proposta mais completa que um simples companion.
- **Multiplayer em andamento**: abre espaço para monetizar infraestrutura social/online.
- **Localização em vários idiomas**: amplia alcance sem depender só do mercado local.
- **Forte identidade visual**: favorece venda de temas e itens cosméticos.

Também existem limitações importantes:

- O público é mais nichado do que um jogo mobile casual.
- Sessões são relativamente longas, então anúncios durante gameplay tendem a irritar.
- Se o app usa nome, regras, arte ou universo ligados a uma IP existente, a monetização precisa ser validada com cuidado.

---

## Ponto Crítico: Licenciamento e IP

Antes de monetizar, vale tratar este ponto como prioridade.

Se o app for uma adaptação, companion oficial ou não-oficial de um jogo já existente, é importante validar:

- uso comercial do nome do jogo
- uso comercial das regras
- uso de ilustrações, personagens e assets
- publicação paga nas lojas
- monetização de modo digital multiplayer

Sem essa validação, existe risco de a monetização ser contestada ou barrada.

Estratégia segura:

- se houver licença: monetizar normalmente
- se não houver licença: posicionar o app como **companion não-oficial**, evitar uso de assets protegidos e considerar branding próprio

Isso não substitui orientação jurídica, mas é um ponto de negócio que pode mudar toda a estratégia.

---

## Princípios de Monetização Recomendados

Para este jogo, a monetização ideal deveria seguir estes princípios:

1. **Nada de pay-to-win**
   Recursos pagos não devem alterar regras, dano, cartas ou chance de vitória.

2. **Gameplay principal sem interrupção**
   Evitar popups e anúncios no meio da partida.

3. **Cobrar por valor percebido**
   O usuário tende a pagar por praticidade, multiplayer, histórico, personalização e experiência premium.

4. **Usar o modo grátis como aquisição**
   Tracker e instruções podem funcionar como topo de funil.

5. **Monetizar onde existe custo recorrente**
   Multiplayer, cloud sync e recursos online justificam melhor um upgrade pago.

---

## Estratégias de Monetização

## 1. Freemium com Upgrade para Desbloqueio Completo

### Modelo

Deixar parte do app gratuita e cobrar um unlock para a experiência completa.

### O que faz sentido deixar grátis

- Tracker físico
- Instruções
- Tutorial / primeira experiência do modo digital
- Entrada em salas multiplayer como convidado

### O que faz sentido cobrar

- Jogo digital completo
- Criar salas multiplayer
- Histórico detalhado de partidas
- Estatísticas avançadas
- Cloud save

### Vantagens

- Baixa fricção para aquisição
- Fácil de comunicar
- Boa compatibilidade com um público de nicho
- Monetiza usuários que já entenderam o valor do app

### Riscos

- Se o grátis for bom demais, pouca conversão
- Se o bloqueio acontecer cedo demais, o usuário abandona

### Boa implementação

Uma abordagem equilibrada seria:

- **grátis**: tracker + instruções + 1 experiência guiada do modo digital
- **pago**: modo digital completo + multiplayer host + stats premium

---

## 2. Compra Única "Premium" ou "Pro"

### Modelo

Cobrar uma vez para desbloquear os recursos premium permanentemente.

### Faixa de preço sugerida

- **baixo ticket**: `R$ 9,90` a `R$ 19,90`
- **ticket principal**: `R$ 19,90` a `R$ 34,90`

### Quando funciona melhor

- Produto utilitário
- Público que prefere pagar uma vez
- App sem necessidade forte de conteúdo novo todo mês

### Melhor pacote Pro para este projeto

- Jogo digital completo
- Criar e hospedar salas multiplayer
- Salvar histórico de runs
- Métricas por partida
- Temas visuais extras
- Badge de apoiador

### Vantagens

- Mensagem simples
- Menos rejeição que assinatura
- Boa aderência ao perfil de companion app

### Riscos

- Receita menos previsível no longo prazo
- Exige volume constante de novos usuários

### Recomendação

Se eu tivesse que escolher um único modelo para lançar primeiro, seria este.

---

## 3. Multiplayer como Recurso Pago

### Modelo

Monetizar especificamente o recurso online, que tem custo recorrente de infraestrutura e maior valor social.

### Opções viáveis

- **Somente o host paga**
  Quem cria a sala precisa do upgrade; quem entra pode jogar grátis.

- **Multiplayer incluído no Pro**
  O online vira parte do pacote premium.

- **Passe de sala**
  Compra avulsa para criar salas por um período ou quantidade limitada.

### Melhor opção

**Host paga, convidados entram grátis**.

Isso reduz fricção social e facilita viralização:

- 1 pessoa converte
- 2 a 4 pessoas experimentam
- parte delas pode virar usuária pagante depois

### Vantagens

- Monetiza uma feature de alto valor percebido
- Justifica custos de Firebase/backend
- Cria efeito de crescimento orgânico entre amigos

### Riscos

- Se a base ainda for pequena, pode haver pouca disposição para pagar por multiplayer cedo
- Exige estabilidade alta; ninguém quer pagar por online instável

### Gatilho ideal para cobrar

Cobre apenas quando o multiplayer estiver bem resolvido em:

- reconexão
- sincronização
- estabilidade
- UX de lobby

---

## 4. Cosméticos e Personalização

### Modelo

Vender itens que não afetam gameplay.

### Exemplos que combinam com este app

- backs de carta alternativos
- temas de mesa
- fundos temáticos
- trilhas sonoras adicionais
- efeitos visuais sutis
- molduras de perfil / badge de host

### Faixa de preço sugerida

- packs simples: `R$ 4,90` a `R$ 9,90`
- pack apoiador/deluxe: `R$ 12,90` a `R$ 24,90`

### Vantagens

- Não afeta balanceamento
- Boa margem
- Reforça a identidade visual já forte do projeto

### Riscos

- Depende de uma base ativa
- Precisa de direção artística consistente para vender bem

### Recomendação

Funciona melhor como receita complementar, não como modelo principal.

---

## 5. Supporter Pack / Gorjeta Premium

### Modelo

Oferecer um pack para quem quer apoiar o projeto, sem depender só de features bloqueadas.

### O que incluir

- badge de apoiador
- tema exclusivo
- moldura de perfil
- trilha adicional
- agradecimento em créditos
- acesso antecipado a novidades

### Vantagens

- Excelente para projetos com apelo de comunidade
- Ajuda mesmo quando o usuário não precisa do Pro
- Baixo risco de percepção negativa

### Riscos

- Receita imprevisível
- Não sustenta sozinho um produto com custos online

### Recomendação

Ótimo como segunda camada de monetização.

---

## 6. Anúncios com Uso Muito Controlado

### Modelo

Inserir ads apenas em pontos de baixa fricção.

### Locais aceitáveis

- tela inicial
- fim de partida
- entre sessões
- rewarded ad opcional para liberar um mimo cosmético temporário

### Locais a evitar

- durante o turno
- durante seleção de cartas
- em telas críticas do tracker
- no meio do multiplayer

### Vantagens

- Gera receita com usuários não pagantes
- Pode capturar valor da base free

### Riscos

- Prejudica muito a experiência se mal dosado
- Em jogo de nicho, o volume pode não compensar
- Pode reduzir conversão para pago se o app parecer "barato"

### Recomendação

Usar anúncios só se:

- a base free crescer bastante
- a receita por compra for insuficiente

Mesmo assim, eu evitaria banner agressivo. Se usar ads, prefira **rewarded** ou placements discretos fora da partida.

---

## 7. Afiliados, Bundles e Parcerias

### Modelo

Ganhar receita com integração ao ecossistema físico do jogo.

### Possibilidades

- link para compra do baralho físico
- bundle com sleeve, playmat ou acessórios
- cupom com lojas parceiras
- versão oficial licenciada com publisher

### Vantagens

- Excelente alinhamento com o tracker físico
- Monetiza mesmo usuários que não querem o modo digital
- Cria ponte entre app e mesa

### Riscos

- Depende de negociação externa
- Pode esbarrar em políticas das lojas se o fluxo comercial for mal implementado

### Recomendação

Muito promissor se houver abertura comercial com parceiros ou detentores da IP.

---

## 8. Assinatura

### Modelo

Cobrança mensal ou anual por benefícios contínuos.

### Quando faria sentido

Somente se o app evoluir para algo com entrega recorrente clara, como:

- matchmaking
- cloud sync avançado
- estatísticas online
- eventos sazonais
- conteúdos novos frequentes
- features sociais persistentes

### Por que não é ideal agora

- O produto ainda parece mais companion/premium do que serviço
- Assinatura gera expectativa alta de updates constantes
- A resistência inicial tende a ser maior

### Recomendação

Não começar por assinatura.

Se um dia ela existir, que seja como camada opcional avançada, não como porta de entrada principal.

---

## Estratégias Não Recomendadas

- **Pay-to-win**
  Vender vantagem de jogo destruiria a confiança no produto.

- **Energy/lives**
  Não combina com o ritmo de partida e com a proposta de board/card game.

- **Ads no meio da gameplay**
  Alto risco de abandono.

- **Assinatura obrigatória desde o lançamento**
  Muita fricção para um produto ainda em validação.

---

## Estratégia Recomendada para Este Projeto

## Melhor composição inicial

### Camada 1: Grátis

- Tracker físico
- Instruções
- Tutorial do jogo digital
- Entrar em sala multiplayer

### Camada 2: Pro por compra única

- Modo digital completo
- Criar/hospedar salas multiplayer
- Histórico de partidas
- Estatísticas avançadas
- Cloud save
- Alguns cosméticos premium

### Camada 3: Receita complementar

- Supporter pack
- Cosméticos extras
- Parcerias/afiliados

---

## Roadmap Sugerido

## Fase 1 — Lançar com monetização simples

Objetivo: validar disposição de pagamento com o menor atrito operacional.

Entregar:

- tracker grátis
- instruções grátis
- paywall leve no modo digital completo
- compra única Pro

Métrica principal:

- taxa de conversão free -> Pro

---

## Fase 2 — Monetizar o multiplayer

Objetivo: transformar o online em alavanca de crescimento e receita.

Entregar:

- host pago
- convidados grátis
- melhorias de lobby e reconexão
- histórico online de partidas

Métricas principais:

- criação de salas por usuário pagante
- taxa de convite
- conversão de convidados em pagantes

---

## Fase 3 — Expandir ticket médio

Objetivo: aumentar receita por usuário sem pressionar a experiência principal.

Entregar:

- packs cosméticos
- supporter pack
- badges e temas exclusivos
- eventuais bundles com parceiros

Métrica principal:

- receita adicional por usuário pagante

---

## KPIs Recomendados

Para decidir o que realmente funciona, vale instrumentar pelo menos:

- instalação -> abertura do tracker
- instalação -> início do tutorial
- tutorial -> primeira partida digital
- visita à tela multiplayer -> criação de sala
- convidado -> retorno ao app
- conversão para Pro
- retenção `D1`, `D7` e `D30`
- partidas por usuário por semana
- taxa de vitória/abandono

---

## Sugestões Práticas de Implementação no Produto

Com a estrutura atual do app, a monetização pode ser introduzida sem refazer o produto inteiro:

- manter `Tracker` e `Como Jogar` sempre acessíveis na home
- aplicar gating leve em `Jogar` e `Multiplayer`
- liberar `entrar em sala` e cobrar `criar sala`
- salvar entitlement localmente no começo e sincronizar depois, se necessário
- conectar analytics aos fluxos de lobby, início de partida e conclusão de run

Importante: só vale endurecer paywall depois de medir uso real.

---

## Conclusão

Para o **Regicide Tracker**, a estratégia mais forte é:

- **freemium para aquisição**
- **compra única Pro para captura de valor**
- **multiplayer como motor de conversão**
- **cosméticos e supporter pack como receita complementar**

A ordem importa. Primeiro, validar valor percebido com um upgrade simples. Depois, usar multiplayer e personalização para expandir receita. E antes de tudo, garantir que a monetização esteja segura do ponto de vista de **licenciamento e IP**.
