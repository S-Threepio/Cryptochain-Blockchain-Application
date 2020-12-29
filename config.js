const MINE_RATE = 5000; //1 sec
const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
    timestamp: '1609080496100',
    lastHash: '------',
    hash: 'hash-one',
    data: [],
    nonce: 0,
    difficulty: INITIAL_DIFFICULTY
};

const STARTING_BALANCE = 1000;

module.exports = { GENESIS_DATA, MINE_RATE, STARTING_BALANCE }