# Questão 1 - Proposta de arquitetura DDD para o TravelBuddy

## Domínio de aplicação

O TravelBuddy é uma plataforma web de compartilhamento e descoberta de experiências de viagem. Pessoas usuárias podem criar relatos associados a destinos, publicar imagens, explorar um feed e buscar conteúdo; também podem manter perfis e interagir com relatos por meio de curtidas e comentários. O domínio central é a publicação e descoberta de relatos de viagem, enquanto identidade, mídia e interações dão suporte a esse fluxo.

## Linguagem ubíqua

| Termo | Significado no domínio |
|---|---|
| Relato | Publicação criada por uma pessoa sobre uma experiência/destino, com título, descrição, categoria e imagem. O código atual chama essa entidade `Destination`. |
| Autor | Pessoa usuária que criou um relato. |
| Feed | Lista paginada de relatos ordenados por data de publicação. |
| Curtida | Manifestação de interesse de uma pessoa em um relato; a combinação pessoa-relato é única. |
| Comentário | Mensagem de uma pessoa vinculada a um relato. |
| Perfil | Dados públicos e privados de uma pessoa, incluindo sua apresentação e imagem. |

O termo de domínio preferido nesta proposta é **Relato**; nomes existentes do banco/API (`Destination`, `destinationId`) são detalhes de implementação a serem traduzidos nos adaptadores até uma eventual migração.

## Contextos delimitados

1. **Identidade e Perfil**: cadastro, autenticação, credenciais, perfil e autorização de acesso. Dono dos identificadores de pessoas.
2. **Relatos de Viagem**: criação, edição, remoção, autoria, conteúdo, publicação e consulta de relatos. Dono dos identificadores de relatos e das regras de autoria.
3. **Interações Sociais**: curtidas e comentários, com suas regras de unicidade e vínculo a relato/pessoa.
4. **Descoberta**: feed, busca e projeções de leitura. Pode consumir eventos publicados pelos demais contextos para atualizar uma projeção, sem se tornar dona dos relatos.

Os contextos podem começar como módulos dentro de um monólito modular. A divisão não exige microsserviços e evita distribuir a complexidade antes que exista necessidade operacional.

## Modelo e agregados

- **Pessoa** (`Identity/Profile`): raiz do agregado Pessoa; protege alteração do perfil e estado da conta. Credenciais devem ser tratadas por um serviço de domínio/aplicação especializado e armazenadas por um adaptador seguro.
- **Relato** (`Travel Content`): raiz do agregado Relato; concentra regras de criação, edição, publicação e remoção. Autor é referenciado por ID, sem incorporar o agregado Pessoa.
- **Curtida** (`Social Interaction`): agregado pequeno identificado por pessoa e relato; uma restrição única no armazenamento protege a unicidade.
- **Comentário** (`Social Interaction`): agregado identificado por seu próprio ID, ligado a pessoa e relato por IDs. A regra de existência do relato é verificada por porta/consulta apropriada.
- **Feed/Busca** (`Discovery`): projeções de leitura, reconstruíveis a partir das fontes de verdade e/ou eventos; não são agregados transacionais de escrita.

Contadores exibidos (visualizações, curtidas, comentários, relatos publicados) podem ser projeções/materializações. Se armazenados junto de um agregado, a atualização deve ser consistente e possuir uma regra clara de propriedade.

## Organização proposta

```text
src/
  contexts/
    identity-profile/
      domain/            # Pessoa, regras, eventos, portas de repositório
      application/       # casos de uso: cadastrar, autenticar, atualizar perfil
      infrastructure/    # Sequelize, hash de senha, JWT, armazenamento de mídia
      interfaces/http/   # rotas, controladores, validadores e DTOs
    travel-content/
      domain/            # Relato, políticas de autoria/publicação, eventos
      application/       # criar, editar, publicar, remover, consultar relato
      infrastructure/    # persistência Sequelize, mídia, adaptadores
      interfaces/http/
    social-interaction/
      domain/            # Curtida, Comentário e regras de interação
      application/       # curtir, descurtir, comentar, listar interações
      infrastructure/   # repositórios Sequelize e publicação de eventos
      interfaces/http/
    discovery/
      application/       # pesquisar e montar feed
      infrastructure/   # consultas/projeções, consumidores de eventos
      interfaces/http/
  shared-kernel/         # IDs, tipos de valor realmente compartilhados
  bootstrap/             # composição das implementações e configuração
```

As dependências apontam para dentro: interfaces HTTP chamam casos de uso; casos de uso dependem de portas; domínio não conhece Express, Sequelize, JWT, filesystem ou broker. `bootstrap` injeta adaptadores concretos. Cada contexto controla seu modelo e expõe contratos explícitos aos demais.

## Mapeamento do código atual para a proposta

| Código atual | Destino conceitual |
|---|---|
| `modules/user` | `identity-profile` |
| `modules/destination` | `travel-content` (renomeado conceitualmente para Relato) |
| `modules/like` e `modules/comment` | `social-interaction` |
| `modules/search` e consultas de feed | `discovery` |
| `config/database.js`, modelos Sequelize, armazenamento de uploads | adaptadores de infraestrutura e composição |
| `middlewares`, controllers e routes | adaptadores de entrada HTTP |

Esta é uma arquitetura-alvo documentada, não uma alegação de que o código atual já implementa DDD. O sistema atual tem módulos por funcionalidade e serviços com acesso direto a Sequelize; a proposta separa regras de domínio de infraestrutura e torna explícitos os limites contextuais.
