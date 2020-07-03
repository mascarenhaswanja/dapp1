/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';
const { Contract } = require('fabric-contract-api');
class TestChain extends Contract {
    async initLedger(ctx) {
        var sKey = '1111';
        var jsonValue = {name: 'Wanja', address: {city: 'Toronto', street:'Northland'}};
        await ctx.stub.putState(sKey, JSON.stringify(jsonValue));
        console.info('============= END : Initialize Ledger ===========');
    }
    async helloWorld(ctx) {
        var sKey = '1111';
        var bValue = await ctx.stub.getState(sKey);
        var sValue = bValue.toString()
        return sValue;
    }
}
module.exports = TestChain;
