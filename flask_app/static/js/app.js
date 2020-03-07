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
        $('#illuminance_value').text(readings['illuminance']);
        $('#temperature_value').text(readings['temperature']);
        $('#humidity_value').text(readings['humidity']);
        localStorage.setItem('illuminance', readings['illuminance']);
        localStorage.setItem('temperature', readings['temperature']);
        localStorage.setItem('humidity', readings['humidity']);
    }

    // called when a message arrives
    function onMessageArrived_PI2(message) {
        console.log("onMessageArrived:"+message.payloadString);
        let readings = JSON.parse(message.payloadString);
        let soil_status = readings['soil_probe'] == 1 ? 'Low': 'High';
        $('#soil_probe_value').text(soil_status);
        localStorage.setItem('soil_probe', soil_status);
        console.log(localStorage.getItem('soil_probe'))
    }


    function getCachedData(){
        let illuminance = localStorage.getItem('illuminance') != undefined ? localStorage.getItem('illuminance') : "-";
        let temperature = localStorage.getItem('temperature') != undefined ? localStorage.getItem('temperature') : "-";
        let humidity = localStorage.getItem('humidity') != undefined ? localStorage.getItem('humidity') : "-";
        let soil_probe = localStorage.getItem('soil_probe') != undefined ? localStorage.getItem('soil_probe') : "-";
        return {
            'timestamp': new Date().toISOString(),
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


})