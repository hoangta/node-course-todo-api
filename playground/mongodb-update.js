const {MongoClient, ObjectID} = require('mongodb')
const url = 'mongodb://localhost:27017'
const dbName = 'TodoApp'

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongodb server')
    }
    console.log("Connected successfully to server");
    const db = client.db(dbName)

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5b78ff80bea105c7ad08dca2')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result)
    // })

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b78f5d4bea105c7ad08db8b')
    }, {
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result)
    })

    client.close();
});
