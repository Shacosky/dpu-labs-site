// Script para limpiar errores antiguos o masivos en MongoDB
// Uso: node scripts/cleanup-errorlogs.cjs

const mongoose = require('mongoose');

require('dotenv').config({ path: '.env.local' });
const MONGO_URI = process.env.MONGODB_URI;
const DAYS_OLD = 30; // Cambia este valor para antigüedad (días)
const DELETE_DUPLICATES = true; // Cambia a false si no quieres eliminar duplicados

const ErrorLogSchema = new mongoose.Schema({}, { strict: false });
const ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema, 'errorlogs');

async function cleanup() {
  await mongoose.connect(MONGO_URI);
  const cutoff = new Date(Date.now() - DAYS_OLD * 24 * 60 * 60 * 1000);

  // 1. Eliminar errores antiguos
  const oldResult = await ErrorLog.deleteMany({ createdAt: { $lt: cutoff } });
  console.log(`Eliminados ${oldResult.deletedCount} errores anteriores a ${cutoff.toISOString()}`);

  // 2. Eliminar duplicados (por mensaje y stack)
  if (DELETE_DUPLICATES) {
    const cursor = ErrorLog.aggregate([
      {
        $group: {
          _id: { message: '$message', stack: '$stack' },
          ids: { $push: '$_id' },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);
    let totalDupes = 0;
    for await (const group of cursor) {
      // Mantener solo el más reciente
      const idsToDelete = group.ids.slice(1);
      if (idsToDelete.length) {
        const dupResult = await ErrorLog.deleteMany({ _id: { $in: idsToDelete } });
        totalDupes += dupResult.deletedCount;
      }
    }
    console.log(`Eliminados ${totalDupes} duplicados por mensaje/stack.`);
  }

  await mongoose.disconnect();
  console.log('Limpieza completada.');
}

cleanup().catch((err) => {
  console.error('Error en limpieza:', err);
  process.exit(1);
});
