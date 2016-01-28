from pymongo import *
from datetime import datetime
from bson.objectid import ObjectId

db = 0
    
def connect_to_database():
    client = MongoClient('localhost', 27017)
    global db
    db = client.ecomind_database
 
def start ():
    print "a"
    connect_to_database() 
    print "b"
    #insert_user("heloisacarbone@gmail.com", "Heloisa Carbone", "030394", [1994,3,3], "female", "sjsjsjs", ["water", "trash"], [])
    # a = find_one_user("56a92a1e3666cf6105dc9feb")
    #update_user("56a92a1e3666cf6105dc9feb", {"photo": "shshshaushshsuahs"})
    print "c"

if __name__ == "__main__":
    start()