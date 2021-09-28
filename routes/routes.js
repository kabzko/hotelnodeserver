const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/usercontroller');
const storecontroller = require('../controllers/storecontroller');
const multer = require('multer');
const upload = multer({dest: 'C:/xampp/htdocs/hotelimages/storeimages'});

// USER
router.post('/user_login', usercontroller.user_login);
router.post('/user_home_detail', usercontroller.user_home_detail);
router.post('/user_store_detail', usercontroller.user_store_detail);
router.post('/user_product_detail', usercontroller.user_product_detail);
router.post('/already_booked_room', usercontroller.already_booked_room);
router.post('/user_reserve_room', usercontroller.user_reserve_room);
router.post('/user_booked_room', usercontroller.user_booked_room);
router.post('/user_booked_room_detail', usercontroller.user_booked_room_detail);
router.post('/user_wallet', usercontroller.user_wallet);
router.post('/user_check_email', usercontroller.user_check_email);
router.post('/user_check_username', usercontroller.user_check_username);
router.post('/user_register_account', usercontroller.user_register_account);
router.post('/user_cashin_wallet', usercontroller.user_cashin_wallet);
router.post('/user_cashout_wallet', usercontroller.user_cashout_wallet);
router.post('/user_stores', usercontroller.user_stores);
router.post('/user_products', usercontroller.user_products);
router.post('/user_search_store', usercontroller.user_search_store);
router.post('/user_profile', usercontroller.user_profile);

// ADMIN
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
router.post('/store_check_username', storecontroller.store_check_username);
router.post('/store_register', storecontroller.store_register);
router.post('/store_product_category', storecontroller.store_product_category);
router.post('/store_save_product', upload.single('productimage'), storecontroller.store_save_product);
router.post('/store_product_update_detail', storecontroller.store_product_update_detail);
router.post('/store_update_status', storecontroller.store_update_status);
router.post('/store_status', storecontroller.store_status);
router.post('/store_upload_carousel', upload.single('carouselimage'), storecontroller.store_upload_carousel);
router.post('/store_cashout_wallet', storecontroller.store_cashout_wallet);

module.exports = router;