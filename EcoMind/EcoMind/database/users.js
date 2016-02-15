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
                    users.insert({ _id: email, pass: pass, name: name, registerDate: new Date(), birthdate: birthdate, gender: gender, preferences: preferences}, {safe: true}, callback);
                } else {
                    callback({err: 'User email already in use'}, undefined);
                }
            };

            users.findOne({_id: email}, _userNotFound_then_add);
        },

        check: function (email, pass, callback) {
            users.findOne({ _id: email, pass: pass}, callback);
        },
        
        getUser: function (email, callback) {
            users.findOne({_id: email}, callback);
        },

        editPassword: function (email, new_pass, callback) {
            if (typeof user === 'string' && typeof new_pass === 'string' && new_pass !== '') {
                users.update({ _id: email }, {$set: { pass: new_pass }}, {safe: true}, callback);
            } else {
                callback(null, null);
            }
        },


        updateUser: function (email, fields) {
            users.update({ _id: email }, {$set: fields}, {safe: true}, callback);
        },

        getList: function (filter, callback) {
            users.find(filter, {_id: 1}).toArray(callback);
        },

        findOne: function (email, callback) {
            users.findOne({ _id: email}, callback);
        },

        addFan: function (fan_email, idol_email, callback) {
            relationship.insert({"fan": fan_email, "idol": idol_email}, callback);
        },

        findFanList: function (idol_email, callback) {
            relationship.find({"idol": idol_email}, {"fan": 1, "_id": 0, "idol": 0}).toArray(callback);
        },

        findIdolsList: function (fan_email, callback) {
            relationship.find({"fan": fan_email}, {"idol": 1, "_id": 0, "fan": 0}).toArray(callback);
        },

        addUserProgress: function (email, ecological_footprint, callback) {
            progress.insert({"email": userId, "timestamp": new Date(), "ecological_footprint": ecological_footprint }, callback)
        }

    };
}
