const app = require('./src/app');
require('dotenv/lib/main').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});