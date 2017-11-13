var kafka = require('kafka-node');

var topics = [
    {topic: 'dropbox_login', partition: 0},
    {topic: 'dropbox_register', partition: 0},
    {topic: 'dropbox_updateUserDetails', partition: 0},
    {topic: 'dropbox_getUserDetails', partition: 0},
    {topic: 'dropbox_getAllFiles', partition: 0},
    {topic: 'dropbox_upload', partition: 0},
    {topic: 'dropbox_delete', partition: 0},
    {topic: 'dropbox_share', partition: 0},
    {topic: 'dropbox_getFolderFiles', partition: 0},
    {topic: 'dropbox_group', partition: 0}
    ];


function ConnectionProvider() {
    this.getConsumer = function(topic_name) {
        if (!this.kafkaConsumerConnection) {

            this.client = new kafka.Client("localhost:2181");
            this.kafkaConsumerConnection = new kafka.Consumer(this.client,topics);
            this.client.on('ready', function () { console.log('client ready!') })
        }
        return this.kafkaConsumerConnection;
    };

    //Code will be executed when we start Producer
    this.getProducer = function() {

        if (!this.kafkaProducerConnection) {
            this.client = new kafka.Client("localhost:2181");
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer(this.client);
            //this.kafkaConnection = new kafka.Producer(this.client);
            console.log('producer ready');
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;