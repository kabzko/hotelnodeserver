const express = require('express');
const router = express.Router();
const path = require('path');
const admincontroller = require('../controllers/admincontroller');
const storecontroller = require('../controllers/storecontroller');
const usercontroller = require('../controllers/usercontroller');
const multer = require('multer');
const upload = multer({dest: path.join(__dirname, '../public/images/hotelimages/storeimages')});
const upload2 = multer({dest: path.join(__dirname, '../public/images/hotelimages/verification')});

// USER
router.post('/user_login', usercontroller.user_login);
router.post('/user_log_out', usercontroller.user_log_out);
router.post('/user_home_detail', usercontroller.user_home_detail);
router.post('/user_store_detail', usercontroller.user_store_detail);
router.post('/user_product_detail', usercontroller.user_product_detail);
router.post('/already_booked_room', usercontroller.already_booked_room);
router.post('/user_reserve_room', upload.fields([{
    name: 'proofofpayment', maxCount: 1
}]), usercontroller.user_reserve_room);
router.post('/user_booked_room', usercontroller.user_booked_room);
router.post('/user_booked_room_detail', usercontroller.user_booked_room_detail);
router.post('/user_wallet', usercontroller.user_wallet);
router.post('/user_check_email', usercontroller.user_check_email);
router.post('/user_register_account', usercontroller.user_register_account);
router.post('/user_cashin_wallet', usercontroller.user_cashin_wallet);
router.post('/user_cashout_wallet', usercontroller.user_cashout_wallet);
router.post('/user_stores', usercontroller.user_stores);
router.post('/user_products', usercontroller.user_products);
router.post('/user_search_store', usercontroller.user_search_store);
router.post('/user_profile', usercontroller.user_profile);
router.post('/user_post_rate_review', upload.fields([{
        name: 'avatarimage', maxCount: 1
    }, {
        name: 'video', maxCount: 1
}]), usercontroller.user_post_rate_review);
router.post('/user_remove_review', usercontroller.user_remove_review);
router.post('/user_save_profile', usercontroller.user_save_profile);
router.post('/user_update_password', usercontroller.user_update_password);
router.post('/user_change_password', usercontroller.user_change_password);
router.post('/user_decline_reservation', usercontroller.user_decline_reservation);

// STORE
router.post('/store_login', storecontroller.store_login);
router.post('/store_pending_booked_list', storecontroller.store_pending_booked_list);
router.post('/store_booked_room_detail', storecontroller.store_booked_room_detail);
router.post('/store_accept_reservation', storecontroller.store_accept_reservation);
router.post('/store_decline_reservation', storecontroller.store_decline_reservation);
router.post('/store_booked_list', storecontroller.store_booked_list);
router.post('/store_wallet', storecontroller.store_wallet);
router.post('/store_add_extra_charges', storecontroller.store_add_extra_charges);
router.post('/store_detail', storecontroller.store_detail);
router.post('/store_product_detail', storecontroller.store_product_detail);
router.post('/store_update_booked_room', storecontroller.store_update_booked_room);
router.post('/store_pay_thru_wallet', storecontroller.store_pay_thru_wallet);
router.post('/store_check_email', storecontroller.store_check_email);
router.post('/store_register', storecontroller.store_register);
router.post('/store_product_category', storecontroller.store_product_category);
router.post('/store_save_product', upload.fields([{
        name: 'productimage', maxCount: 1
    }, {
        name: 'productimage2', maxCount: 1
    }, {
        name: 'productimage3', maxCount: 1
}]), storecontroller.store_save_product);
router.post('/store_update_product', upload.fields([{
    name: 'updateimage', maxCount: 1
}, {
    name: 'updateimage2', maxCount: 1
}, {
    name: 'updateimage3', maxCount: 1
}]), storecontroller.store_update_product);
router.post('/store_product_update_detail', storecontroller.store_product_update_detail);
router.post('/store_update_status', storecontroller.store_update_status);
router.post('/store_status', storecontroller.store_status);
router.post('/store_update_profile', upload.single('avatarimage'), storecontroller.store_update_profile);
router.post('/store_cashout_wallet', storecontroller.store_cashout_wallet);
router.post('/store_rate_reviews', storecontroller.store_rate_reviews);
router.post('/store_remove_extra', storecontroller.store_remove_extra);
router.post('/store_pay_thru_cashier', storecontroller.store_pay_thru_cashier);
router.post('/store_update_password', storecontroller.store_update_password);
router.post('/store_change_password', storecontroller.store_change_password);
router.post('/store_reply_ratings', storecontroller.store_reply_ratings);
router.post('/store_verification_status', storecontroller.store_verification_status);
router.post('/store_verify_update', upload2.fields([{
        name: 'updategovidimage', maxCount: 1
    }, {
        name: 'updatebusinessimage', maxCount: 1
}]), storecontroller.store_verify_update);
router.post('/store_verify_now', upload2.fields([{
        name: 'govidimage', maxCount: 1
    }, {
        name: 'businessimage', maxCount: 1
}]), storecontroller.store_verify_now);

// ADMIN
router.post('/admin_login', admincontroller.admin_login);
router.post('/admin_list_of_users', admincontroller.admin_list_of_users);
router.post('/admin_list_of_hotels', admincontroller.admin_list_of_hotels);
router.post('/admin_list_of_resorts', admincontroller.admin_list_of_resorts);
router.post('/admin_boost_rate', admincontroller.admin_boost_rate);
router.post('/admin_ban_store', admincontroller.admin_ban_store);
router.post('/decline_store_verification', admincontroller.decline_store_verification);
router.post('/accept_store_verification', admincontroller.accept_store_verification);
router.post('/delete_store_rate_review', admincontroller.delete_store_rate_review);

module.exports = router;