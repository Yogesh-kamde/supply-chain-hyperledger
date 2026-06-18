const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const ccpPath = path.resolve(__dirname, 'config/connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf-8');
const connectionProfile = JSON.parse(ccpJSON);

async function connectToNetwork() {
    const wallet = await Wallets.newFileSystemWallet('./wallet');
    const identity = await wallet.get('appUser');
    if (!identity) {
        console.log(`appUser not Found run registerUser.js first`);
        return;
    }
    const gateway = new Gateway();
    await gateway.connect(connectionProfile, {
        wallet,
        identity: 'appUser',
        discovery: { enabled: true, asLocalhost: true }
    });
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('supplychain');
    return { contract, gateway };
}

app.post('/api/product/create', async (req, res) => {
    const { productId, productName, category, manufacturingDate } = req.body;
    const { contract, gateway } = await connectToNetwork();
    const result = await contract.submitTransaction('createProduct', productId, productName, category, manufacturingDate);
    gateway.disconnect();
    res.json({ message: 'Product Created', data: result.toString() });
});
app.post('/api/product/transfer', async (req, res) => {
    const { productId, newOwner, newStatus } = req.body;
    const { contract, gateway } = await connectToNetwork();
    const result = await contract.submitTransaction('TransferProduct', productId, newOwner, newStatus);
    gateway.disconnect();
    res.json({ message: 'Product Transfer', data: result.toString() });
});
app.get('/api/product/:id', async (req, res) => {

    const productId = req.params.id;
    const { contract, gateway } = await connectToNetwork();
    const result = await contract.evaluateTransaction('queryProduct', productId);
    gateway.disconnect();
    res.json(JSON.parse(result.toString())); 
});
app.listen(5000, () => {
    console.log('Server running on port 5000');
});


