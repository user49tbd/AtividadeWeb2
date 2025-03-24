const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

module.exports = {
  async findAll() {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute('SELECT * FROM usuarios');
      return result.rows;
    } catch (err) {
      throw err;
    } finally {
      if (connection) await connection.close();
    }
  },

  async findById(id) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute('SELECT * FROM usuarios WHERE id = :id', [id]);
      return result.rows[0] || null;
    } catch (err) {
      throw err;
    } finally {
      if (connection) await connection.close();
    }
  },

  async create({ nome, idade, email }) {
    let connection;
    try {
      connection = await getConnection();
      await connection.execute('BEGIN');
      
      const sql = `
        INSERT INTO usuarios (nome, idade, email) 
        VALUES (:nome, :idade, :email) 
        RETURNING id INTO :id
      `;
      
      const result = await connection.execute(
        sql,
        { 
          nome, idade, email, 
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        },
        { autoCommit: false }
      );

      await connection.execute('COMMIT');
      return { id: result.outBinds.id[0], nome, idade, email };
    } catch (err) {
      if (connection) await connection.execute('ROLLBACK');
      throw err;
    } finally {
      if (connection) await connection.close();
    }
  },

  async update(id, { nome, idade, email }) {
    let connection;
    try {
      connection = await getConnection();
      await connection.execute('BEGIN');

      const sql = `
        UPDATE usuarios 
        SET nome = :nome, idade = :idade, email = :email 
        WHERE id = :id
      `;

      await connection.execute(sql, { nome, idade, email, id }, { autoCommit: false });
      await connection.execute('COMMIT');

      return { id, nome, idade, email };
    } catch (err) {
      if (connection) await connection.execute('ROLLBACK');
      throw err;
    } finally {
      if (connection) await connection.close();
    }
  },

  async delete(id) {
    let connection;
    try {
      connection = await getConnection();
      await connection.execute('BEGIN');

      await connection.execute('DELETE FROM usuarios WHERE id = :id', [id], { autoCommit: false });
      await connection.execute('COMMIT');
    } catch (err) {
      if (connection) await connection.execute('ROLLBACK');
      throw err;
    } finally {
      if (connection) await connection.close();
    }
  }
};
