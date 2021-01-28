const express = require('./config/express');
const {logger} = require('./config/winston');

// const app = express();
// app.set('port',process.env.PORT || 3000);

// app.get('/',(rea, res) => {
//     res.send('Hello express');
// })
const port = 3300;

express().listen(port);
// console.log(`port: ${port} 으로 실행중 `);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);