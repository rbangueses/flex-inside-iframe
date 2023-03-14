import * as Flex from "@twilio/flex-ui";
import { FlexPlugin } from "@twilio/flex-plugin";

const PLUGIN_NAME = "FlexAsIframePlugin";
const TASK_CHANNEL = {
  VOICE: "voice",
};
const CALL_STATUS = ["accepted", "canceled", "rejected", "rescinded", "timeout"];

export default class FlexAsIframePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex: typeof Flex, manager: Flex.Manager): Promise<void> {
    const sendMessageToCRM = (eventName: string, payload?: any) => {
      let data = {
        eventName,
        payload,
      };

      parent.postMessage(JSON.stringify(data), "*");
      console.log(">>> sending post message to crm: ", data);
    };

    if (window.self !== window.top) {
      flex.AgentDesktopView.defaultProps.showPanel2 = false;

      const pluginsInitializedCallback = () => {
        sendMessageToCRM("pluginsInitialized");
      };

      const afterSetActivityCallback = (payload: any) => {
        let data = {
          visibility: payload.activityName,
        };

        sendMessageToCRM("afterSetActivity", data);
      };

      const postActiveCallStatus = (status: string) => {
        let data = {
          status,
        };

        sendMessageToCRM("reservationCreated", data);
      };

      const reservationCreatedCallback = (reservation: any) => {
        // status "created" is used to indicate call is getting connected
        postActiveCallStatus("created");

        CALL_STATUS.forEach((status) => {
          reservation.on(status, (payload: any) => {
            postActiveCallStatus(status);
          });
        });
      };

      const afterToggleMuteCallback = () => {
        sendMessageToCRM("toggleMute");
      };

      const receiveMessage = (event: any) => {
        let { name, payload = null } = event.data;

        // invoke the action requested by crm
        flex.Actions.invokeAction(name, payload);
      };

      window.addEventListener("message", receiveMessage);

      flex.Actions.addListener("afterSetActivity", afterSetActivityCallback);
      flex.Actions.addListener("afterToggleMute", afterToggleMuteCallback);

      manager.events.addListener("pluginsInitialized", pluginsInitializedCallback);
      manager.workerClient && manager.workerClient.on("reservationCreated", reservationCreatedCallback);
    }

    const acceptTaskCallback = (payload: any, original: any) => {
      return new Promise<void>((resolve, reject) => {
        if (payload.task.taskChannelUniqueName === TASK_CHANNEL.VOICE) {
          let data = {
            ...payload.task.attributes,
          };

          sendMessageToCRM("voice", data);
        }
        resolve();
      }).then(() => original(payload));
    };

    const hangupCallCallback = (payload: any, original: any) => {
      return new Promise<void>((resolve, reject) => {
        //for outbound calls, to will be undefined

        let data = {
          ...payload.task.attributes,
          duration: payload.task.age,
          agent: manager.user.identity,
        };
        debugger;
        sendMessageToCRM("hangupCall", data);

        resolve();
      }).then(() => original(payload));
    };

    flex.Actions.replaceAction("AcceptTask", acceptTaskCallback);
    flex.Actions.replaceAction("HangupCall", hangupCallCallback);
  }
}
