import { Box } from "@chakra-ui/react";
import { ThreeJSComponent } from "../../components/mainCanvas/index";

const Canvas = () => {
  return (
    <Box w="100%" h="100%">
      <ThreeJSComponent waitUntil={5000} />
    </Box>
  );
};

export default Canvas;
