#!/usr/bin/env python
# -*- coding: utf-8 -*- 

from pymongo import *
from datetime import datetime
from bson.objectid import ObjectId

class Objectives:
    def __init__(self, db):
        self.db = db
    
    """
        Insert a new objective in the objectives collection
        title: String
        description: String
        ecological_field: Array in (“water”, “electricity”, “food waste”, “trash”, “car usage”)
    """
    def insert_objective(self, title, description, ecological_field):
        self.db.objectives.insert({"title": title, "description": description, "ecological_field": ecological_field})
    
    """
        Returns the objective that has an specific id
        objectiveId: String
    """
    def get_objective(self, objectiveId):
        objective = self.db.objectives.find_one({u'_id': ObjectId(objectiveId)})
        return objective
    
    """
        Returns objectives with the specified filter
        objectives_filter: Dictionary
    """
    def get_objectives(self, objectives_filter):
        objectives = self.db.objectives.find(objectives_filter)
        return objectives