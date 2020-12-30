const hexToBinary = require('hex-to-binary');
const Block = require('./block');
const { cryptoHash } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

class Blockchain {

    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        })
        this.chain.push(newBlock);
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false;
        for (let i = 1; i < chain.length; i++) {
            const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[i];

            const actualLastHash = chain[i - 1].hash;
            if (lastHash !== actualLastHash) return false;

            const lastDifficulty = chain[i - 1].difficulty;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
            if (hash !== validatedHash) return false;
            if (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty)) return false;
            if (Math.abs(lastDifficulty - difficulty) > 1) return false;
        }
        return true;
    }

    replaceChain(chain, validateTransactions, onSuccess) {
        if (this.chain.length >= chain.length) {
            console.error('Incoming chain must be longer');
            return;
        }
        if (!Blockchain.isValidChain(chain)) {
            console.error('Incoming chain must be Valid');
            return;
        }

        if (validateTransactions && !this.validTransactionData({ chain })) {
            console.error('The incoming chain has invalid transactions');
            return;
        }

        if (onSuccess) onSuccess();
        console.log("replacing chain with " + chain);
        this.chain = chain;
    }

    validTransactionData({ chain }) {
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            let rewardTransactionCount = 0;
            const transactionSet = new Set();


            for (let transaction of block.data) {
                console.log("Comparison is  ->", transaction.inputMap.address);
                console.log("Comparison is  ->", REWARD_INPUT.address);
                console.log("COMPARISONNN VALUE  ->", transaction.inputMap.address === REWARD_INPUT.address);

                if (transaction.inputMap.address === REWARD_INPUT.address) {
                    rewardTransactionCount += 1;

                    console.log("COMPARISONNN VALUE  ->", rewardTransactionCount);

                    if (rewardTransactionCount > 1) {
                        console.error('Miner reward exceeds limit');
                        return false;
                    }

                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.error('Miner reward amount is invalid');
                        return false;
                    }
                }
                else {
                    if (!Transaction.validTransaction(transaction)) {
                        console.error('Invalid tranasaction');
                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain, address: transaction.inputMap.address
                    });

                    if (transaction.inputMap.amount !== trueBalance) {
                        console.error('Invalid input amount');
                        return false;
                    }

                    if (transactionSet.has(transactionSet)) {
                        console.error('An identical transaction already exists in a block');
                        return false;
                    } else {
                        transactionSet.add(transactionSet);
                    }
                }
            }
        }
        return true;
    }

}

// const chain = new Blockchain();
// const chain2 = new Blockchain();
// console.log("chain 1 is " + Blockchain.isValidChain(chain.chain));
// console.log("chain 2 is " + Blockchain.isValidChain(chain2.chain));

// chain.addBlock({ data: [] });
// console.log(chain);

// chain2.addBlock({ data: [] });
// chain2.addBlock({ data: [] });
// console.log(chain2);

// // chain2.chain[1].data = ['new data'];
// console.log("chain 1 is " + Blockchain.isValidChain(chain.chain));
// console.log("chain 2 is " + Blockchain.isValidChain(chain2.chain));

// chain.replaceChain(chain2.chain);



module.exports = Blockchain;