const encrypt = require('./encrypt.js');
const rsa = require('./rsa.js');
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


// Digital signature creation
exports.sign = function(message, privateKey) {
  const { d, n } = privateKey;
  const signature = message
    .split('')
    .map(char => modExp(char.charCodeAt(0), d, n))
    .join(' ');
  return signature
}

// Digital signature verification
exports.verify = function (message, signature, publicKey) {
  const { e, n } = publicKey;
  const decryptedSignature = signature
    .split(' ')
    .map(chunk => String.fromCharCode(Number(modExp(chunk, e, n))))
    .join('');
  return message === decryptedSignature;
}

// tests 
//

// export const { publicKey, privateKey } = rsa.generateKeyPair();

// console.log(publicKey);
// console.log(privateKey);

// const message = prompt('Enter your message to verify through encryption: ');

// const signature = exports.sign(message, privateKey);
// console.log(signature);

// if (exports.verify(message, signature, publicKey)) {
// 	console.log('Verified successfully.');
// } else {
// 	console.log('Not verified.');
// }
