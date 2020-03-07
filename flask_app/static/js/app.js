$(document).ready(function(){
    /* Pre-loading data from the localStorage */
    let data = {'payloadString': JSON.stringify(getCachedData())}
    setDefaultValues(data);

    /* Define Broker */
    const BROKER = 'broker.mqttdashboard.com';
    const PORT = 8000;

    /* Create first PI's client to listen to the publishing thread */
    const CLIENTID = 'clientId-jrhjgbKplR';
    const SUBSCRIBER = 'topic-dwo/pi1/publishing';
    client = new Paho.MQTT.Client(BROKER, PORT, CLIENTID);
    client.connect({onSuccess:onConnect});
    client.onMessageArrived = onMessageArrived;
    enablePI1Buttons();
    
    /* Create second PI's client to listen to the publishing thread */
    const CLIENTID2 = 'clientId-GKBut4gLOc';
    let SUBSCRIBER2 = 'topic-dwo/pi2/publishing'
    client_pi2 = new Paho.MQTT.Client(BROKER, PORT, CLIENTID2);
    client_pi2.connect({onSuccess:onConnect_PI2});
    client_pi2.onMessageArrived = onMessageArrived_PI2;


    // called when the client connects
    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onConnect");
        client.subscribe(SUBSCRIBER);
    }

    // called when the client connects
    function onConnect_PI2() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onConnect");
        client_pi2.subscribe(SUBSCRIBER2);
    }

    // called when a message arrives
    function onMessageArrived(message) {
        console.log("onMessageArrived:"+message.payloadString);
        let readings = JSON.parse(message.payloadString);
        $('#pi1_timestamp').text(readings['timestamp']);
        $('#illuminance_value').text(readings['illuminance']);
        $('#temperature_value').text(readings['temperature']);
        $('#humidity_value').text(readings['humidity']);
        localStorage.setItem('illuminance', readings['illuminance']);
        localStorage.setItem('temperature', readings['temperature']);
        localStorage.setItem('humidity', readings['humidity']);
        localStorage.setItem('pi1_timestamp', readings['timestamp']);
    }

    // called when a message arrives
    function onMessageArrived_PI2(message) {
        console.log("onMessageArrived:"+message.payloadString);
        let readings = JSON.parse(message.payloadString);
        let soil_status = readings['soil_probe'] == 1 ? 'Low': 'High';
        $('#pi2_timestamp').text(readings['timestamp']);
        $('#soil_probe_value').text(soil_status);
        localStorage.setItem('soil_probe', soil_status);
        localStorage.setItem('pi2_timestamp', readings['timestamp']);
        console.log(localStorage.getItem('soil_probe'))
    }


    function getCachedData(){
        let illuminance = localStorage.getItem('illuminance') != undefined ? localStorage.getItem('illuminance') : "-";
        let temperature = localStorage.getItem('temperature') != undefined ? localStorage.getItem('temperature') : "-";
        let humidity = localStorage.getItem('humidity') != undefined ? localStorage.getItem('humidity') : "-";
        let soil_probe = localStorage.getItem('soil_probe') != undefined ? localStorage.getItem('soil_probe') : "-";
        let p1_ts = localStorage.getItem('pi1_timestamp') != undefined ? localStorage.getItem('pi1_timestamp') : "-";
        let p2_ts = localStorage.getItem('pi1_timestamp') != undefined ? localStorage.getItem('pi1_timestamp') : "-";
        return {
                'pi1_timestamp': p1_ts,
                'pi2_timestamp': p2_ts,
                'illuminance': illuminance,
                'humidity': humidity,
                'temperature': temperature,
                'soil_probe': soil_probe,
        };
    }

    function setDefaultValues(data){
        onMessageArrived(data);
        onMessageArrived_PI2(data);
    }

    function enablePI1Buttons(){
        $('#pi1_send').click(function(){
            const MSG_TOPIC = 'topic-dwo/pi1/listen';
            let message_text = $('.message-text').val();
            let message_data = `{"message": "${message_text}", "publishing": true}`;
            sendMessage(message_data, MSG_TOPIC);
        });
    }

    function sendMessage(message_data, destination){
        message = new Paho.MQTT.Message(message_data);
        message.destinationName = destination;
        client.send(message);
        console.log("Message Sent")
    }
})