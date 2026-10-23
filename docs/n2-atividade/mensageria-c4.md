# Questão 2 - Comunicação assíncrona e modelo C4

## Caso de negócio escolhido

Quando um novo relato é publicado, o TravelBuddy precisa atualizar a experiência de descoberta e pode futuramente notificar seguidores. Hoje o frontend chama a API Express e lê o banco MySQL. A proposta adiciona publicação assíncrona do evento `RelatoPublicado`, permitindo que consumidores de feed/busca e notificações trabalhem sem manter a requisição HTTP aberta.

## Diagrama C4 - Contexto

```mermaid
C4Context
  title Contexto do sistema TravelBuddy - proposta N2
  Person(visitante, "Visitante", "Consulta relatos e busca destinos")
  Person(autor, "Pessoa usuária", "Publica relatos, comenta e curte")
  System(travelbuddy, "TravelBuddy", "Plataforma web de relatos e descoberta de viagens")
  System_Ext(email, "Serviço de notificação", "Entrega notificações quando habilitado")
  Rel(visitante, travelbuddy, "Consulta feed, detalhes e busca", "HTTPS")
  Rel(autor, travelbuddy, "Publica e interage com relatos", "HTTPS")
  Rel(travelbuddy, email, "Solicita notificações a partir de eventos", "Mensageria assíncrona")
```

## Diagrama C4 - Containers

```mermaid
C4Container
  title Containers do TravelBuddy com camada de mensageria - proposta N2
  Person(autor, "Pessoa usuária", "Publica e interage com relatos")
  Container(frontend, "Frontend Web", "Vue 3, Vite, Pinia", "Interface para feed, publicação, perfil e interações")
  Container(api, "API monolítica modular", "Node.js, Express", "Autentica requisições, executa casos de uso e publica eventos")
  ContainerDb(mysql, "Banco de dados", "MySQL / Sequelize", "Fonte transacional para pessoas, relatos e interações")
  ContainerDb(outbox, "Outbox transacional", "Tabela no MySQL", "Registra eventos na mesma transação da publicação")
  Container(broker, "Broker de mensagens", "RabbitMQ", "Entrega eventos de domínio de forma assíncrona")
  Container(feed, "Projeção de descoberta", "Consumidor Node.js", "Atualiza projeção do feed e índice de busca")
  Container(notifier, "Consumidor de notificações", "Worker Node.js", "Prepara notificações para seguidores")
  System_Ext(email, "Provedor de e-mail/push", "Canal externo opcional")
  Rel(autor, frontend, "Usa", "HTTPS")
  Rel(frontend, api, "Solicita operações", "JSON / HTTPS")
  Rel(api, mysql, "Lê e grava dados", "Sequelize")
  Rel(api, outbox, "Registra RelatoPublicado na transação de publicação", "SQL")
  Rel(outbox, broker, "Relay publica eventos pendentes e marca entrega", "AMQP")
  Rel(broker, feed, "Entrega RelatoPublicado", "AMQP")
  Rel(broker, notifier, "Entrega RelatoPublicado", "AMQP")
  Rel(feed, mysql, "Atualiza projeção de leitura", "SQL")
  Rel(notifier, email, "Envia notificação quando aplicável", "HTTPS/API")
```

Os diagramas C4 Mermaid são fontes textuais editáveis. A arquitetura é uma proposta de evolução; RabbitMQ, outbox e consumidores não estão implementados no repositório da aplicação.

## Justificativa de negócio

- A publicação do relato pode ser confirmada sem aguardar processamento de notificações ou reconstrução da descoberta.
- Busca, feed e notificações evoluem com menor dependência temporal entre si e com o fluxo de publicação.
- Consumidores podem ser escalados conforme o volume de eventos; falhas em uma integração externa não precisam interromper o cadastro do relato.
- Eventos como `RelatoPublicado`, `RelatoAtualizado` e `RelatoRemovido` tornam explícitas mudanças relevantes do domínio e permitem novos consumidores sem acoplar o caso de uso a cada funcionalidade.

## Escolhas técnicas e garantias

- **RabbitMQ com AMQP**: adequado para filas de trabalho, roteamento por tópicos e confirmação de entrega entre API e workers. O broker é uma decisão proposta, não uma dependência atual.
- **Transactional Outbox em MySQL**: a gravação do relato e do evento pendente ocorre na mesma transação. Um relay publica eventos pendentes e só os marca como enviados após confirmação do broker, evitando a janela clássica em que o banco confirma a publicação mas a mensagem se perde antes de ser enviada.
- **Entrega pelo menos uma vez**: consumidores podem receber duplicatas; cada evento tem `eventId` e consumidor idempotente mantém registro de processamento. Não se promete “exactly once”.
- **Contrato de evento versionado**: por exemplo, `eventId`, `eventType`, `version`, `occurredAt`, `relatoId`, `autorId`; payload minimizado para não expor dados pessoais desnecessários.
- **Resiliência operacional**: política de retry com atraso, fila de mensagens mortas (DLQ), métricas de atraso/erros, rastreamento por `correlationId` e alerta para backlog.
- **Consistência eventual**: a projeção de busca/feed pode levar alguns instantes para refletir a nova publicação; a interface pode confirmar “publicado” e atualizar a lista após a projeção ou mostrar estado transitório.
- **Segurança**: broker em rede privada, credenciais em segredo de ambiente, TLS quando atravessar rede não confiável, permissões mínimas por usuário/fila.

## Fluxo proposto

1. API valida a solicitação e inicia uma transação MySQL.
2. Caso de uso grava o relato e uma linha `RelatoPublicado` na outbox, atomicamente.
3. API confirma a publicação ao frontend após commit.
4. Relay lê a outbox e publica no RabbitMQ com confirmação; marca a linha como processada.
5. Consumidores independentes atualizam a descoberta e, se aplicável, preparam notificações. Mensagens falhas após retries vão para DLQ e são observadas para reprocessamento.
