const db = require('../config/db');

module.exports = {
  findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM usuarios', (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM usuarios WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  create({ nome, idade, email }) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO usuarios (nome, idade, email) VALUES (?, ?, ?)';
      db.run(sql, [nome, idade, email], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, nome, idade, email });
      });
    });
  },

  update(id, { nome, idade, email }) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE usuarios SET nome = ?, idade = ?, email = ? WHERE id = ?';
      db.run(sql, [nome, idade, email, id], function (err) {
        if (err) return reject(err);
        resolve({ id, nome, idade, email });
      });
    });
  },

  delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM usuarios WHERE id = ?', [id], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  },
};



