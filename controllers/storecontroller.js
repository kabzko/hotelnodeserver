const mysql = require('../config/database');
const bcrypt = require('bcrypt');
const fs = require('fs');

function DateTime() {
    return new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2) + ' ' + new Date().toLocaleTimeString('en-US', {hour12: false});
}

exports.store_login = (_req, _res) => {
    mysql.query('SELECT id, password, name, type, address FROM stores WHERE email = "' + _req.body.account + '"', (_err, _rows) => {
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

exports.store_pending_booked_list = (_req, _res) => {
    const query0 = 'SELECT orders.id, orders.from_datetime, orders.to_datetime, orders.room, orders.status_id, orders.checkin, orders.checkout, order_status.name as statusname, stores.name as building, products.name as roomname, products.rate, products.rate_type FROM orders INNER JOIN order_status ON orders.status_id = order_status.id INNER JOIN products ON orders.product_id = products.id INNER JOIN stores ON products.store_id = stores.id WHERE products.store_id = "' + _req.body.storeid + '" AND orders.status_id = "1";';
    const query1 = 'SELECT orders.id, orders.from_datetime, orders.to_datetime, orders.room, orders.status_id, orders.checkin, orders.checkout, order_status.name as statusname, stores.name as building, products.name as roomname, products.rate, products.rate_type FROM orders INNER JOIN order_status ON orders.status_id = order_status.id INNER JOIN products ON orders.product_id = products.id INNER JOIN stores ON products.store_id = stores.id WHERE products.store_id = "' + _req.body.storeid + '" AND orders.status_id = "2"';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            _res.json({
                'new': _rows[0],
                'active': _rows[1],
            })
        } else {
            _res.send(_err);
        }
    });
}

exports.store_booked_room_detail = (_req, _res) => {
    const query0 = 'SELECT orders.id, orders.user_id, orders.from_datetime, orders.to_datetime, orders.room, orders.checkin, orders.checkout, users.firstname, users.lastname, users.email, users.mobile, orders.status_id, order_status.name as statusname, stores.name as building, products.name as roomname, products.rate, products.rate_type FROM orders INNER JOIN users ON orders.user_id = users.id INNER JOIN order_status ON orders.status_id = order_status.id INNER JOIN products ON orders.product_id = products.id INNER JOIN stores ON products.store_id = stores.id WHERE orders.id = "' + _req.body.orderid + '";';
    const query1 = 'SELECT transactions.amount FROM transactions WHERE order_id = "' + _req.body.orderid + '" AND name = "Downpayment";';
    const query2 = 'SELECT * FROM charges WHERE order_id = "' + _req.body.orderid + '"';
    mysql.query(query0 + query1 + query2, (_err, _rows) => {
        if (!_err) {
            _res.json({
                'room': _rows[0],
                'downpayment': _rows[1],
                'charges': _rows[2],
            });
        } else {
            _res.send(_err);
        }
    });
}

exports.store_accept_reservation = (_req, _res) => {
    mysql.query('UPDATE orders SET status_id = "2" WHERE id = "' + _req.body.orderid + '"', (_err, _rows) => {
        if (!_err) {
            mysql.query('SELECT transactions.amount FROM transactions INNER JOIN orders ON transactions.order_id = orders.id WHERE orders.id = "' + _req.body.orderid + '"', (_err1, _rows1) => {
                if (!_err1) {
                    const query0 = 'UPDATE stores SET wallet = "' + _rows1[0].amount + '" WHERE id = "' + _req.body.storeid + '";';
                    const query1 = 'UPDATE transactions SET status_id = "3" WHERE id = "' + _req.body.orderid + '"';
                    mysql.query(query0 + query1, (_err2, _rows2) => {
                        if (!_err2) {
                            _res.send('1');
                        } else {
                            _res.send(_err2);
                        }
                    });
                } else {
                    _res.send(_err1);
                }
            });
        } else {
            _res.send(_err);
        }
    });
}

exports.store_decline_reservation = (_req, _res) => {
    mysql.query('UPDATE orders SET status_id = "4" WHERE id = "' + _req.body.orderid + '"', (_err, _rows) => {
        if (!_err) {
            mysql.query('SELECT transactions.amount FROM transactions INNER JOIN orders ON transactions.order_id = orders.id WHERE orders.id = "' + _req.body.orderid + '"', (_err1, _rows1) => {
                if (!_err) {
                    mysql.query('INSERT INTO transactions (order_id, name, amount, status_id, createdAt, updatedAt) VALUES ("' + _req.body.orderid + '", "Refunded Downpayment", "' + _rows1[0].amount + '", "2", "' + DateTime() + '", "' + DateTime() + '")', (_err2, _rows2) => {
                        if (!_err2) {
                            mysql.query('SELECT users.id, users.wallet FROM orders INNER JOIN users ON orders.user_id = users.id WHERE orders.id = "' + _req.body.orderid + '"', (_err3, _rows3) => {
                                if (!_err3) {
                                    mysql.query('UPDATE users SET wallet = "' + (_rows3[0].wallet + _rows1[0].amount) + '" WHERE id = "' + _rows3[0].id + '"', (_err4, _rows4) => {
                                        if (!_err4) {
                                            _res.send('1');
                                        } else {
                                            _res.send(_err4);
                                        }
                                    });
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
            _res.send(_err);
        }
    });
}

exports.store_booked_list = (_req, _res) => {
    mysql.query('SELECT orders.id, orders.from_datetime, orders.to_datetime, orders.room, orders.status_id, orders.checkin, orders.checkout, order_status.name as statusname, stores.name as building, products.name as roomname, products.rate, products.rate_type FROM orders INNER JOIN order_status ON orders.status_id = order_status.id INNER JOIN products ON orders.product_id = products.id INNER JOIN stores ON products.store_id = stores.id WHERE products.store_id = "' + _req.body.storeid + '" AND (orders.status_id = "3" OR orders.status_id = "4" OR orders.status_id = "5")', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            _res.send(_err);
        }
    });
}

exports.store_wallet = (_req, _res) => {
    const query0 = 'SELECT name, amount, status_id FROM transactions WHERE store_id = "' + _req.body.storeid + '";';
    const query1 = 'SELECT id, wallet FROM stores WHERE id = "' + _req.body.storeid + '"';
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

exports.store_add_extra_charges = (_req, _res) => {
    mysql.query('INSERT INTO charges (order_id, title, amount, createdAt, updatedAt) VALUES ("' + _req.body.orderid + '", "' + _req.body.title + '", "' + _req.body.amount + '", "' + DateTime() + '", "' + DateTime() + '")', (_err, _rows) => {
        if (!_err) {
            _res.send('1');
        } else {
            _res.send(_err);
        }
    });
}

exports.store_product_detail = (_req, _res) => {
    mysql.query('SELECT products.id, products.name, products.facility, products.entry, products.rate, products.rate_type, products.room_availability, products.images, stores.checkin, stores.checkout FROM products INNER JOIN stores ON products.store_id = stores.id WHERE products.id = "' + _req.body.productid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            _res.send(_err);
        }
    });
}

exports.store_detail = (_req, _res) => {
    query0 = 'SELECT name, checkin, checkout, images, status_id FROM stores WHERE id = "' + _req.body.storeid + '";';
    query1 = 'SELECT id, name, category, store_id, images FROM products WHERE store_id = "' + _req.body.storeid + '";';
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

exports.store_update_booked_room = (_req, _res) => {
    mysql.query('UPDATE orders SET product_id = "' + _req.body.productid + '", room = "' + _req.body.room + '" WHERE id = "' + _req.body.orderid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send('1');
        } else {
            _res.send(_err);
        }
    });
}

exports.store_pay_thru_wallet = (_req, _res) => {
    const query0 = 'SELECT wallet FROM users WHERE id = "' + _req.body.userid + '";';
    const query1 = 'SELECT wallet FROM stores WHERE id = "' + _req.body.storeid + '"';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            if (_rows[0][0].wallet >= _req.body.balance) {
                const query2 = 'INSERT INTO transactions (order_id, name, amount, status_id, createdAt, updatedAt) VALUES ("' + _req.body.orderid + '", "Pay thru wallet payment", "' + _req.body.balance + '", "3", "' + DateTime() + '", "' + DateTime() + '");';
                const query3 = 'UPDATE users SET wallet = "' + (_rows[0][0].wallet - _req.body.balance) + '" WHERE id = "' + _req.body.userid + '";';
                const query4 = 'UPDATE orders SET status_id = "3" WHERE id = "' + _req.body.orderid + '";';
                const query5 = 'UPDATE stores SET wallet = "' + (_rows[1][0].wallet + _req.body.balance) + '" WHERE id = "' + _req.body.storeid + '"';
                mysql.query(query2 + query3 + query4 + query5, (_err1, _rows1) => {
                    if (!_err1) {
                        _res.send('1');
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

exports.store_check_email = (_req, _res) => {
    mysql.query('SELECT COUNT(*) as count FROM stores WHERE email = "' + _req.body.email + '"', (_err, _rows) => {
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

exports.store_check_username = (_req, _res) => {
    mysql.query('SELECT COUNT(*) as count FROM stores WHERE username = "' + _req.body.username + '"', (_err, _rows) => {
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

exports.store_register = (_req, _res) => {
    bcrypt.hash(_req.body.password, 10, (err, hash) => {
        mysql.query('INSERT INTO stores (email, password, name, wallet, type, checkin, checkout, address, latitude, longitude, status_id, createdAt, updatedAt) VALUES ("' + _req.body.email + '", "' + hash + '", "' + _req.body.name + '", "0", "' + _req.body.category + '", "' + _req.body.checkin + '", "' + _req.body.checkout + '", "' + _req.body.address + '", "' + _req.body.latitude + '", "' + _req.body.longitude + '", "2", "' + DateTime() + '", "' + DateTime() + '")', (_err, _rows) => {
            if (!_err) {
                mysql.query('SELECT id, password, name, type, address FROM stores WHERE id = "' + _rows.insertId + '"', (_err1, _rows1) => {
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

exports.store_product_category = (_req, _res) => {
    mysql.query('SELECT category FROM products WHERE store_id = "' + _req.body.storeid + '" GROUP BY category', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            _res.send(_err);
        }
    });
}

exports.store_save_product = (_req, _res) => {
    const dest = 'C:/xampp/htdocs/hotelimages/productimages/';
    const tempPath = _req.file.path;
    const targetPath = dest + new Date().getTime() + ".png";
    const url = "http://localhost/hotelimages/productimages/" + new Date().getTime() + ".png";
    fs.rename(tempPath, targetPath, _err => {
        if (!_err) {
            mysql.query('INSERT INTO products (store_id, category, name, facility, entry, rate, rate_type, room_availability, images, discount, createdAt, updatedAt) VALUES ("' + _req.body.storeid + '", "' + _req.body.category + '", "' + _req.body.name + '", "' + _req.body.facility + '", "' + _req.body.entry + '", "' + _req.body.rate + '", "' + _req.body.ratetype + '", "' + _req.body.room + '", "' + url + '", "0", "' + DateTime() + '", "' + DateTime() + '")', (_err, _rows) => {
                if (!_err) {
                    _res.send('1');
                } else {
                    _res.send(_err);
                }
            });
        } else {
            _res.send(_err);
        }
    });
}

exports.store_product_update_detail = (_req, _res) => {
    const query0 = 'SELECT id, category, name, facility, entry, rate, rate_type, room_availability, images FROM products WHERE id = "' + _req.body.productid + '";'
    const query1 = 'SELECT category FROM products WHERE store_id = "' + _req.body.storeid + '" GROUP BY category';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            _res.json({
                'product': _rows[0],
                'category': _rows[1],
            });
        } else {
            _res.send(_err);
        }
    });
}

exports.store_update_status = (_req, _res) => {
    mysql.query('SELECT COUNT(*) as count FROM products WHERE store_id = "' + _req.body.storeid + '"', (_err, _rows) => {
        if (!_err) {
            if (_rows[0].count != 0) {
                mysql.query('UPDATE stores SET status_id = "' + _req.body.status + '" WHERE id = "' + _req.body.storeid + '"', (_err1, _rows1) => {
                    if (!_err1) {
                        _res.send('1');
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

exports.store_status = (_req, _res) => {
    const query0 = 'SELECT COUNT(*) as count FROM products WHERE store_id = "' + _req.body.storeid + '";';
    const query1 = 'SELECT status_id FROM stores WHERE id = "' + _req.body.storeid + '"';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            _res.json({
                'product': _rows[0][0].count,
                'status': _rows[1][0].status_id,
            })
        } else {
            _res.send(_err);
        }
    })
}

exports.store_upload_carousel = (_req, _res) => {
    const dest = 'C:/xampp/htdocs/hotelimages/storeimages/';
    const tempPath = _req.file.path;
    const targetPath = dest + new Date().getTime() + ".png";
    const url = "http://localhost/hotelimages/storeimages/" + new Date().getTime() + ".png";
    fs.rename(tempPath, targetPath, _err => {
        if (!_err) {
            mysql.query('UPDATE stores SET images = "' + url + '", updatedAt = "' + DateTime() +'" WHERE id = "' + _req.body.storeid + '"', (_err1, _rows1) => {
                if (!_err1) {
                    _res.send('1');
                } else {
                    _res.send(_err1);
                }
            });
        } else {
            _res.send(_err);
        }
    });
}

exports.store_cashout_wallet = (_req, _res) => {
    mysql.query('UPDATE stores SET wallet = "' + _req.body.amount + '", updatedAt = "' + DateTime() + '" WHERE id = "' +  _req.body.storeid + '"', (_err, _rows) => {
        if (!_err) {
            mysql.query('INSERT INTO transactions (store_id, name, amount, status_id, createdAt, updatedAt) VALUES ("' + _req.body.storeid + '", "Cash out to wallet", "' + _req.body.added + '", "7","' + DateTime() + '", "' + DateTime() + '")', (_err1, _rows1) => {
                _res.send('1');
            });
        } else {
            _res.send(_err);
        }
    });
}