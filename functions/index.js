var functions = require('firebase-functions');
var admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
var wrotedata;
var receiver;
var msg;
var sender;

exports.Pushtrigger = functions.database.ref('/messages/{messageId}').onWrite((event) => {
        wrotedata = event.data.val();

        console.log(wrotedata);
        event.data.forEach(function(data){
            sender = data.val().senderId;
            msg = data.val().text;
            receiver = data.val().receiverId;
        });

console.log(msg + " " + sender + " " + receiver);

admin.database().ref('users/'+sender).once('value').then((data) => {
    sender = data.val().name;
    console.log(sender);
admin.database().ref('pushtokens/'+receiver).once('value').then((alltokens) => {
    var rawtokens = alltokens.val();
    console.log(rawtokens);
var tokens = [];
processtokens(rawtokens).then((processedtokens) => {

    for (var token of processedtokens) {
    tokens.push(token.devtoken);
}

var payload = {

    "notification":{
        "title":"From" + sender,
        "body":"Msg" + msg,
        "sound":"default"
    },
    "data":{
        "sendername":sender,
        "message":msg
    }
}
console.log(payload);
return admin.messaging().sendToDevice(tokens, payload).then((response) => {
        console.log('Pushed notifications');
}).catch((err) => {
    console.log(err);
})
})
})
})
})

function processtokens(rawtokens) {
    var promise = new Promise((resolve, reject) => {
            var processedtokens = []
            for (var token in rawtokens) {
        processedtokens.push(rawtokens[token]);
    }
    resolve(processedtokens);
})
    return promise;

}

function getUsername(uid) {
    var username;
    console.log(uid);

}