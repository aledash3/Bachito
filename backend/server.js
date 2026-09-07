require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor Bachito corriendo en puerto ${PORT}`);
});
