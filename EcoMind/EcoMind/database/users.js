//var async = require('async');

module.exports = function () {

    return {

        initialize: function (main_database) {
            users = main_database.collection('users');
            relationship = main_database.collection('relationship');
            progress = main_database.collection('progress');
            console.log("database.users: users and relationship collection created");
        },

        add: function (email, pass, name, birthdate, gender, preferences, callback) {
            var _userNotFound_then_add = function (err, obj) {
                if (err) {
                    callback(err, undefined);
                } else if (!obj) {
                    users.insert({email: email, pass: pass, name: name, registerDate: new Date(), birthdate: birthdate, gender: gender, preferences: preferences}, {safe: true}, callback);
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

        editPassword: function (email, new_pass, callback) {
            if (typeof user === 'string' && typeof new_pass === 'string' && new_pass !== '') {
                users.update({email: email }, {$set: { pass: new_pass }}, {safe: true}, callback);
            } else {
                callback(null, null);
            }
        },


        updateUser: function (email, fields) {
            users.update({ email: email }, {$set: fields}, {safe: true}, callback);
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

        findFanList: function (idol_id, callback) {
            relationship.find({"idol": idol_id}, {"fan": 1, "_id": 0, "idol": 0}).toArray(callback);
        },

        findIdolsList: function (fan_id, callback) {
            relationship.find({"fan": fan_id}, {"idol": 1, "_id": 0, "fan": 0}).toArray(callback);
        },

        addUserProgress: function (userId, ecological_footprint, callback) {
            progress.insert({"userId": userId, "timestamp": new Date(), "ecological_footprint": ecological_footprint }, callback)
        }

    };
}
