#!/usr/bin/env python
# -*- coding: utf-8 -*- 

from pymongo import *
from datetime import datetime
from bson.objectid import ObjectId

class User:
    def __init__(self, db):
        self.db = db
    
    """
        Insert a new user on the system
        email: String
        name: String
        password: String
        birthdate: Array [year, month, day]
        gender: String (female or male)
        photo: String
        ecological_preferences: Array [“water”, “electricity”, “food waste”, “trash”, “car usage”, “miscellaneous”]
        objectives_achievements: Array [objectives_title]
    
    """
    def insert_user(self, email, name, password, birth_date, gender, photo, ecological_preferences, objectives_achievements):
        self.db.users.insert({"email": email, "name": name, "password": password, "birthdate": datetime(birth_date[0],birth_date[1], birth_date[2]),
                      "gender": gender, "ecological_prefereces": ecological_preferences, "photo": photo, "objectives_achievements": objectives_achievements})
    
    """
        Find a user by his id
        userId: String
    """
    def find_one_user(self, userId):
        
        user = self.db.users.find_one({u'_id': ObjectId(userId)})
        return user
    
    """
        Update a user in the database, using his id to search for the element and passing all the new values on field.
        userId: String
        fields: Dictionary
    """
    def update_user(self, userId, fields):
        self.db.users.update_one({u'_id': ObjectId(userId)}, {"$set": fields})
        
    """
        Creates the relationship between two users, one being the fan of the other in the "relationship" collection
        userId: String 
        idolId: String
        
    """
    def insert_new_fan(self, userId, idolId):
        self.db.relationship.insert({"fan_id": userId, "idol_id": idolId})
        
    """
        Returns all the users that are fans of the user that requested the action
        idolId: String
    """
    def find_fan_list(self, idolId): 
        fan_list = self.db.relationship.find({"idol_id": idolId}, {"fan_id": 1, "_id": 0, "idol_id": 0})
        return fan_list
    
    """
        Returns all the users that athe user that requested the action is a fan
        fanId: String
    """
    def find_idols_list(self, fanId): 
        idols_list = self.db.relationship.find({"fan_id": fanId}, {"idol_id": 1, "_id": 0, "fan_id": 0})
        return idols_list    
    
    
    """
        When a user updates the ecological form, the new info is saved in the progress history, to comparison be made in the future.
        userId: String
        ecological_footprint: Dictionary
    """
    def insert_user_progress(self, userId, ecological_footprint):
        self.db.progress.insert({"user_id": userId, "timestamp": datetime.now, "ecological_footprint": ecological_footprint })
        