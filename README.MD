The most common requirement for a customer engagement platform is the ability to integrate with a system of records, such as a CRM or a ticketing system, so that agents don't struggle with yet another application on their desktop. By integrating these systems you can also remove some of the robotic processes, such as no longer having to search for a customer record when someone's calling, or the ability to just click on a customer number on the CRM to dial automatically, contributing to better customer and agent experiences.

Twilio Flex provides a customer engagement platform with a comprehensive set of integration capabilities. At an agent desktop level, you can bring your applications inside Flex, bring Flex inside your applications, or have them run side by side. This article focuses on the scenario where you want to bring Flex inside your application.

This is a Proof of Concept showing Flex embedded within an application. Flex runs as an iframe, a child of your application. This PoC also shows how bi-directional communication between Flex and an application can be implemented using postmessages. Three use cases are covered: 
- click to dial, using postmessage and the Flex Activity Framework.
- how Flex can communicate with your Application to screenpop the CRM or other applications when receiving an inbound call.
- how Flex can publish interaction activity history after hangup.

Triggers from and to Twilio Flex are not limited to these use cases. You can communicate between platforms by adding new triggers to specific user actions on both applications, as well as support any channel.

The following figure provides an overview of how the click to dial capability has been implemented:
<how it works>

The following figure shows how Flex is sending information to the application.
<how it works>

Solution components:
-   a web application (CRM or other) that can be modified to send and listen to postMessage.
-   a Twilio Flex plugin, that will send and receive postMessage.

You can find more information about the Flex Activity Framework here.

You can find more information about postMessage here.

Interested in seeing how you can bring your own applications inside Flex? here's an example.

What if you just want to bring some data into the Flex application? here's another example.


