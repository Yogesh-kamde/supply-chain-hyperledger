const { Contract } = require('fabric-contract-api');

class SupplyChain extends Contract {

    async ProductExists(ctx, productId) {
        const data = await ctx.stub.getState(productId);
        return data && data.length > 0;
    }

    async createProduct(ctx, productId, productName, productCategory, manufacturingDate) {
        const exists = await this.ProductExists(ctx, productId);

        if (exists) {
            throw new Error(`The product ${productId} already exist`);
        }
        //create Product
        const product = {
            productId,
            productName,
            productCategory,
            manufacturingDate,
            currentOwner: "Manufacturer",
            state:"created",
            timestamp: new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString()
        };
        //save product to state
        await ctx.stub.putState(productId, Buffer.from(JSON.stringify(product)));
        return JSON.stringify(product);
    }
    async TransferProduct(ctx, productId, newOwner, newStatus) {
        const exists = await this.ProductExists(ctx,productId);
        if(!exists){
            throw new Error(`Product ${productId} does not exist`);
        }

        const data = await ctx.stub.getState(productId);
        const product = JSON.parse(data.toString());

        product.currentOwner = newOwner;
        product.status = newStatus;
        product.timestamp = new Date(ctx.stub.getTxTimestamp().seconds.low * 1000).toISOString();
        await ctx.stub.putState(productId,Buffer.from(JSON.stringify(product)));
        return JSON.stringify(product);
    }
    //query
    async queryProduct(ctx, productId) {
       const exists = await this.ProductExists(ctx,productId);
       if(!exists){
        throw new Error(`Product ${productId} does not exist`);
       }
       const data = await ctx.stub.getState(productId);
       return data.toString();
    }
}
module.exports.contracts = [SupplyChain];