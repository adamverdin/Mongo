// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log("unable to connect to MongoDB Server");
    }
    console.log("connected to mongo server");
    
    // db.collection('Todos').findOneAndUpdate({
    //     _id : ObjectID('5a7268fc27d962d4065d511a')
    //     }, {
    //     $set: {
    //         completed: true
    //     }
    //     },
    //     {
    //     returnOriginal: false
    //     }).then((result) => {
    //         console.log(result);
    //     });

    db.collection('Users').findOneAndUpdate({
        _id : ObjectID('5a7130fd0e0e6fd3b8f464dd')
        }, {
            $set: {
                name: "Adam"
                },
            $inc: {
                age: 1
                }
        },
        {
            returnOriginal: false
        }).then((result) => {
                console.log(result);
        });
    

        db.close();
});