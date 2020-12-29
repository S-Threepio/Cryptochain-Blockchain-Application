const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class Pubsub { 

    constructor({ blockchain }) {
        this.blockchain = blockchain;
        this.publisher = redis.createClient()
        this.subscriber = redis.createClient()

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
        const parsedMesage = JSON.parse(message);
        if (channel === CHANNELS.BLOCKCHAIN)
            this.blockchain.replaceChain(parsedMesage)
    }

    //TODO bad impl since it can get a message when the channel is unsubscribed
    publish({ channel, message }) {
        this.subscriber.unsubscribe(channel,()=>{
            this.publisher.publish(channel, message,()=>{
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

}
module.exports = Pubsub;