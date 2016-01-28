from pymongo import *
from datetime import datetime
from bson.objectid import ObjectId

"""
    Insert a new objective in the objectives collection
    title: String
    description: String
    ecological_field: Array in (“water”, “electricity”, “food waste”, “trash”, “car usage”)
"""
def insert_objective(title, description, ecological_field):
    global db
    db.objectives.insert({"title": title, "description": description, "ecological_field": ecological_field})

"""
    Returns the objective that has an specific id
    objectiveId: String
"""
def get_objective(objectiveId):
    global db
    objective = db.objectives.find_one({u'_id': ObjectId(objectiveId)})
    return objective

"""
    Returns objectives with the specified filter
    objectives_filter: Dictionary
"""
def get_objectives(objectives_filter):
    global db
    objectives = db.objectives.find(objectives_filter)
    return objectives