// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebaseabc!");
});

exports.searchTBChung = functions.https.onRequest((req, res) => {
    ref = admin.database().ref('/chung/data');
    text = req.query.text
    text = text.toLowerCase();
    result = []
    return ref.once('value', snapshot => {
        i = 0;
        snapshot.forEach(element => {
            raw = element.child('content').val()
            raw += ' ' + element.child('day').val() + ' ' + element.child('event').val();
            raw = raw.toLowerCase()
            if (raw.indexOf(text) == -1) {
                return;
            }
            //result[i] = element.child('key').val()
            result.push(element.child('key').val())
            i++
        });

        return res.send(result)
    })
})

exports.getTBChung = functions.https.onRequest((req, res) => {
    ref = admin.database().ref('/chung/data');
    const key = req.query.key
    result = {

    }
    return ref.orderByChild('key').equalTo(key).once('value', snapshot => {
        snapshot.forEach(element => {
            result[element.child('key').val()] = element    
        })

        return res.send(result)
    })
})


