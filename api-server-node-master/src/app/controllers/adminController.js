const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const adminDao = require('../dao/adminDao');

// exports.deliveryShoes = async function (req, res) {
//     const {
        
//     } = req.body;

//     if (!modelID) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
    

//     try{
//         const insertbuyShoesInfoParams = [];     
//         const insertbuyShoesRows = await adminDao.insertbuyShoesInfo(insertbuyShoesInfoParams); //  await connection.commit(); // COMMIT

//         // connection.release();
//         return res.json({
//             isSuccess: true,
//             code: 200,
//             message: "구매양식 등록 성공"
//         });
//     } catch (err) {
//         // await connection.rollback(); // ROLLBACK
//         // connection.release();
//          logger.error(`App - SignUp Query error\n: ${err.message}`);
//          return res.status(500).send(`Error: ${err.message}`);
//      } 
    
// };

exports.deliveryShoes = async function (req, res) {
    const {
        deliveryNumber, 
    } = req.body;

    if (!modelID) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
    if (!shoesSize) return res.json({isSuccess: false, code: 411, message: "신발사이즈를 선택해주세요."});
    if (!sellPrice) return res.json({isSuccess: false, code: 412, message: "판매가격을 선택해주세요."});
    if (!accountNumber) return res.json({isSuccess: false, code: 413, message: "계좌번호를 입력해주세요."});
    if (!deliveryAddress) return res.json({isSuccess: false, code: 415, message: "배송주소를 입력해주세요"});

    try{
        const insertsellShoesInfoParams = [accountNumber, modelID, memberNumber, sellShoesAcceptance, shoesSize, 
            sellShoesWay, priceInspection, priceDelivery, deliveryAddress, sellPrice, sellEnrollmentTime];     
        const insertsellShoesRows = await boardDao.insertsellShoesInfo(insertsellShoesInfoParams); //  await connection.commit(); // COMMIT
        
        // 판매양식 등록
        if(insertsellShoesRows != null){
            return res.json({
                isSuccess: true,
                code: 200,
                message: "판매양식 등록 성공"
            });
        } 

    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
    }

    
};