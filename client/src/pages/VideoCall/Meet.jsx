import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";
import classes from "./Meet.module.css";

const Meet = () => {
  const roomId = useParams().roomId;

  const myMeeting = async (element) => {
    const appId = 1289907309;
    const serverSecret = "0757a2ce3888b1150ab381be98304321";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,
      Date.now().toString(),
      "host"
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      class: classes.zegoContainer,
    });
  };
  return (
    <div className={classes["container"]}>
      <div ref={myMeeting} className={classes.zegoContainer} />
    </div>
  );
};
export default Meet;
