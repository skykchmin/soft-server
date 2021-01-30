const { pool } = require("../../../config/database");

// // 메인
// async function selectBuyShoeslist(selectBuyShoeslistParams) {
//   const connection = await pool.getConnection(async (conn) => conn); // 데이터베이스 pool을 getconnection해줍니다.
//   const selectBuyShoeslistQuery = ` 
  
//   `;               // 쿼리를 명시해줍니다
  
//   const [buyShoeslistRows] = await connection.query( // emailRows라는 최종적인 결과값에 await connection query를 해줘서 쿼리안에 쿼리문이 들어가게 되고 ? 안에는 email 값이 들어가게 되어서 selectEmailParams로 명시가 되었고 
//     selectBuyShoeslistQuery, // 쿼리안에 쿼리문이 들어가게 되고
//     selectBuyShoeslistParams
//   );
//   connection.release(); // connection release처리를 해주고

//   return buyShoeslistRows; // 결과값 return
// }

// buyshoes
async function insertbuyShoesInfo(insertbuyShoesInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
    const insertbuyShoesInfoQuery = `
    INSERT INTO 구매양식(계좌번호, 모델ID, 회원번호, 약관동의여부, 스니커즈사이즈, 구매방법, 검수비, 배송비, 배송주소, 구매가격, 등록시간)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, default);
    `;  
  const insertbuyShoesInfoRow = await connection.query(
    insertbuyShoesInfoQuery,
    insertbuyShoesInfoParams
  );
  connection.release();
  return insertbuyShoesInfoRow;
}

// 구매거래내역으로 보내기(insert)
async function insertbuyShoesHistoryInfo(insertbuyShoesHistoryInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
    const insertbuyShoesHistoryInfoQuery = `
    insert into 구매거래내역(구매번호, 배송번호, 계좌번호, 구매진행상황, 총정산금액, 구매가격, 검수비, 배송비, 거래일시, 정산일, 배송주소, 구매방법, 회원번호, 스니커즈사이즈, 모델ID)
    values ( ?, ?, ?, ?, ?, ?, ?, ?, default, ?, ?, ?, ?, ?, ?);
    `;  
  const insertbuyShoesHistoryInfoRow = await connection.query(
    insertbuyShoesHistoryInfoQuery,
    insertbuyShoesHistoryInfoParams
  );
  connection.release();
  return insertbuyShoesHistoryInfoRow;
}

// sellshoes
async function insertsellShoesInfo(insertsellShoesInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
    const insertsellShoesInfoQuery = `
    INSERT INTO 판매양식(계좌번호, 모델ID, 회원번호, 약관동의여부, 스니커즈사이즈, 판매방법, 검수비, 배송비, 배송주소, 판매가격, 등록시간)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, default);
    `;  
  const insertsellShoesInfoRow = await connection.query(
    insertsellShoesInfoQuery,
    insertsellShoesInfoParams
  );
  connection.release();
  return insertsellShoesInfoRow;
}

// 판매거래내역으로 보내기(insert)
async function insertsellShoesHistoryInfo(insertsellShoesHistoryInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
    const insertsellShoesHistoryInfoQuery = `
    insert into 판매거래내역(판매번호, 배송번호, 계좌번호, 판매진행상황, 총정산금액, 판매가격, 검수비, 배송비, 거래일시, 정산일, 배송주소, 판매방법, 회원번호, 스니커즈사이즈, 모델ID)
    values ( ?, ?, ?, ?, ?, ?, ?, ?, default, ?, ?, ?, ?, ?, ?);
    `;  
  const insertsellShoesHistoryInfoRow = await connection.query(
    insertsellShoesHistoryInfoQuery,
    insertsellShoesHistoryInfoParams
  );
  connection.release();
  return insertsellShoesHistoryInfoRow;
}


// drawshoes
async function insertdrawShoesInfo(insertdrawShoesInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
    const insertdrawShoesInfoQuery = `
    INSERT INTO 드로우양식(계좌번호, 모델ID, 회원번호, 구매가격, 응모기간, 배송비, 배송주소, 결제금액, 입찰일)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, default);
    `;  
  const insertdrawShoesInfoRow = await connection.query(
    insertdrawShoesInfoQuery,
    insertdrawShoesInfoParams
  );
  connection.release();
  return insertdrawShoesInfoRow;
}

// 구매양식 삭제
async function deletebuyShoesInfo(deletebuyShoesParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deletebuyShoesInfoQuery = `
        delete from 구매양식
        where 구매번호 = ? 
    `;
  const deletebuyShoesInfoRows = await connection.query(
    deletebuyShoesInfoQuery,
    deletebuyShoesParams
  );
  connection.release();
  return deletebuyShoesInfoRows ;
}

// 판매양식 삭제
async function deletesellShoesInfo(deletesellShoesParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deletesellShoesInfoQuery = `
        delete from 판매양식
        where 판매번호 = ? 
    `;
  const deletesellShoesInfoRows = await connection.query(
    deletesellShoesInfoQuery,
    deletesellShoesParams
  );
  connection.release();
  return deletesellShoesInfoRows ;
}

// 드로우양식 삭제
async function deletedrawShoesInfo(deletedrawShoesParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deletedrawShoesInfoQuery = `
        delete from 드로우양식
        where 드로우번호 = ? 
    `;
  const deletedrawShoesInfoRows = await connection.query(
    deletedrawShoesInfoQuery,
    deletedrawShoesParams
  );
  connection.release();
  return deletedrawShoesInfoRows ;
}

// 구매양식 수정
async function patchbuyShoesInfo(patchbuyShoesInfoParams) {
  //accountNumber,shoesSize, buyshoesWay, deliveryAddress, buyPrice, buyEnrollmentTime, buyNumber
  const connection = await pool.getConnection(async (conn) => conn);
    const patchbuyShoesInfoQuery = `
      update 구매양식
      set 계좌번호 = ?, 스니커즈사이즈 = ?, 구매방법 = ?, 배송주소 = ?, 구매가격 = ?, 등록시간 = ?
      where 구매번호 = ? 
    `;  
  const patchbuyShoesInfoRow = await connection.query(
    patchbuyShoesInfoQuery,
    patchbuyShoesInfoParams
  );
  connection.release();
  return patchbuyShoesInfoRow;
}

// 판매양식 수정
async function patchsellShoesInfo(patchsellShoesInfoParams) {
  //accountNumber,shoesSize, sellshoesWay, deliveryAddress, sellPrice, sellEnrollmentTime, sellNumber

  const connection = await pool.getConnection(async (conn) => conn);
    const patchsellShoesInfoQuery = `
      update 판매양식
      set 계좌번호 = ?, 스니커즈사이즈 = ?, 판매방법 = ?, 배송주소 = ?, 판매가격 = ?, 등록시간 = ?
      where 판매번호 = ? 
    `;  
  const patchsellShoesInfoRow = await connection.query(
    patchsellShoesInfoQuery,
    patchsellShoesInfoParams
  );
  connection.release();
  return patchsellShoesInfoRow;
}

// 드로우양식 수정
async function patchdrawShoesInfo(patchdrawShoesInfoParams) {
  //accountNumber,shoesSize, drawshoesWay, deliveryAddress, drawPrice, drawEnrollmentTime, drawNumber

  const connection = await pool.getConnection(async (conn) => conn);
    const patchdrawShoesInfoQuery = `
      update 드로우양식
      set 계좌번호 = ?, 배송주소 = ?, 구매가격 = ?, 등록시간 = ?
      where 드로우번호 = ? 
    `;  
  const patchdrawShoesInfoRow = await connection.query(
    patchdrawShoesInfoQuery,
    patchdrawShoesInfoParams
  );
  connection.release();
  return patchdrawShoesInfoRow;
}



// testshoes
async function inserttestShoesInfo(inserttestShoesInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
    const inserttestShoesInfoQuery = `
    INSERT INTO 신발검수(판매번호, 배송번호, 상태기준준수여부, 오염도기준준수여부, 패널티여부, 검수담당자이름, 모델ID)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `;  
  const inserttestShoesInfoRow = await connection.query(
    inserttestShoesInfoQuery,
    inserttestShoesInfoParams
  );
  connection.release();
  return inserttestShoesInfoRow;
}

// 메인
async function selectMainInfo() {
  const connection = await pool.getConnection(async (conn) => conn); // 데이터베이스 pool을 getconnection해줍니다.
  const selectMainInfoQuery = ` 
    SELECT *
    FROM 신발정보;
  `;               // 쿼리를 명시해줍니다
  
  const [MainInfoRows] = await connection.query( // emailRows라는 최종적인 결과값에 await connection query를 해줘서 쿼리안에 쿼리문이 들어가게 되고 ? 안에는 email 값이 들어가게 되어서 selectEmailParams로 명시가 되었고 
    selectMainInfoQuery, // 쿼리안에 쿼리문이 들어가게 되고
  );
  connection.release(); // connection release처리를 해주고

  return MainInfoRows; // 결과값 return
}

// 구매양식 조회
async function selectbuyShoeslistInfo(selectbuyShoeslistInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn); // 데이터베이스 pool을 getconnection해줍니다.
  const selectbuyShoeslistInfoQuery = ` 
  select 신발정보.모델ID, 신발정보.신발이미지, 신발정보.모델명, 
  구매경매최고가격.최고구매가격,
  구매양식.배송비, 구매양식.검수비, 구매양식.등록시간,
  계좌정보.계좌번호, 계좌정보.은행명,
  구매양식.배송주소,
  구매양식.구매가격 as 총정산금액 
  from 구매양식
  inner join 신발정보 on 구매양식.모델ID = 신발정보.모델ID
  inner join 회원정보 on 회원정보.회원번호 = 구매양식.회원번호
  inner join 계좌정보 on 구매양식.회원번호 = 계좌정보.회원번호
  inner join 
  (select max(distinct 재고현황.구매가격) as 최고구매가격
      from 신발정보 inner join 재고현황
      where 재고현황.스니커즈사이즈 = ? and 재고현황.모델ID = ?
      group by 재고현황.스니커즈사이즈) 구매경매최고가격
  where 신발정보.모델ID = ? ;
  `;               // 쿼리를 명시해줍니다
  
  const [buyShoeslistInfoRows] = await connection.query( // emailRows라는 최종적인 결과값에 await connection query를 해줘서 쿼리안에 쿼리문이 들어가게 되고 ? 안에는 email 값이 들어가게 되어서 selectEmailParams로 명시가 되었고 
    selectbuyShoeslistInfoQuery, // 쿼리안에 쿼리문이 들어가게 되고
    selectbuyShoeslistInfoParams
  );
  connection.release(); // connection release처리를 해주고

  return buyShoeslistInfoRows; // 결과값 return
}

// 판매양식 조회
async function selectsellShoeslistInfo(selectsellShoeslistInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn); // 데이터베이스 pool을 getconnection해줍니다.
  const selectsellShoeslistInfoQuery = ` 
  select 신발정보.모델ID, 신발정보.신발이미지, 신발정보.모델명, 
  판매경매최저가격.최저판매가격,
  판매양식.배송비, 판매양식.검수비, 판매양식.등록시간,
  계좌정보.계좌번호, 계좌정보.은행명,
  판매양식.배송주소,
  판매양식.판매가격 as 총정산금액 
  from 판매양식
  inner join 신발정보 on 판매양식.모델ID = 신발정보.모델ID
  inner join 회원정보 on 회원정보.회원번호 = 판매양식.회원번호
  inner join 계좌정보 on 판매양식.회원번호 = 계좌정보.회원번호
  inner join 
  (select min(distinct 재고현황.판매가격) as 최저판매가격
      from 신발정보 inner join 재고현황
      where 재고현황.스니커즈사이즈 = 290 and 재고현황.모델ID = 10000
      group by 재고현황.스니커즈사이즈) 판매경매최저가격
  where 신발정보.모델ID = 10000;

  `;               // 쿼리를 명시해줍니다
  
  const [sellShoeslistInfoRows] = await connection.query( // emailRows라는 최종적인 결과값에 await connection query를 해줘서 쿼리안에 쿼리문이 들어가게 되고 ? 안에는 email 값이 들어가게 되어서 selectEmailParams로 명시가 되었고 
    selectsellShoeslistInfoQuery, // 쿼리안에 쿼리문이 들어가게 되고
    selectsellShoeslistInfoParams
  );
  connection.release(); // connection release처리를 해주고

  return sellShoeslistInfoRows; // 결과값 return
}

// 드로우양식 조회
async function selectdrawShoeslistInfo(selectdrawShoeslistInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn); // 데이터베이스 pool을 getconnection해줍니다.
  const selectdrawShoeslistInfoQuery = ` 
  select 신발정보.모델ID, 신발정보.신발이미지, 신발정보.모델명, 드로우양식.회원번호,
  드로우양식.구매가격 as 구매희망가, 검수비, 배송비, 드로우양식.구매가격 as 총결제금액, 응모기간 as 입찰일, 
      case 
        when 드로우양식.드로우진행상황 = 0 then '성공'
        when 드로우양식.드로우진행상황 = 1 then '실패'
        when 드로우양식.드로우진행상황 = 2 then '진행중'
    end as 입찰진행상황,
      회원정보.회원주소 as 배송주소,
      계좌정보.은행명,
      계좌정보.계좌번호 as 결제정보
      
  from 드로우양식
  inner join 신발정보 on 드로우양식.모델ID = 신발정보.모델ID
  inner join 회원정보 on 회원정보.회원번호 = 드로우양식.회원번호
  inner join 계좌정보 on 회원정보.회원번호 = 계좌정보.회원번호
  where 드로우양식.회원번호 = 10001
  ;
  `;               // 쿼리를 명시해줍니다
  
  const [drawShoeslistInfoRows] = await connection.query( // emailRows라는 최종적인 결과값에 await connection query를 해줘서 쿼리안에 쿼리문이 들어가게 되고 ? 안에는 email 값이 들어가게 되어서 selectEmailParams로 명시가 되었고 
    selectdrawShoeslistInfoQuery, // 쿼리안에 쿼리문이 들어가게 되고
    selectdrawShoeslistInfoParams
  );
  connection.release(); // connection release처리를 해주고

  return drawShoeslistInfoRows; // 결과값 return
}

// 배송관리 입력
async function insertdeliveryShoesInfo(insertdeliveryShoesInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
    const insertdeliveryShoesInfoQuery = `
    insert into 배송관리(배송번호, 구매번호, 판매번호, 드로우번호, 배송일자, 출발배송주소, 도착배송주소, 도착배송전화번호, 배송진행상황)
    values( ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;  
  const insertdeliveryShoesInfoRow = await connection.query(
    insertdeliveryShoesInfoQuery,
    insertdeliveryShoesInfoParams
  );
  connection.release();
  return insertdeliveryShoesInfoRow;
}

// 직접배송 입력
async function insertdirectDeliveryShoesInfo(insertdirectDeliveryShoesInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
    const insertdirectDeliveryShoesInfoQuery = `
    insert into 직접배송(배송번호, 용역금액, 택배업체명, 택배업체사업자번호, 택배원이름, 택배원전화번호, 배송진행상황)
    values(?, ?, ?, ?, ?, ?, ?)
    ;

    `;  
  const insertdirectDeliveryShoesInfoRows = await connection.query(
    insertdirectDeliveryShoesInfoQuery,
    insertdirectDeliveryShoesInfoParams
  );
  connection.release();
  return insertdirectDeliveryShoesInfoRows;
}

// 택배업체 입력
async function insertdeliveryCompanyInfo(insertdeliveryCompanyInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
    const insertdeliveryCompanyInfoQuery = `
    insert into 택배업체(택배업체사업자번호, 택배업체명, 택배업체전화번호, 택배업체주소)
    values(?, ?, ?, ?)
    ;

    `;  
  const insertdeliveryCompanyInfoRows = await connection.query(
    insertdeliveryCompanyInfoQuery,
    insertdeliveryCompanyInfoParams
  );
  connection.release();
  return insertdeliveryCompanyInfoRows;
}

// 정산관리 입력
async function insertcalculateShoesInfo(insertcalculateShoesParams) {
  const connection = await pool.getConnection(async (conn) => conn);
    const insertcalculateShoesQuery = `
    insert into 정산관리(정산번호, 정산일, 정산금액, 정산여부, 계좌번호, 은행명, 예금주, 택배업체사업자번호)
    values(?, ?, ?, ?, ?, ?, ?, ?)
    ;

    `;  
  const insertcalculateShoesRows = await connection.query(
    insertcalculateShoesQuery,
    insertcalculateShoesParams
  );
  connection.release();
  return insertcalculateShoesRows;
}

module.exports = {
  insertbuyShoesInfo,
  insertsellShoesInfo,
  insertdrawShoesInfo,
  inserttestShoesInfo,
  deletebuyShoesInfo,
  deletesellShoesInfo,
  deletedrawShoesInfo,
  patchbuyShoesInfo,
  patchsellShoesInfo,
  patchdrawShoesInfo,
  selectbuyShoeslistInfo,
  selectsellShoeslistInfo,
  selectdrawShoeslistInfo,
  selectMainInfo,
  insertbuyShoesHistoryInfo,
  insertsellShoesHistoryInfo,
  insertdeliveryShoesInfo,
  insertdirectDeliveryShoesInfo,
  insertdeliveryCompanyInfo,
  insertcalculateShoesInfo,
  
};
