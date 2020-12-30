const { validTransaction } = require('../wallet/transaction');
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

        //check if any transaction exists
        if (validTransactions.length > 0) {
            //generate miner's reward
            validTransactions.push(
                Transaction.rewardTransaction({ minerWallet: this.wallet })
            );
            //add a block consisting of these transactions to the blockchain
            this.blockchain.addBlock({ data: validTransactions });

            //broadcast the updated blockchain
            this.pubsub.broadcastChain();

            //clear the pool
            this.transactionPool.clear();
        }
    }


}


module.exports = TransactionMiner;