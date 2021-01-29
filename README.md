# HD Wallet service

A nice project with a nice description

## Request example

Request `POST http://localhost:8000/act` with body :

```
{
	"cmd": "ping"
}
```

Response : 
```
{
    "answer": "pong"
}
```

---
## Requirements

For development, you will only need Node.js and a node global package, and typescript compiler installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###


## Install typescript

    npm install -g typescript

---

## Install

    $ git clone https://github.com/artpro676/seneca-hd-eth-wallet
    $ cd hd-wallet-service
    $ npm install

## ENV varaibles

  - PORT: **Integer** (default: 8000),
  - HOST: **String** (default: 'localhost'),

  - DB_STORAGE: **String**, path to file (default: ':memory:'),
  - DB_ENCRYPT_KEY: **String** (default: 'some-enryption-key'),

## Build the project

    $ npm run build 

## Run the project

    $ npm run app:start

## Run tests

    $ npm run test

## Run with watch

    $ npm run app:dev

## API

#### PING

Act :

    {
      "cmd": "ping"
    }


Response : 

    {
        "answer": "pong"
    }

#### Get/Create Wallet

Act :

    {
      "role": "wallet",
      "cmd": "get",
      "uid": 123...9 <-- some external user ID 
    }


Response : 

    "wallet": {
        "addresses": [
            {
                "address": "0xb903fa023557f3af54f6c607f4fe557578d63f4d",
                "type": 60 <-- Ethereum type
            }
        ]
    }

#### Sign transaction

Act :

    {
        "role": "wallet",
        "cmd": "signTx",
        "uid": 123...9,
        "tx": {
          "nonce": 0,
          "from": "0xb903fa023557f3af54f6c607f4fe557578d63f4d",
            "to": "0x30b4d63b00ca3f76c94dac89b8ed70e8d3d5abe0",
            "value": 0.000000000000001,
            "gasLimit": 21000,
            "gasPrice": 51000000000,
            "chainId": "3"
        }
    }


Response : 

    {
       "signedTx": "00..0123"
    }
