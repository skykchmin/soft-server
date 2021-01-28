module.exports = function(app){
    const user = require('../controllers/userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.route('/app/signUp').post(user.signUp); // 회원가입
    app.route('/app/signIn').post(user.signIn); // 로그인
    app.route('/app/deleteUser').delete(user.deleteUser); // 회원 삭제
    app.route('/app/patchUser').patch(user.patchUser); // 회원정보 수정

    app.route('/app/accountSignUp').post(user.accountSignUp); // 계좌정보 입력
    app.route('/app/accountCheck').get(user.getaccountCheck); // 계좌정보 조회
    app.route('/app/patchaccount').patch(user.patchaccount); // 계좌정보 수정
    // app.get('/check', jwtMiddleware, user.check);
};