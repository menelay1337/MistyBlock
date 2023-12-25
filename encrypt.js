const rsa = require('./rsa.js')
const prompt = require('prompt-sync')()

// Simple modular exponentiation function (x^y mod n)
function modExp(x, y, n) {
  let result = 1;
  x = x % n;

  while (y > 0) {
    if (y % 2 === 1) {
      result = (result * x) % n;
    }
    y = Math.floor(y / 2);
    x = (x * x) % n;
  }

  return result;
}

// Text-to-number conversion function
function textToNumber(text) {
  return text
    .split('')
    .map(char => char.charCodeAt(0))
    .join('');
}

// Number-to-text conversion function
function numberToText(numberString) {
  const numbers = numberString.match(/.{1,3}/g);
  return numbers
    .map(num => String.fromCharCode(Number(num)))
    .join('');
}

// Encryption function for strings
function encrypt(message, publicKey) {
  const { e, n } = publicKey;
  const encryptedMessage = message
    .split('')
    .map(char => modExp(char.charCodeAt(0), e, n))
    .join(' ');
  return encryptedMessage;
}

// Decryption function for strings
function decrypt(encryptedMessage, privateKey) {
  const { d, n } = privateKey;
  const decryptedMessage = encryptedMessage
    .split(' ')
    .map(chunk => String.fromCharCode(Number(modExp(chunk, d, n))))
    .join('');
  return decryptedMessage;
}

exports.modules={
  decrypt:decrypt,
  encrypt:encrypt
}
// // const { publicKey, privateKey } = rsa.generateKeyPair();
// console.log(publicKey);
// // console.log(privateKey);

// const plaintext = prompt("Enter text to encrypt: ");

// // Asymmetric Encryption
// const encrypted = encrypt(plaintext, publicKey);
// console.log('Original:', plaintext);
// console.log('Encrypted:', encrypted);

// // Asymmetric Decryption
// const decrypted = decrypt(encrypted, privateKey);
// console.log('Decrypted:', decrypted);

