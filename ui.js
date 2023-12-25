const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
const block =require('./blockchain')
const signature=require("./signature")
// const digSignature = require("./digitalSignature");
const rsa = require("./rsa")
const decrypt=require("./encrypt")
const {publicKey,privateKey}=rsa.modules.generateKeyPair(0,1000)
const {publicKey:publicKey2,privateKey:privateKey2}=rsa.modules.generateKeyPair(0,1000)
console.log(publicKey,privateKey)
const blockchain =  new block.blockchain()
let isBlockCreationInProgress = false;

const person1 = {
  name:"Temirlan",
  value:1000,
  keys:publicKey,
  signature:signature.sign("Hello",privateKey)
}
console.log(person1)

const person2={
  name:"Nigger",
  value:12,
  keys:publicKey2,
  signature:signature.sign("nibba",privateKey2)
}
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
    res.end(htmlContent.replace('<%= JSON.stringify(blockchain, null, 2) %>', JSON.stringify(blockchain, null, 2)));
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
      try {

        const signature1 = person1.signature;
         const isSignature1Valid = signature.verify("Hello", signature1, publicKey);

            const signature2 = person2.signature;
    const isSignature2Valid = signature.verify("nibba", signature2, publicKey2);

        const transactionData = requestBody;
        if (isSignature1Valid && isSignature2Valid) {
          decrypt.modules.decrypt()
          blockchain.addBlock(transactionData);
          console.log(blockchain.chain);
          isBlockCreationInProgress = false;
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Transaction added successfully!');
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Invalid signature(s). Transaction rejected.');
        }
      } catch (error) {
        console.error('Error parsing or processing the transaction:', error);
        isBlockCreationInProgress = false;
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    });
  } else {
    // Serve the HTML page for transactions (default case)
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
  }
});


server.listen(3000);
console.log('Server started on localhost:3000; press Ctrl-C to terminate....');
