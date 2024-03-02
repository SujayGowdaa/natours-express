const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server', author: 'SUJAY GOWDA' });
});

app.post('/', (req, res) => {
  res.send('You can post to this URL');
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
