import { Box, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Setup } from "@/components/settings/setup";

// type role = "canvas" | "user" | "admin";
// type state = "not_connected" | "connecting" | "connected";
type pageType = "setup" | "canvas" | "user" | "admin";

const Settings = () => {
  const [pageType, setPageType] = useState<pageType>("setup");

  const [socketUrl, setSocketUrl] = useState("ws://localhost:8765");
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log("opened"),
      shouldReconnect: (closeEvent) => {
        console.log(closeEvent);
        return true;
      },
    },
  );
  const [id, setId] = useState<string>();

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    console.log(lastJsonMessage);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = lastJsonMessage as any;
    if (message?.type === "setup") {
      setPageType(message.role);
      setId(message.id);
    }
  }, [lastJsonMessage]);

  if (pageType === "setup")
    return (
      <Setup
        sendJsonMessage={sendJsonMessage}
        setSocketUrl={setSocketUrl}
        id={id}
      />
    );
  if (pageType === "canvas")
    return (
      <Box>
        <Text>{connectionStatus}</Text>
        <Text>{String(lastJsonMessage)}</Text>
      </Box>
    );
  if (pageType === "user") return <Box>user</Box>;
  if (pageType === "admin") return <Box>admin</Box>;
  return <Box>ERROR</Box>;
};

export default Settings;
