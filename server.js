const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
app.set('view engine', 'ejs');
app.set('views', './views');

const homeRoutes = require('./routes/homeRoutes');
app.use('/home', homeRoutes);

app.get('/', (req, res) => {
  res.status(200).render('index', 
    { 
        title: 'Página Inicial', 
        message: 'Bem-vindo ao Express com EJS!' 
    });
});

app.get('/sobre', (req, res) => {
    res.status(200).render('index', 
        { 
            title: 'sobre com Express',
            message: 'Página sobre!' 
        });
});

const rotaAdmin = express.Router();

rotaAdmin.get('/', (req, res) => {
  res.status(200).send('Dashboard Admin');
});

rotaAdmin.get('/usuarios', (req, res) => {
  res.status(200).send('Gerenciamento de Usuários');
});

app.use('/admin', rotaAdmin);

app.listen(PORT, () => {
  console.log(`Servidor http://${HOST}:${PORT} com Express`);
});
