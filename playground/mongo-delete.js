// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log("unable to connect to MongoDB Server");
    }
    console.log("connected to mongo server");
    
    // //delete many
    // db.collection('Users').deleteMany({name: 'Adam'}).then((result) => {
    //     console.log(result);
    // }):
    //delete one
    // db.collection('Todos').deleteOne({text: 'Eat Lunch'}).then((result) => {
    //     console.log(result);
    // });

    //find one and delete one
    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5a7132170c8daad3e4f15c6b') 
    }).then((result) => {
        console.log(JSON.stringify(results, undefined, 2));
    })

        db.close();
});