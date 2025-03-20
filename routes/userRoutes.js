const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.list);
router.get('/new', userController.showCreateForm);
router.get('/:id/edit', userController.showEditForm);

router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;




const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bancoDeDados.db', (err) => {
  if (err) {
    console.error('Erro ao conectar', err.message);
    return;
  }
  console.log('Conexão bem sucedida');
});
module.exports = db;

