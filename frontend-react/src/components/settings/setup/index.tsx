import {
  Box,
  Button,
  Select,
  Text,
  Container,
  VStack,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import type { Role } from "@/types";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendJsonMessage: (data: any) => void;
  setSocketUrl: (url: string) => void;
  id: string | undefined;
  connectionStatus: string;
  role: "canvas" | "admin" | "user";
  setRole: Dispatch<SetStateAction<Role>>;
};

export const Setup = (props: Props) => {
  const { sendJsonMessage, setSocketUrl, id, role, setRole } = props;

  const startConnect = () => {
    sendJsonMessage({
      type: "setup",
      role: role,
      id: id,
    });
  };

  return (
    <Container>
      <VStack spacing={5} w="100%">
        <Text fontSize="2xl" mt={3}>
          Settings
        </Text>
        <Flex alignItems="center" justifyContent="center">
          {props.connectionStatus === "Open" ? (
            <Icon
              as={AiOutlineCheck}
              color="green.500"
              width="2em"
              height="1em"
            />
          ) : (
            ""
          )}
          <Text lineHeight="1em">{props.connectionStatus}</Text>
        </Flex>
        <Box w="100%">
          <Text>Select server</Text>
          <Select onChange={(e) => setSocketUrl(e.target.value)}>
            <option value="ws://localhost:8765">localhost:8765</option>
            <option value="ws://localhost:8765" disabled>
              本番
            </option>
          </Select>
        </Box>
        <Box w="100%">
          <Text>Select role</Text>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Select onChange={(e) => setRole(e.target.value as any)}>
            <option value="canvas">canvas(tablet)</option>
            <option value="admin">admin panel</option>
            <option value="user">user</option>
          </Select>
        </Box>
        <Button colorScheme="blue" mt={5} onClick={startConnect}>
          Connect
        </Button>
      </VStack>
    </Container>
  );
};
