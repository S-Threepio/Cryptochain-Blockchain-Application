const Transaction = require('../wallet/transaction');
class TransactionMiner {

    constructor({ blockchain, transactionPool, wallet, pubsub }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.pubsub = pubsub;
        this.wallet = wallet;
    }

    mineTransactions() {
        //get transaction pools valid transactions
        const validTransactions = this.transactionPool.validTransactions();

        console.log("these are valid transactions :", validTransactions);
        //generate miner's reward
        validTransactions.push(
            Transaction.rewardTransaction({ minerWallet: this.wallet })
        );

        this.blockchain.addBlock({ data: validTransactions });

        this.pubsub.broadcastChain();

        this.transactionPool.clear();
        //add a block consisting of these transactions to the blockchain

        //broadcast the updated blockchain

        //clear the pool

    }


}


module.exports = TransactionMiner;