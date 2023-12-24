const encrypt = require('./encrypt.js');

function sign(message, privateKey) {
  const { d, n } = privateKey;
  const signature = encrypt.encrypt(message, { e: d, n });
  return signature;
}

function verify(message, signature, publicKey) {
  const { e, n } = publicKey;
  const decryptedSignature = encrypt.decrypt(signature, { d: e, n });
  return message === decryptedSignature;
}

exports.sign = sign;
exports.verify = verify;
