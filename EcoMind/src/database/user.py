from datetime import datetime

global db
users = db.users

def insert_user(email, name, password, birth_date, gender, photo, ecological_preferences, objectives_achievements):
    global users
    users.insert({"email": email, "name": name, "password": password, "birthdate": datetime.datetime(birth_date[0],birth_date[1], birth_date[2]),
                  "gender": gender, "ecological_prefereces": ecological_preferences, "objectives_achievements": objectives_achievements})