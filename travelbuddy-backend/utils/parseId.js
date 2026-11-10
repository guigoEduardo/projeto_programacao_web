function parseId(rawValue, label = 'recurso') {
  const value = typeof rawValue === 'string' && /^\d+$/.test(rawValue) ? Number(rawValue) : rawValue;
  if (!Number.isSafeInteger(value) || value <= 0) {
    const error = new Error(`Identificador de ${label} inválido.`);
    error.status = 400;
    throw error;
  }
  return value;
}
module.exports = { parseId };
