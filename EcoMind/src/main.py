from pymongo import *
from database.user import insert_user

db = 0

def connect_to_database():
    client = MongoClient('localhost', 27017)
    global db
    db = client.ecomind_database
 
def start ():
    connect_to_database() 
    insert_user("heloisacarbone@gmail.com", "Heloisa Carbone", "030394", [1994,3,3], "female", "sjsjsjs", ["water", "trash"], [])

if __name__ == "__main__":
    start()