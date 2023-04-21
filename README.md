# DataLan : A Decentralised Data Marketplace Based On AutoML

[![Watch the video](https://firebasestorage.googleapis.com/v0/b/shuhaib-ahamed.appspot.com/o/Screenshot%202023-04-13%20200304.png?alt=media&token=ab6d0cba-b8b2-4e8b-bb39-4a4880360e4a)](https://www.youtube.com/watch?v=eN1mG4_x-Zo)

## Application Demo

[Watch Application Demo](https://www.youtube.com/watch?v=eN1mG4_x-Zo)

## Project Introduction


The project proposes developing an open, decentralized, and automated customer service architecture for Small and Medium Enterprises (SMEs) using AutoML and the Internet of Things. The proposed architecture includes a transparent and automated customer service that utilizes Blockchain technology for secure data exchange, data trading platform for SMEs, and homomorphic encryption to improve system security and performance. The study aims to contribute to the research domain by facilitating the integration of open automated customer services, increasing revenue and customer satisfaction among small businesses. SMEs can benefit from the proposed architecture by automating customer service, enhancing customer satisfaction, and increasing revenue.

## Reasearch Gap

Various data masking techniques have been described in the blockchain and machine learning literature, including substitution, shuffling, nulling out or deleting, encryption, and variance of dates and numbers. Due to reduced block sizes, increased consensus times, transient forks, and additional network overheads, current scaling concerns (Ayinala, Choi and Song, 202) result in inefficiencies and performance problems. Even so, without adequate data, today's businesses will not be able to compete, let alone prosper.

## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express

**Auto ML Server:** Fast API, Pycaret

**Databases:** MongoDB, Firebase, BigchainDB

**Blockchain:** Stellar Blockchain

![alt text](https://firebasestorage.googleapis.com/v0/b/shuhaib-ahamed.appspot.com/o/Demo.gif?alt=media&token=ce7551c6-70b5-433b-b36c-6cb4d602a81f)

## Run Locally

Clone the project

```bash
  git clone https://github.com/Shuhaib-Ahamed/DataLan
```

Set up BigchainDB

```bash
  docker pull bigchaindb/bigchaindb:all-in-one
```

```bash
  docker run \
  --detach \
  --name bigchaindb \
  --publish 9984:9984 \
  --publish 9985:9985 \
  --publish 27017:27017 \
  --publish 26657:26657 \
  --volume $HOME/bigchaindb_docker/mongodb/data/db:/data/db \
  --volume $HOME/bigchaindb_docker/mongodb/data/configdb:/data/configdb \
  --volume $HOME/bigchaindb_docker/tendermint:/tendermint \
  bigchaindb/bigchaindb:all-in-one
```

Install and run the Server

```bash
  cd server
  npm install
  npm run dev
```

Install and run the Client

```bash
  cd client
  npm install
  npm start
```

Install and run the AutoML Server

```bash
  pip install -r requirements.txt
  uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Authors

- [@shuhaib_ahamed](https://github.com/Shuhaib-Ahamed)

## Feedback

If you have any feedback, please reach out to me at shuhaibsamadh@gmail.com
