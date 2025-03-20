const express = require('express');
const app = express();
const methodOverride = require('method-override');
const homeRoutes = require('./routes/homeRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();


const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use('/home', homeRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.redirect('/home');
});

app.listen(PORT, () => {
  console.log(`Servidor http://${HOST}:${PORT} com Express`);
});
