# Cryptochain
A Cryptocurrency-Blockchain project using Express JS and Redis Pub Sub model



# SETUP : Install Redis
- this project uses Redis server for publish subscribe model.
- A redis setup on your machine is required for this app to work.

The scripts used will start the redis server by themselves but you must have it installed first.
If you are able to run 'redis-server' command then you are good to go.


# Starting Nodes
First install all the development dependencies.
then,
- to start the root node run 'npm run dev'
- to start other nodes you need to run the command 'npm run dev-peer'

# Ports 
- root node will be running at Port : 3000
- rest of the nodes will be running at randomly generated ports which will be visible in the terminal with a message ->               
"Listening at localhost:[random port no.]"

# Backend
The REST APIs in the backend can be checked on Postman
- GET /blocks : to get the current blockchain blocks
- POST /transact : {
    "recipient": "war",
    "amount": 20
} : to make a transaction between 2 peers
- GET /transaction-pool-map : to get the transactions pool map
- GET /mine-transactions : to mine the transactions in the transactions pool and create a block to the blockchain

# Frontend 
The front end is hosted in React. 
- The port at which a node is running can be opened in browser.
- All the backend functionalities are available in frontend as well.
