window.onload = function () {
    const flexUrl = 'http://localhost:3000/agent-desktop';

    // Get the window displayed in the iframe.
    if (document.getElementById('flex')){
        console.log("iframe found with id flex")
        var receiver = document.getElementById('flex').contentWindow;
    }
    else{
        console.log("No iframe with id flex found.");
        console.log(window.parent.frames);
    }

    // Get a reference to the 'Send Message' button.
    var button = document.getElementById('callButton');

    // A function to handle sending messages.
    function sendMessage(e) {
        // Prevent any default browser behaviour.
        e.preventDefault();
        cleanParameterTable();
        console.log("sending postmessage with phonenumber: ", document.getElementById('numberToCall').value);
        // Send a message with the the phonenumber to the flex frame
        receiver.postMessage(document.getElementById('numberToCall').value, flexUrl);
    }

    // A function to handle sending messages.
    function receiveMessage(e) {
        console.log("parent received: ", e.data);
        const payloadForCRM = JSON.parse(e.data);
        //check if event is for screenpop. For more use cases you can send a key value-pair to identify the postmessage action instead of the logic below.
        if(typeof payloadForCRM.pop !== 'undefined'){
            console.log("in this scenario we screenpop the record");
            cleanParameterTable();
            screenPop(payloadForCRM);
        }
        //otherwise publish activity data
        else {
            activityData(payloadForCRM);
        }
        
    }
    function screenPop(payloadForCRM){
        console.log("screenPop received: ", payloadForCRM);
        const divText = ("We can now use this number to screenpop the crm: " + payloadForCRM.pop);
        document.getElementById("pop").innerHTML = divText;
    }

    function activityData(payloadForCRM){
        console.log("activityData received: ", payloadForCRM);
        document.getElementById("pop").innerHTML = null;
        document.getElementById('from').firstChild.data = payloadForCRM.from;
        document.getElementById('to').firstChild.data = payloadForCRM.to;
        document.getElementById('direction').firstChild.data = payloadForCRM.direction;
        document.getElementById('duration').firstChild.data = payloadForCRM.duration;
        document.getElementById('agent').firstChild.data = payloadForCRM.agent;
    }

    // A function to handle sending messages.
    function cleanParameterTable() {
        document.getElementById('from').firstChild.data = "";
        document.getElementById('to').firstChild.data = "";
        document.getElementById('direction').firstChild.data = "";
        document.getElementById('duration').firstChild.data = "";
        document.getElementById('agent').firstChild.data = "";
    }
    // Add an event listener that will execute the sendMessage() function
    // when the send button is clicked.
    button.addEventListener('click', sendMessage);
    
    // Add an event listener to receive message from flex
    window.addEventListener("message", receiveMessage);

}


