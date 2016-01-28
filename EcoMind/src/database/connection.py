from pymongo import *

db = 0
    
def connect_to_database():
    client = MongoClient('localhost', 27017)
    global db
    db = client.ecomind_database