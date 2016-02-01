#!/usr/bin/env python
# -*- coding: utf-8 -*- 
from pymongo import *

""" Creates a connection with a database"""    
def connect_to_database():
    client = MongoClient('localhost', 27017)
    return client.ecomind_database
    