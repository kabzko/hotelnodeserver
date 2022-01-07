const mysql = require('../config/database');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

function DateTime() {
    return new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2) + ' ' + new Date().toLocaleTimeString('en-US', {hour12: false});
}

function LatLngToKM(lat1, lng1, lat2, lng2) {
    const r = 6371;
    const p1 = lat1 * (Math.PI/180);
    const p2 = lat2 * (Math.PI/180);
    const dp = (lat2-lat1) * (Math.PI/180);
    const dl = (lng2-lng1) * (Math.PI/180);
    const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = r * c;
    return d;
}

exports.user_login = (_req, _res) => {
    mysql.query('SELECT id, firstname, email, password FROM users WHERE email = "' + _req.body.email + '"', (_err, _rows) => {
        if (!_err) {
            if (_rows.length) {
                bcrypt.compare(_req.body.password, _rows[0].password, (_err, _result) => {
                    if (_result) {
                        mysql.query('UPDATE users SET isActive = 1, updatedAt = "' + DateTime() + '" WHERE email = "' + _req.body.email + '"', (_err1, _rows1) => {
                            if (!_err1) {
                                _res.json({
                                    'id': _rows[0].id,
                                    'firstname': _rows[0].firstname,
                                    'email': _rows[0].email
                                });
                            } else {
                                throw(_err1);
                            }
                        });
                    } else {
                        _res.send('0');
                    }
                });
            } else {
                _res.send('0');
            }
        } else {
            throw(_err);
        }
    });
}

exports.user_log_out  = (_req, _res) => {
    mysql.query('UPDATE users SET isActive = 0, updatedAt = "' + DateTime() + '" WHERE id = "' + _req.body.userid + '"', (_err1, _rows1) => {
        if (!_err1) {
            _res.send('1');
        } else {
            throw(_err1);
        }
    });
}

exports.user_home_detail = (_req, _res) => {
    let nearHotel = [];
    let nearResort = [];
    let nearHotelStatus = false;
    let nearResortStatus = false;
    const query0 = 'SELECT id, name, type, latitude, longitude, avatar FROM stores WHERE type LIKE "%hotel%" AND status_id = 4;';
    const query1 = 'SELECT id, name, type, latitude, longitude, avatar FROM stores WHERE type LIKE "%resort%" AND status_id = 4';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            if (_rows[0].length != 0) {
                _rows[0].forEach((x, index) => {
                    if (LatLngToKM(_req.body.lat, _req.body.lng, x.latitude, x.longitude) <= 5) {
                        nearHotel.push({
                            'id': x.id,
                            'name': x.name,
                            'avatar': x.avatar,
                        });
                    }
                    if (_rows[0].length == (index + 1)) {
                        nearHotelStatus = true;
                    }
                });
            } else {
                nearHotel = [];
            }
            if (_rows[1].length != 0) {
                _rows[1].forEach((x, index) => {
                    if (LatLngToKM(_req.body.lat, _req.body.lng, x.latitude, x.longitude) <= 5) {
                        nearResort.push({
                            'id': x.id,
                            'name': x.name,
                            'avatar': x.avatar,
                        });
                    }
                    if (_rows[1].length == (index + 1)) {
                        nearResortStatus = true;
                    }
                });
            } else {
                nearResort = [];
            }
            if (nearHotelStatus == true && nearResortStatus == true) {
                _res.json({
                    'hotel': nearHotel,
                    'resort': nearResort,
                    'allhotel': _rows[0],
                    'allresort': _rows[1],
                });
            } else {
                _res.json({
                    'hotel': nearHotel,
                    'resort': nearResort,
                    'allhotel': _rows[0],
                    'allresort': _rows[1],
                });
            }
        } else {
            throw(_err);
        }
    });
}

exports.user_store_detail = (_req, _res) => {
    query0 = 'SELECT name, address, mobile, type, avatar, status_id FROM stores WHERE id = "' + _req.body.storeid + '";';
    query1 = 'SELECT id, name, category, images, store_id FROM products WHERE store_id = "' + _req.body.storeid + '";';
    query2 = 'SELECT id, category as name FROM products WHERE store_id = "' + _req.body.storeid + '" GROUP BY category;';
    query3 = 'SELECT ratings.id, ratings.user_id, CONCAT(users.firstname, " ", users.lastname) as name, ratings.rate, ratings.comment, ratings.image, ratings.reply, ratings.createdAt FROM ratings INNER JOIN users ON ratings.user_id = users.id WHERE ratings.store_id = "' + _req.body.storeid + '" AND ratings.user_id != "' + _req.body.userid + '" ORDER BY ratings.createdAt DESC;';
    query4 = 'SELECT COUNT(*) as count FROM ratings WHERE user_id = "' + _req.body.userid + '";';
    query5 = 'SELECT COUNT(*) as count FROM orders INNER JOIN products ON orders.product_id = products.id WHERE orders.user_id = "' + _req.body.userid + '" AND products.store_id = "' + _req.body.storeid + '" AND orders.status_id = 3;';
    query6 = 'SELECT id, name, rate, comment, image, reply, createdAt FROM ratings WHERE store_id = "' + _req.body.storeid + '" AND user_id IS NULL ORDER BY createdAt DESC;';
    query7 = 'SELECT ratings.id, ratings.user_id, CONCAT(users.firstname, " ", users.lastname) as name, ratings.rate, ratings.comment, ratings.image, ratings.reply, ratings.createdAt FROM ratings INNER JOIN users ON ratings.user_id = users.id WHERE ratings.store_id = "' + _req.body.storeid + '" AND ratings.user_id = "' + _req.body.userid + '" ORDER BY ratings.createdAt DESC';
    mysql.query(query0 + query1 + query2 + query3 + query4 + query5 + query6 + query7, (_err, _rows) => {
        if (!_err) {
            _res.json({
                'store': _rows[0],
                'products': _rows[1],
                'categories': _rows[2],
                'ratingsown': _rows[7],
                'ratingsuser': _rows[3],
                'ratingsbot': _rows[6],
                'review': _rows[4][0].count == 0 && _rows[5][0].count != 0 ? 0 : 1,
            });
        } else {
            throw(_err);
        }
    });
}

exports.user_product_detail = (_req, _res) => {
    mysql.query('SELECT products.id, products.name, products.facility, products.entry, products.rate, products.rate_type, products.room_availability, products.images, products.images2, products.images3, products.store_id, stores.checkin, stores.checkout FROM products INNER JOIN stores ON products.store_id = stores.id WHERE products.id = "' + _req.body.productid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            throw(_err);
        }
    });
}

exports.already_booked_room = (_req, _res) => {
    mysql.query('SELECT orders.from_datetime, orders.to_datetime, orders.room, products.room_availability FROM orders INNER JOIN products ON orders.product_id = products.id WHERE orders.status_id = 2 AND orders.product_id = "' + _req.body.productid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            throw(_err);
        }
    });
}

exports.user_reserve_room = (_req, _res) => {
    const dest = path.join(__dirname, '../public/images/hotelimages/storeimages/');
    const tempPath1 = _req.files.proofofpayment[0].path;
    const datetime = new Date().getTime();
    const targetPath1 = dest + datetime + "proofofpayment.png";
    const url1 = "https://hotelyahaytest.herokuapp.com/images/hotelimages/storeimages/" + datetime + "proofofpayment.png";
    mysql.query('SELECT COUNT(*) as count FROM orders WHERE user_id = "' + + _req.body.userid + '" AND from_datetime = "' + _req.body.from + '" AND to_datetime = "' + _req.body.to + '" AND status_id = 1', (_err, _rows) => {
        if (!_err) {
            if (_rows[0].count == 0) {
                fs.rename(tempPath1, targetPath1, _err1 => {
                    if (!_err1) {
                        mysql.query('INSERT INTO orders (user_id, product_id, proof_of_payment, orders.downpayment, room, rate, rate_type, discount, from_datetime, to_datetime, checkin, checkout, status_id, createdAt, updatedAt) VALUES ("' + _req.body.userid + '", "' + _req.body.productid + '", "' + url1 + '", "' + _req.body.downpayment + '", "' + _req.body.room + '", "' + _req.body.rate + '", "' + _req.body.ratetype + '", "' + _req.body.discount + '", "' + _req.body.from + '", "' + _req.body.to + '", "' + _req.body.checkin + '", "' + _req.body.checkout + '", 1, "' + DateTime() + '", "' + DateTime() + '")', (_err2, _rows2) => {
                            if (!_err2) {
                                _res.send('1');
                            } else {
                                throw(_err2);
                            }
                        });
                    } else {
                        throw(_err1);
                    }
                });
            } else {
                _res.send('0');
            }
        } else {
            throw(_err);
        }
    });
}

exports.user_booked_room = (_req, _res) => {
    const query0 = 'SELECT orders.id, orders.from_datetime, orders.to_datetime, orders.checkin, orders.checkout, orders.room, orders.status_id, order_status.name as statusname, stores.name as building, products.name as roomname, products.rate, products.rate_type FROM orders INNER JOIN order_status ON orders.status_id = order_status.id INNER JOIN products ON orders.product_id = products.id INNER JOIN stores ON products.store_id = stores.id WHERE orders.user_id = "' + _req.body.userid + '" AND (MONTH(orders.from_datetime) = "' + _req.body.month + '" OR MONTH(orders.to_datetime) = "' + _req.body.month + '") AND (orders.status_id = "1" OR orders.status_id = "2");';
    const query1 = 'SELECT orders.id, orders.from_datetime, orders.to_datetime, orders.checkin, orders.checkout, orders.room, orders.status_id, order_status.name as statusname, stores.name as building, products.name as roomname, products.rate, products.rate_type FROM orders INNER JOIN order_status ON orders.status_id = order_status.id INNER JOIN products ON orders.product_id = products.id INNER JOIN stores ON products.store_id = stores.id WHERE orders.user_id = "' + _req.body.userid + '" AND (MONTH(orders.from_datetime) = "' + _req.body.month + '" OR MONTH(orders.to_datetime) = "' + _req.body.month + '") AND (orders.status_id = "3" OR orders.status_id = "4" OR orders.status_id = "5")';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            _res.json({
                'active': _rows[0],
                'past': _rows[1],
            });
        } else {
            throw(_err);
        }
    });
}

exports.user_booked_room_detail = (_req, _res) => {
    const query0 = 'SELECT orders.id, orders.proof_of_payment, orders.downpayment, orders.from_datetime, orders.to_datetime, orders.checkin, orders.checkout, orders.room, orders.status_id, users.firstname, users.lastname, users.email, users.mobile, order_status.name as statusname, stores.address, stores.name as building, products.name as roomname, products.rate, products.rate_type, products.store_id FROM orders INNER JOIN users ON orders.user_id = users.id INNER JOIN order_status ON orders.status_id = order_status.id INNER JOIN products ON orders.product_id = products.id INNER JOIN stores ON products.store_id = stores.id WHERE orders.id = "' + _req.body.orderid + '";'
    const query1 = 'SELECT * FROM charges WHERE order_id = "' + _req.body.orderid + '"';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            _res.json({
                'order': _rows[0],
                'charge': _rows[1],
            });
        } else {
            throw(_err);
        }
    });
}

exports.user_wallet = (_req, _res) => {
    const query0 = 'SELECT name, amount, status_id FROM transactions WHERE user_id = "' + _req.body.userid + '";';
    const query1 = 'SELECT id, wallet FROM users WHERE id = "' + _req.body.userid + '"';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            _res.json({
                'transactions': _rows[0],
                'wallet': _rows[1],
            });
        } else {
            throw(_err);
        }
    });
}

exports.user_check_email = (_req, _res) => {
    mysql.query('SELECT COUNT(*) as count FROM users WHERE email = "' + _req.body.email + '"', (_err, _rows) => {
        if (!_err) {
            if (_rows[0].count == 0) {
                _res.send('1');
            } else {
                _res.send('0');
            }
        } else {
            throw(_err);
        }
    });
}

exports.user_register_account  = (_req, _res) => {
    bcrypt.hash(_req.body.password, 10, (err, hash) => {
        mysql.query('INSERT INTO users (firstname, lastname, mobile, email, password, createdAt, updatedAt) VALUES ("' + _req.body.firstname + '", "' + _req.body.lastname + '", "' + _req.body.mobile + '", "' + _req.body.email + '", "' + hash + '", "' + DateTime() + '", "' + DateTime() + '")', (_err, _rows) => {
            if (!_err) {
                mysql.query('SELECT id, firstname, lastname, email, mobile, password FROM users WHERE id = "' + _rows.insertId + '"', (_err1, _rows1) => {
                    if (!_err1) {
                        _res.json({
                            'id': _rows1[0].id,
                            'firstname': _rows1[0].firstname,
                            'email': _rows1[0].email
                        });
                    } else {
                        throw(_err1);
                    }
                });
            } else {
                throw(_err);
            }
        });
    });
}

exports.user_cashin_wallet = (_req, _res) => {
    mysql.query('UPDATE users SET wallet = "' + _req.body.amount + '", updatedAt = "' + DateTime() + '" WHERE id = "' +  _req.body.userid + '"', (_err, _rows) => {
        if (!_err) {
            mysql.query('INSERT INTO transactions (user_id, name, amount, status_id, createdAt, updatedAt) VALUES ("' + _req.body.userid + '", "Add funds to wallet", "' + _req.body.added + '", "6","' + DateTime() + '", "' + DateTime() + '")', (_err1, _rows1) => {
                _res.send('1');
            });
        } else {
            throw(_err);
        }
    });
}

exports.user_cashout_wallet = (_req, _res) => {
    mysql.query('UPDATE users SET wallet = "' + _req.body.amount + '", updatedAt = "' + DateTime() + '" WHERE id = "' +  _req.body.userid + '"', (_err, _rows) => {
        if (!_err) {
            mysql.query('INSERT INTO transactions (user_id, name, amount, status_id, createdAt, updatedAt) VALUES ("' + _req.body.userid + '", "Transfer funds to bank", "' + _req.body.added + '", "7","' + DateTime() + '", "' + DateTime() + '")', (_err1, _rows1) => {
                _res.send('1');
            });
        } else {
            throw(_err);
        }
    });
}

exports.user_stores = (_req, _res) => {
    let nearMe = [];
    let nearMeStatus = false;
    mysql.query('SELECT id, name, type, latitude, longitude, avatar FROM stores WHERE type LIKE "%' + _req.body.bldgtype + '%" AND status_id = 4', (_err, _rows) => {
        if (!_err) {
            if (_rows.length != 0) {
                _rows.forEach((x, index) => {
                    if (LatLngToKM(_req.body.lat, _req.body.lng, x.latitude, x.longitude) <= 5) {
                        nearMe.push({
                            'id': x.id,
                            'name': x.name,
                            'avatar': x.avatar,
                        });
                    }
                    if (_rows.length == (index + 1)) {
                        nearMeStatus = true;
                    }
                });
            } else {
                nearMe = [];
            }
            if (nearMeStatus == true) {
                _res.json({
                    "nearme": nearMe,
                    "all": _rows,
                });
            } else {
                _res.json({
                    "nearme": nearMe,
                    "all": _rows,
                });
            }
        } else {
            throw(_err);
        }
    });
}

exports.user_products = (_req, _res) => {
    mysql.query('SELECT id, name, category, images, store_id FROM products WHERE category = "' + _req.body.category + '"', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            throw(_err);
        }
    });
}

exports.user_search_store = (_req, _res) => {
    const query0 = 'SELECT id, name, type, avatar FROM stores WHERE type LIKE "%' + _req.body.type + '%" AND name LIKE "%' + _req.body.search + '%" AND status_id = 4;';
    const query1 = 'SELECT id, name, type, avatar FROM stores WHERE type LIKE "%' + _req.body.type + '%" AND name NOT LIKE "%' + _req.body.search + '%" AND status_id = 4';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            _res.send(_rows[0].concat(_rows[1]));
        } else {
            throw(_err);
        }
    });
}

exports.user_profile = (_req, _res) => {
    mysql.query('SELECT firstname, lastname, email, mobile FROM users WHERE id = "' + _req.body.userid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            throw(_err);
        }
    });
}

exports.user_post_rate_review = (_req, _res) => {
    if (typeof _req.files.avatarimage === "undefined" && typeof _req.files.video === "undefined") {
        mysql.query('INSERT INTO ratings (user_id, store_id, rate, comment, createdAt, updatedAt) VALUES ("' + _req.body.userid + '", "' + _req.body.storeid + '", "' + _req.body.rate + '", "' + _req.body.message + '", "' + DateTime() + '", "' + DateTime() + '")', (_err, _rows) => {
            if (!_err) {
                _res.send('1');
            } else {
                throw(_err);
            }
        });
    } else if (typeof _req.files.avatarimage !== "undefined" && typeof _req.files.video === "undefined") {
        const dest = path.join(__dirname, '../public/images/hotelimages/storeimages/');
        const tempPath1 = _req.files.avatarimage[0].path;
        const datetime = new Date().getTime();
        const targetPath1 = dest + datetime + "commentimage.png";
        const url1 = "https://hotelyahaytest.herokuapp.com/images/hotelimages/storeimages/" + datetime + "commentimage.png";
        const imagevideo = JSON.stringify([url1.toString()]);
        fs.rename(tempPath1, targetPath1, _err1 => {
            if (!_err1) {
                mysql.query("INSERT INTO ratings (user_id, store_id, rate, image, comment, createdAt, updatedAt) VALUES ('" + _req.body.userid + "', '" + _req.body.storeid + "', '" + _req.body.rate + "', '" + imagevideo + "', '" + _req.body.message + "', '" + DateTime() + "', '" + DateTime() + "')", (_err3, _rows3) => {
                    if (!_err3) {
                        _res.send('1');
                    } else {
                        throw(_err3);
                    }
                });
            } else {
                throw(_err1);
            }
        });
    } else if (typeof _req.files.avatarimage === "undefined" && typeof _req.files.video !== "undefined") {
        const dest = path.join(__dirname, '../public/images/hotelimages/storeimages/');
        const tempPath2 = _req.files.video[0].path;
        const datetime = new Date().getTime();
        const targetPath2 = dest + datetime + "commentvideo.mp4";
        const url2 = "https://hotelyahaytest.herokuapp.com/images/hotelimages/storeimages/" + datetime + "commentvideo.mp4";
        const imagevideo = JSON.stringify([url2.toString()]);
        fs.rename(tempPath2, targetPath2, _err2 => {
            if (!_err2) {
                mysql.query("INSERT INTO ratings (user_id, store_id, rate, image, comment, createdAt, updatedAt) VALUES ('" + _req.body.userid + "', '" + _req.body.storeid + "', '" + _req.body.rate + "', '" + imagevideo + "', '" + _req.body.message + "', '" + DateTime() + "', '" + DateTime() + "')", (_err3, _rows3) => {
                    if (!_err3) {
                        _res.send('1');
                    } else {
                        throw(_err3);
                    }
                });
            } else {
                throw(_err2);
            }
        });
    } else {
        const dest = path.join(__dirname, '../public/images/hotelimages/storeimages/');
        const tempPath1 = _req.files.avatarimage[0].path;
        const tempPath2 = _req.files.video[0].path;
        const datetime = new Date().getTime();
        const targetPath1 = dest + datetime + "commentimage.png";
        const targetPath2 = dest + datetime + "commentvideo.mp4";
        const url1 = "https://hotelyahaytest.herokuapp.com/images/hotelimages/storeimages/" + datetime + "commentimage.png";
        const url2 = "https://hotelyahaytest.herokuapp.com/images/hotelimages/storeimages/" + datetime + "commentvideo.mp4";
        const imagevideo = JSON.stringify([url2.toString(), url1.toString()]);
        fs.rename(tempPath1, targetPath1, _err1 => {
            if (!_err1) {
                fs.rename(tempPath2, targetPath2, _err2 => {
                    if (!_err2) {
                        mysql.query("INSERT INTO ratings (user_id, store_id, rate, image, comment, createdAt, updatedAt) VALUES ('" + _req.body.userid + "', '" + _req.body.storeid + "', '" + _req.body.rate + "', '" + imagevideo + "', '" + _req.body.message + "', '" + DateTime() + "', '" + DateTime() + "')", (_err3, _rows3) => {
                            if (!_err3) {
                                _res.send('1');
                            } else {
                                throw(_err3);
                            }
                        });
                    } else {
                        throw(_err2);
                    }
                });
            } else {
                throw(_err1);
            }
        });
    }
}

exports.user_remove_review = (_req, _res) => {
    mysql.query('DELETE FROM ratings WHERE id = "' + _req.body.id + '"', (_err, _rows) => {
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}

exports.user_save_profile = (_req, _res) => {
    mysql.query('UPDATE users SET email = "' + _req.body.email + '", firstname = "' + _req.body.firstname + '", lastname = "' + _req.body.lastname + '", mobile = "' + _req.body.mobile + '", updatedAt = "' + DateTime() + '" WHERE id = "' + _req.body.userid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}

exports.user_update_password = (_req, _res) => {
    bcrypt.hash(_req.body.password, 10, (err, hash) => {
        mysql.query('UPDATE users SET password = "' + hash + '", updatedAt = "' + DateTime() + '" WHERE id = "' + _req.body.userid + '"', (_err, _rows) => {
            if (!_err) {
                _res.send('1');
            } else {
                throw(_err);
            }
        });
    });
}

exports.user_change_password = (_req, _res) => {
    bcrypt.hash(_req.body.password, 10, (err, hash) => {
        mysql.query('UPDATE users SET password = "' + hash + '", updatedAt = "' + DateTime() + '" WHERE email = "' + _req.body.email + '"', (_err, _rows) => {
            if (!_err) {
                _res.send('1');
            } else {
                throw(_err);
            }
        });
    });
}

exports.user_decline_reservation = (_req, _res) => {
    mysql.query('UPDATE orders SET status_id = "5" WHERE id = "' + _req.body.orderid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}


