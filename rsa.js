// Miller-Rabin primality test
function isPrime(num, k = 5) {
  if (num <= 1 || num === 4) return false;
  if (num <= 3) return true;

  // Find r and d such that num-1 = 2^r * d
  let d = num - 1;
  while (d % 2 === 0) {
    d /= 2;
  }

  // Witness loop
  for (let i = 0; i < k; i++) {
    const a = 2 + Math.floor(Math.random() * (num - 3));
    let x = modExp(a, d, num);

    if (x === 1 || x === num - 1) continue;

    let continueWitnessLoop = false;

    for (let r = 0; r < Math.log2(num - 1); r++) {
      x = modExp(x, 2, num);

      if (x === 1) return false;
      if (x === num - 1) {
        continueWitnessLoop = true;
        break;
      }
    }

    if (!continueWitnessLoop) return false;
  }

  return true;
}

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


// Generate random prime number
function generateRandomPrime(min, max) {
  let num;
  do {
    num = Math.floor(Math.random() * (max - min + 1) + min);
  } while (!isPrime(num));
  return num;
}

// Updated Key generation
// returns 2 objects in one object
// each object is a key with key itself and a modulus number.
function generateKeyPair(minPrime, maxPrime) {

  const p = generateRandomPrime(minPrime, maxPrime);
  const q = generateRandomPrime(minPrime, maxPrime);

  const n = p * q; // Modulus
  const phi = (p - 1) * (q - 1); // Euler's totient function

  let e;
  do {
    e = Math.floor(Math.random() * (phi - 100) + 100);
  } while (gcd(e, phi) !== 1);

  const d = modInv(e, phi);

  return {
    publicKey: { e, n },
    privateKey: { d, n },
  };
}

// Greatest common divisor
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

// Modular multiplicative inverse
function modInv(a, m) {
  const m0 = m;
  let x0 = 0;
  let x1 = 1;

  if (m === 1) return 0;

  while (a > 1) {
    const q = Math.floor(a / m);
    let t = m;

    m = a % m;
    a = t;
    t = x0;

    x0 = x1 - q * x0;
    x1 = t;
  }

  if (x1 < 0) {
    x1 += m0;
  }

  return x1;
}
exports.modules = {
  generateKeyPair: generateKeyPair
};

// const { publicKey, privateKey } = generateKeyPair(0, 1000);

