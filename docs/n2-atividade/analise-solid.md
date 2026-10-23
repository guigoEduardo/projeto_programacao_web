

# Questão 3 - Inspeção SOLID do código existente

## Escopo e metodologia reprodutível

A inspeção estática foi feita sobre o snapshot local do TravelBuddy em 23/10/2026. A análise detalhada priorizou o backend Express, onde ficam casos de uso, acesso a dados e integração com filesystem; foram percorridos os módulos `user`, `destination`, `comment`, `like`, `search`, validadores, controllers e configuração. O frontend foi considerado no entendimento dos limites da aplicação, sem alegação de inspeção exaustiva de seus componentes. Para reproduzir: (1) obtenha o repositório e leia `README.md`; (2) liste os arquivos de `travelbuddy-backend/modules` e `middlewares`; (3) percorra responsabilidades, imports e efeitos colaterais de cada função/módulo; (4) compare cada unidade com SRP e DIP e procure responsabilidades independentes ou dependência direta de detalhes concretos; (5) registre o caminho, linhas e trecho mínimo; (6) para cada achado, descreva o motivo e uma refatoração sugerida; (7) releia os trechos no mesmo commit para confirmar que a evidência permanece. A análise não executou refatoração e não presume que toda dependência concreta seja defeito: os itens abaixo são oportunidades justificadas pelo custo de mudança e teste descrito.

## Achado 1 - SRP em `destinationService.js`

**Trecho (linhas 22-25 e 35-40; funções de criação/remoção):**

```js
async function removeFile(filename) {
  if (!filename) return;
  try { await fs.unlink(path.join(uploadDir, filename)); }
  catch (error) { if (error.code !== 'ENOENT') console.error('Erro ao remover arquivo:', error.message); }
}

const sequelize = require('../../config/database');
const destination = await sequelize.transaction(async (transaction) => {
  const created = await Destination.create({ userId, title, description, category, image: file.filename }, { transaction });
  await User.increment('destinationsCount', { where: { id: userId }, transaction });
  return created;
});
```

**Princípio:** SRP (responsabilidade única). O mesmo módulo coordena regras de relato, persistência/transação, manutenção de arquivos e detalhes de erro/log. Mudanças na política de armazenamento ou no banco podem exigir mudanças nesse serviço.

**Refatoração sugerida:** manter o caso de uso `CreateTravelReport` responsável pela regra e coordenação; mover persistência para `TravelReportRepository` e mídia para `MediaStorage` (porta com adaptador local/S3). Emitir erros de aplicação tipados e deixar o adaptador HTTP traduzi-los em status HTTP.

## Achado 2 - SRP em `userService.js`

**Trecho (linhas 51-64 e 92-116):**

```js
const user = await User.findOne({ where: { email } });
const passwordMatches = await bcrypt.compare(password, user.password);
const token = generateToken({ id: user.id, username: user.username });
// ...
const oldPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'profiles', oldPicture);
fs.unlink(oldPath, (err) => { if (err) console.error('Erro ao remover foto antiga:', err.message); });
await user.save();
```

**Princípio:** SRP. O serviço reúne autenticação/credenciais, consulta e atualização de perfil, criação de token e ciclo de vida de imagem. Mudanças de política de senha, tokens, perfil ou armazenamento ficam no mesmo módulo.

**Refatoração sugerida:** separar casos de uso de identidade (`RegisterUser`, `AuthenticateUser`) e perfil (`UpdateProfile`), com `PasswordHasher`, `TokenIssuer`, `UserRepository` e `ProfileImageStorage` como portas injetadas.

## Achado 3 - SRP em `destinationValidator.js`

**Trecho (linhas 15-23):**

```js
const errors = validationResult(req);
if (!errors.isEmpty()) {
  if (req.file?.path) {
    try { await require('fs/promises').unlink(req.file.path); }
    catch (cleanupError) { if (cleanupError.code !== 'ENOENT') console.error(cleanupError.message); }
  }
  return res.status(422).json({ success: false, message: 'Dados inválidos.', errors: errors.array() });
}
```

**Princípio:** SRP. Middleware de validação de entrada também remove arquivo temporário, registra falha de I/O e decide o formato/status HTTP da resposta.

**Refatoração sugerida:** validar e anexar erros ao fluxo HTTP; usar uma política/handler de upload temporário para compensar arquivos rejeitados; centralizar tradução de erro para resposta no adaptador HTTP. A compensação continua explícita, mas em unidade própria e testável.

## Achado 4 - DIP em `destinationService.js`

**Trecho (linhas 1-7 e 35-38):**

```js
const Destination = require('./destinationModel');
const User = require('../user/userModel');
const fs = require('fs/promises');
const path = require('path');
// ...
const sequelize = require('../../config/database');
const created = await Destination.create({ userId, title, description, category, image: file.filename }, { transaction });
```

**Princípio:** DIP (inversão de dependência). A política do caso de uso depende diretamente de Sequelize, modelos concretos, filesystem e caminho local, em vez de contratos definidos pelo núcleo da aplicação.

**Refatoração sugerida:** definir portas `TravelReportRepository`, `UserStatistics`, `UnitOfWork` e `MediaStorage`; implementar adaptadores Sequelize/filesystem na infraestrutura e compô-los no bootstrap. O domínio/caso de uso passa a depender dessas abstrações.

## Achado 5 - DIP em `userService.js`

**Trecho (linhas 1-6 e 16-20):**

```js
const User = require('./userModel');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../config/jwt');
const fs = require('fs');
const path = require('path');
const Destination = require('../destination/destinationModel');
```

**Princípio:** DIP. O serviço de aplicação conhece diretamente banco/modelos, biblioteca de hash, implementação JWT e filesystem, restringindo substituição e testes isolados.

**Refatoração sugerida:** injetar `UserRepository`, `PasswordHasher`, `TokenIssuer` e `ProfileImageStorage`; fazer composições em `bootstrap`. A camada de aplicação define as portas necessárias; os adaptadores implementam os contratos.

## Achado 6 - DIP em `commentService.js`

**Trecho (linhas 1-4 e 13-21):**

```js
const sequelize = require('../../config/database');
const Comment = require('./commentModel');
const Destination = require('../destination/destinationModel');
const User = require('../user/userModel');
// createComment grava comentário e altera contador do modelo de relato
const comment = await sequelize.transaction(async (transaction) => {
  const created = await Comment.create({ userId, destinationId, content }, { transaction });
  await Destination.increment('commentsCount', { by: 1, where: { id: destinationId }, transaction });
  return created;
});
```

**Princípio:** DIP. O caso de uso de comentário depende do banco e dos modelos Sequelize de Comentário, Relato e Pessoa; também atravessa diretamente o modelo de outro módulo para atualizar uma projeção.

**Refatoração sugerida:** depender de `CommentRepository`, `ReportReference`/porta de consulta e `UnitOfWork`; atualizar contadores por evento (`ComentarioCriado`) ou por projeção pertencente ao contexto de Relatos/Descoberta. Injetar os adaptadores no caso de uso.

## Síntese e limites

Foram registrados seis achados: três oportunidades de SRP e três de DIP. A avaliação é estática e contextual; SRP é interpretado como um motivo principal para mudança, e DIP é relevante especialmente onde se pretende testar ou trocar detalhes de infraestrutura. A arquitetura atual é funcional/modular e isso não elimina a aplicabilidade dos princípios: os módulos e funções foram tratados como unidades equivalentes, conforme a orientação do enunciado. Não foi identificado neste recorte um caso de LSP ou ISP que pudesse ser sustentado por evidência clara, e OCP não foi contado entre os seis achados para evitar atribuição especulativa. As sugestões são propostas, não alterações implementadas.
