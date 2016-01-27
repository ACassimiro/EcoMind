from pymongo import *
from datetime import datetime

db = 0


def insert_user(email, name, password, birth_date, gender, photo, ecological_preferences, objectives_achievements):
    db.users.insert({"email": email, "name": name, "password": password, "birthdate": datetime(birth_date[0],birth_date[1], birth_date[2]),
                  "gender": gender, "ecological_prefereces": ecological_preferences, "objectives_achievements": objectives_achievements})

def connect_to_database():
    client = MongoClient('localhost', 27017)
    global db
    db = client.ecomind_database
 
def start ():
    print "a"
    connect_to_database() 
    print "b"
    insert_user("heloisacarbone@gmail.com", "Heloisa Carbone", "030394", [1994,3,3], "female", "sjsjsjs", ["water", "trash"], [])

if __name__ == "__main__":
    start()