

This is a Proof of Concept showing Flex embedded within an application. Flex runs as an iframe, a child of your application. This PoC also shows how bi-directional communication between Flex and an application can be implemented using postmessages. Three use cases are covered: 
- click to dial, using postmessage and the Flex Activity Framework.
- how Flex can communicate with your Application to screenpop the CRM or other applications when receiving an inbound call.
- how Flex can publish interaction activity history after hangup.

Demonstration for inbound screenpop and interaction activity history:

https://user-images.githubusercontent.com/98812531/222751791-935c6e2b-e073-4a42-9fdc-75fd27803696.mov

Demonstration for outbound click to dial and interaction activity history:

https://user-images.githubusercontent.com/98812531/222751888-11e3d96f-e95c-44a6-878c-657d0f0ea73d.mov

Triggers from and to Twilio Flex are not limited to these use cases. You can communicate between platforms by adding new triggers to specific user actions on both applications, as well as support any channel.

Sequence diagram for an inbound interaction, with screenpop and interaction activity postMessage triggers:

![Inbound Sequence Diagram](https://github.com/rbangueses/flex-inside-iframe/blob/main/Inbound%20flow.png?raw=true)

Sequence diagram for the click to dial and interaction activity postMessage triggers:

![Outbound Sequence Diagram](https://github.com/rbangueses/flex-inside-iframe/blob/main/click%20to%20dial%20flow.png?raw=true)

Solution components:
-   a web application (CRM or other) that can be modified to send and listen to postMessage.
-   a Twilio Flex plugin, that will send and receive postMessage.

Note: you need to securely embed flex as an iframe. [The instructions can be found here](https://www.twilio.com/docs/flex/admin-guide/setup/secure-iframe).

[Click to find out more on Flex Activity Framework](https://www.twilio.com/docs/flex/developer/ui/v1/actions).

[Click to read about postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

Interested in seeing how you can bring your own applications inside Flex? [Here's an example](https://www.twilio.com/blog/integrating-twilio-flex-and-hubspot-crm).

What if you just want to bring some data into the Flex application? [Here's another example](https://github.com/rbangueses/DataOnCanvasTab).


