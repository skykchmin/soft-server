const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');

const jwt = require('jsonwebtoken');
const regexEmail = require('regex-email');
const crypto = require('crypto');
const secret_config = require('../../../config/secret');

const userDao = require('../dao/userDao');
const { constants } = require('buffer');

/**
 update : 2020.10.4
 01.signUp API = 회원가입
 */
exports.signUp = async function (req, res) {
    const {
        email, password, shoesSize, nickname, signUpAcceptance 
    } = req.body;

    if (!email) return res.json({isSuccess: false, code: 411, message: "이메일을 입력해주세요."});
    if (email.length > 30) return res.json({
        isSuccess: false,
        code: 412,
        message: "이메일은 30자리 미만으로 입력해주세요."
    });

    if (!regexEmail.test(email)) return res.json({isSuccess: false, code: 413, message: "이메일을 형식을 정확하게 입력해주세요."});

    if (!password) return res.json({isSuccess: false, code: 414, message: "비밀번호를 입력 해주세요."});
    if (password.length < 6 || password.length > 20) return res.json({
        isSuccess: false,
        code: 415,
        message: "비밀번호는 6~20자리를 입력해주세요."
    });

    if (!nickname) return res.json({isSuccess: false, code: 416, message: "닉네임을 입력 해주세요."});
    if (nickname.length > 20) return res.json({
        isSuccess: false,
        code: 417,
        message: "닉네임은 최대 20자리를 입력해주세요."
    });

    // 
    if(!signUpAcceptance) return res.json({isSuccess: false, code: 418, message: "약관을 동의해야합니다"});

        try {
            // 이메일 중복 확인
            const emailRows = await userDao.userEmailCheck(email);
            if (emailRows.length > 0) {

                return res.json({
                    isSuccess: false,
                    code: 419,
                    message: "중복된 이메일입니다."
                });
            }

            // 닉네임 중복 확인
            const nicknameRows = await userDao.userNicknameCheck(nickname);
            if (nicknameRows.length > 0) {
                return res.json({
                    isSuccess: false,
                    code: 420,
                    message: "중복된 닉네임입니다."
                });
            }

            // TRANSACTION : advanced
           // await connection.beginTransaction(); // START TRANSACTION
            const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
            const insertUserInfoParams = [email, hashedPassword, nickname];
            
            const insertUserRows = await userDao.insertUserInfo(insertUserInfoParams);

            //  await connection.commit(); // COMMIT
           // connection.release();
            return res.json({
                isSuccess: true,
                code: 200,
                message: "회원가입 성공"
            });
        } catch (err) {
           // await connection.rollback(); // ROLLBACK
           // connection.release();
            logger.error(`App - SignUp Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
};

/**
 update : 2020.10.4
 02.signIn API = 로그인
 **/
exports.signIn = async function (req, res) {
    const {
        email, password
    } = req.body;

    if (!email) return res.json({isSuccess: false, code: 301, message: "이메일을 입력해주세요."});
    if (email.length > 30) return res.json({
        isSuccess: false,
        code: 302,
        message: "이메일은 30자리 미만으로 입력해주세요."
    });

    if (!regexEmail.test(email)) return res.json({isSuccess: false, code: 303, message: "이메일을 형식을 정확하게 입력해주세요."});

    if (!password) return res.json({isSuccess: false, code: 304, message: "비밀번호를 입력 해주세요."});
        try {
            const [userInfoRows] = await userDao.selectUserInfo(email)

            if (userInfoRows.length < 1) {
                connection.release();
                return res.json({
                    isSuccess: false,
                    code: 310,
                    message: "아이디를 확인해주세요."
                });
            }

            const hashedPassword = await crypto.createHash('sha512').update(password).digest('hex');
            if (userInfoRows[0].pswd !== hashedPassword) {
                connection.release();
                return res.json({
                    isSuccess: false,
                    code: 311,
                    message: "비밀번호를 확인해주세요."
                });
            }

            console.log(userInfoRows[0].status);

            // if (userInfoRows[0].status === "INACTIVE") {
            //     connection.release();
            //     return res.json({
            //         isSuccess: false,
            //         code: 312,
            //         message: "비활성화 된 계정입니다. 고객센터에 문의해주세요."
            //     });
            // } else if (userInfoRows[0].status === "DELETED") {
            //     connection.release();
            //     return res.json({
            //         isSuccess: false,
            //         code: 313,
            //         message: "탈퇴 된 계정입니다. 고객센터에 문의해주세요."
            //     });
            // }
            //토큰 생성
            let token = await jwt.sign({
                    id: userInfoRows[0].id,
                }, // 토큰의 내용(payload)
                secret_config.jwtsecret, // 비밀 키
                {
                    expiresIn: '365d',
                    subject: 'userInfo',
                } // 유효 시간은 365일
            );

            res.json({
                userInfo: userInfoRows[0],
                jwt: token,
                isSuccess: true,
                code: 200,
                message: "로그인 성공"
            });

            connection.release();
        } catch (err) {
            logger.error(`App - SignIn Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
};

exports.accountSignUp = async function (req, res) {

    const {
        accountnumber, bankname, accountname
    } = req.body;

    if (!accountnumber) return res.json({isSuccess: false, code: 401, message: "계좌번호를 입력해주세요."});
    if (!bankname) return res.json({isSuccess: false, code: 400, message: "은행명을 선택해주세요."});
    if (!accountname) return res.json({isSuccess: false, code: 402, message: "예금주를 입력해주세요."});

    if (accountname.length > 10) return res.json({
        isSuccess: false,
        code: 403,
        message: "계좌번호는 30자리 미만으로 입력해주세요."
    });

    try{
        const insertAccountInfoParams = [accountnumber, bankname, accountname];  
        const insertAccountRows = await userDao.insertAccountInfo(insertAccountInfoParams);

      //  await connection.commit(); // COMMIT
       // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "계좌정보 등록 성공"
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
     } 
    
};

exports.deleteUser= async function (req, res) {
    const {
        emailID
    } = req.body;

    if (!emailID) return res.json({isSuccess: false, code: 401, message: "이메일ID를 입력해주세요"});
    
    try{
        const deleteUserInfoParams = [emailID];
        const deleteUserInfoRow = await userDao.deleteUserInfo(deleteUserInfoParams);

      //  await connection.commit(); // COMMIT
       // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "회원삭제 성공 성공"
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
     } 
    
};

exports.getaccountCheck = async function (req, res) {
    try {    
        // const selectMainParams = [modelID];
        const selectAccountCheckInfoRows = await userDao.selectAccountInfo(); // userDao에서 userEmailCheck 파라미터로 email을 넘겨줬습니다.
        
            if (selectAccountCheckInfoRows.length > 0) { // buyShoeslistRows가 null이 아니라면 
                return res.json({
                            isSuccess: true,
                            code: 200,
                            message: "계좌정보 조회 성공",
                            data: selectAccountCheckInfoRows // data에 buyShoeslistRows를 넣어주게 됩니다
                        });
            } else {
                return res.json({ // 게시물이 존재하지 않는다면 
                    isSuccess: false,
                    code: 300,
                    message: "계좌가 존재하지 않습니다"
                    });
            } 
        } catch (err) { // 에러가 발생했다면 에러를 알려줍니다. 
            // await connection.rollback(); // ROLLBACK
            // connection.release();
            logger.error(`App - getBoard Query error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }        
        
};

exports.patchaccount = async function (req, res) {
    const {
        accountnumber, bankname, accountname, memberNumber
    } = req.body;

    if (!accountnumber) return res.json({isSuccess: false, code: 401, message: "계좌번호를 입력해주세요."});
    if (!bankname) return res.json({isSuccess: false, code: 400, message: "은행명을 선택해주세요."});
    if (!accountname) return res.json({isSuccess: false, code: 402, message: "예금주를 입력해주세요."});

    try{
        const patchAccountInfoParams = [ accountnumber, bankname, accountname, memberNumber];     
        const patchAccountInfoRows = await userDao.patchAccountInfo(patchAccountInfoParams); //  await connection.commit(); // COMMIT

        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "계좌정보 수정 성공" 
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
     } 
    
};

// 회원정보 수정
exports.patchUser = async function (req, res) {
    // 이메일ID = ?, 스니커즈사이즈 = ?, 회원주소 = ?, 이름 = ?, 약관동의여부 = ? , where 회원번호 = ? 
    
    const {
        emailID, shoesSize, memberAddress, nickname, memberName, signUpAcceptance, userNumber 
    } = req.body;

    if (!emailID) return res.json({isSuccess: false, code: 411, message: "이메일ID를 입력해주세요"});
    if (!shoesSize) return res.json({isSuccess: false, code: 412, message: "스니커즈 사이즈를 입력해주세요."});
    if (!memberAddress) return res.json({isSuccess: false, code: 413, message: "회원주소를 입력해주세요."});
    if (!nickname) return res.json({isSuccess: false, code: 414, message: "닉네임을 입력해주세요."});
    if (!signUpAcceptance) return res.json({isSuccess: false, code: 415, message: "약관을 동의해주세요"});

    try{
        const patchUserInfoParams = [ emailID, shoesSize, memberAddress, nickname, memberName, signUpAcceptance, userNumber];     
        const patchUserInfoRows = await userDao.patchUserInfo(patchUserInfoParams); //  await connection.commit(); // COMMIT

        // connection.release();
        return res.json({
            isSuccess: true,
            code: 200,
            message: "회원정보 수정 성공" 
        });
    } catch (err) {
        // await connection.rollback(); // ROLLBACK
        // connection.release();
         logger.error(`App - SignUp Query error\n: ${err.message}`);
         return res.status(500).send(`Error: ${err.message}`);
     } 
    
};


/**
 update : 2019.09.23
 03.check API = token 검증
 **/
exports.check = async function (req, res) {
    res.json({
        isSuccess: true,
        code: 200,
        message: "검증 성공",
        info: req.verifiedToken
    })
};