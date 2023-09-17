import { Box, Button, Input, Text } from "@chakra-ui/react";
import React from "react";

export const App = () => {
  const [id, setId] = React.useState<string>();
  const socketRef = React.useRef<WebSocket>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // #0.WebSocket関連の処理は副作用なので、useEffect内で実装
  React.useEffect(() => {
    // #1.WebSocketオブジェクトを生成しサーバとの接続を開始
    const websocket = new WebSocket("ws://localhost:8765");
    socketRef.current = websocket;

    // #2.メッセージ受信時のイベントハンドラを設定
    const onMessage = (event: MessageEvent<string>) => {
      console.log("message: " + event.data);
      // 自分のIDを保存
      if (event.data.match(/^Your ID is:/)) {
        setId(event.data.replace(/^Your ID is:/, ""));
      }
    };
    websocket.addEventListener("message", onMessage);

    // #3.useEffectのクリーンアップの中で、WebSocketのクローズ処理を実行
    return () => {
      websocket.close();
      websocket.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <Box>
      <Text>ID: {id}</Text>
      <Input placeholder="message here" ref={inputRef} />
      <Button
        onClick={() => {
          // #4.WebSocketでメッセージを送信する場合は、イベントハンドラ内でsendメソッドを実行
          socketRef.current?.send(inputRef.current?.value || "");
        }}
      >
        送信
      </Button>
    </Box>
  );
};

export default App;
