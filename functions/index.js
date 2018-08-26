// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

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
            if (raw.indexOf(text) === -1) {
                return;
            }
            //result[i] = element.child('key').val()
            result.push(element.child('key').val())
            i++
        });

        return res.send(result)
    })
})

/**
 * search post by text and category:
 * @category: chung or hocphan
 * @text: text to search
 * -> return: JSON Array of key
 */
exports.searchPost = functions.https.onRequest((req, res) => {
    category = req.query.category
    if (category === 'chung')
        ref = admin.database().ref('/chung/data')
    else if (category === 'hocphan')
        ref = admin.database().ref('/lop_hoc_phan/data')
    text = req.query.text

    if (!text || !category) {
        res.status(401)
        return res.send("No enough parameter!")
    }

    text = text.toLowerCase();
    result = []
    return ref.once('value', snapshot => {
        i = 0;
        snapshot.forEach(element => {
            raw = element.child('content').val()
            raw += ' ' + element.child('day').val() + ' ' + element.child('event').val();
            raw = raw.toLowerCase()
            if (raw.indexOf(text) === -1) {
                return;
            }
            //result[i] = element.child('key').val()
            result.push(element.child('key').val())
            i++
        });

        return res.send(result)
    })
})

/**
 * Get post by post'key(hash) and category
 * @key: post'hash
 * @category: post category
 * -> return: post
 */
exports.getPost = functions.https.onRequest((req, res) => {

    const key = req.query.key
    const category = req.query.category;
    if (!key || !category) {
        res.status(401)
        return res.send("not enough parameter!")
    }

    if (category === 'chung')
        ref = admin.database().ref('/chung/data');
    else if (category === 'hocphan')
        ref = admin.database().ref('/lop_hoc_phan/data')
    result = {

    }
    return ref.orderByChild('key').equalTo(key).once('value', snapshot => {
        snapshot.forEach(element => {
            result[element.child('key').val()] = element    
        })

        return res.send(result)
    })
})

