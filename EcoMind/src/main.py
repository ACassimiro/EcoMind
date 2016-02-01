from pymongo import *
from datetime import datetime
from bson.objectid import ObjectId
from database.user import *
from database.connection import *
from server import *

 
def start ():
    print "a"
    init_server()
    
    #db = connect_to_database() 
    #user = User(db)
    #user.insert_user("ricks@gmail.com", "Ricardo Sakurai", "030394", [1994,6,10], "male", "fff", ["water", "electricity"], [])
    # a = find_one_user("56a92a1e3666cf6105dc9feb")
    #update_user("56a92a1e3666cf6105dc9feb", {"photo": "shshshaushshsuahs"})
   


if __name__ == "__main__":
    start()