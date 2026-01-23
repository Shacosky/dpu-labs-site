// Script para mostrar los errores más frecuentes en la colección errorlogs
// Uso: node scripts/top-errorlogs.cjs

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI;
const ErrorLogSchema = new mongoose.Schema({}, { strict: false });
const ErrorLog = mongoose.model('ErrorLog', ErrorLogSchema, 'errorlogs');

async function showTopErrors() {
  await mongoose.connect(MONGO_URI);
  // Agrupa por mensaje y stack, cuenta ocurrencias y muestra los más frecuentes
  const top = await ErrorLog.aggregate([
    {
      $group: {
        _id: { message: '$message', stack: '$stack', url: '$url' },
        count: { $sum: 1 },
        last: { $max: '$createdAt' },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);
  console.log('Top errores más frecuentes:');
  top.forEach((err, i) => {
    console.log(`\n#${i + 1} (${err.count} veces)`);
    console.log('Mensaje:', err._id.message);
    console.log('URL:', err._id.url);
    if (err._id.stack) console.log('Stack:', err._id.stack.split('\n')[0]);
    console.log('Última vez:', err.last);
  });
  await mongoose.disconnect();
}

showTopErrors().catch((err) => {
  console.error('Error mostrando top errores:', err);
  process.exit(1);
});
