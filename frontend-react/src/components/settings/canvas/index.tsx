import {
  Box,
  Button,
  Text,
  VStack,
  Spinner,
  Flex,
  ButtonGroup,
} from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

type CalState = "not_started" | "started" | "finished";

type Props = {
  id: string | undefined;
  fullscreenHandle: ReturnType<typeof useFullScreenHandle>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendJsonMessage: (data: any) => void;
  lastJsonMessage: unknown;
};
export const Canvas = (props: Props) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const { id, fullscreenHandle, sendJsonMessage, lastJsonMessage } = props;

  const [calState, setCalState] = useState<CalState>("not_started");
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [color, setColor] = useState<string>("");
  const [clientNum, setClientNum] = useState<number>(0);
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [theta, setTheta] = useState<number>(0);

  const onToggleFullscreen = () => {
    // 縦横幅取得
    setCalState("started");
    const w = screenRef.current?.clientWidth;
    const h = screenRef.current?.clientHeight;
    setWidth(w || 0);
    setHeight(h || 0);
    // 通信
    sendJsonMessage({
      type: "init_new",
      id: id,
      width: w,
      height: h,
      x,
      y,
      theta,
    });
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = lastJsonMessage as any;
    if (message?.type === "init_new") {
      setColor(message.color || "#ff0");
      setClientNum(message.clientNum);
      setCalState("finished");
    }
  }, [lastJsonMessage]);

  const Calibration = () => {
    switch (calState) {
      case "not_started":
        return (
          <>
            <Text fontWeight="bold" color="red">
              全画面になったことを確認してボタンを押してください。
            </Text>
            <Text fontWeight="bold" color="red">
              全画面になってないと計測にずれが生じます。
            </Text>
            <Button w="16em" onClick={onToggleFullscreen} colorScheme="red">
              キャリブレーション開始
            </Button>
          </>
        );
      case "started":
        return (
          <>
            <Flex alignItems="center" justifyContent="center" dir="column">
              <Spinner />
              <Text>Loading...</Text>
            </Flex>
          </>
        );
      case "finished":
        return (
          <>
            <Box
              bgColor="#fff"
              border="10px solid"
              borderColor={color}
              h="100%"
              position="relative"
            >
              <Flex
                alignItems="center"
                justifyContent="center"
                h="100%"
                direction="column"
              >
                <Text>Width: {width}</Text>
                <Text>Height: {height}</Text>
              </Flex>
              <Box fontWeight="bold" fontSize="4rem">
                <Flex
                  position="absolute"
                  top="calc(50% - 2rem)"
                  right="1rem"
                  alignItems="center"
                  justifyContent="center"
                  direction="column"
                >
                  <Text>x: {x}</Text>
                  <ButtonGroup size="md" colorScheme="blue">
                    <Button>-</Button>
                    <Button>+</Button>
                  </ButtonGroup>
                </Flex>
                <Text>ID: {clientNum}</Text>
              </Box>
            </Box>
          </>
        );
      default:
        return <Box>ERROR</Box>;
    }
  };

  return (
    <FullScreen handle={fullscreenHandle}>
      {!fullscreenHandle.active ? (
        <Box w="100%" h="100%" bgColor="#fff" ref={screenRef}>
          <VStack pt="30vh">
            <Text>ID: {id}</Text>
            <>
              <Text fontWeight="bold">
                キャリブレーション開始にはフルスクリーンが必須です。
              </Text>
              <Button
                w="16em"
                onClick={fullscreenHandle.enter}
                colorScheme="blue"
              >
                全画面
              </Button>
            </>
          </VStack>
        </Box>
      ) : (
        <Box w="100%" h="100%" bgColor="#fff" ref={screenRef}>
          <Calibration />
        </Box>
      )}
    </FullScreen>
  );
};

// <Button w="16em" onClick={fullscreenHandle.exit}>
//   全画面解除
// </Button>
