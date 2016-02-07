var mongo = require('mongodb');


var database_modules_list = {
 	news_posts: require("../database/news_posts.js"),
    objectives: require("../database/objectives.js"),
    user: require("../database/user.js")

};

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
			
			callback();
            
        });
    }
};

for (var method in exportable) {
    if (exportable.hasOwnProperty(method)) {
        exports[method] = exportable[method];
    }
}