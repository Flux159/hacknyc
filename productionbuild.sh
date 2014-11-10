#Tested on Ubuntu Server 14.04
#Install Dependencies and create directories
sudo apt-get update
sudo apt-get install -y mongodb-server nodejs npm build-essential
sudo apt-get install -y git
sudo ln -s /usr/bin/nodejs /usr/bin/node
mkdir /home/ubuntu/data
mkdir /home/ubuntu/log

#Start mongodb in background:
mongod --dbpath /home/ubuntu/data --fork --logpath /home/ubuntu/log/mongodb.log --smallfiles

#Clone git repo & change into directory:
git clone https://github.com/Flux159/hacknyc.git
cd hackync
npm install

#Start node app on port 80:
NODE_ENV=production node app.js