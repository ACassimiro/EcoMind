//var async = require('async');

module.exports = function () {

    return {

        initialize: function (main_database) {
            users = main_database.collection('users');
            console.log("database.users: users collection created");
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
            users.findOne({ _id: email, pass: pass, active: true}, callback);
        },
        
        getUser: function (email, callback) {
            users.findOne({_id: email}, callback);
        },

        /**
         * Edit an user password
         * @param {String} user User name
         * @param {String} new_pass New password
         * @param {function} callback function (Error, Object)
         */
        editPassword: function (email, new_pass, callback) {
            if (typeof user === 'string' && typeof new_pass === 'string' && new_pass !== '') {
                users.update({ _id: email }, {$set: { pass: new_pass }}, {safe: true}, callback);
            } else {
                callback(null, null);
            }
        },

        /**
         * Find users
         * @param {Object} filter MongoDB Query to filter
         * @param {function} callback function (Error, Object)
         */
        getList: function (filter, callback) {
            users.find(filter, {_id: 1}).toArray(callback);
        },

        /**
         * Find an user by the name
         * @param {String} user User name
         * @param {function} callback function (Error, Object)
         */
        findOne: function (email, callback) {
            users.findOne({ _id: email}, callback);
        }
    };
};
