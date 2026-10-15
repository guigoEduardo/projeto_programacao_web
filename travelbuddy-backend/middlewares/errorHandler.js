const { error } = require('./apiResponse');

const fs = require('fs/promises');
module.exports = async (err, req, res, next) => {
  if (req.file?.path) {
    try { await fs.unlink(req.file.path); }
    catch (cleanupError) { if (cleanupError.code !== 'ENOENT') console.error('Erro ao limpar upload órfão:', cleanupError.message); }
  }
  console.error(err);
  const statusCode = err.status || 500;
  const errors = err.errors || [];
  return error(res, err.message || 'Ocorreu um erro inesperado.', statusCode, errors);
};
