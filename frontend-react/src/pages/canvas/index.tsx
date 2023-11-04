import { Box } from "@chakra-ui/react";
import { ThreeJSComponent } from "../../components/mainCanvas/index";

const Canvas = () => {
  return (
    <Box w="100%" h="100%">
      <ThreeJSComponent waitUntil={5000} flowerData={{
        flowerText: "TEST",
        flowerNum: 10,
        flowerMin: 0.1,
        flowerMax: 0.6,
        color1: "rgb(255, 200, 100)",
        color2: "rgb(0, 200, 100)",
      }} />
    </Box>
  );
};

export default Canvas;
