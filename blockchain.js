const crypto = require('crypto');

const dataToHash = 'Some data to hash';
const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
console.log('Hash:', hash);

class Block {
  constructor(index, timestamp, transactions, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256').update(this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash).digest('hex');
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), 'Genesis Block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
}

// Usage example:
const myBlockchain = new Blockchain();
myBlockchain.addBlock(new Block(1, new Date().toISOString(), { from: 'Alice', to: 'Bob', amount: 10 }));
myBlockchain.addBlock(new Block(2, new Date().toISOString(), { from: 'Bob', to: 'Charlie', amount: 5 }));

console.log(JSON.stringify(myBlockchain, null, 2));
