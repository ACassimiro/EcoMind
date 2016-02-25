//var async = require('async');

module.exports = function () {

    return {

        initialize: function (main_database) {
            news_posts = main_database.collection('news_posts');
            console.log("database.news_posts: news_posts collection created");
        },
        // user = email
        add: function (user, type, ecological_field, title, description, options, callback) {
            var query = {
                user: user,
                type: type,
                ecological_field: ecological_field,
                title: title,
                description: description,
                timestamp: new Date()
            }

            if (type === "poll") {
                query["options"] = options;
            }
            
      
            news_posts.insert(query, {safe: true}, callback);
                
        },

        getUserPosts: function (user, limit, callback) {
            var cursor = news_posts.find({user: user});
                
            if (limit !== null && limit !== undefined) {
                cursor.limit(limit);
            }

            cursor.toArray(callback);
        
        },

        getList: function (filter, number, callback) {
    	    news_posts.find(filter).skip(number + 5).limit(5).toArray(callback);
    	},


        findOne: function (id, callback) {
            news_posts.findOne({ _id: id}, callback);
        },

        findEcologicalField: function(ecological_field) {
            news_posts.find({ecological_field:  {'$in': ecological_field}}).toArray(callback);
        },

        findByType: function(type) {
            news_posts.find({type: type}).toArray(callback);
        }


    };
};
