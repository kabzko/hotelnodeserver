const mysql = require('../config/database');
const bcrypt = require('bcrypt');

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
    mysql.query('SELECT id, firstname, lastname, username, email, mobile, password FROM users WHERE email = "' + _req.body.account + '" OR username = "' + _req.body.account + '" OR mobile = "' + _req.body.account + '"', (_err, _rows) => {
        if (!_err) {
            if (_rows.length) {
                bcrypt.compare(_req.body.password, _rows[0].password, (_err, _result) => {
                    if (_result) {
                        _res.send(_rows);
                    } else {
                        _res.send('0');
                    }
                });
            } else {
                _res.send('0');
            }
        } else {
            _res.send(_err);
        }
    });
}

exports.user_home_detail = (_req, _res) => {
    let nearHotel = [];
    let nearResort = [];
    let nearHotelStatus = false;
    let nearResortStatus = false;
    const query0 = 'SELECT id, name, type, latitude, longitude, images FROM stores WHERE type LIKE "%hotel%" AND status_id = 1;';
    const query1 = 'SELECT id, name, type, latitude, longitude, images FROM stores WHERE type LIKE "%resort%" AND status_id = 1';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            if (_rows[0].length != 0) {
                _rows[0].forEach((x, index) => {
                    if (LatLngToKM(_req.body.lat, _req.body.lng, x.latitude, x.longitude) <= 5) {
                        nearHotel.push({
                            'id': x.id,
                            'name': x.name,
                            'images': x.images,
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
                            'images': x.images,
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
                });
            } else {
                _res.json({
                    'hotel': nearHotel,
                    'resort': nearResort,
                });
            }
        } else {
            _res.send(_err);
        }
    });
}

exports.user_store_detail = (_req, _res) => {
    query0 = 'SELECT name, checkin, checkout, images, status_id FROM stores WHERE id = "' + _req.body.storeid + '";';
    query1 = 'SELECT id, name, category, images, store_id FROM products WHERE store_id = "' + _req.body.storeid + '";';
    query2 = 'SELECT id, category as name FROM products WHERE store_id = "' + _req.body.storeid + '" GROUP BY category';
    mysql.query(query0 + query1 + query2, (_err, _rows) => {
        if (!_err) {
            _res.json({
                'store': _rows[0],
                'products': _rows[1],
                'categories': _rows[2],
            });
        } else {
            _res.send(_err);
        }
    });
}

exports.user_product_detail = (_req, _res) => {
    mysql.query('SELECT products.id, products.name, products.facility, products.entry, products.rate, products.rate_type, products.room_availability, products.images, products.store_id, stores.checkin, stores.checkout FROM products INNER JOIN stores ON products.store_id = stores.id WHERE products.id = "' + _req.body.productid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            _res.send(_err);
        }
    });
}

exports.already_booked_room = (_req, _res) => {
    mysql.query('SELECT orders.from_datetime, orders.to_datetime, orders.room, products.room_availability FROM orders INNER JOIN products ON orders.product_id = products.id WHERE orders.status_id = 2 AND orders.product_id = "' + _req.body.productid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            _res.send(_err);
        }
    });
}

exports.user_reserve_room = (_req, _res) => {
    mysql.query('SELECT wallet FROM users WHERE id = "' + + _req.body.userid + '"', (_err, _rows) => {
        if (!_err) {
            if (_rows[0].wallet >= _req.body.downpayment) {
                mysql.query('INSERT INTO orders (user_id, product_id, room, rate, rate_type, discount, from_datetime, to_datetime, checkin, checkout, status_id, createdAt, updatedAt) VALUES ("' + _req.body.userid + '", "' + _req.body.productid + '", "' + _req.body.room + '", "' + _req.body.rate + '", "' + _req.body.ratetype + '", "' + _req.body.discount + '", "' + _req.body.from + '", "' + _req.body.to + '", "' + _req.body.checkin + '", "' + _req.body.checkout + '", 1, "' + DateTime() + '", "' + DateTime() + '")', (_err1, _rows1) => {
                    if (!_err1) {
                        mysql.query('INSERT INTO transactions (user_id, store_id, order_id, name, amount, status_id, createdAt, updatedAt) VALUES ("' + _req.body.userid + '", "' + _req.body.storeid + '", "' + _rows1.insertId + '", "Downpayment", "' + _req.body.downpayment + '", "1", "' + DateTime() + '", "' + DateTime() + '")', (_err2, _rows2) => {
                            if (!_err2) {
                                mysql.query('UPDATE users SET wallet = "' + (_rows[0].wallet - _req.body.downpayment) + '" WHERE id = "' + + _req.body.userid + '"', (_err3, _rows3) => {
                                    if (!_err3) {
                                        _res.send('1');
                                    } else {
                                        _res.send(_err3);
                                    }
                                });
                            } else {
                                _res.send(_err2);
                            }
                        });
                    } else {
                        _res.send(_err1);
                    }
                });
            } else {
                _res.send('0');
            }
        } else {
            _res.send(_err);
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
            _res.send(_err);
        }
    });
}

exports.user_booked_room_detail = (_req, _res) => {
    mysql.query('SELECT orders.id, orders.from_datetime, orders.to_datetime, orders.checkin, orders.checkout, orders.room, orders.status_id, users.firstname, users.lastname, users.email, users.mobile, order_status.name as statusname, stores.name as building, products.name as roomname, products.rate, products.rate_type FROM orders INNER JOIN users ON orders.user_id = users.id INNER JOIN order_status ON orders.status_id = order_status.id INNER JOIN products ON orders.product_id = products.id INNER JOIN stores ON products.store_id = stores.id WHERE orders.id = "' + _req.body.orderid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            _res.send(_err);
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
            _res.send(_err);
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
            _res.send(_err);
        }
    });
}

exports.user_check_username = (_req, _res) => {
    mysql.query('SELECT COUNT(*) as count FROM users WHERE username = "' + _req.body.username + '"', (_err, _rows) => {
        if (!_err) {
            if (_rows[0].count == 0) {
                _res.send('1');
            } else {
                _res.send('0');
            }
        } else {
            _res.send(_err);
        }
    });
}

exports.user_register_account  = (_req, _res) => {
    bcrypt.hash(_req.body.password, 10, (err, hash) => {
        mysql.query('INSERT INTO users (firstname, lastname, wallet, username, email, password, createdAt, updatedAt) VALUES ("' + _req.body.firstname + '", "' + _req.body.lastname + '", "0", "' + _req.body.username + '", "' + _req.body.email + '", "' + hash + '", "' + DateTime() + '", "' + DateTime() + '")', (_err, _rows) => {
            if (!_err) {
                mysql.query('SELECT id, firstname, lastname, username, email, mobile, password FROM users WHERE id = "' + _rows.insertId + '"', (_err1, _rows1) => {
                    if (!_err1) {
                        _res.send(_rows1);
                    } else {
                        _res.send(_err1);
                    }
                });
            } else {
                _res.send(_err);
            }
        });
    });
}

exports.user_cashin_wallet = (_req, _res) => {
    mysql.query('UPDATE users SET wallet = "' + _req.body.amount + '", updatedAt = "' + DateTime() + '" WHERE id = "' +  _req.body.userid + '"', (_err, _rows) => {
        if (!_err) {
            mysql.query('INSERT INTO transactions (user_id, name, amount, status_id, createdAt, updatedAt) VALUES ("' + _req.body.userid + '", "Cash in to wallet", "' + _req.body.added + '", "6","' + DateTime() + '", "' + DateTime() + '")', (_err1, _rows1) => {
                _res.send('1');
            });
        } else {
            _res.send(_err);
        }
    });
}

exports.user_cashout_wallet = (_req, _res) => {
    mysql.query('UPDATE users SET wallet = "' + _req.body.amount + '", updatedAt = "' + DateTime() + '" WHERE id = "' +  _req.body.userid + '"', (_err, _rows) => {
        if (!_err) {
            mysql.query('INSERT INTO transactions (user_id, name, amount, status_id, createdAt, updatedAt) VALUES ("' + _req.body.userid + '", "Cash out to wallet", "' + _req.body.added + '", "7","' + DateTime() + '", "' + DateTime() + '")', (_err1, _rows1) => {
                _res.send('1');
            });
        } else {
            _res.send(_err);
        }
    });
}

exports.user_stores = (_req, _res) => {
    let nearMe = [];
    let nearMeStatus = false;
    mysql.query('SELECT id, name, type, latitude, longitude, images FROM stores WHERE type LIKE "%' + _req.body.bldgtype + '%" AND status_id = 1', (_err, _rows) => {
        if (!_err) {
            if (_rows.length != 0) {
                _rows.forEach((x, index) => {
                    if (LatLngToKM(_req.body.lat, _req.body.lng, x.latitude, x.longitude) <= 5) {
                        nearMe.push({
                            'id': x.id,
                            'name': x.name,
                            'images': x.images,
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
                _res.send(nearMe);
            } else {
                _res.send(nearMe);
            }
        } else {
            _res.send(_err);
        }
    });
}

exports.user_products = (_req, _res) => {
    mysql.query('SELECT id, name, category, images, store_id FROM products WHERE category = "' + _req.body.category + '"', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            _res.send(_err);
        }
    });
}

exports.user_search_store = (_req, _res) => {
    const query0 = 'SELECT id, name, type, images FROM stores WHERE type LIKE "%' + _req.body.type + '%" AND name LIKE "%' + _req.body.search + '%" AND status_id = 1;';
    const query1 = 'SELECT id, name, type, images FROM stores WHERE type LIKE "%' + _req.body.type + '%" AND name NOT LIKE "%' + _req.body.search + '%" AND status_id = 1';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            _res.send(_rows[0].concat(_rows[1]));
        } else {
            _res.send(_err);
        }
    });
}

exports.user_profile = (_req, _res) => {
    mysql.query('SELECT firstname, lastname, email, mobile FROM users WHERE id = "' + _req.body.userid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            _res.send(_err);
        }
    });
}