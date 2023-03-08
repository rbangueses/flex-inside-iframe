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
    const postMessage = (data: any) => {
      parent.postMessage(JSON.stringify(data), "*");
      console.log(">>> sending post message to crm: ", data);
    };

    if (window.self !== window.top) {
      flex.AgentDesktopView.defaultProps.showPanel2 = false;

      const pluginsInitializedCallback = () => {
        let data = {
          eventName: "pluginsInitialized",
          payload: {},
        };
        postMessage(data);
      };

      const afterSetActivityCallback = (payload: any) => {
        let data = {
          eventName: "afterSetActivity",
          payload: {
            visibility: payload.activityName,
          },
        };
        postMessage(data);
      };

      const postActiveCallStatus = (status: string) => {
        let data = {
          eventName: `reservationCreated`,
          payload: {
            status,
          },
        };

        postMessage(data);
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

      const receiveMessage = (event: any) => {
        let { action, payload } = event.data;
        flex.Actions.invokeAction(action, payload);
      };

      window.addEventListener("message", receiveMessage);
      manager.events.addListener("pluginsInitialized", pluginsInitializedCallback);
      flex.Actions.addListener("afterSetActivity", afterSetActivityCallback);
      manager.workerClient && manager.workerClient.on("reservationCreated", reservationCreatedCallback);
    }

    const acceptTaskCallback = (payload: any, original: any) => {
      return new Promise<void>((resolve, reject) => {
        if (payload.task.taskChannelUniqueName === TASK_CHANNEL.VOICE) {
          let data = {
            eventName: "voiceCall",
            payload: {
              ...payload.task.attributes,
            },
          };
          postMessage(data);
        }
        resolve();
      }).then(() => original(payload));
    };

    const hangupCallCallback = (payload: any, original: any) => {
      return new Promise<void>((resolve, reject) => {
        //for outbound calls, to will be undefined

        let data = {
          eventName: "HangupCall",
          payload: {
            ...payload.task.attributes,
            duration: payload.task.age,
            agent: manager.user.identity,
          },
        };
        postMessage(data);
        resolve();
      }).then(() => original(payload));
    };

    flex.Actions.replaceAction("AcceptTask", acceptTaskCallback);
    flex.Actions.replaceAction("HangupCall", hangupCallCallback);
  }
}
