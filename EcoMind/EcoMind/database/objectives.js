//var async = require('async');

module.exports = function () {

    return {
        initialize: function (main_database) {
            objectives = main_database.collection('objectives');
            console.log("database.objectives: objectives collection created");
        },

        add: function (title, description, ecological_field, callback) {
            objectives.insert({"title": title, "description": description, "ecological_field": ecological_field}, callback);
        },

        find: function (objectives_filter, callback) {
            objectives.find(objectives_filter).toArray(callback);
        }
    };
}