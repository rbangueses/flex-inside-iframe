#Introduction

The most common requirement for a Customer Engagement Platform is the ability to integrate with a system of records, such as a CRM or a ticketing system, so that agents don't struggle with yet another application on their desktop. By integrating these systems you can also remove some of the robotic processes, such as no longer having to search for a customer record when someone's calling, or the ability to just click on a customer number on the CRM to dial automatically, contributing to better customer and agent experiences.

Twilio Flex provides a customer engagement platform with a comprehensive set of integration capabilities. At an agent desktop level, you can bring your applications inside Flex, bring Flex inside your applications, or have them run side by side. This document focuses on the scenario where you want to bring Flex inside your application.

This is a Proof of Concept showing Flex embedded within an application. Flex runs as an iframe, a child of your application. This PoC also shows how bi-directional communication between Flex and an application can be implemented using postMessage. Three use cases are covered: 
- how Flex can communicate with your Application to screenpop the CRM or other applications when receiving an inbound call.
- click to dial, using postMessage and the Flex Activity Framework.
- how Flex can publish interaction activity history after hangup.


#Proof of Concept Components

- a web application that has been modified to send and listen to postMessage events.
- a Twilio Flex plugin that will send and receive postMessage events.

#Setup

This section walks you through the process of setting this up locally so that you may test the functionality.

There are 2 folders in this repository that will be required:
- Plugin-flex-as-iframe: this is a flex plugin that will listen to postMessage and send PostMessage events to the other application.
- Dummypage: includes a basic html page and js code that embeds flex as an iframe. This application will play the part of a dummy CRM or ticketing application.

Additionally, we will need to securely embed flex as an iframe. Please make sure you follow the steps on this guide: https://www.twilio.com/docs/flex/admin-guide/setup/secure-iframe

##Plugin setup

No changes need to be made to the plugin when testing this proof of concept. All you need to do is install the dependencies (npm install) and run it locally using the Twilio CLI.

##Dummy page Setup

Please follow the instructions on the readme.md file. Basically, you need to ensure the iframe url is the same as where flex is running (i.e. if you’re testing locally it would be localhost). Both the index.html and the index.js files need to be updated. Make sure the port is correct!

Moreover, you will need to run this application in some kind of web server. I recommend caddy - https://caddyserver.com/docs/quick-starts/https

#Testing

Once you have Flex running locally, as well as the web application running on your web server, you just need to browse to the web application, i.e. https://localhost/index.html or similar (this depends on the dir you run your web server from as well as the port).

#Demos 

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


