import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

const PLUGIN_NAME = 'FlexAsIframePlugin';

export default class FlexAsIframePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   */
  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {

    // Flex in an iFrame
    if (window.self !== window.top) {
      //Hide CRM container since Flex is in iFrame
      flex.AgentDesktopView.defaultProps.showPanel2 = false;
      // Define a function for what to do when a message from postMessage() comes in
      const receiveMessage = (event : any) => {
        // Invoke the Flex Outbound Call Action
        flex.Actions.invokeAction("StartOutboundCall", {destination: event.data});
      }

      // Add an event listener to associate the postMessage() data with the receiveMessage, to trigger an outbound call
      window.addEventListener("message", receiveMessage);
    }

    flex.Actions.replaceAction("AcceptTask", (payload, original) => {
      return new Promise<void>((resolve, reject) => {
        console.log("sending postmessage after AcceptTask");
        //in this POC we use the inbound from attribute as the unique identifier.
        if(payload.task.attributes.direction == 'inbound'){
          parent.postMessage(`{"pop":"${payload.task.attributes.from}"}`,'*');
        }
        resolve();
      }).then(() => original(payload));
    });

    //send message to iframe parent, in this case the dummy CRM
    flex.Actions.replaceAction("HangupCall", (payload, original) => {
      return new Promise<void>((resolve, reject) => {
          console.log("sending postmessage after HangupCall");
          let to = payload.task.attributes.to;
          //if it is outbound, to will be undefined so set it to outbound
          if(typeof to == 'undefined'){
            to = payload.task.attributes.outbound_to;
          }
          parent.postMessage(`{"from": "${payload.task.attributes.from}", "to":"${to}", "direction":"${payload.task.attributes.direction}", "duration":"${payload.task.age}", "agent":"${manager.user.identity}"}`,'*');
          resolve();
      }).then(() => original(payload));
    });
  }
}
