import { Button } from "@chakra-ui/react";
import React from "react";
import ReconnectingWebSocket from 'reconnecting-websocket';
import { ThreeJSComponent } from "../components/mainCanvas/index";
import { FlowerData } from "../components/mainCanvas/src";
import { SERVER_URL } from "../components/websocketUtils/utils";

const ROLE = "projector";

const Page = () => {

  const [playTime, setPlayTime] = React.useState(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uuid, setUuid] = React.useState('');

    // {/* WebSocket のインスタンスを保持する。 */}
  const ws = React.useRef<ReconnectingWebSocket | null>(null);

  const [flower, setFlower] = React.useState<FlowerData>({
    flowerText: "TEST",
    flowerNum: 10,
    flowerMin: 0.1,
    flowerMax: 0.6,
    color1: "rgb(255, 200, 100)",
    color2: "rgb(0, 200, 100)",
  });

  // {/* WebSocket を開く。 一度開いたら、ページを閉じるまで開きっぱなしにする。*/}
  React.useEffect(() => {
    ws.current = new ReconnectingWebSocket(SERVER_URL);
    ws.current.onopen = () => {
      console.log('ws opened');
    }
    ws.current.onclose = () => {
      console.log('ws closed');
    }
    ws.current.onmessage = (event) => {

      const obj = JSON.parse(event.data);
      console.log(obj.type);

      // init だったら uuid をセット
      // デバイスの情報を送信
      switch (obj.type) {
        case "initConnection":
          setUuid(obj.uuid);
          console.log(obj.uuid);

          ws.current?.send(JSON.stringify({
            uuid: obj.uuid, 
            type: "initConnection",
            role: ROLE,
          }));
          break;
        case "prePlay":
          setPlayTime(obj.startTime);
          // NG
          console.log("flowerCount: ", obj.flowerCount);
          setFlower({
            flowerText: obj.flowerText,
            flowerNum:  parseFloat(obj.flowerCount),
            flowerMin:  parseFloat(obj.flowerSizeRange[0]),
            flowerMax:  parseFloat(obj.flowerSizeRange[1]),
            color1:     obj.flowerColor[0],
            color2:     obj.flowerColor[1],
          })
          break;

      }
    }
    return () => {
      ws.current?.close();
    }
  }, [])

  return (
    <div>
    {/* qrCodeURL が null だったら FormWithHandler, そうでなければ OK を表示する。 */}
    {playTime === null ? (
        <p> None </p>
      ) : (
        flower && playTime && <>
          <ThreeJSComponent isScreen={true} waitUntil={playTime - Date.now()} flowerData={flower!} />
          <Button onClick={() => {setPlayTime(null)}}>
            Reconnect
          </Button>
        </>
    )}
  </div>
  );
}

export default Page;
