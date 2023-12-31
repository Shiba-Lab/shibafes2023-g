import { Box, Button, Container, FormControl, FormLabel, Heading, Input, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack } from "@chakra-ui/react";
import Head from "next/head";
import QRCode from 'qrcode';
import React from "react"
import ReconnectingWebSocket from 'reconnecting-websocket';
import { ThreeJSComponent } from "../components/mainCanvas/index";
import { FlowerData } from "../components/mainCanvas/src/index";
import { SERVER_URL } from "../components/websocketUtils/utils"

const ROLE = "phone";

export default function Home() {

  const [playTime, setPlayTime] = React.useState(null);
  const [uuid, setUuid] = React.useState('');
  const [qrCodeURL, setQRCodeURL] = React.useState<string | null>(null);
  const [flower, setFlower] = React.useState<FlowerData>({
    flowerText: "TEST",
    flowerNum: 10,
    flowerMin: 0.1,
    flowerMax: 0.6,
    color1: "rgb(255, 200, 100)",
    color2: "rgb(0, 200, 100)",
  });

  // {/* WebSocket のインスタンスを保持する。 */}
  const ws = React.useRef<ReconnectingWebSocket | null>(null);

  // {/* WebSocket を開く。 一度開いたら、ページを閉じるまで開きっぱなしにする。*/}
  React.useEffect(() => {
    ws.current = new ReconnectingWebSocket(SERVER_URL);
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

          setFlower({
            flowerText: obj.flowerText,
            flowerNum:  parseFloat(obj.flowerCount),
            flowerMin:  parseFloat(obj.flowerSizeRange[0]),
            flowerMax:  parseFloat(obj.flowerSizeRange[1]),
            color1:     obj.flowerColor[0],
            color2:     obj.flowerColor[1],
          })

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
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            // デフォルトのイベントをキャンセル
            e.preventDefault();
            const form = e.target as HTMLFormElement;

            // Form の値を取得して送信
            const flowerCount   = (form.elements.namedItem("flowerCount") as HTMLInputElement).value;
            const flowerSizeMin = (form.elements.namedItem("flowerSizeMin") as HTMLInputElement).value;
            const flowerSizeMax = (form.elements.namedItem("flowerSizeMax") as HTMLInputElement).value;
            const flowerColor1  = (form.elements.namedItem("color1") as HTMLInputElement).value;
            const flowerColor2  = (form.elements.namedItem("color2")   as HTMLInputElement).value;
            const nickname      = (form.elements.namedItem("nickname")   as HTMLInputElement).value;


            ws.current?.send(JSON.stringify({
              uuid: uuid,
              role: ROLE,
              type: "sendFlowerData",
              flowerText: nickname,
              flowerCount: flowerCount,
              flowerSizeRange: [flowerSizeMin, flowerSizeMax],
              flowerColor: [flowerColor1, flowerColor2],
            }));

            console.log("flowerCount: ", flowerCount);

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
            <Box py={4} display="none">
              <FormLabel>花の咲く数</FormLabel>
              <Slider min={10} max={100} step={1} name="flowerCount">
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
            <Box py={4} display="none">
              <FormLabel>花弁の大きさ (最小)</FormLabel>
              <Slider defaultValue={0.1} min={0.01} max={1.00} step={0.01} name="flowerSizeMin">
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
  
            <Box py={4} display="none">
              <FormLabel>花弁の大きさ (最大)</FormLabel>
              <Slider defaultValue={0.6} min={0.01} max={1.00} step={0.01} name="flowerSizeMax">
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
              <Input type="color" defaultValue="#c0ffee" name="color1"/>
            </Box>

            <Box py={4}>
              <FormLabel>花の色 (終点)</FormLabel>
              <Input type="color" defaultValue="#cf00ee" name="color2"/>
            </Box>

            <Box py={4}>
              <FormLabel>ニックネーム (アルファベットで) </FormLabel>
              <Input type="text" name="nickname"/>
            </Box>
          </FormControl>
  
          <Container centerContent py={16}>
            <Button type="submit" colorScheme="blue">
              Submit
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
          {/* qrCodeURL が null だったら FormWithHandler, そうでなければ OK を表示する。 */}
          {qrCodeURL === null ? (
            <FormWithHandler />
          ) : (
            playTime === null && flower !== null ? (
              <img src={qrCodeURL} alt="Generated QR Code" style={{
                margin: "auto",
                width: "100%",  // スマホは縦長なので横に合わせれば OK
              }} />
            ) : (
              flower && playTime && <ThreeJSComponent isScreen={false} waitUntil={playTime - Date.now()} flowerData={flower!} />
            )
          )}
        </div>
      </main>
    </>
  );
}
