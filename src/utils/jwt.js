const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const createJWT = ({ payload }) => {
  console.log(payload);
  const token = jwt.sign(
    { id: payload.id, email: payload.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return token;
};

const isTokenValid = async (token) => {
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
};

module.exports = {
  createJWT,
  isTokenValid,
};
