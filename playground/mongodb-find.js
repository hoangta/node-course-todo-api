const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const dbName = 'TodoApp'

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongodb server')
    }
    console.log("Connected successfully to server");
    const db = client.db(dbName)

    // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    //     console.log('Todos')
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // })

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`)
    // }, (err) => {
    //     console.log('Unable to fetch todos', err)
    // })

    db.collection('Users').find({name: 'Phong'}).count().then((count) => {
        console.log(`Todos count: ${count}`)
    }, (err) => {
        console.log('Unable to fetch todos', err)
    })

    client.close();
});
