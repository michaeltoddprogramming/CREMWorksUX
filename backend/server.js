const express = require('express');
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});


app.use((req, res) => {
  res.status(404).send('Not Found');
});



// LOGIN BACKEND




// REGISTER BACKEND

app.listen(PORT, () => {
  console.log(`BACKEND RUNNING http://localhost:${PORT}`);
});