module.exports = function(app){
    const admin = require('../controllers/adminController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    
    app.route('/admin/deliveryShoes').post(admin.deliveryShoes);
    // app.route('/board/testShoes').post(board.testShoes);

    // app.get('/app/board', board.getBoard); // apt.get으로 접근하게 된다면 board의 selectBoard가 명시가 됩니다. 
};