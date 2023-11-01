import { Box, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useFullScreenHandle } from "react-full-screen";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Canvas } from "@/components/settings/canvas";
import { Setup } from "@/components/settings/setup";
import type { Role, PageType } from "@/types";

const Settings = () => {
  const toast = useToast();
  const fullscreenHandle = useFullScreenHandle();

  const [pageType, setPageType] = useState<PageType>("setup");
  const [id, setId] = useState<string>();
  const [role, setRole] = useState<Role>("canvas");

  const [socketUrl, setSocketUrl] = useState("ws://localhost:8765");
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {
      onOpen: () => {
        toast({
          title: "Connected",
          status: "success",
          description: "now connected to: " + socketUrl,
          duration: 8000,
          isClosable: true,
        });
        if (id) {
          // TODO: idを再送信したい
        }
      },
      onClose: () => {
        if (id)
          toast({
            title: "Disconnected",
            status: "warning",
            duration: 3000,
            isClosable: true,
            description: "disconnected from: " + socketUrl,
          });
      },
      shouldReconnect: (closeEvent) => {
        console.log(closeEvent);
        toast({
          title: "COULD NOT CONNECT",
          status: "error",
          duration: 5000,
          isClosable: true,
          description:
            "failed to connect: " + socketUrl + ". Is the server running?",
        });
        return true;
      },
    },
  );

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

    // 初回セットアップ
    if (message?.type === "setup") {
      setPageType(message.role);
      setId(message.id);
    } else if (message?.type === "check_reconnect") {
      if (id) {
        sendJsonMessage({ type: "reconnect", id: id, role: role });
      }
    }
  }, [lastJsonMessage]);

  if (pageType === "setup")
    return (
      <Setup
        sendJsonMessage={sendJsonMessage}
        setSocketUrl={setSocketUrl}
        connectionStatus={connectionStatus}
        role={role}
        setRole={setRole}
        id={id}
      />
    );
  if (pageType === "canvas")
    return (
      <Canvas
        fullscreenHandle={fullscreenHandle}
        id={id}
        sendJsonMessage={sendJsonMessage}
        lastJsonMessage={lastJsonMessage}
      />
    );
  if (pageType === "user") return <Box>user</Box>;
  if (pageType === "admin") return <Box>admin</Box>;
  return <Box>ERROR</Box>;
};

export default Settings;
