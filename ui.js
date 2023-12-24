const http = require('http');
const fs = require('fs');
const crypto = require('crypto');

class Block {
  constructor(index, timestamp, transactions, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256')
      .update(
        this.index +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.previousHash
      )
      .digest('hex');
  }
}
  

// Initialize an empty blockchain
const myBlockchain = [];

let isBlockCreationInProgress = false;

const server = http.createServer((req, res) => {
   if (req.url === '/transaction' && req.method === 'GET') {
    // Serve the HTML page for transaction UI
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
  } else if (req.url === '/data' && req.method === 'GET') {
    // Serve the HTML page with dynamically rendered blockchain data
    const htmlContent = fs.readFileSync('data.html', 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent.replace('<%= JSON.stringify(myBlockchain) %>', JSON.stringify(myBlockchain)));
  } else if (req.url === '/add-transaction' && req.method === 'POST') {
    // Handle the POST request for adding a new transaction
    if (isBlockCreationInProgress) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Transaction creation in progress. Please try again later.');
      return;
    }

    isBlockCreationInProgress = true;

    let requestBody = '';
    req.on('data', chunk => {
      requestBody += chunk.toString();
    });

    req.on('end', () => {
      const transactionData = JSON.parse(requestBody);
      // Add a new block to the blockchain
      const newBlock = createNewBlock(transactionData);
      myBlockchain.push(newBlock);
      isBlockCreationInProgress = false;
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Transaction added successfully!');
    });
  } else {
    // Serve the HTML page for transactions (default case)
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
  }
});

function createNewBlock(transactionData) {
  const previousBlock = myBlockchain[myBlockchain.length - 1] || {
    index: 0,
    timestamp: new Date().toISOString(),
    transactions: 'Genesis Block',
    previousHash: '0',
    hash: '8b61cfcf146e3f894197a3f7e1e8e63b5c5ef8a64f7e8b48e140990d20c3d1a8'
  };
  const newBlock = new Block(
    previousBlock.index + 1,
    new Date().toISOString(),
    transactionData,
    previousBlock.hash
  );
  newBlock.hash = newBlock.calculateHash();

  // Log the blockchain to the console
  console.log('Updated Blockchain:', myBlockchain);

  return newBlock;
}

server.listen(3000);
console.log('Server started on localhost:3000; press Ctrl-C to terminate....');
