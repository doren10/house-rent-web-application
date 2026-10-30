const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;
    const token = (req.cookies && req.cookies.token) || bearerToken;

    if (!token) {
      return res
        .status(401)
        .send({ message: "No token found in cookies", success: false });
    }

    const secret = process.env.JWT_KEY || "househunt_secret_jwt_key_2026";
    jwt.verify(token, secret, (err, decode) => {
      if (err) {
        return res
          .status(200)
          .send({ message: "Token is not valid", success: false });
      } else {
        req.userId = decode.id;
        req.body = req.body || {};
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.error(error); 
    res.status(500).send({ message: "Internal server error", success: false });
  }
};

module.exports = {
  authMiddleware
}