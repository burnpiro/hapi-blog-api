#!/bin/bash

#Force file syncronization and lock writes
echo "Lock writes..."
mongo admin --eval "printjson(db.fsyncLock())"

MONGODUMP_PATH="/usr/bin/mongodump"
MONGO_HOST="127.0.0.1" # replace with your server ip if taking dump from other machine
MONGO_PORT="27017"
MONGO_DATABASE="blog2" # replace with your database name

TIMESTAMP=`date +%F-%H%M`

# Create backup
echo "Taking dump and storing in /home/ubuntu/backup/..."
cd /home/ubuntu/backup
mongodump -h $MONGO_HOST:$MONGO_PORT -d $MONGO_DATABASE

# Add timestamp to backup
echo "Making zip of dump created..."
mv dump backups/mongodb-$HOSTNAME-$TIMESTAMP
tar cf backups/mongodb-$HOSTNAME-$TIMESTAMP.tar.gz backups/mongodb-$HOSTNAME-$TIMESTAMP
