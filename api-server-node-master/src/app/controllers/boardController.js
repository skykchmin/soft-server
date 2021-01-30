const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const boardDao = require('../dao/boardDao');

// exports.getBoard = async function (req, res) { // board를 가져오는 것
//     try {        
//         const buyShoeslistRows = await boardDao.selectBoard(); // userDao에서 userEmailCheck 파라미터로 email을 넘겨줬습니다.
//         if (!buyShoeslistRows) { // buyShoeslistRows가 null이 아니라면 
//             return res.json({
//                 isSuccess: true,
//                 code: 200,
//                 message: "게시물 조회 성공",
//                 data: buyShoeslistRows // data에 buyShoeslistRows를 넣어주게 됩니다
//             });
//         } 
//         return res.json({ // 게시물이 존재하지 않는다면 
//             isSuccess: false,
//             code: 300,
//             message: "게시물이 존재하지 않습니다"
//             });
//         } catch (err) { // 에러가 발생했다면 에러를 알려줍니다. 
//             // await connection.rollback(); // ROLLBACK
//             // connection.release();
//              logger.error(`App - getBoard Query error\n: ${err.message}`);
//              return res.status(500).send(`Error: ${err.message}`);
//         }
// };

// 구매양식 등록
// exports.buyShoes = async function (req, res) {
//     const {
//         accountnumber, modelID, memberNumber, buyShoesAcceptance, shoesSize, 
//         buyshoesWay, priceInspection, priceDelivery, deliveryAddress, buyprice, buyEnrollmentTime
//     } = req.body;

//     if (!modelID) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
//     if (!shoesSize) return res.json({isSuccess: false, code: 411, message: "신발사이즈를 선택해주세요."});
//     if (!buyprice) return res.json({isSuccess: false, code: 412, message: "구매가격을 선택해주세요."});
//     if (!accountnumber) return res.json({isSuccess: false, code: 413, message: "계좌번호를 입력해주세요."});
//     if (!deliveryAddress) return res.json({isSuccess: false, code: 415, message: "배송주소를 입력해주세요"});

//     try{
//         const insertbuyShoesInfoParams = [accountnumber, modelID, memberNumber, buyShoesAcceptance, shoesSize, 
//             buyshoesWay, priceInspection, priceDelivery, deliveryAddress, buyprice, buyEnrollmentTime];     
//         const insertbuyShoesRows = await boardDao.insertbuyShoesInfo(insertbuyShoesInfoParams); //  await connection.commit(); // COMMIT

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

// 구매양식 등록 후 구매거래내역 보내기
exports.buyShoes = async function (req, res) {
    const {
        accountNumber, modelID, memberNumber, buyShoesAcceptance, shoesSize, 
        buyShoesWay, priceInspection, priceDelivery, deliveryAddress, buyPrice, buyEnrollmentTime, // 구매양식에 필요
        buyNumber, deliveryNumber, buyStatus, TotalbuyPrice, buyDateTime, calculateDate  // 구매거래내역에 필요
    } = req.body;

    if (!accountNumber) return res.json({isSuccess: false, code: 410, message: "계좌번호를 입력해야합니다"});
    if (!modelID) return res.json({isSuccess: false, code: 411, message: "모델을 선택해주세요."});
    if (!buyShoesAcceptance) return res.json({isSuccess: false, code: 413, message: "약관에 동의 해주세요"});
    if (!buyShoesWay) return res.json({isSuccess: false, code: 415, message: "구매방법을 선택해주세요"});
    if (!deliveryAddress) return res.json({isSuccess: false, code: 415, message: "배송주소를 입력해주세요"});
    if (!buyPrice) return res.json({isSuccess: false, code: 415, message: "구매가격을 선택해주세요"});
    

    try{
        const insertbuyShoesInfoParams = [accountNumber, modelID, memberNumber, buyShoesAcceptance, shoesSize, 
            buyShoesWay, priceInspection, priceDelivery, deliveryAddress, buyPrice, buyEnrollmentTime];     
        const insertbuyShoesRows = await boardDao.insertbuyShoesInfo(insertbuyShoesInfoParams);  // 구매양식으로 보내기
        //  await connection.commit(); // COMMIT
        
        // 구매양식 등록
        // if(insertbuyShoesRows != null){
        //     return res.json({
        //         isSuccess: true,
        //         code: 200,
        //         message: "구매양식 등록 성공"
        //     });
        // } 

        const insertbuyShoesHistoryInfoParams = [
            buyNumber, deliveryNumber, accountNumber, buyStatus, TotalbuyPrice, 
            buyPrice, priceInspection, priceDelivery, buyDateTime, calculateDate,  
            deliveryAddress, buyShoesWay, memberNumber, shoesSize, modelID];     

        const insertbuyShoesHistoryRows = await boardDao.insertbuyShoesHistoryInfo(insertbuyShoesHistoryInfoParams); // 판매거래내역 보내기
        //  await connection.commit(); // COMMIT
        if(insertbuyShoesHistoryRows != null){
            return res.json({
                isSuccess: true,
                code: 200,
                message: "구매거래내역 보내기 성공"
            })
        }                
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
    }

};

// 판매거래내역으로 보내기
exports.sellShoesHistory = async function (req, res) {
    const {
        sellNumber, deliveryNumber, accountNumber, sellStatus, TotalsellPrice, 
        sellPrice, priceInspection, priceDelivery, sellDateTime, calculateDate,  
        deliveryAddress, sellShoesWay, memberNumber, shoesSize, modelID
    } = req.body;

    // 배송번호에 보내져야할 것: deliveryNumber, buyNumber, sellNumber, drawNumber, deliveryDate, departureDeliveryAddress, arriveDeliveryAddress, arriveAddressPhoneNumber, deliveryStatus

    if (!modelID) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
    if (!shoesSize) return res.json({isSuccess: false, code: 411, message: "신발사이즈를 선택해주세요."});
    if (!sellPrice) return res.json({isSuccess: false, code: 412, message: "판매가격을 선택해주세요."});
    if (!accountNumber) return res.json({isSuccess: false, code: 413, message: "계좌번호를 입력해주세요."});
    if (!deliveryAddress) return res.json({isSuccess: false, code: 415, message: "배송주소를 입력해주세요"});

    try{
        const insertsellShoesHistoryInfoParams = [
            sellNumber, deliveryNumber, accountNumber, sellStatus, TotalsellPrice, 
            sellPrice, priceInspection, priceDelivery, sellDateTime, calculateDate,  
            deliveryAddress, sellShoesWay, memberNumber, shoesSize, modelID];     
        const insertsellShoesHistoryRows = await boardDao.insertsellShoesHistoryInfo(insertsellShoesHistoryInfoParams); //  await connection.commit(); // COMMIT
          
        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "판매거래양식 등록 성공",
            data: insertsellShoesHistoryRows
        });

        

    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
    } 
    
};


// 판매양식 등록
// exports.sellShoes = async function (req, res) {
//     const {
//         accountNumber, modelID, memberNumber, sellShoesAcceptance, shoesSize, 
//         sellShoesWay, priceInspection, priceDelivery, deliveryAddress, sellPrice, sellEnrollmentTime
//     } = req.body;

//     if (!modelID) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
//     if (!shoesSize) return res.json({isSuccess: false, code: 411, message: "신발사이즈를 선택해주세요."});
//     if (!sellPrice) return res.json({isSuccess: false, code: 412, message: "판매가격을 선택해주세요."});
//     if (!accountNumber) return res.json({isSuccess: false, code: 413, message: "계좌번호를 입력해주세요."});
//     if (!deliveryAddress) return res.json({isSuccess: false, code: 415, message: "배송주소를 입력해주세요"});

//     try{
//         const insertsellShoesInfoParams = [accountNumber, modelID, memberNumber, sellShoesAcceptance, shoesSize, 
//             sellShoesWay, priceInspection, priceDelivery, deliveryAddress, sellPrice, sellEnrollmentTime];     
//         const insertsellShoesRows = await boardDao.insertsellShoesInfo(insertsellShoesInfoParams); //  await connection.commit(); // COMMIT

//         // connection.release();
//         return res.json({
//             isSuccess: true,
//             code: 200,
//             message: "판매양식 등록 성공"
//         });
//     } catch (err) {
//         // await connection.rollback(); // ROLLBACK
//         // connection.release();
//          logger.error(`App - SignUp Query error\n: ${err.message}`);
//          return res.status(500).send(`Error: ${err.message}`);
//      } 
    
// };

// 판매양식 등록 후 판매거래내역 보내기
exports.sellShoes = async function (req, res) {
    const {
        accountNumber, modelID, memberNumber, sellShoesAcceptance, shoesSize, 
        sellShoesWay, priceInspection, priceDelivery, deliveryAddress, sellPrice, sellEnrollmentTime, // 판매양식에 필요
        sellNumber, deliveryNumber, sellStatus, TotalsellPrice, sellDateTime, calculateDate  // 판매거래내역에 필요
    } = req.body;

    if (!modelID) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
    if (!shoesSize) return res.json({isSuccess: false, code: 411, message: "신발사이즈를 선택해주세요."});
    if (!sellPrice) return res.json({isSuccess: false, code: 412, message: "판매가격을 선택해주세요."});
    if (!accountNumber) return res.json({isSuccess: false, code: 413, message: "계좌번호를 입력해주세요."});
    if (!deliveryAddress) return res.json({isSuccess: false, code: 415, message: "배송주소를 입력해주세요"});

    try{
        const insertsellShoesInfoParams = [accountNumber, modelID, memberNumber, sellShoesAcceptance, shoesSize, 
            sellShoesWay, priceInspection, priceDelivery, deliveryAddress, sellPrice, sellEnrollmentTime];     
        const insertsellShoesRows = await boardDao.insertsellShoesInfo(insertsellShoesInfoParams);  // 판매양식으로 보내기
        //  await connection.commit(); // COMMIT
        
        // 판매양식 등록
        // if(insertsellShoesRows != null){
        //     return res.json({
        //         isSuccess: true,
        //         code: 200,
        //         message: "판매양식 등록 성공"
        //     });
        // } 

        const insertsellShoesHistoryInfoParams = [
            sellNumber, deliveryNumber, accountNumber, sellStatus, TotalsellPrice, 
            sellPrice, priceInspection, priceDelivery, sellDateTime, calculateDate,  
            deliveryAddress, sellShoesWay, memberNumber, shoesSize, modelID];     

        const insertsellShoesHistoryRows = await boardDao.insertsellShoesHistoryInfo(insertsellShoesHistoryInfoParams); // 판매거래내역 보내기
        //  await connection.commit(); // COMMIT
        if(insertsellShoesHistoryRows != null){
            return res.json({
                isSuccess: true,
                code: 200,
                message: "판매거래내역 보내기 성공"
            })
        }                
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
    }

};


// 판매거래내역으로 보내기
exports.sellShoesHistory = async function (req, res) {
    const {
        sellNumber, deliveryNumber, accountNumber, sellStatus, TotalsellPrice, 
        sellPrice, priceInspection, priceDelivery, sellDateTime, calculateDate,  
        deliveryAddress, sellShoesWay, memberNumber, shoesSize, modelID
    } = req.body;

    // 배송번호에 보내져야할 것: deliveryNumber, buyNumber, sellNumber, drawNumber, deliveryDate, departureDeliveryAddress, arriveDeliveryAddress, arriveAddressPhoneNumber, deliveryStatus

    if (!modelID) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
    if (!shoesSize) return res.json({isSuccess: false, code: 411, message: "신발사이즈를 선택해주세요."});
    if (!sellPrice) return res.json({isSuccess: false, code: 412, message: "판매가격을 선택해주세요."});
    if (!accountNumber) return res.json({isSuccess: false, code: 413, message: "계좌번호를 입력해주세요."});
    if (!deliveryAddress) return res.json({isSuccess: false, code: 415, message: "배송주소를 입력해주세요"});

    try{
        const insertsellShoesHistoryInfoParams = [
            sellNumber, deliveryNumber, accountNumber, sellStatus, TotalsellPrice, 
            sellPrice, priceInspection, priceDelivery, sellDateTime, calculateDate,  
            deliveryAddress, sellShoesWay, memberNumber, shoesSize, modelID];     
        const insertsellShoesHistoryRows = await boardDao.insertsellShoesHistoryInfo(insertsellShoesHistoryInfoParams); //  await connection.commit(); // COMMIT
          
        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "판매거래양식 등록 성공",
            data: insertsellShoesHistoryRows
        });

        

    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
    } 
    
};

exports.drawShoes = async function (req, res) {
    // 드로우양식(계좌번호, 모델ID, 회원번호, 구매가격, 응모기간,배송비, 배송주소, 총결제금액, 입찰일)
    const {
        accountnumber, modelID, memberNumber, buyPrice, drawPeriod, priceDelivery, deliveryAddress, Totalbuyprice, drawDate
    } = req.body;
    if (!accountnumber) return res.json({isSuccess: false, code: 410, message: "계좌번호를 입력해주세요"});
    if (!modelID) return res.json({isSuccess: false, code: 411, message: "신발을 선택해주세요"});
    if (!buyPrice) return res.json({isSuccess: false, code: 411, message: "구매가격을 입력해주세요"});
    if (!drawPeriod) return res.json({isSuccess: false, code: 411, message: "응모기간을 입력해주세요"});
    if (!priceDelivery) return res.json({isSuccess: false, code: 411, message: "신발배송을 입력해주세요"});
    if (!deliveryAddress) return res.json({isSuccess: false, code: 411, message: "배송주소를 입력해주세요"});
    try{
        const insertdrawShoesInfoParams = [accountnumber, modelID, memberNumber, buyPrice, drawPeriod, priceDelivery, deliveryAddress, Totalbuyprice, drawDate];     
        const insertdrawShoesRows = await boardDao.insertdrawShoesInfo(insertdrawShoesInfoParams); //  await connection.commit(); // COMMIT

        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "드로우 양식 등록 성공"
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
     } 
    
};

// 배송관리 등록
exports.deliveryShoes = async function (req, res) {
    const {
        deliveryNumber, buyNumber, sellNumber, drawNumber, deliveryDate, 
        departureDeliveryAddress, arriveDeliveryAddress, arriveAddressPhoneNumber, deliveryStatus
    } = req.body;

    // if(buyNumber.length + drawNumber.length + drawNumber.length > 1){
    //     return res.json({isSuccess: false, code: 410, message: "구매번호, 판매번호, 드로우번호 중 한 개의 번호만 입력해주세요"});
    // }

    try{
        const insertdeliveryShoesInfoParams = [deliveryNumber, buyNumber, sellNumber, drawNumber, deliveryDate, 
            departureDeliveryAddress, arriveDeliveryAddress, arriveAddressPhoneNumber, deliveryStatus];     
        const insertdeliveryShoesRows = await boardDao.insertdeliveryShoesInfo(insertdeliveryShoesInfoParams); //  await connection.commit(); // COMMIT
        
        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "배송관리 등록 성공"
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
     } 
    
};

// 신발 검수 
exports.testShoes = async function (req, res) {
    const {
        sellNumber, deliveryNumber, compilanceStandardStatus, pollutionStandardStatus, penaltyStatus, inspectorName, modelID
    } = req.body;

    if (!modelID) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
    if (!sellNumber) return res.json({isSuccess: false, code: 411, message: "판매번호를 입력해주세요"});
    if (!deliveryNumber) return res.json({isSuccess: false, code: 412, message: "배송번호를 입력해주세요"});
    if (!compilanceStandardStatus) return res.json({isSuccess: false, code: 413, message: "상태기준준수여부를 입력해주세요"});    
    if (!pollutionStandardStatus) return res.json({isSuccess: false, code: 415, message: "오염도기준준수여부를 입력해주세요"});
    if (!penaltyStatus) return res.json({isSuccess: false, code: 416, message: "페널티여부를 입력해주세요"});
    if (!inspectorName) return res.json({isSuccess: false, code: 417, message: "검수담당자를 입력해주세요"});
    
    try{
        const inserttestShoesInfoParams = [sellNumber, deliveryNumber, compilanceStandardStatus, pollutionStandardStatus, penaltyStatus, inspectorName, modelID];     
        const inserttestShoesRows = await boardDao.inserttestShoesInfo(inserttestShoesInfoParams); //  await connection.commit(); // COMMIT

        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "신발 검수 양식 등록 성공"
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
     } 
    
};

// 직접배송 입력
exports.directDeliveryShoes = async function (req, res) {
    // 직접배송(배송번호, 용역금액, 택배업체사업자번호, 택배업체명, 택배원이름, 택배원전화번호, 배송진행상황)
    const {
        deliveryNumber, deliveryServicePrice, deliveryCompanyNumber, deliveryCompanyName, deliveryPersonName, deliveryPersonPhoneNumber, deliveryStatus
    } = req.body;

    // if (!modelID) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
    // if (!shoesSize) return res.json({isSuccess: false, code: 411, message: "신발사이즈를 선택해주세요."});
    // if (!sellPrice) return res.json({isSuccess: false, code: 412, message: "판매가격을 선택해주세요."});
    // if (!accountNumber) return res.json({isSuccess: false, code: 413, message: "계좌번호를 입력해주세요."});
    // if (!deliveryAddress) return res.json({isSuccess: false, code: 415, message: "배송주소를 입력해주세요"});

    try{ 
        const insertdirectDeliveryShoesInfoParams = [deliveryNumber, deliveryServicePrice, deliveryCompanyNumber, deliveryCompanyName, deliveryPersonName, deliveryPersonPhoneNumber, deliveryStatus];     
        const insertdirectDeliveryShoesRows = await boardDao.insertdirectDeliveryShoesInfo(insertdirectDeliveryShoesInfoParams); //  await connection.commit(); // COMMIT
        
        // 판매양식 등록
        if(insertdirectDeliveryShoesRows != null){
            return res.json({
                isSuccess: true,
                code: 200,
                message: "직접배송등록 성공"
            });
        } 
            
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
    }

    
};

// 택배업체 
exports.deliveryCompany = async function (req, res) {
    // 택배업체(택배업체사업자번호, 택배업체명, 택배업체전화번호, 택배업체주소)
    const {
        deliveryCompanyNumber, deliveryCompanyName, deliveryCompanyPhoneNumber, deliveryCompanyAddress
    } = req.body;

    // if (!modelID) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
    // if (!shoesSize) return res.json({isSuccess: false, code: 411, message: "신발사이즈를 선택해주세요."});
    // if (!sellPrice) return res.json({isSuccess: false, code: 412, message: "판매가격을 선택해주세요."});
    // if (!accountNumber) return res.json({isSuccess: false, code: 413, message: "계좌번호를 입력해주세요."});
    // if (!deliveryAddress) return res.json({isSuccess: false, code: 415, message: "배송주소를 입력해주세요"});

    try{ 
        const insertdeliveryCompanyInfoParams = [deliveryCompanyNumber, deliveryCompanyName, deliveryCompanyPhoneNumber, deliveryCompanyAddress];     
        const insertdeliveryCompanyRows = await boardDao.insertdeliveryCompanyInfo(insertdeliveryCompanyInfoParams); //  await connection.commit(); // COMMIT
        
        // 판매양식 등록
        if(insertdeliveryCompanyRows != null){
            return res.json({
                isSuccess: true,
                code: 200,
                message: "택배업체등록 성공"
            });
        } 
            
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
    }

    
};

// 정산관리
exports.calculateShoes = async function (req, res) {
    // 택배업체(택배업체사업자번호, 택배업체명, 택배업체전화번호, 택배업체주소)
    const {
        calculateNumber, calculateDate, calculateMoney, calculateStatus, accountNumber, bankName, accountName, deliveryCompanyNumber
    } = req.body;

    // if (!modelID) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
    // if (!shoesSize) return res.json({isSuccess: false, code: 411, message: "신발사이즈를 선택해주세요."});
    // if (!sellPrice) return res.json({isSuccess: false, code: 412, message: "판매가격을 선택해주세요."});
    // if (!accountNumber) return res.json({isSuccess: false, code: 413, message: "계좌번호를 입력해주세요."});
    // if (!deliveryAddress) return res.json({isSuccess: false, code: 415, message: "배송주소를 입력해주세요"});

    try{ 
        const insertcalculateShoesInfoParams = [calculateNumber, calculateDate, calculateMoney, calculateStatus, accountNumber, bankName, accountName, deliveryCompanyNumber];     
        const insertcalculateShoesInfoRows = await boardDao.insertcalculateShoesInfo(insertcalculateShoesInfoParams); //  await connection.commit(); // COMMIT
        
        console.log(insertcalculateShoesInfoRows);
        // 판매양식 등록
        if(insertcalculateShoesInfoRows != null){
            return res.json({
                isSuccess: true,
                code: 200,
                message: "정산관리 성공"
            });
        } 
            
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
    }

    
};





// 신발 구매 삭제
exports.deletebuyShoes = async function (req, res) {
    const {
        buyNumber
    } = req.body;

    if (!buyNumber) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
    try{
        const deletebuyShoesParams = [buyNumber];     
        const deletebuyShoesInfoRows = await boardDao.deletebuyShoesInfo(deletebuyShoesParams); //  await connection.commit(); // COMMIT

        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "신발 구매 양식 삭제 성공"
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
     } 
    
};

// 신발 판매 삭제
exports.deletesellShoes = async function (req, res) {
    const {
        sellNumber
    } = req.body;

    if (!sellNumber) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
    try{
        const deletesellShoesParams = [sellNumber];     
        const deletesellShoesInfoRows = await boardDao.deletesellShoesInfo(deletesellShoesParams); //  await connection.commit(); // COMMIT

        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "신발 판매 양식 삭제 성공"
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
     } 
    
};

// 신발 드로우 삭제
exports.deletedrawShoes = async function (req, res) {
    const {
        drawNumber
    } = req.body;

    if (!drawNumber) return res.json({isSuccess: false, code: 410, message: "신발을 선택해주세요."});
    try{
        const deletedrawShoesParams = [drawNumber];     
        const deletedrawShoesInfoRows = await boardDao.deletedrawShoesInfo(deletedrawShoesParams); //  await connection.commit(); // COMMIT

        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "신발 드로우 양식 삭제 성공"
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
     } 
    
};

// 신발 구매양식 수정
exports.patchbuyShoes = async function (req, res) {
    const {
        accountNumber,shoesSize, buyshoesWay, deliveryAddress, buyPrice, buyEnrollmentTime, buyNumber
    } = req.body;

    if (!accountNumber) return res.json({isSuccess: false, code: 410, message: "계좌번호를 입력해주세요."});
    if (!shoesSize) return res.json({isSuccess: false, code: 411, message: "신발사이즈를 선택해주세요."});
    if (!buyshoesWay) return res.json({isSuccess: false, code: 412, message: "구매방법을 선택해주세요."});
    if (!deliveryAddress) return res.json({isSuccess: false, code: 413, message: "배송주소를 입력해주세요."});
    if (!buyPrice) return res.json({isSuccess: false, code: 414, message: "구매번호를 입력해주세요"});
    if (!buyNumber) return res.json({isSuccess: false, code: 415, message: "구매가격을 입력해주세요"});

    try{
        const patchbuyShoesInfoParams = [ accountNumber,shoesSize, buyshoesWay, deliveryAddress, buyPrice, buyEnrollmentTime, buyNumber];     
        const patchbuyShoesRows = await boardDao.patchbuyShoesInfo(patchbuyShoesInfoParams); //  await connection.commit(); // COMMIT

        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "구매양식 수정 성공"
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
     } 
    
};

// 신발 판매양식 수정
exports.patchsellShoes = async function (req, res) {
    const {
        accountNumber,shoesSize, sellshoesWay, deliveryAddress, sellPrice, sellEnrollmentTime, sellNumber
    } = req.body;

    if (!accountNumber) return res.json({isSuccess: false, code: 410, message: "계좌번호를 입력해주세요."});
    if (!sellNumber) return res.json({isSuccess: false, code: 411, message: "신발사이즈를 선택해주세요."});
    if (!sellshoesWay) return res.json({isSuccess: false, code: 412, message: "구매방법을 선택해주세요."});
    if (!deliveryAddress) return res.json({isSuccess: false, code: 413, message: "배송주소를 입력해주세요."});
    if (!sellNumber) return res.json({isSuccess: false, code: 415, message: "구매번호를 입력해주세요"});

    try{
        const patchsellShoesInfoParams = [ accountNumber,shoesSize, sellshoesWay, deliveryAddress, sellPrice, sellEnrollmentTime, sellNumber];     
        const patchsellShoesRows = await boardDao.patchsellShoesInfo(patchsellShoesInfoParams); //  await connection.commit(); // COMMIT

        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "판매양식 수정 성공"
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
     } 
    
};

// 신발 드로우양식 수정
exports.patchdrawShoes = async function (req, res) {
    const {
        accountNumber, deliveryAddress, drawPrice, drawEnrollmentTime, drawNumber
    } = req.body;

    if (!accountNumber) return res.json({isSuccess: false, code: 410, message: "계좌번호를 입력해주세요."});
    if (!drawNumber) return res.json({isSuccess: false, code: 411, message: "신발사이즈를 선택해주세요."});
    if (!deliveryAddress) return res.json({isSuccess: false, code: 413, message: "배송주소를 입력해주세요."});
    if (!drawNumber) return res.json({isSuccess: false, code: 415, message: "구매번호를 입력해주세요"});

    try{
        const patchdrawShoesInfoParams = [ accountNumber, deliveryAddress, drawPrice, drawEnrollmentTime, drawNumber];     
        const patchdrawShoesRows = await boardDao.patchdrawShoesInfo(patchdrawShoesInfoParams); //  await connection.commit(); // COMMIT

        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "드로우양식 수정 성공"
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
     } 
    
};

// 구매양식 조회
exports.getbuyShoes = async function (req, res) {
    const {
        shoesSize, modelID, storedModelID
    } = req.body;

    if (!shoesSize) return res.json({isSuccess: false, code: 410, message: "신발사이즈를 입력해주세요"});
    if (!modelID) return res.json({isSuccess: false, code: 411, message: "모델ID를 입력해주세요"});
    if (!storedModelID) return res.json({isSuccess: false, code: 412, message: "재고현황ID을 입력해주세요"});

    try {    
        const selectbuyShoeslistInfoParams = [shoesSize, modelID, storedModelID];
        const selectbuyShoeslistInfoRows = await boardDao.selectMainInfo(selectbuyShoeslistInfoParams); // userDao에서 userEmailCheck 파라미터로 email을 넘겨줬습니다.  
            if (selectbuyShoeslistInfoRows.length > 0) { // buyShoeslistRows가 null이 아니라면 
                return res.json({
                            isSuccess: true,
                            code: 200,
                            message: "조회한 구매양식입니다",
                            data: selectbuyShoeslistInfoRows // data에 buyShoeslistRows를 넣어주게 됩니다
                        });
            } else {
                return res.json({ // 게시물이 존재하지 않는다면 
                    isSuccess: false,
                    code: 300,
                    message: "조건에 만족하는 구매양식이 존재하지 않습니다"
                    });
            } 
        } catch (err) { // 에러가 발생했다면 에러를 알려줍니다. 
            // await connection.rollback(); // ROLLBACK
            // connection.release();
            logger.error(`App - getBoard Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }      
    
};

//판매양식 조회
exports.getsellShoes = async function (req, res) {
    const {
        shoesSize, modelID, storedModelID
    } = req.body;

    if (!shoesSize) return res.json({isSuccess: false, code: 410, message: "신발사이즈를 입력해주세요"});
    if (!modelID) return res.json({isSuccess: false, code: 411, message: "모델ID를 입력해주세요"});
    if (!storedModelID) return res.json({isSuccess: false, code: 412, message: "재고현황ID을 입력해주세요"});
    
    try {    
        const selectsellShoeslistInfoParams = [shoesSize, modelID, storedModelID];
        const selectsellShoeslistInfoRows = await boardDao.selectMainInfo(selectsellShoeslistInfoParams); // userDao에서 userEmailCheck 파라미터로 email을 넘겨줬습니다.  
            if (selectsellShoeslistInfoRows.length > 0) { // sellShoeslistRows가 null이 아니라면 
                return res.json({
                            isSuccess: true,
                            code: 200,
                            message: "조회한 구매양식입니다",
                            data: selectsellShoeslistInfoRows // data에 buyShoeslistRows를 넣어주게 됩니다
                        });
            } else {
                return res.json({ // 게시물이 존재하지 않는다면 
                    isSuccess: false,
                    code: 300,
                    message: "조건에 만족하는 구매양식이 존재하지 않습니다"
                    });
            } 
        } catch (err) { // 에러가 발생했다면 에러를 알려줍니다. 
            // await connection.rollback(); // ROLLBACK
            // connection.release();
            logger.error(`App - getBoard Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }      
    
};

// 드로우양식 조회
exports.getdrawShoes = async function (req, res) {
    const {
        shoesSize, modelID, storedModelID
    } = req.body;

    if (!shoesSize) return res.json({isSuccess: false, code: 410, message: "신발사이즈를 입력해주세요"});
    if (!modelID) return res.json({isSuccess: false, code: 411, message: "모델ID를 입력해주세요"});
    if (!storedModelID) return res.json({isSuccess: false, code: 412, message: "재고현황ID을 입력해주세요"});
    
    try {    
        const selectdrawShoeslistInfoParams = [shoesSize, modelID, storedModelID];
        const selectdrawShoeslistInfoRows = await boardDao.selectMainInfo(selectdrawShoeslistInfoParams); // userDao에서 userEmailCheck 파라미터로 email을 넘겨줬습니다.  
            if (selectdrawShoeslistInfoRows.length > 0) { // drawShoeslistRows가 null이 아니라면 
                return res.json({
                            isSuccess: true,
                            code: 200,
                            message: "조회한 구매양식입니다",
                            data: selectdrawShoeslistInfoRows // data에 buyShoeslistRows를 넣어주게 됩니다
                        });
            } else {
                return res.json({ // 게시물이 존재하지 않는다면 
                    isSuccess: false,
                    code: 300,
                    message: "조건에 만족하는 구매양식이 존재하지 않습니다"
                    });
            } 
        } catch (err) { // 에러가 발생했다면 에러를 알려줍니다. 
            // await connection.rollback(); // ROLLBACK
            // connection.release();
            logger.error(`App - getBoard Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }      
    
};

// 메인
exports.getMain = async function (req, res) {
    try {    
        // const selectMainParams = [modelID];
        const MainInfoRows = await boardDao.selectMainInfo(); // userDao에서 userEmailCheck 파라미터로 email을 넘겨줬습니다.
        
            if (MainInfoRows.length > 0) { // buyShoeslistRows가 null이 아니라면 
                // const test = res.json({
                //     isSuccess: true,
                //     code: 200,
                //     message: "메인화면!!",
                //     data: MainInfoRows // data에 buyShoeslistRows를 넣어주게 됩니다
                // });
                
                // console.log(test.data[0])
                return res.json({
                            isSuccess: true,
                            code: 200,
                            message: "메인화면!!",
                            data: MainInfoRows // data에 buyShoeslistRows를 넣어주게 됩니다
                        });
                
            } else {
                return res.json({ // 게시물이 존재하지 않는다면 
                    isSuccess: false,
                    code: 400,
                    message: "메인이 존재하지 않습니다"
                    });
            } 
        } catch (err) { // 에러가 발생했다면 에러를 알려줍니다. 
            // await connection.rollback(); // ROLLBACK
            // connection.release();
            logger.error(`App - getBoard Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }        
        

};
