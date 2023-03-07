import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";

const PLUGIN_NAME = "FlexAsIframePlugin";
const TASK_CHANNEL = {
  VOICE: "voice",
};

export default class FlexAsIframePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    if (window.self !== window.top) {
      flex.AgentDesktopView.defaultProps.showPanel2 = false;

      const receiveMessage = (event: any) => {
        let actionName = event.data.actionName;
        let options;

        switch (actionName) {
          case "StartOutboundCall":
            options = {
              destination: event.data.attributes.to,
            };
            break;
          default:
            console.log("unknown event:", event.data.action);
        }
        //invoke action
        flex.Actions.invokeAction(actionName, options);
      };

      window.addEventListener("message", receiveMessage);
    }

    flex.Actions.replaceAction("AcceptTask", (payload, original) => {
      return new Promise<void>((resolve, reject) => {
        let data;
        if (payload.task.taskChannelUniqueName === TASK_CHANNEL.VOICE) {
          switch (payload.task.attributes.direction) {
            case "inbound":
              data = {
                attributes: payload.task.attributes,
              };
              break;
            case "outbound":
              data = {
                attributes: payload.task.attributes,
              };
              break;
            default:
              console.log("Unhandled replaceAction::AcceptTask");
          }

          parent.postMessage(JSON.stringify(data), "*");
        }
        resolve();
      }).then(() => original(payload));
    });

    flex.Actions.replaceAction("HangupCall", (payload, original) => {
      return new Promise<void>((resolve, reject) => {
        //for outbound calls, to will be undefined
        let { from, to, outbound_to, direction } = payload.task.attributes;

        let data = {
          from,
          to,
          outbound_to,
          direction,
          duration: payload.task.age,
          agent: manager.user.identity,
        };
        parent.postMessage(JSON.stringify(data), "*");
        resolve();
      }).then(() => original(payload));
    });
  }
}
