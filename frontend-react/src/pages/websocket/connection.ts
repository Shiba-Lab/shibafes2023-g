export class Connection {
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
    this.websocket.addEventListener("close", this.onClose);
    this.websocket.addEventListener("message", this.onMessage);
  };

  // 接続開始時に実行
  onOpen = () => {
    this.status = "connected";
    const setup = {
      type: "setup",
      id: this.id,
      role: "admin",
    };
    this.websocket?.send(JSON.stringify(setup));
  };

  // 接続切断時に実行
  onClose = () => {
    if (this.status === "connected") {
      // 自動再接続
      this.start();
    }
  };

  // メッセージを受信したときに実行
  onMessage = (event: MessageEvent<string>) => {
    const message = JSON.parse(event.data);
    switch (message.type) {
      case "setup":
        this.id = message.id;
        this.status = "connected";
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
