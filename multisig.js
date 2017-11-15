var bitcore = require("bitcore-lib");

var privateKeys = [
    bitcore.PrivateKey.fromWIF("L3QuV8k3rs32hK8DHsDdNA9yUv6s6DT3pvRShVr3CGxkkVVU7jsD"),
    bitcore.PrivateKey.fromWIF("L3Bu14At7bUFtVgJgpZt9YDGopkc6FBwzgBEBkgrpoMJYCPV4eU9"),
    bitcore.PrivateKey.fromWIF("L4o97TzSMFvqt4YfNWBCo3rqrNokQWMtHNKXPwBCp8wz7Db2m6Na")
];

var publicKeys = [
    "02c1bea928731e1bd7e48ee74eb5fb544bccbd04d1a2484ed718d2f17d8d635cfe",
    "02211bb3475ed39609a0e4b31a71f212c565ff088cf42a7540572beb2269b487a1",
    "02fe15f72d897d6b01309e07176f88f3ff8d006ff3e189ebbb72d47353c0a02f08"
];

var multiSigAddress = new bitcore.Address(publicKeys, 2, bitcore.Networks.testnet);

console.log(multiSigAddress);

//adr to my btc etc wallet android
//2MxykHuDodFhfwMpMcyCeEFfbWsVVwuTWiB

var targetAddress = bitcore.Address.fromString('2MxykHuDodFhfwMpMcyCeEFfbWsVVwuTWiB');
var Insight = require("bitcore-explorers").Insight;
var insight = new Insight("testnet");

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
        tx.to(targetAddress, 48792);
        tx.change(multiSigAddress);
        tx.sign(privateKeys[0]); // first signature
        tx.sign(privateKeys[1]); // second signature
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




