const crypto = require("crypto");


module.exports.default = function a(alg, data, log) {
	const cs = crypto.createHash(alg).update(data).digest("hex");
	if (log != null) log(cs);
	return cs;
};
