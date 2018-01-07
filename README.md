# Dropbox Prototype

## Requirements

For development, you will need Node.js, ReactJS,  Zookeeper, Kafka and MongoDB installed on your environement.

### Node

[Node](http://nodejs.org/) is really easy to install & now include [NPM](https://npmjs.org/).
You should be able to run the following command after the installation procedure
below.

    $ node --version
    v0.10.24

    $ npm --version
    1.3.21
    
---

## Clone

    $ git clone https://github.com/DivyaThazha/CMPE273_Lab2_Dropbox.git
    
## Install & start client and server

Back-end server
	1. cd nodelogin
	2. npm install
	3. npm start

Front-end server
	1. cd reactlogin
	2. npm install
	3. npm start

---

## Languages & tools

#### HTML


#### JavaScript

- [React](http://facebook.github.io/react) is used for UI.

#### CSS & Bootstarp
#### Zookeeper
#### Apache Kafka

Create following topics in Kafka:
		
	kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dropbox_login
	
	kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dropbox_updateUserDetails
	
	kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dropbox_getUserDetails
	
	kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dropbox_getAllFiles
	
	kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dropbox_upload
	
	kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dropbox_delete
	
	kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dropbox_share
	
	kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dropbox_getFolderFiles
	
	kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic dropbox_group


---

## Screenshots

- Home Page
![alt text](https://github.com/DivyaThazha/CMPE273_Lab2_Dropbox/reactlogin/Images/screenshot1.png)

- Groups
![alt text](https://github.com/DivyaThazha/CMPE273_Lab2_Dropbox/reactlogin/Images/screenshot2.png)
