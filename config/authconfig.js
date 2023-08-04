const JWT = require('jsonwebtoken');
const { USER } = require('../models');

exports.authconfig = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        let decoded;
        if (token) {
            decoded = await JWT.verify(token, 'test');
            req.uuid = decoded.uuid;
        } else {
            decoded = await JWT.decode(token);
            req.uuid = decoded?.sub;
        }
        next()

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

};