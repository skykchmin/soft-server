const { pool } = require("../../../config/database");

// index
async function defaultDao() {
  const connection = await pool.getConnection(async (conn) => conn);
  // const selectEmailQuery = `
  //                   SELECT id, email, nickname, createdAt, updatedAt 
  //                   FROM UserInfo `;

  const selectEmailQuery = `
  SELECT * 
  FROM 계좌정보 `;

  const [rows] = await connection.query(selectEmailQuery)
  connection.release();

  return rows;
}

module.exports = {
  defaultDao,
};
