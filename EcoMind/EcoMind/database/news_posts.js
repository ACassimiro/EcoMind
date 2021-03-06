var mongo = require('mongodb');
var createTokens = require('../modules/createTokens.js');

module.exports = function () {

    return {

        initialize: function (main_database) {
            news_posts = main_database.collection('news_posts');
            console.log("database.news_posts: news_posts collection created");
        },
        // user = email
        add: function (user, type, ecological_field, title, description, options, date, url, callback) {
            var tokens = createTokens.extractTokens(title);
            tokens = createTokens.removeDuplicatedWords(tokens.concat(ecological_field));
            console.log(tokens);

            var query = {
                type: type,
                ecological_field: ecological_field,
                title: title,
                description: description,
                tokens: tokens
            };

            if (type === "poll") {
                query["options"] = options;
            }

            if (user !== null && user !== undefined) {
                query['user'] = user;
            }

            if (date !== null && date !== undefined) {
                query['timestamp'] = date;
            } else {
                query['timestamp'] = new Date();
            }

            if (url !== null && url !== undefined) {
                query['url'] = url;
            }
            
      
            news_posts.insert(query, {safe: true}, callback);
                
        },

        getUserPosts: function (user, number, limit, callback) {
            var cursor = news_posts.find({user: user}).skip(number).sort({timestamp: -1});
            // console.log(news_posts.find({user: user}).skip(number).limit(1));
            if (limit !== null && limit !== undefined) {
                cursor.limit(limit);
            }

            cursor.toArray(callback);
        
        },

        getList: function (filter, number, callback) {
            news_posts.find(filter).skip(number + 5).limit(5).sort({timestamp: -1}).toArray(callback);
        },

        getSearchList: function (filter, number, callback) {
            var tokenizedFilter = createTokens.extractTokens(filter);
            console.log(tokenizedFilter);

            news_posts.find({'tokens': {$in:tokenizedFilter}}).skip(number + 5).limit(5).sort({timestamp: -1}).toArray(callback);
        },

        findOne: function (id, callback) {
            news_posts.findOne({ _id: id}, callback);
        },

        findEcologicalField: function(ecological_field) {
            news_posts.find({ecological_field:  {'$in': ecological_field}}).sort({timestamp: -1}).toArray(callback);
        },

        findByType: function(type) {
            news_posts.find({type: type}).toArray(callback);
        },

        addComment: function(id, userId, newComment, callback) {
            news_posts.update({_id: new mongo.ObjectID(id)}, {'$push': {comments: {comment: newComment, id: userId}}}, {safe: true}, callback);
        },

        incLike: function(id, userId, callback) {
            news_posts.update({_id: new mongo.ObjectID(id)}, {'$inc': {likes: 1}, '$push': {likesIds: userId}}, {safe: true}, callback);
        },

        disLike: function(id, userId, callback) {
            news_posts.update({_id: new mongo.ObjectID(id)}, {'$inc': {likes: -1}, '$pull': {likesIds: userId}}, {safe: true}, callback);
        }


    };
};
