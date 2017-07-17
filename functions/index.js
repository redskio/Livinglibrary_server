var functions = require('firebase-functions');
var admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
var wrotedata;
var receiver_key;
var msg;
var sender;
var sender_key;
exports.Pushtrigger = functions.database.ref('/messages/{messageId}').onWrite((event) => {
        wrotedata = event.data.val();

        event.data.forEach(function(data){
            sender_key = data.val().senderId;
            msg = data.val().text;
            receiver_key = data.val().receiverId;
        });

console.log(msg + " " + sender_key + " " + receiver_key);

admin.database().ref('users/'+sender_key).once('value').then((data) =>  {
    sender = data.val().name;
admin.database().ref('pushtokens/'+receiver_key).once('value').then((alltokens) => {
    var rawtokens = alltokens.val();
var tokens = [];
processtokens(rawtokens).then((processedtokens) => {

    for (var token of processedtokens) {
    tokens.push(token.devtoken);
}

var payload = {

    "notification":{
        "title":"From" + sender,
        "body":"Msg" + msg,
        "sound":"default",
        "click_action":"FCM_PLUGIN_ACTIVITY",
        "icon":"fcm_push_icon"
    },
    "data":{
        "senderKey":sender_key,
        "receiverKey":receiver_key,
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