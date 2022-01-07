const mysql = require('../config/database');
const bcrypt = require('bcrypt');
const faker = require('faker');

function DateTime() {
    return new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2) + ' ' + new Date().toLocaleTimeString('en-US', {hour12: false});
}

exports.admin_login = (_req, _res) => {
    mysql.query('SELECT password FROM admins WHERE username = "' + _req.body.username + '"', (_err, _rows) => {
        if (!_err) {
            if (_rows.length) {
                bcrypt.compare(_req.body.password, _rows[0].password, (_err, _result) => {
                    if (_result) {
                        _res.send('1');
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
exports.admin_list_of_users = (_req, _res) => {
    mysql.query('SELECT firstname, lastname, isActive, updatedAt FROM users ORDER BY updatedAt DESC', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            throw(_err);
        }
    });
}

exports.admin_list_of_hotels = (_req, _res) => {
    mysql.query('SELECT * FROM (SELECT stores.id, stores.name, stores.type, stores.address, stores.status_id, stores.avatar, store_status.name as statusname, SUM(ratings.rate) as totalrate, COUNT(ratings.id) as length FROM ratings LEFT OUTER JOIN stores ON ratings.store_id = stores.id INNER JOIN store_status ON stores.status_id = store_status.id GROUP BY stores.id UNION ALL SELECT stores.id, stores.name, stores.type, stores.address, stores.status_id, stores.avatar, store_status.name as statusname, SUM(ratings.rate) as totalrate, COUNT(ratings.id) as length FROM ratings RIGHT OUTER JOIN stores ON ratings.store_id = stores.id INNER JOIN store_status ON stores.status_id = store_status.id WHERE ratings.store_id IS NULL GROUP BY stores.id) as data ORDER BY data.name ASC', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            throw(_err);
        }
    });
}

exports.admin_list_of_resorts = (_req, _res) => {
    mysql.query('SELECT * FROM (SELECT stores.id, stores.name, stores.address, stores.status_id, stores.avatar, store_status.name as statusname, SUM(ratings.rate) as totalrate, COUNT(ratings.id) as length FROM ratings LEFT OUTER JOIN stores ON ratings.store_id = stores.id INNER JOIN store_status ON stores.status_id = store_status.id WHERE stores.type LIKE "%resort%" GROUP BY stores.id UNION ALL SELECT stores.id, stores.name, stores.address, stores.status_id, stores.avatar, store_status.name as statusname, SUM(ratings.rate) as totalrate, COUNT(ratings.id) as length FROM ratings RIGHT OUTER JOIN stores ON ratings.store_id = stores.id INNER JOIN store_status ON stores.status_id = store_status.id WHERE stores.type LIKE "%resort%" AND ratings.store_id IS NULL GROUP BY stores.id) as data ORDER BY data.name ASC', (_err, _rows) => {
        if (!_err) {
            _res.send(_rows);
        } else {
            throw(_err);
        }
    });
}

exports.admin_boost_rate = (_req, _res) => {
    mysql.query('INSERT INTO ratings (store_id, name, rate, createdAt, updatedAt) VALUES ("' + _req.body.storeid + '", "' + faker.name.findName() + '", "5", "' + DateTime() + '", "' + DateTime() + '")', (_err, _rows) => {
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}

exports.admin_ban_store = (_req, _res) => {
    let status = 0;
    if (_req.body.status == 1 || _req.body.status == 2) {
        status = 4;
    } else {
        status = 2;
    }
    mysql.query('UPDATE stores SET status_id = "' + status + '" WHERE id = "' + _req.body.storeid + '"', (_err, _rows) => {
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}

exports.decline_store_verification = (_req, _res) => {
    const query0 = 'UPDATE stores SET status_id = "3" WHERE id = "' + _req.body.storeid + '";';
    const query1 = 'UPDATE verifications SET reasons = "' + _req.body.reason + '" WHERE store_id = "' + _req.body.storeid + '"'
    mysql.query(query0 + query1, (_err, _rows) => { 
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}

exports.accept_store_verification = (_req, _res) => {
    mysql.query('UPDATE stores SET status_id = "5" WHERE id = "' + _req.body.storeid + '"', (_err, _rows) => { 
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}

exports.delete_store_rate_review = (_req, _res) => {
    mysql.query('DELETE FROM ratings WHERE id = "' + _req.body.commentid + '"', (_err, _rows) => { 
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}

exports.generate_new_secret_key = (_req, _res) => {
    mysql.query('DELETE FROM ratings WHERE id = "' + _req.body.commentid + '"', (_err, _rows) => { 
        if (!_err) {
            _res.send('1');
        } else {
            throw(_err);
        }
    });
}

