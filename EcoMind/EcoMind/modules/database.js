var mongo = require('mongodb');


var database_modules_list = [
    'users',
    'news_posts'
];

function initialize_modules(main_database) {
    console.log("database.initialize_modules: Initializing database modules...");
    database_modules_list.forEach(function (coll) {
        module.exports[coll] = require('../database/' + coll + '.js')();
        module.exports[coll].initialize(main_database);
    });
}

var exportable = {

    connect: function (callback) {
    
        var mongo_uri = 'mongodb://127.0.0.1:27017/ecomind_database';

        console.log('database.connect: Connecting @', mongo_uri);

        mongo.MongoClient.connect(mongo_uri, callback);
    },

    initialize: function (callback) {

        exportable.connect(function (error, client) {
            if (error) {
                throw error;
            }

            console.log('database.MongoClient.connect: Database connected @ecomind_database');

            initialize_modules(client);
			
			callback();
            
        });
    }
};

for (var method in exportable) {
    if (exportable.hasOwnProperty(method)) {
        exports[method] = exportable[method];
    }
}