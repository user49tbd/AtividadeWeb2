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
      db.serialize(() => {
        db.run('BEGIN TRANSACTION', (err) => {
          if (err) return reject(err);

          const sql = 'INSERT INTO usuarios (nome, idade, email) VALUES (?, ?, ?)';
          db.run(sql, [nome, idade, email], function (err) {
            if (err) {
              return db.run('ROLLBACK', (rollbackErr) => {
                if (rollbackErr) return reject(rollbackErr);
                return reject(err);
              });
            }

            const insertedId = this.lastID;

            db.run('COMMIT', (commitErr) => {
              if (commitErr) {
                return db.run('ROLLBACK', (rollbackErr) => {
                  if (rollbackErr) return reject(rollbackErr);
                  return reject(commitErr);
                });
              }
              resolve({ id: insertedId, nome, idade, email });
            });
          });
        });
      });
    });
  },

  update(id, { nome, idade, email }) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION', (err) => {
          if (err) return reject(err);

          const sql = 'UPDATE usuarios SET nome = ?, idade = ?, email = ? WHERE id = ?';
          db.run(sql, [nome, idade, email, id], function (err) {
            if (err) {
              return db.run('ROLLBACK', (rollbackErr) => {
                if (rollbackErr) return reject(rollbackErr);
                return reject(err);
              });
            }

            db.run('COMMIT', (commitErr) => {
              if (commitErr) {
                return db.run('ROLLBACK', (rollbackErr) => {
                  if (rollbackErr) return reject(rollbackErr);
                  return reject(commitErr);
                });
              }
              resolve({ id, nome, idade, email });
            });
          });
        });
      });
    });
  },

  delete(id) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION', (err) => {
          if (err) return reject(err);

          db.run('DELETE FROM usuarios WHERE id = ?', [id], function (err) {
            if (err) {
              return db.run('ROLLBACK', (rollbackErr) => {
                if (rollbackErr) return reject(rollbackErr);
                return reject(err);
              });
            }

            db.run('COMMIT', (commitErr) => {
              if (commitErr) {
                return db.run('ROLLBACK', (rollbackErr) => {
                  if (rollbackErr) return reject(rollbackErr);
                  return reject(commitErr);
                });
              }
              resolve();
            });
          });
        });
      });
    });
  },
};
