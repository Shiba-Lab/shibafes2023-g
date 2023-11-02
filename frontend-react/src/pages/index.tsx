import { Box, Button, Container, FormControl, FormLabel, Heading, Input, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack } from "@chakra-ui/react";
import Head from "next/head";
import QRCode from 'qrcode';
import React from "react"
import { SERVER_URL } from "../components/websocketUtils/utils"

const ROLE = "phone";

export default function Home() {

  const [playTime, setPlayTime] = React.useState(null);
  const [uuid, setUuid] = React.useState('');
  const [qrCodeURL, setQRCodeURL] = React.useState(null);

  // {/* WebSocket のインスタンスを保持する。 */}
  const ws = React.useRef<WebSocket | null>(null);

  // {/* WebSocket を開く。 一度開いたら、ページを閉じるまで開きっぱなしにする。*/}
  React.useEffect(() => {
    ws.current = new WebSocket(SERVER_URL);
    ws.current.onopen = () => {
      console.log('ws opened');
    }
    ws.current.onclose = () => {
      console.log('ws closed');
    }
    ws.current.onmessage = (event) => {

      const obj = JSON.parse(event.data);
      console.log(obj.type);

      // init だったら uuid をセット
      // デバイスの情報を送信
      switch (obj.type) {
        case "initConnection":
          setUuid(obj.uuid);
          console.log(obj.uuid);

          ws.current?.send(JSON.stringify({
            uuid: obj.uuid, 
            type: "initConnection",
            role: ROLE,
          }));
          break;
        case "prePlay":
          setPlayTime(obj.startTime);
          break;
      }
    }
    return () => {
      ws.current?.close();
    }
  }, [])

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(uuid);
      setQRCodeURL(url);
    } catch (err) {
      console.error(err);
    }
  }

  const FormWithHandler = () => {

    const labelStyles = {
      mt: "2",
      ml: "-2.5",
      fontSize: "sm",
    };
    
    return (

      <Container maxW="md">
        <form
          onSubmit={(e) => {
            // デフォルトのイベントをキャンセル
            e.preventDefault();

            // Form の値を取得して送信
            ws.current?.send(JSON.stringify({
              uuid: uuid,
              role: ROLE,
              type: "sendFlowerData",
              flowerCount: e.target[0].value,
              flowerSizeRange: [e.target[1].value, e.target[2].value],
              flowerColor: [e.target[3].value, e.target[4].value],
            }));

            // 自身の uuid の QR コードを生成
            generateQR();
          }}
        >
        {/* コンポーネント分割しようとすると Hydration Error になる... */}
          <Heading as="h1" textAlign="center" py={10}>
            花を想像する...
          </Heading>
          <FormControl>
            {/* 花の数 */}
            <Box py={4}>
              <FormLabel>花の咲く数</FormLabel>
              <Slider min={10} max={100} step={1}>
                <SliderMark value={10} {...labelStyles}>
                  小
                </SliderMark>
                <SliderMark value={100} {...labelStyles}>
                  大
                </SliderMark>
                <SliderTrack bg="red.100">
                  <Box position="relative" right={10} />
                  <SliderFilledTrack bg="tomato" />
                </SliderTrack>
                <SliderThumb boxSize={6} />
              </Slider>
            </Box>
  
            {/* 花弁の大きさ */}
            <Box py={4}>
              <FormLabel>花弁の大きさ (最小)</FormLabel>
              <Slider defaultValue={30} min={10} max={100} step={1}>
                <SliderMark value={10} {...labelStyles}>
                  10
                </SliderMark>
                <SliderMark value={100} {...labelStyles}>
                  100
                </SliderMark>
                <SliderTrack bg="red.100">
                  <Box position="relative" right={10} />
                  <SliderFilledTrack bg="tomato" />
                </SliderTrack>
                <SliderThumb boxSize={6} />
              </Slider>
            </Box>
  
            <Box py={4}>
              <FormLabel>花弁の大きさ (最大)</FormLabel>
              <Slider defaultValue={60} min={10} max={100} step={1}>
                <SliderMark value={10} {...labelStyles}>
                  10
                </SliderMark>
                <SliderMark value={55} {...labelStyles}>
                  55
                </SliderMark>
                <SliderMark value={100} {...labelStyles}>
                  100
                </SliderMark>
                <SliderTrack bg="red.100">
                  <Box position="relative" right={10} />
                  <SliderFilledTrack bg="tomato" />
                </SliderTrack>
                <SliderThumb boxSize={6} />
              </Slider>
            </Box>
              
            {/* 色選択 */}
            <Box py={4}>
              <FormLabel>花の色 (始点)</FormLabel>
              <Input type="color" />
            </Box>

            <Box py={4}>
              <FormLabel>花の色 (終点)</FormLabel>
              <Input type="color" />
            </Box>
          </FormControl>
  
          <Container centerContent>
            <Button type="submit" colorScheme="blue">
              Button
            </Button>
          </Container>
        </form>
      </Container>
    )
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <h1> Phone </h1>
          {/* qrCodeURL が null だったら FormWithHandler, そうでなければ OK を表示する。 */}
          {qrCodeURL === null ? (
            <FormWithHandler />
          ) : (
            playTime === null ? (
              <img src={qrCodeURL} alt="Generated QR Code" />
            ) : (
              <p>{playTime}</p>
            )
          )}
        </div>
      </main>
    </>
  );
}
