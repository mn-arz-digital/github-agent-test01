const { createApp } = require('./src/app');

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Ticket-System läuft auf http://localhost:${PORT}`);
});
