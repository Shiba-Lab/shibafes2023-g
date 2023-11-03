import React from "react";
import { SERVER_URL } from "../components/websocketUtils/utils";
import { ThreeJSComponent } from "@/components/mainCanvas";

const ROLE = "projector";

const Page = () => {

  const [playTime, setPlayTime] = React.useState(null);
  const [uuid, setUuid] = React.useState('');
  const [animationStarted, setAnimationStarted] = React.useState(false);

    // {/* WebSocket のインスタンスを保持する。 */}
  const ws = React.useRef<WebSocket | null>(null);

  // {/* WebSocket を開く。 一度開いたら、ページを閉じるまで開きっぱなしにする。*/}
  React.useEffect(() => {
    ws.current = new WebSocket(SERVER_URL);
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
          drawAtDate();
          break;

      }
    }
    return () => {
      ws.current?.close();
    }
  }, [])

  const drawAtDate = () => {

    if (playTime === null) {
      return;
    }

    const delay = playTime - Date.now();
    console.log(delay);

    setTimeout(() => {
      setAnimationStarted(true);
    }, delay);
  }

  return (
    <div>
      <h1> Projector </h1>
    {/* qrCodeURL が null だったら FormWithHandler, そうでなければ OK を表示する。 */}
    {playTime === null ? (
        <p> None </p>
      ) : (
        animationStarted ? (
          <ThreeJSComponent />
        ) : (
          <p>{playTime}</p>
        )
      
    )}
  </div>
  );
}

export default Page;
