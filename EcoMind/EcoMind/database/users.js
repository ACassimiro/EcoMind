var mongo = require('mongodb');
var createTokens = require('../modules/createTokens.js');

module.exports = function () {

    return {

        initialize: function (main_database) {
            users = main_database.collection('users');
            relationship = main_database.collection('relationship');
            progress = main_database.collection('progress');
            console.log("database.users: users and relationship collection created");
        },

        add: function (email, pass, name, birthdate, gender, preferences, userImage, callback) {
            var _userNotFound_then_add = function (err, obj) {
                if (err) {
                    callback(err, undefined);
                } else if (!obj) {
                    var tokens = createTokens.extractTokens(name);
                    users.insert({email: email, pass: pass, name: name, tokens: tokens, registerDate: new Date(), birthdate: birthdate, gender: gender, preferences: preferences, image: userImage}, {safe: true}, callback);
                } else {
                    callback({err: 'User email already in use'}, undefined);
                }
            };

            users.findOne({email: email}, _userNotFound_then_add);
        },

        check: function (email, pass, callback) {
            users.findOne({ email: email, pass: pass}, callback);
        },
        
        getUserEmail: function (email, callback) {
            users.findOne({email: email}, callback);
        },

        getUserId: function (userId, callback) {
            users.findOne({_id: new mongo.ObjectID(userId)}, callback);
        },

        getUserList: function (filter, number, callback) {
            users.find(filter).skip(number + 5).limit(5).toArray(callback);
        },

        getUserIdServer: function (comId, user) {
            user = users.findOne({_id: new mongo.ObjectID(comId)});
            return user;
        },

        editPassword: function (userId, new_pass, callback) {
            users.update({_id: new mongo.ObjectID(userId)}, {$set: { pass: new_pass }}, {safe: true}, callback);
           
        },

        editImage: function (userId, new_image, callback) {
            users.update({_id: new mongo.ObjectID(userId)}, {$set: { image: new_image }}, {safe: true}, callback);           
        },

        updateUser: function (userId, fields, callback) {
            users.update({_id: new mongo.ObjectID(userId)}, {$set: fields}, {safe: true}, callback);
        },

        getList: function (filter, callback) {
            users.find(filter, {email: 1}).toArray(callback);
        },

        findOne: function (email, callback) {
            users.findOne({ email: email}, callback);
        },

        addFan: function (fan_id, idol_id, callback) {
            relationship.insert({"fan": fan_id, "idol": idol_id}, callback);
        },

        removeIdol: function (fan_id, idol_id, callback) {
            relationship.remove({"fan": fan_id, "idol": idol_id}, callback);
        },

        findIdol: function (fan_id, idol_id, callback) {
            relationship.findOne({"fan": fan_id, "idol": idol_id}, callback);
        },

        findFansList: function (idol_id, callback) {
            relationship.find({"idol": idol_id}).toArray(callback);
        },

        findIdolsList: function (fan_id, callback) {
            relationship.find({"fan": fan_id}).toArray(callback);
        },

        addUserProgress: function (userId, ecological_footprint, callback) {
            progress.insert({"userId": userId, "timestamp": new Date(), "ecological_footprint": ecological_footprint }, callback)
        }

    };
}
