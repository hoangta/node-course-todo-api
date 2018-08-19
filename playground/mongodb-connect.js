const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const dbName = 'TodoApp'

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongodb server')
    }
    console.log("Connected successfully to server");
    const db = client.db(dbName)

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err)
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // })

    db.collection('Users').insertOne({
        name: 'Hoang',
        age: 25,
        location: 'hcm'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user', err)
        }
        console.log(JSON.stringify(result.ops, undefined, 2))
    })

    client.close();
});
