import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { FullScreen } from "react-full-screen";

type Props = {
  id: string | undefined;
  fullscreenHandle: any;
  sendJsonMessage: (data: any) => void;
};
export const Canvas = (props: Props) => {
  const { id, fullscreenHandle, sendJsonMessage } = props;
  return (
    <FullScreen handle={fullscreenHandle}>
      <Box w="100%" h="100%" bgColor="#fff">
        <VStack pt="2em">
          <Text>ID: {id}</Text>
          <Text fontWeight="bold">
            キャリブレーション開始にはフルスクリーンが必須です。
          </Text>
          {fullscreenHandle.active ? (
            <Button w="16em" onClick={fullscreenHandle.exit}>
              全画面解除
            </Button>
          ) : (
            <Button
              w="16em"
              onClick={fullscreenHandle.enter}
              colorScheme="blue"
            >
              キャリブレーション開始
            </Button>
          )}
        </VStack>
      </Box>
    </FullScreen>
  );
};
