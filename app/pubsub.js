const redis = require('redis');
const { parse } = require('uuid');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class Pubsub {

    constructor({ blockchain, transactionPool }) {
        this.blockchain = blockchain;
        this.publisher = redis.createClient({ host: 'redis', port: 6379 });
        this.subscriber = redis.createClient({ host: 'redis', port: 6379 });
        this.transactionPool = transactionPool;
        this.subscribeToChannels();
        this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message));
    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    }

    handleMessage(channel, message) {
        console.log(`Message received. Channel : ${channel}. Message: ${message}.`);
        const parsedMessage = JSON.parse(message);

        switch (channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage, true, () => {
                    this.transactionPool.clearBlockchainTransactions({ chain: parsedMessage });
                });
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage);
                break;
            default: return;
        }
    }

    //TODO bad impl since it can get a message when the channel is unsubscribed
    publish({ channel, message }) {
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        })
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        })
    }

}
module.exports = Pubsub;