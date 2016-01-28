from pymongo import *
from datetime import datetime
from bson.objectid import ObjectId

"""
    Insert a new post or news into the collection of news_posts
    post_type: String in [poll, news, posts]
    description: String
    options: Array (Just for Polls)
"""
def insert_news_or_posts(post_type, ecological_field, description, options):
    element = {"type": post_type, "timestamp": datetime.now(), "ecological_field": ecological_field, "description": description}
    if type == "poll":
        element["options"] = options
    element["comments"] = []
    global db
    db.news_posts.insert(element)
    
""" 
    Returns the posts and/or news that corresponds to the search
    post_filter: Dictionary
"""
def get_news_posts(post_filter):
    global db
    news_posts = db.news_posts.find(post_filter)
    return news_posts

"""
    Insert a new comment on the Post
    news_post_id: String
    comment: Dictionary in ther format of {user_id:id, message:comment}
"""
def insert_comments(news_post_id, comment):
    comment["timestamp"] = datetime.now()
    global db
    db.news_posts.update_one({u'_id': ObjectId(news_post_id)}, {'$addToSet': {"comments": comment}})
    
