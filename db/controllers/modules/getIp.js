"use strict";

/**
 *
 * @param {req} req - req.headers, req.connection, req.socket & req.connection.socket get ip
 */
module.exports.default = function a(req) {
	return (req.headers['x-forwarded-for'] || "").split(',').pop() || req.connection.remoteAddress ||
    req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
};
