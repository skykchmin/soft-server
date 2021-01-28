module.exports = function(app){
    const board = require('../controllers/boardController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    
    app.route('/board/buyShoes').post(board.buyShoes); // 구매 양식 생성 
    app.route('/board/sellShoes').post(board.sellShoes); // 판매 양식 생성
    app.route('/board/drawShoes').post(board.drawShoes); // 드로우 양식 생성
    app.route('/board/testShoes').post(board.testShoes); // 신발검수 생성

    app.route('/board/deletebuyShoes').delete(board.deletebuyShoes); // 구매 양식 삭제
    app.route('/board/deletesellShoes').delete(board.deletesellShoes); // 판매 양식 삭제
    app.route('/board/deletedrawShoes').delete(board.deletedrawShoes); // 드로우 양식 삭제

    app.route('/board/patchbuyShoes').patch(board.patchbuyShoes); // 구매 양식 수정
    app.route('/board/patchsellShoes').patch(board.patchsellShoes); // 판매 양식 수정
    app.route('/board/patchdrawShoes').patch(board.patchdrawShoes); // 드로우 양식 수정

    app.route('/board/main').get(board.getMain); // 메인 
    app.route('/board/getbuyShoes').get(board.getbuyShoes); // 구매 양식 조회
    app.route('/board/getsellShoes').get(board.getsellShoes); // 판매 양식 조회
    app.route('/board/getdrawShoes').get(board.getdrawShoes); // 드로우 양식 조회 
 
    app.route('/board/sellShoesHistory').post(board.sellShoesHistory); // 판매 양식 생성

    app.route('/board/deliveryShoes').post(board.deliveryShoes); // 배송관리 생성

    // app.get('/app/board', board.getBoard); // apt.get으로 접근하게 된다면 board의 selectBoard가 명시가 됩니다. 
};