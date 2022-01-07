const mysql = require('../config/database');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { Console } = require('console');

function DateTime() {
    return new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2) + ' ' + new Date().toLocaleTimeString('en-US', {hour12: false});
}

exports.store_login = (_req, _res) => {
    mysql.query('SELECT id, password, name, type, address FROM stores WHERE email = "' + _req.body.email + '"', (_err, _rows) => {
        if (!_err) {
            if (_rows.length) {
                bcrypt.compare(_req.body.password, _rows[0].password, (_err, _result) => {
                    if (_result) {
                        _res.json({
                            'id': _rows[0].id,
                            'name': _rows[0].name,
                            'address': _rows[0].address,
                            'type': _rows[0].type
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
            throw(_err);
        }
    });
}

exports.store_booked_room_detail = (_req, _res) => {
    const query0 = 'SELECT orders.id, orders.user_id, orders.proof_of_payment, orders.downpayment, orders.from_datetime, orders.to_datetime, orders.room, orders.checkin, orders.checkout, users.firstname, users.lastname, users.email, users.mobile, orders.status_id, order_status.name as statusname, stores.name as building, products.name as roomname, products.rate, products.rate_type FROM orders INNER JOIN users ON orders.user_id = users.id INNER JOIN order_status ON orders.status_id = order_status.id INNER JOIN products ON orders.product_id = products.id INNER JOIN stores ON products.store_id = stores.id WHERE orders.id = "' + _req.body.orderid + '";';
    const query1 = 'SELECT * FROM charges WHERE order_id = "' + _req.body.orderid + '"';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            _res.json({
                'room': _rows[0],
                'charges': _rows[1],
            });
        } else {
            throw(_err);
        }
    });
}

exports.store_accept_reservation = (_req, _res) => {
    mysql.query('UPDATE orders SET status_id = "2" WHERE id = "' + _req.body.orderid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}

exports.store_decline_reservation = (_req, _res) => {
    mysql.query('UPDATE orders SET status_id = "4", reasons = "' + _req.body.reasons + '" WHERE id = "' + _req.body.orderid + '"', (_err1, _rows1) => {
        if (!_err1) {
            _res.send('1');
        } else {
            throw(_err1);
        }
    });
}

exports.store_booked_list = (_req, _res) => {
    mysql.query('SELECT orders.id, orders.from_datetime, orders.to_datetime, orders.room, orders.status_id, orders.checkin, orders.checkout, order_status.name as statusname, stores.name as building, products.name as roomname, products.rate, products.rate_type FROM orders INNER JOIN order_status ON orders.status_id = order_status.id INNER JOIN products ON orders.product_id = products.id INNER JOIN stores ON products.store_id = stores.id WHERE products.store_id = "' + _req.body.storeid + '" AND (orders.status_id = "3" OR orders.status_id = "4" OR orders.status_id = "5") ORDER BY orders.createdAt desc', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            throw(_err);
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
            throw(_err);
        }
    });
}

exports.store_add_extra_charges = (_req, _res) => {
    mysql.query('INSERT INTO charges (order_id, title, amount, createdAt, updatedAt) VALUES ("' + _req.body.orderid + '", "' + _req.body.title + '", "' + _req.body.amount + '", "' + DateTime() + '", "' + DateTime() + '")', (_err, _rows) => {
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}

exports.store_product_detail = (_req, _res) => {
    mysql.query('SELECT products.id, products.name, products.facility, products.entry, products.rate, products.rate_type, products.room_availability, products.images, products.images2, products.images3, stores.checkin, stores.checkout FROM products INNER JOIN stores ON products.store_id = stores.id WHERE products.id = "' + _req.body.productid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            throw(_err);
        }
    });
}

exports.store_detail = (_req, _res) => {
    query0 = 'SELECT name, email, mobile, checkin, checkout, avatar, address, latitude, longitude, type, status_id FROM stores WHERE id = "' + _req.body.storeid + '";';
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
            throw(_err);
        }
    });
}

exports.store_update_booked_room = (_req, _res) => {
    mysql.query('UPDATE orders SET product_id = "' + _req.body.productid + '", room = "' + _req.body.room + '" WHERE id = "' + _req.body.orderid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}

exports.store_pay_thru_wallet = (_req, _res) => {
    const query0 = 'SELECT wallet FROM users WHERE id = "' + _req.body.userid + '";';
    const query1 = 'SELECT wallet FROM stores WHERE id = "' + _req.body.storeid + '"';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            if (_rows[0][0].wallet >= _req.body.balance) {
                const query2 = 'INSERT INTO transactions (user_id, store_id, order_id, name, amount, status_id, createdAt, updatedAt) VALUES ("' + _req.body.userid + '", "' + _req.body.storeid + '", "' + _req.body.orderid + '", "Pay thru wallet payment", "' + _req.body.balance + '", "3", "' + DateTime() + '", "' + DateTime() + '");';
                const query3 = 'UPDATE users SET wallet = "' + (_rows[0][0].wallet - _req.body.balance) + '" WHERE id = "' + _req.body.userid + '";';
                const query4 = 'UPDATE orders SET status_id = "3" WHERE id = "' + _req.body.orderid + '";';
                const query5 = 'UPDATE stores SET wallet = "' + (_rows[1][0].wallet + _req.body.balance) + '" WHERE id = "' + _req.body.storeid + '"';
                mysql.query(query2 + query3 + query4 + query5, (_err1, _rows1) => {
                    if (!_err1) {
                        _res.send('1');
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

exports.store_check_email = (_req, _res) => {
    mysql.query('SELECT COUNT(*) as count FROM stores WHERE email = "' + _req.body.email + '"', (_err, _rows) => {
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

exports.store_register = (_req, _res) => {
    bcrypt.hash(_req.body.password, 10, (err, hash) => {
        mysql.query('INSERT INTO stores (email, password, mobile, name, type, checkin, checkout, address, latitude, longitude, status_id, createdAt, updatedAt) VALUES ("' + _req.body.email + '", "' + hash + '", "' + _req.body.mobile + '", "' + _req.body.name + '", "' + _req.body.type + '", "' + _req.body.checkin + '", "' + _req.body.checkout + '", "' + _req.body.address + '", "' + _req.body.latitude + '", "' + _req.body.longitude + '", "1", "' + DateTime() + '", "' + DateTime() + '")', (_err, _rows) => {
            if (!_err) {
                mysql.query('SELECT id, password, name, type, address FROM stores WHERE id = "' + _rows.insertId + '"', (_err1, _rows1) => {
                    if (!_err1) {
                        _res.json({
                            'id': _rows1[0].id,
                            'name': _rows1[0].name,
                            'address': _rows1[0].address,
                            'type': _rows1[0].type
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

exports.store_product_category = (_req, _res) => {
    mysql.query('SELECT category FROM products WHERE store_id = "' + _req.body.storeid + '" GROUP BY category', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            throw(_err);
        }
    });
}

exports.store_save_product = (_req, _res) => {
    if (typeof _req.files.productimage2 === "undefined" && typeof _req.files.productimage3 === "undefined") {
        const dest = 'C:/xampp/htdocs/hotelimages/storeimages/';
        const tempPath1 = _req.files.productimage[0].path;
        const datetime = new Date().getTime();
        const targetPath1 = dest + datetime + "first.png";
        const url1 = "http://localhost/hotelimages/storeimages/" + datetime + "first.png";
        fs.rename(tempPath1, targetPath1, _err1 => {
            if (!_err1) {
                mysql.query('INSERT INTO products (store_id, category, name, facility, entry, rate, rate_type, room_availability, images, discount, createdAt, updatedAt) VALUES ("' + _req.body.storeid + '", "' + _req.body.category + '", "' + _req.body.name + '", "' + _req.body.facility + '", "' + _req.body.entry + '", "' + _req.body.rate + '", "' + _req.body.ratetype + '", "' + _req.body.room + '", "' + url1 + '", "0", "' + DateTime() + '", "' + DateTime() + '")', (_err, _rows) => {
                    if (!_err) {
                        _res.send('1');
                    } else {
                        throw(_err);
                    }
                });
            } else {
                throw(_err1);
            }
        });
    } else if (typeof _req.files.productimage2 !== "undefined" && typeof _req.files.productimage3 === "undefined") {
        const dest = 'C:/xampp/htdocs/hotelimages/storeimages/';
        const tempPath1 = _req.files.productimage[0].path;
        const tempPath2 = _req.files.productimage2[0].path;
        const datetime = new Date().getTime();
        const targetPath1 = dest + datetime + "first.png";
        const targetPath2 = dest + datetime + "second.png";
        const url1 = "http://localhost/hotelimages/storeimages/" + datetime + "first.png";
        const url2 = "http://localhost/hotelimages/storeimages/" + datetime + "second.png";
        fs.rename(tempPath1, targetPath1, _err1 => {
            if (!_err1) {
                fs.rename(tempPath2, targetPath2, _err2 => {
                    if (!_err2) {
                        mysql.query('INSERT INTO products (store_id, category, name, facility, entry, rate, rate_type, room_availability, images, images2, discount, createdAt, updatedAt) VALUES ("' + _req.body.storeid + '", "' + _req.body.category + '", "' + _req.body.name + '", "' + _req.body.facility + '", "' + _req.body.entry + '", "' + _req.body.rate + '", "' + _req.body.ratetype + '", "' + _req.body.room + '", "' + url1 + '", "' + url2 + '", "0", "' + DateTime() + '", "' + DateTime() + '")', (_err, _rows) => {
                            if (!_err) {
                                _res.send('1');
                            } else {
                                throw(_err);
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
    } else if (typeof _req.files.productimage2 === "undefined" && typeof _req.files.productimage3 !== "undefined") {
        const dest = 'C:/xampp/htdocs/hotelimages/storeimages/';
        const tempPath1 = _req.files.productimage[0].path;
        const tempPath3 = _req.files.productimage3[0].path;
        const datetime = new Date().getTime();
        const targetPath1 = dest + datetime + "first.png";
        const targetPath3 = dest + datetime + "third.png";
        const url1 = "http://localhost/hotelimages/storeimages/" + datetime + "first.png";
        const url3 = "http://localhost/hotelimages/storeimages/" + datetime + "third.png";
        fs.rename(tempPath1, targetPath1, _err1 => {
            if (!_err1) {
                fs.rename(tempPath3, targetPath3, _err3 => {
                    if (!_err3) {
                        mysql.query('INSERT INTO products (store_id, category, name, facility, entry, rate, rate_type, room_availability, images, images3, discount, createdAt, updatedAt) VALUES ("' + _req.body.storeid + '", "' + _req.body.category + '", "' + _req.body.name + '", "' + _req.body.facility + '", "' + _req.body.entry + '", "' + _req.body.rate + '", "' + _req.body.ratetype + '", "' + _req.body.room + '", "' + url1 + '", "' + url3 + '", "0", "' + DateTime() + '", "' + DateTime() + '")', (_err, _rows) => {
                            if (!_err) {
                                _res.send('1');
                            } else {
                                throw(_err);
                            }
                        });
                    } else {
                        throw(_err3);
                    }
                });
            } else {
                throw(_err1);
            }
        });
    } else {
        const dest = 'C:/xampp/htdocs/hotelimages/storeimages/';
        const tempPath1 = _req.files.productimage[0].path;
        const tempPath2 = _req.files.productimage2[0].path;
        const tempPath3 = _req.files.productimage3[0].path;
        const datetime = new Date().getTime();
        const targetPath1 = dest + datetime + "first.png";
        const targetPath2 = dest + datetime + "second.png";
        const targetPath3 = dest + datetime + "third.png";
        const url1 = "http://localhost/hotelimages/storeimages/" + datetime + "first.png";
        const url2 = "http://localhost/hotelimages/storeimages/" + datetime + "second.png";
        const url3 = "http://localhost/hotelimages/storeimages/" + datetime + "third.png";
        fs.rename(tempPath1, targetPath1, _err1 => {
            if (!_err1) {
                fs.rename(tempPath2, targetPath2, _err2 => {
                    if (!_err2) {
                        fs.rename(tempPath3, targetPath3, _err3 => {
                            if (!_err3) {
                                mysql.query('INSERT INTO products (store_id, category, name, facility, entry, rate, rate_type, room_availability, images, images2, images3, discount, createdAt, updatedAt) VALUES ("' + _req.body.storeid + '", "' + _req.body.category + '", "' + _req.body.name + '", "' + _req.body.facility + '", "' + _req.body.entry + '", "' + _req.body.rate + '", "' + _req.body.ratetype + '", "' + _req.body.room + '", "' + url1 + '", "' + url2 + '", "' + url3 + '", "0", "' + DateTime() + '", "' + DateTime() + '")', (_err, _rows) => {
                                    if (!_err) {
                                        _res.send('1');
                                    } else {
                                        throw(_err);
                                    }
                                });
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

exports.store_product_update_detail = (_req, _res) => {
    const query0 = 'SELECT id, category, name, facility, entry, rate, rate_type, room_availability, images, images2, images3 FROM products WHERE id = "' + _req.body.productid + '";'
    const query1 = 'SELECT category FROM products WHERE store_id = "' + _req.body.storeid + '" GROUP BY category';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            _res.json({
                'product': _rows[0],
                'category': _rows[1],
            });
        } else {
            throw(_err);
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

exports.store_status = (_req, _res) => {
    const query0 = 'SELECT COUNT(*) as count FROM products WHERE store_id = "' + _req.body.storeid + '";';
    const query1 = 'SELECT status_id, avatar FROM stores WHERE id = "' + _req.body.storeid + '"';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            _res.json({
                'product': _rows[0][0].count,
                'status': _rows[1][0],
            })
        } else {
            throw(_err);
        }
    })
}

exports.store_update_profile = (_req, _res) => {
    if (typeof _req.file === "undefined") {
        mysql.query('UPDATE stores SET email = "' + _req.body.email + '", mobile = "' + _req.body.mobile + '", name = "' + _req.body.name + '", type = "' + _req.body.type + '", checkin = "' + _req.body.checkin + '", checkout = "' + _req.body.checkout + '", address = "' + _req.body.address + '", latitude = "' + _req.body.latitude + '", longitude = "' + _req.body.longitude + '", updatedAt = "' + DateTime() +'" WHERE id = "' + _req.body.storeid + '"', (_err1, _rows1) => {
            if (!_err1) {
                _res.send('1');
            } else {
                throw(_err1);
            }
        });
    } else {
        const dest = 'C:/xampp/htdocs/hotelimages/storeimages/';
        const tempPath = _req.file.path;
        const datetime = new Date().getTime();
        const targetPath = dest + datetime + ".png";
        const url = "http://localhost/hotelimages/storeimages/" + datetime + ".png";
        fs.rename(tempPath, targetPath, _err => {
            if (!_err) {
                mysql.query('UPDATE stores SET mobile = "' + _req.body.mobile + '", name = "' + _req.body.name + '", type = "' + _req.body.type + '", checkin = "' + _req.body.checkin + '", checkout = "' + _req.body.checkout + '", address = "' + _req.body.address + '", latitude = "' + _req.body.latitude + '", longitude = "' + _req.body.longitude + '", avatar = "' + url + '", updatedAt = "' + DateTime() +'" WHERE id = "' + _req.body.storeid + '"', (_err1, _rows1) => {
                    if (!_err1) {
                        _res.send('1');
                    } else {
                        throw(_err1);
                    }
                });
            } else {
                throw(_err);
            }
        });
    }
}

exports.store_update_product = (_req, _res) => {
    const dest = 'C:/xampp/htdocs/hotelimages/storeimages/';
    const tempPath1 = typeof _req.files.updateimage === "undefined" ? "" : _req.files.updateimage[0].path;
    const tempPath2 = typeof _req.files.updateimage2 === "undefined" ? "" : _req.files.updateimage2[0].path;
    const tempPath3 = typeof _req.files.updateimage3 === "undefined" ? "" : _req.files.updateimage3[0].path;
    const datetime = new Date().getTime();
    const targetPath1 = typeof _req.files.updateimage === "undefined" ? "" : (dest + datetime + "first.png");
    const targetPath2 = typeof _req.files.updateimage2 === "undefined" ? "" : (dest + datetime + "second.png");
    const targetPath3 = typeof _req.files.updateimage3 === "undefined" ? "" : (dest + datetime + "third.png");
    const url1 = typeof _req.files.updateimage === "undefined" ? "" : ("http://localhost/hotelimages/storeimages/" + datetime + "first.png");
    const url2 = typeof _req.files.updateimage2 === "undefined" ? "" : ("http://localhost/hotelimages/storeimages/" + datetime + "second.png");
    const url3 = typeof _req.files.updateimage3 === "undefined" ? "" : ("http://localhost/hotelimages/storeimages/" + datetime + "third.png");
    if (typeof _req.files.updateimage === "undefined" && typeof _req.files.updateimage2 === "undefined" && typeof _req.files.updateimage3 === "undefined") {
        mysql.query('UPDATE products SET category = "' + _req.body.category + '", name = "' + _req.body.name + '", facility = "' + _req.body.facility + '", entry = "' + _req.body.entry + '", rate = "' + _req.body.rate + '", rate_type = "' + _req.body.ratetype + '", room_availability = "' + _req.body.room + '", updatedAt = "' + DateTime() +'" WHERE id = "' + _req.body.productid + '"', (_err, _rows) => {
            if (!_err) {
                _res.send('1');
            } else {
                throw(_err);
            }
        });
    } else if (typeof _req.files.updateimage !== "undefined" && typeof _req.files.updateimage2 === "undefined" && typeof _req.files.updateimage3 === "undefined") {
        fs.rename(tempPath1, targetPath1, _err1 => {
            if (!_err1) {
                mysql.query('UPDATE products SET category = "' + _req.body.category + '", name = "' + _req.body.name + '", facility = "' + _req.body.facility + '", entry = "' + _req.body.entry + '", rate = "' + _req.body.rate + '", rate_type = "' + _req.body.ratetype + '", room_availability = "' + _req.body.room + '", images = "' + url1 + '", updatedAt = "' + DateTime() +'" WHERE id = "' + _req.body.productid + '"', (_err, _rows) => {
                    if (!_err) {
                        _res.send('1');
                    } else {
                        throw(_err);
                    }
                });
            } else {
                throw(_err1);
            }
        });
    } else if (typeof _req.files.updateimage !== "undefined" && typeof _req.files.updateimage2 !== "undefined" && typeof _req.files.updateimage3 === "undefined") {
        fs.rename(tempPath1, targetPath1, _err1 => {
            if (!_err1) {
                fs.rename(tempPath2, targetPath2, _err2 => {
                    if (!_err2) {
                        mysql.query('UPDATE products SET category = "' + _req.body.category + '", name = "' + _req.body.name + '", facility = "' + _req.body.facility + '", entry = "' + _req.body.entry + '", rate = "' + _req.body.rate + '", rate_type = "' + _req.body.ratetype + '", room_availability = "' + _req.body.room + '", images = "' + url1 + '", images2 = "' + url2 + '", updatedAt = "' + DateTime() +'" WHERE id = "' + _req.body.productid + '"', (_err, _rows) => {
                            if (!_err) {
                                _res.send('1');
                            } else {
                                throw(_err);
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
    } else if (typeof _req.files.updateimage !== "undefined" && typeof _req.files.updateimage2 === "undefined" && typeof _req.files.updateimage3 !== "undefined") {
        fs.rename(tempPath1, targetPath1, _err1 => {
            if (!_err1) {
                fs.rename(tempPath3, targetPath3, _err3 => {
                    if (!_err3) {
                        mysql.query('UPDATE products SET category = "' + _req.body.category + '", name = "' + _req.body.name + '", facility = "' + _req.body.facility + '", entry = "' + _req.body.entry + '", rate = "' + _req.body.rate + '", rate_type = "' + _req.body.ratetype + '", room_availability = "' + _req.body.room + '", images = "' + url1 + '", images3 = "' + url3 + '", updatedAt = "' + DateTime() +'" WHERE id = "' + _req.body.productid + '"', (_err, _rows) => {
                            if (!_err) {
                                _res.send('1');
                            } else {
                                throw(_err);
                            }
                        });
                    } else {
                        throw(_err3);
                    }
                });
            } else {
                throw(_err1);
            }
        });
    } else if (typeof _req.files.updateimage == "undefined" && typeof _req.files.updateimage2 !== "undefined" && typeof _req.files.updateimage3 === "undefined") {
        fs.rename(tempPath2, targetPath2, _err2 => {
            if (!_err2) {
                mysql.query('UPDATE products SET category = "' + _req.body.category + '", name = "' + _req.body.name + '", facility = "' + _req.body.facility + '", entry = "' + _req.body.entry + '", rate = "' + _req.body.rate + '", rate_type = "' + _req.body.ratetype + '", room_availability = "' + _req.body.room + '", images2 = "' + url2 + '", updatedAt = "' + DateTime() +'" WHERE id = "' + _req.body.productid + '"', (_err, _rows) => {
                    if (!_err) {
                        _res.send('1');
                    } else {
                        throw(_err);
                    }
                });
            } else {
                throw(_err2);
            }
        });
    } else if (typeof _req.files.updateimage == "undefined" && typeof _req.files.updateimage2 !== "undefined" && typeof _req.files.updateimage3 !== "undefined") {
        fs.rename(tempPath2, targetPath2, _err2 => {
            if (!_err2) {
                fs.rename(tempPath3, targetPath3, _err3 => {
                    if (!_err3) {
                        mysql.query('UPDATE products SET category = "' + _req.body.category + '", name = "' + _req.body.name + '", facility = "' + _req.body.facility + '", entry = "' + _req.body.entry + '", rate = "' + _req.body.rate + '", rate_type = "' + _req.body.ratetype + '", room_availability = "' + _req.body.room + '", images2 = "' + url2 + '", images3 = "' + url3 + '", updatedAt = "' + DateTime() +'" WHERE id = "' + _req.body.productid + '"', (_err, _rows) => {
                            if (!_err) {
                                _res.send('1');
                            } else {
                                throw(_err);
                            }
                        });
                    } else {
                        throw(_err3);
                    }
                });
            } else {
                throw(_err2);
            }
        });
    } else if (typeof _req.files.updateimage == "undefined" && typeof _req.files.updateimage2 == "undefined" && typeof _req.files.updateimage3 !== "undefined") {
        fs.rename(tempPath3, targetPath3, _err3 => {
            if (!_err3) {
                mysql.query('UPDATE products SET category = "' + _req.body.category + '", name = "' + _req.body.name + '", facility = "' + _req.body.facility + '", entry = "' + _req.body.entry + '", rate = "' + _req.body.rate + '", rate_type = "' + _req.body.ratetype + '", room_availability = "' + _req.body.room + '", images3 = "' + url3 + '", updatedAt = "' + DateTime() +'" WHERE id = "' + _req.body.productid + '"', (_err, _rows) => {
                    if (!_err) {
                        _res.send('1');
                    } else {
                        throw(_err);
                    }
                });
            } else {
                throw(_err3);
            }
        });
    } else {
        fs.rename(tempPath1, targetPath1, _err1 => {
            if (!_err1) {
                fs.rename(tempPath2, targetPath2, _err2 => {
                    if (!_err2) {
                        fs.rename(tempPath3, targetPath3, _err3 => {
                            if (!_err3) {
                                mysql.query('UPDATE products SET category = "' + _req.body.category + '", name = "' + _req.body.name + '", facility = "' + _req.body.tags + '", entry = "' + _req.body.entry + '", rate = "' + _req.body.rate + '", rate_type = "' + _req.body.ratetype + '", room_availability = "' + _req.body.room + '", images = "' + url1 + '", images2 = "' + url2 + '", images3 = "' + url3 + '", updatedAt = "' + DateTime() +'" WHERE id = "' + _req.body.productid + '"', (_err, _rows) => {
                                    if (!_err) {
                                        _res.send('1');
                                    } else {
                                        throw(_err);
                                    }
                                });
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

exports.store_cashout_wallet = (_req, _res) => {
    mysql.query('UPDATE stores SET wallet = "' + _req.body.amount + '", updatedAt = "' + DateTime() + '" WHERE id = "' +  _req.body.storeid + '"', (_err, _rows) => {
        if (!_err) {
            mysql.query('INSERT INTO transactions (store_id, name, amount, status_id, createdAt, updatedAt) VALUES ("' + _req.body.storeid + '", "Cash out to wallet", "' + _req.body.added + '", "7","' + DateTime() + '", "' + DateTime() + '")', (_err1, _rows1) => {
                if (!_err1) {
                    _res.send('1');
                } else {
                    throw(_err1);
                }
            });
        } else {
            throw(_err);
        }
    });
}

exports.store_rate_reviews = (_req, _res) => {
    query0 = 'SELECT ratings.id, ratings.user_id, CONCAT(users.firstname, " ", users.lastname) as name, ratings.rate, ratings.comment, ratings.image, ratings.reply, ratings.createdAt FROM ratings INNER JOIN users ON ratings.user_id = users.id WHERE ratings.store_id = "' + _req.body.storeid + '" ORDER BY ratings.createdAt DESC;';
    query1 = 'SELECT id, name, rate, comment, image, reply, ratings.createdAt FROM ratings WHERE store_id = "' + _req.body.storeid + '" AND user_id IS NULL ORDER BY createdAt DESC';
    mysql.query(query0 + query1, (_err, _rows) => {
        if (!_err) {
            _res.json(_rows[0].concat(_rows[1]));
        } else {
            throw(_err);
        }
    });
}

exports.store_remove_extra = (_req, _res) => {
    mysql.query('DELETE FROM charges WHERE id = "' + _req.body.chargeid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}

exports.store_pay_thru_cashier = (_req, _res) => {
    mysql.query('UPDATE orders SET status_id = "3" WHERE id = "' + _req.body.orderid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}

exports.store_update_password = (_req, _res) => {
    bcrypt.hash(_req.body.password, 10, (err, hash) => {
        mysql.query('UPDATE stores SET password = "' + hash + '", updatedAt = "' + DateTime() + '" WHERE id = "' + _req.body.storeid + '"', (_err, _rows) => {
            if (!_err) {
                _res.send('1');
            } else {
                throw(_err);
            }
        });
    });
}

exports.store_change_password = (_req, _res) => {
    bcrypt.hash(_req.body.password, 10, (err, hash) => {
        mysql.query('UPDATE stores SET password = "' + hash + '", updatedAt = "' + DateTime() + '" WHERE email = "' + _req.body.email + '"', (_err, _rows) => {
            if (!_err) {
                _res.send('1');
            } else {
                throw(_err);
            }
        });
    });
}

exports.store_reply_ratings = (_req, _res) => {
    mysql.query('UPDATE ratings SET reply = "' + _req.body.replytext + '", updatedAt = "' + DateTime() + '" WHERE id = "' + _req.body.rateid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}

exports.store_verify_now = (_req, _res) => {
    const dest = 'C:/xampp/htdocs/hotelimages/verification/';
    const tempPath1 = _req.files.govidimage[0].path;
    const tempPath2 = _req.files.businessimage[0].path;
    const datetime = new Date().getTime();
    const targetPath1 = dest + datetime + "typeone.png";
    const targetPath2 = dest + datetime + "typetwo.png";
    const url1 = "http://localhost/hotelimages/verification/" + datetime + "typeone.png";
    const url2 = "http://localhost/hotelimages/verification/" + datetime + "typetwo.png";
    fs.rename(tempPath1, targetPath1, _err1 => {
        if (!_err1) {
            fs.rename(tempPath2, targetPath2, _err2 => {
                if (!_err2) {
                    mysql.query('INSERT INTO verifications (store_id, verification_type_one, verification_type_one_image, verification_type_two, verification_type_two_image, reasons, createdAt, updatedAt) VALUES ("' + _req.body.storeid + '", "' + _req.body.type + '", "' + url1 + '", "' + _req.body.businesspermit + '", "' + url2 + '", "", "' + DateTime() + '", "' + DateTime() + '")', (_err3, _rows3) => {
                        if (!_err3) {
                            mysql.query('UPDATE stores SET status_id = "2", updatedAt = "' + DateTime() + '" WHERE id = "' + _req.body.storeid + '"', (_err4, _rows4) => {
                                if (!_err4) {
                                    _res.send('1');
                                } else {
                                    throw(_err4);
                                }
                            });
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

exports.store_verify_update = (_req, _res) => {
    const dest = 'C:/xampp/htdocs/hotelimages/verification/';
    const tempPath1 = _req.files.updategovidimage[0].path;
    const tempPath2 = _req.files.updatebusinessimage[0].path;
    const datetime = new Date().getTime();
    const targetPath1 = dest + datetime + "typeone.png";
    const targetPath2 = dest + datetime + "typetwo.png";
    const url1 = "http://localhost/hotelimages/verification/" + datetime + "typeone.png";
    const url2 = "http://localhost/hotelimages/verification/" + datetime + "typetwo.png";
    fs.rename(tempPath1, targetPath1, _err1 => {
        if (!_err1) {
            fs.rename(tempPath2, targetPath2, _err2 => {
                if (!_err2) {
                    mysql.query('UPDATE verifications SET verification_type_one = "' + _req.body.type + '", verification_type_one_image = "' + url1 + '", verification_type_two = "' + _req.body.businesspermit + '", verification_type_two_image = "' + url2 + '", reasons = "" WHERE store_id = "' + _req.body.storeid + '"', (_err3, _rows3) => {
                        if (!_err3) {
                            mysql.query('UPDATE stores SET status_id = "2", updatedAt = "' + DateTime() + '" WHERE id = "' + _req.body.storeid + '"', (_err4, _rows4) => {
                                if (!_err4) {
                                    _res.send('1');
                                } else {
                                    throw(_err4);
                                }
                            });
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

exports.store_verification_status = (_req, _res) => {
    mysql.query('SELECT * FROM verifications INNER JOIN stores ON verifications.store_id = stores.id WHERE stores.id = "' + _req.body.storeid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            throw(_err);
        }
    });
}