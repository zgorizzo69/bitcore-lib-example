var bitcore = require("bitcore-lib");
/*
Botchain example
mnemonic: green book used merry blush jungle ball inhale today claw panther predict remind turn quit 
passphrase: dezdezd 
sk: edskS7JiAubij3LvVZNvMZFnDKN52YqUzCkmsrhgJwLLVH2WkfqjDzLMNY6U9LYMs3bXgz6Hx9Mv5gMgPh5n2CQS2cR3Gz5iny 
pk: edpkucVXBNN4UaxDoF7W2Qdvhp7KjPkZdZZCMmhAR5MuyfCV8fwpA3 
pkh: bt1rfuKuYp9JpCv6mY144z4jLAjXfRYJ76Bk 
btc contribution PubKey full: 02b698d22c110f416a40850e578406e41c3e933669796b17e5ac0ba2c5ad812f41 
btc contribution address full: 2MzmTZ2cbWdYJKKXpVLtQJEJQmV1PvtrZmX 
btc contribution address first half: 2MzmTZ2cbWdYJKKXp 
*/


var privateKeys = [
    bitcore.PrivateKey.fromWIF("L3QuV8k3rs32hK8DHsDdNA9yUv6s6DT3pvRShVr3CGxkkVVU7jsD"),
    bitcore.PrivateKey.fromWIF("L3Bu14At7bUFtVgJgpZt9YDGopkc6FBwzgBEBkgrpoMJYCPV4eU9"),
];
var publicKeys = [
    "02c1bea928731e1bd7e48ee74eb5fb544bccbd04d1a2484ed718d2f17d8d635cfe",
    "02211bb3475ed39609a0e4b31a71f212c565ff088cf42a7540572beb2269b487a1",
    "02b698d22c110f416a40850e578406e41c3e933669796b17e5ac0ba2c5ad812f41"
];


var multiSigAddress = bitcore.Address.fromString('2MzmTZ2cbWdYJKKXpVLtQJEJQmV1PvtrZmX');

console.log(multiSigAddress);
//2N9cgU6A4E3yJe2WsZyCHHTuPbDhcFVf98R


//addr with test net btc
//cTFnctcD4jRup3qB96Gn3NeiyrBDPW5LT8fTDvfvJ9zx7Q5z62bw priv
//myHsSVNuF9R9zr9A1xNLbJpZ1crLRmLQzA pub

//adr to my btc etc wallet android
//2Mw5hUcXtBwSNrveuMU7cvf4wXFvpWMWzgh

var targetAddress = bitcore.Address.fromString('2Mw5hUcXtBwSNrveuMU7cvf4wXFvpWMWzgh');
var Insight = require("bitcore-explorers").Insight;
var insight = new Insight("testnet");
const AVERAGE_SIZE_BYTES = 500;
const AVERAGE_COST_BYTES = 100;
function getFee() {
    return AVERAGE_SIZE_BYTES * AVERAGE_COST_BYTES;
}
function getMaxAmount(utxo) {
    let amount = 0;
    utxo.forEach(element => {
        amount += element.satoshis;
    });
    return amount - getFee()
}

insight.getUnspentUtxos(multiSigAddress, function (error, utxos) {
    if (error) {
        console.log(error);
    } else {
        // we will create our transaction here
        var tx = new bitcore.Transaction();
        //Bitcoins we want to spend are included in UTXOs we have just received. 
        //Because they belong to the multi-sign address we also have to pass 
        //an array of all public keys that were used to create the address.
        // In the last argument, we will require signatures of two of private keys.
        tx.from(utxos, publicKeys, 2);
        //var fees = tx.getFee();
        tx.to(targetAddress, getMaxAmount(utxos));
        //var fees2 = tx.getFee();
        tx.sign(privateKeys[0]); // first signature
        tx.sign(privateKeys[1]); // second signature
        // var fees3 = tx.getFee();
        //tx.fee(fees);
        var serializedTX = tx.serialize();
        insight.broadcast(serializedTX, function (error, transactionId) {
            if (error) {
                console.log(error)
            } else {
                console.log(transactionId);
            }
        });

    }
});




