const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// Server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
