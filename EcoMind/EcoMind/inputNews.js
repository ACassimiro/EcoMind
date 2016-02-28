var http = require('http');
var socketio = require('socket.io');
var express = require('express');

var car_usage = require('./newsJSON/car_usage.json');
var electricity = require('./newsJSON/electricity.json');
var food_waste = require('./newsJSON/food_waste.json');
var trash = require('./newsJSON/trash.json');
var water = require('./newsJSON/water.json');
var database = require('./modules/database.js');
var async = require("async");
function fillDatabase() {
	var news = [];

	car_usage.news.forEach(function(car){
		car['ecological_field'] = ["car_usage"];
		news.push(car);
	});

	electricity.news.forEach(function(e){
		e['ecological_field'] = ["electricity"];
		news.push(e);
	});

	food_waste.news.forEach(function(food){
		food['ecological_field'] = ["food_waste"];
		news.push(food);
	});

	trash.news.forEach(function(t){
		t['ecological_field'] = ["trash"];
		news.push(t);
	});

	water.news.forEach(function(w){
		w['ecological_field'] = ["water"];
		news.push(w);
	});

	async.each(news, function(n, callback) {

        database['news_posts'].add(null, "news", n["ecological_field"], n['title'], n["description"], null, new Date(Date.parse(n["date"])), n["url"], function(err, ne) {
        	if (err) {
        		callback(err);
        	}
            callback();
            
        });
    }, function(err){ 
        if (err) {
        	console.log("An error occured", err);
        }
    });   
	
}
 
// Inits the magic. Connects to the database - Similar to the main
database.initialize(function () {
    console.log('Initializing server');
    // Initialize the server
    fillDatabase();
});

