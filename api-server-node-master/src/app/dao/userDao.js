const { pool } = require("../../../config/database");

// Signup
async function userEmailCheck(email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectEmailQuery = `
                SELECT 이메일ID, 프로필이름 
                FROM 회원정보 
                WHERE 이메일ID = ?;
                `;
  const selectEmailParams = [email];
  const [emailRows] = await connection.query(
    selectEmailQuery,
    selectEmailParams
  );
  connection.release();

  return emailRows;
}

async function userNicknameCheck(nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectNicknameQuery = `
                SELECT 이메일ID, 비밀번호
                FROM 회원정보 
                WHERE 프로필이름 = ?;
                `;
  const selectNicknameParams = [nickname];
  const [nicknameRows] = await connection.query(
    selectNicknameQuery,
    selectNicknameParams
  );
  connection.release();
  return nicknameRows;
}

async function insertUserInfo(insertUserInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertUserInfoQuery = `
        INSERT INTO 회원정보(이메일ID, 비밀번호, 프로필이름)
        VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );
  connection.release();
  return insertUserInfoRow;
}

// 계좌정보 생성
async function insertAccountInfo(insertAccountInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const insertAccountInfoQuery = `
        INSERT INTO 계좌정보(계좌번호, 은행명, 예금주)
        VALUES (?, ?, ?);
    `;
  const insertAccountInfoRow = await connection.query(
    insertAccountInfoQuery,
    insertAccountInfoParams
  );
  connection.release();
  return insertAccountInfoRow;
}


// 계좌정보 수정
async function patchAccountInfo(patchAccountInfoParams) {
  //accountNumber,shoesSize, buyshoesWay, deliveryAddress, buyPrice, buyEnrollmentTime, buyNumber

  const connection = await pool.getConnection(async (conn) => conn);
    const patchAccountInfoQuery = `
      update 계좌정보
      set 계좌번호 = ?, 은행명 = ?, 예금주 = ?  
      where 회원번호 = ? 
    `;  
  const patchAccountInfoRow = await connection.query(
    patchAccountInfoQuery,
    patchAccountInfoParams
  );
  connection.release();
  return patchAccountInfoRow;
}

// 회원정보 수정
async function patchUserInfo(patchUserInfoParams) {
  //accountNumber,shoesSize, buyshoesWay, deliveryAddress, buyPrice, buyEnrollmentTime, buyNumber

  const connection = await pool.getConnection(async (conn) => conn);
    const patchUserInfoQuery = `
      update 회원정보
      set 이메일ID = ?, 스니커즈사이즈 = ?, 회원주소 = ?, 프로필이름 = ?, 이름 = ?, 약관동의여부 = ? 
      where 회원번호 = ? 
    `;  
  const patchUserInfoRow = await connection.query(
    patchUserInfoQuery,
    patchUserInfoParams
  );
  connection.release();
  return patchUserInfoRow;
}



// deleteUser
async function deleteUserInfo(deleteUserInfoParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const deleteUserInfoQuery = `
        delete from 회원정보
        where 이메일ID = ? 
    `;
  const deleteUserInfoRow = await connection.query(
    deleteUserInfoQuery,
    deleteUserInfoParams
  );
  connection.release();
  return deleteUserInfoRow;
}


//SignIn
async function selectUserInfo(email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectUserInfoQuery = `
                SELECT 이메일ID, 비밀번호, 프로필이름
                FROM 회원정보 
                WHERE 이메일ID = ?;
                `;

  let selectUserInfoParams = [email];
  const [userInfoRows] = await connection.query(
    selectUserInfoQuery,
    selectUserInfoParams
  );
  connection.release();
  return [userInfoRows];
}

async function selectAccountInfo() {
  const connection = await pool.getConnection(async (conn) => conn);
  const selectAccountInfoQuery = `
    select 은행명, 계좌번호, 예금주 
    from 계좌정보 inner join 회원정보 
    on 계좌정보.회원번호 = 회원정보.회원번호
    
    `;

  // let selectAccountInfoParams = [];
  const [selectAccountInfoRows] = await connection.query(
    selectAccountInfoQuery,
    // selectAccountInfoParams
  );
  connection.release();
  return [selectAccountInfoRows];
}

module.exports = {
  userEmailCheck,
  userNicknameCheck,
  insertUserInfo,
  insertAccountInfo,
  selectUserInfo,
  deleteUserInfo,
  selectAccountInfo,
  patchAccountInfo,
  patchUserInfo
};
