const mysql = require('mysql2/promise');
const {logger} = require('./winston');

const pool = mysql.createPool({
    host: '13.124.165.208', // 서버 로컬 IP
    user: 'skykchmin',
    // port: 3306,
    password: '1234',
    database: 'Kream',

});

// pool.query(`select * from 계좌정보`, (err, result, fields)=>{
//     if(err){
//         return console.log(err);
//     }
//     return console.log(result);
// })

// const pool = mysql.createPool({ // 기본적인 데이터베이스의 정보 
//     host: 'localhost',
//     user: 'skykchmin',
//     // port: ,
//     password: '1234',
//     database: 'Kream'
// });

console.log('test');

module.exports = {
    pool: pool
};

const exampleNonTransaction = async (sql, params) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query(sql, params);
            connection.release();
            return rows;
        } catch(err) {
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    } catch(err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};

const exampleTransaction = async (sql, params) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            await connection.beginTransaction(); // START TRANSACTION
            const [rows] = await connection.query(sql, params);
            await connection.commit(); // COMMIT
            connection.release();
            return rows;
        } catch(err) {
            await connection.rollback(); // ROLLBACK
            connection.release();
            logger.error(`example transaction Query error\n: ${JSON.stringify(err)}`);
            return false;
        }
    } catch(err) {
        logger.error(`example transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
};