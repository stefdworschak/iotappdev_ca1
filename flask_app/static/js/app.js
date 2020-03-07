$(document).ready(function(){
    /* Pre-loading data from the localStorage */
    let data = {'payloadString': JSON.stringify(getCachedData())}
    console.log(data);
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
        localStorage.setItem('pi1_timestamp', readings['pi1_timestamp']);
        enableDisable('pi1');
    }

    // called when a message arrives
    function onMessageArrived_PI2(message) {
        console.log("onMessageArrived:"+message.payloadString);
        let readings = JSON.parse(message.payloadString);
        let soil_status = readings['soil_probe'] == 1 ? 'Low': 'High';
        $('#pi2_timestamp').text(readings['timestamp']);
        $('#soil_probe_value').text(soil_status);
        localStorage.setItem('soil_probe', soil_status);
        localStorage.setItem('pi2_timestamp', readings['pi2_timestamp']);
        enableDisable('pi2');
    }

    function getDefault(item){
        
        if(item == 'pi1_timestamp' || item == 'pi2_timestamp'){
            console.log('Return Timestamp')
            return localStorage.getItem(item) != undefined ? localStorage.getItem(item) : 0;
        }
        return localStorage.getItem(item) != undefined ? localStorage.getItem(item) : '-';
    }

    function checkEnabled(pi){
        const expiryTime = 20 * 1000; //12s expiry time
        let timestamp = getDefault(`${pi}_timestamp`);
        if(timestamp != undefined){
            const diff = new Date().getTime() - new Date(timestamp).getTime();
            return diff < expiryTime;
        }
        return false; 
    }

    function getCachedData(){
        return {
                'pi1_timestamp': getDefault('pi1_timestamp'),
                'pi2_timestamp': getDefault('pi2_timestamp'),
                'pi1_enabled': checkEnabled('pi1'),
                'pi2_enabled': checkEnabled('pi2'),
                'illuminance': getDefault('illuminance'),
                'humidity': getDefault('humidity'),
                'temperature': getDefault('temperature'),
                'soil_probe': getDefault('soil_probe'),
        };
    }

    function setDefaultValues(data){
        onMessageArrived(data);
        onMessageArrived_PI2(data);
    }

    function enablePI1Buttons(){
        $('#pi1_send').click(function(){
            const MSG_TOPIC = 'topic-dwo/pi1/listen';
            const enabled = checkEnabled('p1');
            console.log(enabled);
            //let message_text = $('.message-text').val();
            //let message_data = `{"message": "${message_text}", "publishing": true}`;
            //sendMessage(message_data, MSG_TOPIC);
        });
    }

    function runEnableDisable(){
        enableDisable('pi1');
        enableDisable('pi2');
    }

    function enableDisable(pi){
        if(checkEnabled(pi)){
            $(`.${pi}_control > button.btn.btn-primary`).hide();
            $(`.${pi}_control > button.btn.btn-warning`).show();
        } else {
            $(`.${pi}_control > button.btn.btn-primary`).show();
            $(`.${pi}_control > button.btn.btn-warning`).hide();
        }
    }

    function sendMessage(message_data, destination){
        message = new Paho.MQTT.Message(message_data);
        message.destinationName = destination;
        client.send(message);
        console.log("Message Sent")
    }
})