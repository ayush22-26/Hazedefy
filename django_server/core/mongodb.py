from pymongo import MongoClient
from django.conf import settings

# In your settings.py, add MONGODB_URI = 'your mongodb connection string'

client = MongoClient(settings.MONGODB_URI)
db = client['Hazedefy-db']  # replace with your DB name
collection = db['uploads']  # a collection to save upload info
