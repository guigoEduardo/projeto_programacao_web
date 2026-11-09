function parsePositiveId(value, message = 'O id deve ser um inteiro positivo.') {
  const id = Number(value);
  if (!/^\d+$/.test(String(value)) || !Number.isSafeInteger(id) || id <= 0) {
    throw Object.assign(new Error(message), { status: 400 });
  }
  return id;
}

module.exports = { parsePositiveId };
