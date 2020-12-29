const hexToBinary = require('hex-to-binary');
const Block = require('./block');
const cryptoHash = require('./crypto-hash');

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

    replaceChain(chain) {
        if (this.chain.length >= chain.length) {
            console.error('Incoming chain must be longer');
            return;
        }
        if (!Blockchain.isValidChain(chain)) {
            console.error('Incoming chain must be Valid');
            return;
        }
        console.log("replacing chain with " + chain);
        this.chain = chain;
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