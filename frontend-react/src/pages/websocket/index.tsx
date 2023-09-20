import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

export const App = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ws, setWs] = useState<Connection>();
  const [status, setStatus] = useState<
    "not_connected" | "connecting" | "connected"
  >("not_connected");
  const [id, setId] = useState<string | undefined>();

  useEffect(() => {
    const con = new Connection();
    setWs(con);

    // カスタムコールバックを設定して、フィールドが変わったときにステータスを更新
    con.onStatusChange = (newStatus) => setStatus(newStatus);
    con.onIdChange = (newId) => setId(newId);

    return () => {
      con.close();
    };
  }, []);

  return (
    <Box>
      <Text>{status}</Text>
      <Text>ID: {id}</Text>
      <Input placeholder="message here" ref={inputRef} />
      <Button onClick={ws?.start}>接続開始</Button>
      <Button
        onClick={() => {
          ws?.send({
            type: "message",
            value: inputRef.current?.value || "",
          });
        }}
      >
        送信
      </Button>
    </Box>
  );
};

// Connectionクラス内に新しいフィールドを追加
class Connection {
  id: string | undefined;
  websocket: WebSocket | null;
  status: "not_connected" | "connecting" | "connected";

  constructor() {
    this.websocket = null;
    this.status = "not_connected";
    this.id = undefined;
  }

  start = () => {
    this.status = "connecting";
    this.websocket = new WebSocket("ws://localhost:8765");
    this.websocket.addEventListener("open", this.onOpen);
    this.websocket.addEventListener("message", this.onMessage);
  };

  onStatusChange?: (
    newStatus: "not_connected" | "connecting" | "connected",
  ) => void;
  onIdChange?: (newId: string | undefined) => void;

  onOpen = () => {
    this.status = "connected";
    // ステータスが変わったら、コールバックを呼び出す
    this.onStatusChange?.("connected");
    const setup = {
      type: "setup",
      id: this.id,
      role: "admin",
    };
    this.websocket?.send(JSON.stringify(setup));
  };

  onMessage = (event: MessageEvent<string>) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case "setup":
        this.id = message.id;
        this.status = "connected";
        // ステータスとIDが変わったら、コールバックを呼び出す
        this.onStatusChange?.("connected");
        this.onIdChange?.(this.id);
        break;
      default:
        console.log("new message", message);
        break;
    }
  };
  // 一般送信
  send = (message: any) => {
    try {
      this.websocket?.send(JSON.stringify(message));
    } catch (e) {
      console.error(e);
    }
  };

  close = () => {
    if (!this.websocket) return;
    this.status = "not_connected";
    this.websocket.close();
  };
}
