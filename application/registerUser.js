const FabricCAServices = require('fabric-ca-client');
const {Wallets} = require('fabric-network');
const path = require('path');
const fs = require('fs');


async function main(){
    try{
    const ccpPath = path.resolve(__dirname,'config/connection-org1.json');
    const ccpJSON = fs.readFileSync(ccpPath,'utf8');
    const connectionProfile = JSON.parse(ccpJSON);

    const caInfo = connectionProfile.certificateAuthorities['ca.org1.example.com'];
    const caClient = new FabricCAServices(caInfo.url);
    const wallet = await Wallets.newFileSystemWallet('./wallet');

    const userIdentity = await wallet.get('user');
    if(userIdentity){
        console.log('User already registered');
        return;
    }
    const adminIdentity = await  wallet.get('admin');
        if(!adminIdentity){
            console.log('Admin not found, run enroll Admin first');
        return;
        }
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity,'admin');

    const secret = await caClient.register({
        enrollmentID:'appUser',
        affiliation:'org1.department1',
        role:'client'
    },adminUser);

    const userEnrollment = await caClient.enroll({
        enrollmentID:"appUser",
        enrollmentSecret: secret
    });
    const identity = {
        credentials:{
            certificate:userEnrollment.certificate,
            privateKey : userEnrollment.key.toBytes()
        },
        mspId:'Org1MSP',
        type:'X.509'

    };
    await wallet.put('appUser',identity);
    console.log('appUser registered & enrolled successfully');
    }catch(error){
        console.error(error);
    }
}
main();