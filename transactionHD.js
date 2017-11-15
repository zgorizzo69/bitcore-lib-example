var bitcore = require("bitcore-lib");
var Insight = require("bitcore-explorers").Insight;
var extendedPublicKey = 'tpubDDU119ipMf4tx5eDdpkMULuwBeBBe2h3K5VgMGTR75H2UzKjhboSRf3ECruKmDNatqqMgopFF3NqKjJFzcKXsdDLXWnX1ko8hqLvz9oL9HT';
var seedWords = 'salmon shrug ice same pony ladder asthma casino weird lamp exact super';
var BIP32RootKey = 'tprv8ZgxMBicQKsPfEzUbSrVrE994EoAzGUKdFds2ELg5yJeApii4oZu8F565ti5NKXE318BaowcFQ5xb4eWgvVcnfLW9Vwq3LwCrNFpiLWzQ59';
var BIP32ExtendedPrivateKey = 'tprv8hM6Y9YPGX7MbV4ykwJwJeWPSytW3eKzztzpgdL6K6qvmFFRUjJ2G38FD1mzFhUJLaxB53tqPPk8zA2Sdd2kdWiyreuWDnSegimv3GmqsXh'
var BIP32ExtendedPublicKey = 'tpubDE38gZadQto2Ux6meayXi4AW21QSCyWuaCbby9NPjNeKbjWC787cSXk7P82i4DAmZo1jZM9qpxa3t7bDrVV5VzKAY6d11968NnwXcVWRVyY'
var BIP32DerivationPath = "m/0"
//the full derivation path would be m/44'/1'/0'/0


var HDPrivateKey = bitcore.HDPrivateKey;

var hdPrivateKey = new HDPrivateKey(BIP32ExtendedPrivateKey);
var derived = hdPrivateKey.derive(BIP32DerivationPath);

var derivedByNumber = hdPrivateKey.derive(0);
// obtain HDPublicKey
var hdPublicKey = hdPrivateKey.hdPublicKey;

var address = derived.privateKey.toAddress();
console.log(address);
var address2 = derivedByNumber.privateKey.toAddress();
console.log(address2);
//var derivedByNumber = hdPrivateKey.derive(1).derive(2, true);
//var derivedByArgument = hdPrivateKey.derive("m/1/2'");


var privateKey = derived.privateKey;

var sourceAddress = address;


var targetAddress = bitcore.Address.fromString('msGDQ9hdEfcybut5iV1iNnFrov9rNYRMkw');

if (!bitcore.Address.isValid(targetAddress)) {
    console.log('adr invalid');
    throw (targetAddress);
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
        tx.to(targetAddress, utxos[0].satoshis - 700);
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




