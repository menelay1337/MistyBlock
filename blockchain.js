const crypto = require('crypto');
const merklee = require('./merklee.js')
// const dataToHash = 'Some data to hash';
// const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
// console.log('Hash:', hash);

class Block {
    constructor(index, timestamp, transactions, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.merkleRoot = this.calculateMerkleRoot(); // New property for Merkle root
        this.hash = this.calculateHash();
      }
    
      calculateHash() {
        return crypto.createHash('sha256').update(this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.merkleRoot).digest('hex');
      }
    
      calculateMerkleRoot() {
        const merkleTree = merklee.generateMerkleRoot(this.transactions);
        return merkleTree
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

  addBlock(transactions) {
    const newBlock = new Block(
      this.chain.length,
      new Date().toISOString(),
      transactions,
      this.getLatestBlock().hash
    );

    // Calculate Merkle root and set it in the block
    newBlock.merkleRoot = newBlock.calculateMerkleRoot(transactions);

    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
}

// Usage example:
// const myBlockchain = new Blockchain();
// myBlockchain.addBlock([
//   { from: 'Alice', to: 'Bob', amount: 10 },
//   { from: 'Bob', tto: 'Charlie', amount: 5 }
// ]);
module.exports={
  blockchain:Blockchain,
  block:Block,
}
// console.log(JSON.stringify(myBlockchain, null, 2));