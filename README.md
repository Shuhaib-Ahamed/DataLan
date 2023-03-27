# Getting Started with DataLan

## Docker Commands

### `docker pull bigchaindb/bigchaindb:all-in-one`

### `docker run \ --detach \ --name bigchaindb \ --publish 9984:9984 \ --publish 9985:9985 \ --publish 27017:27017 \ --publish 26657:26657 \ --volume $HOME/bigchaindb_docker/mongodb/data/db:/data/db \ --volume $HOME/bigchaindb_docker/mongodb/data/configdb:/data/configdb \ --volume $HOME/bigchaindb_docker/tendermint:/tendermint \ bigchaindb/bigchaindb:all-in-one`

## Docker Verify `docker ps | grep bigchaindb`
