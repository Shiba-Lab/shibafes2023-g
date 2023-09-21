import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

type CalState = "not_started" | "started" | "finished";

type Props = {
  id: string | undefined;
  fullscreenHandle: ReturnType<typeof useFullScreenHandle>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendJsonMessage: (data: any) => void;
};
export const Canvas = (props: Props) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const { id, fullscreenHandle, sendJsonMessage } = props;
  const [calState, setCalState] = useState<CalState>("not_started");
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const onToggleFullscreen = () => {
    // 縦横幅取得
    setCalState("started");
    setWidth(screenRef.current?.clientWidth || 0);
    setHeight(screenRef.current?.clientHeight || 0);
    // 本来は通信したのちにキャリブレーション完了にする
    setCalState("finished");
  };

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
            <Text>Loading...</Text>
          </>
        );
      case "finished":
        return (
          <>
            <Text>キャリブレーション完了</Text>
            <Text>Width: {width}</Text>
            <Text>Height: {height}</Text>
          </>
        );
      default:
        return <Box>ERROR</Box>;
    }
  };

  return (
    <FullScreen handle={fullscreenHandle}>
      <Box w="100%" h="100%" bgColor="#fff" ref={screenRef}>
        <VStack pt="30vh">
          <Text>ID: {id}</Text>
          {!fullscreenHandle.active ? (
            <>
              <Text fontWeight="bold">キャリブレーション開始にはフルスクリーンが必須です。</Text>
              <Button w="16em" onClick={fullscreenHandle.enter} colorScheme="blue">
                全画面
              </Button>
            </>
          ) : (
            <Calibration />
          )}
        </VStack>
      </Box>
    </FullScreen>
  );
};

// <Button w="16em" onClick={fullscreenHandle.exit}>
//   全画面解除
// </Button>
