

This is a Proof of Concept showing Flex embedded within an application. Flex runs as an iframe, a child of your application. This PoC also shows how bi-directional communication between Flex and an application can be implemented using postmessages. Three use cases are covered: 
- click to dial, using postmessage and the Flex Activity Framework.
- how Flex can communicate with your Application to screenpop the CRM or other applications when receiving an inbound call.
- how Flex can publish interaction activity history after hangup.

Demonstration for inbound screenpop and interaction activity history:

[![Demo Example Inbound](https://github.com/rbangueses/flex-inside-iframe/blob/main/InboundScreenPop.mov)

Demonstration for outbound click to dial and interaction activity history:

[![Demo Example Outbound](https://github.com/rbangueses/flex-inside-iframe/blob/main/ClickToDial.mov)


Triggers from and to Twilio Flex are not limited to these use cases. You can communicate between platforms by adding new triggers to specific user actions on both applications, as well as support any channel.

Sequence diagram for an inbound interaction, with screenpop and interaction activity postMessage triggers:

![Inbound Sequence Diagram](https://github.com/rbangueses/flex-inside-iframe/blob/main/Inbound%20flow.png?raw=true)

Sequence diagram for the click to dial and interaction activity postMessage triggers:

![Outbound Sequence Diagram](https://github.com/rbangueses/flex-inside-iframe/blob/main/click%20to%20dial%20flow.png?raw=true)

Solution components:
-   a web application (CRM or other) that can be modified to send and listen to postMessage.
-   a Twilio Flex plugin, that will send and receive postMessage.

You can find more information about the Flex Activity Framework here.

You can find more information about postMessage here.

Interested in seeing how you can bring your own applications inside Flex? here's an example.

What if you just want to bring some data into the Flex application? here's another example.


