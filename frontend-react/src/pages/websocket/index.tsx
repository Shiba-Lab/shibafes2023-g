import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { Connection } from "./connection";

export const App = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ws, setWs] = useState<Connection>();

  useEffect(() => {
    const con = new Connection();
    setWs(con);
    return () => {
      con.close();
    };
  }, []);

  return (
    <Box>
      <Text>{ws?.status}</Text>
      <Text>ID: {ws?.id}</Text>
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

export default App;
