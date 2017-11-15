var bitcore = require("bitcore-lib");
var Insight = require("bitcore-explorers").Insight;
//pubkey mibK5jk9eP7EkLH175RSPGTLR27zphvvxa
var privateKeyWIF = 'cQN511BWtc2dSUMWySmZpr6ShY1un4WK42JegGwkSFX5a8n9GWr3';
//pub key2 : mfdqfjQXaTzYM9hYTBa7G4We6mL443UEwq
//var privateKeyWIF = '925V8LkbBYjqiYXotdS5f1Hxido46hg1btoYb2m4bamAQx4o3iv';
//var privKey = 'tpubDDU119ipMf4tx5eDdpkMULuwBeBBe2h3K5VgMGTR75H2UzKjhboSRf3ECruKmDNatqqMgopFF3NqKjJFzcKXsdDLXWnX1ko8hqLvz9oL9HT';


var privateKey = bitcore.PrivateKey.fromWIF(privateKeyWIF);
var sourceAddress = privateKey.toAddress(bitcore.Networks.testnet);
console.log(sourceAddress);


var targetAddress = bitcore.Address.fromString('n3gT6yjDmDt3HatG7HwgFCy6NrsmqKPtCi');
if (!bitcore.Address.isValid(targetAddress)) {
    console.log('adr invalid');
} else {
    console.log('OK adr  valid');
}

var insight = new Insight("testnet");

insight.getUnspentUtxos(sourceAddress, function (error, utxos) {
    if (error) {
        console.log(error);
    } else {
        console.log(utxos);
        // transaction code goes here
        var tx = new bitcore.Transaction();
        tx.from(utxos);
        tx.to(targetAddress, 5700);
        tx.change(sourceAddress);
        tx.sign(privateKey);
        var serializedTX = tx.serialize();

        insight.broadcast(serializedTX, function (error, transactionId) {
            if (error) {
                console.log(error);
            } else {
                console.log(transactionId);
            }
        });
    }
});




