const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const adminDao = require('../dao/adminDao');

exports.deliveryShoes = async function (req, res) {
    const {
        
    } = req.body;

    if (!modelID) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
    

    try{
        const insertbuyShoesInfoParams = [];     
        const insertbuyShoesRows = await adminDao.insertbuyShoesInfo(insertbuyShoesInfoParams); //  await connection.commit(); // COMMIT

        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "구매양식 등록 성공"
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
     } 
    
};