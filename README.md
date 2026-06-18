# Supply Chain Tracking System on Hyperledger Fabric

A full-stack blockchain application for tracking products across a supply chain — from Manufacturer to Distributor to Retailer to Customer.

## Tech Stack
- **Blockchain:** Hyperledger Fabric v2.5
- **Smart Contract:** JavaScript (Node.js chaincode)
- **Backend:** Node.js + Express
- **Frontend:** React.js
- **Identity Management:** Fabric CA

## Features
- Create a product on the blockchain
- Transfer product ownership across the supply chain
- Track full product journey by Product ID
- Private blockchain network with 2 organisations

## Supply Chain Flow
Manufacturer → Distributor → Retailer → Customer
## Project Structure
supply-chain/

chaincode/       ← Hyperledger Fabric smart contract

application/     ← Node.js + Express REST API

frontend/        ← React dashboard

## Prerequisites
- Docker
- Node.js
- Hyperledger Fabric binaries
- WSL2 (for Windows)

## How to Run

### 1. Start the Fabric network
```bash
cd ~/hyperledger/fabric-samples/test-network
./network.sh up createChannel -ca
./network.sh deployCC -ccn supplychain -ccp ~/supply-chain/chaincode -ccl javascript
```

### 2. Enroll identities
```bash
cd ~/supply-chain/application
node enrollAdmin.js
node registerUser.js
```

### 3. Start backend
```bash
node app.js
```

### 4. Start frontend
```bash
cd ~/supply-chain/frontend
npm start
```

### 5. Open browser
http://localhost:3000
## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/product/create | Create a new product |
| POST | /api/product/transfer | Transfer product ownership |
| GET | /api/product/:id | Track product by ID |

## Author
Yogesh Kamde
- GitHub: github.com/Yogesh-kamde
- Email: yogeshkamde90@gmail.com