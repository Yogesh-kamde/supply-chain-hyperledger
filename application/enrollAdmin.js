const FabricCAServices = require('fabric-ca-client'); 
const {Wallets} = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function main(){
    try{
    const ccPath = path.resolve(__dirname,'config/connection-org1.json');

    const ccpJSON = fs.readFileSync(ccPath,'utf-8');
    const connectionProfile = JSON.parse(ccpJSON);

    //create Ca client
    const caInfo = connectionProfile.certificateAuthorities['ca.org1.example.com'];
    const caClient = new FabricCAServices(caInfo.url);

    const wallet = await Wallets.newFileSystemWallet('./wallet');

   const adminIdentity = await wallet.get('admin');
    if(adminIdentity){
        console.log('admin already  emrolled');
        return;
    }
    const enrollment = await caClient.enroll({
        enrollmentID:'admin',
        enrollmentSecret:'adminpw'
    });
    const identity = {
        credentials:{
            certificate:enrollment.certificate,
            privateKey:enrollment.key.toBytes()
        },
        mspId:"Org1MSP",
        type:"X.509"
    };
    await wallet.put('admin',identity);
    console.log('Admin enrolled successfully and stored in wallet');
}catch(error){
    console.error(error);
}
}
main();
