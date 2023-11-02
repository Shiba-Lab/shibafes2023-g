import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderMark,
  RangeSliderThumb,
  RangeSliderTrack,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { useState } from "react";

const Page = () => {
  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

  const [submitData, setSubmitData] = useState(null);

  const FormComponent = () => {
    return (
      <form
        onSubmit={(e) => {
          // デフォルトのイベントをキャンセル
          e.preventDefault();
          // Form の値を取得
          setSubmitData({
            flowerCount: e.target[0].value,
            flowerGradient: [e.target[1].value, e.target[2].value],
            flowerSizeRange: [e.target[3].value],
          });

          console.log("submit");
        }}
      >
        <FormControl>
          {/* 花の数 */}
          <Box py={4}>
            <FormLabel>花の咲く数</FormLabel>
            <Slider min={10} max={100} step={1}>
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

          {/* 花弁の大きさ */}
          <Box py={4}>
            <FormLabel> 花弁の大きさ (最小 - 最大) </FormLabel>
            <RangeSlider
              aria-label={["min", "max"]}
              defaultValue={[30, 60]}
              min={10}
              max={100}
            >
              <RangeSliderMark value={10} {...labelStyles}>
                10
              </RangeSliderMark>
              <RangeSliderMark value={55} {...labelStyles}>
                55
              </RangeSliderMark>
              <RangeSliderMark value={100} {...labelStyles}>
                100
              </RangeSliderMark>

              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
          </Box>

          {/* 色選択 */}
          <HStack py={4}>
            <Box>
              <FormLabel>花の色 (始点)</FormLabel>
              <Input type="color" />
            </Box>

            <Box>
              <FormLabel>花の色 (終点)</FormLabel>
              <Input type="color" />
            </Box>
          </HStack>
        </FormControl>

        <Container centerContent>
          <Button type="submit" colorScheme="blue">
            Button
          </Button>
        </Container>
      </form>
    );
  };

  return (
    <Container maxW="md">
      <Heading as="h1" textAlign="center" py={10}>
        花を想像する...
      </Heading>

      {/*
       * submitData が null の場合、FormComponent を表示する。
       * null 出なければ、submitData を string として、改行も含んで表示する。
       */}
      {submitData === null ? (
        <FormComponent />
      ) : (
        <Box>
          <pre>{JSON.stringify(submitData, null, 2)}</pre>
        </Box>
      )}
    </Container>
  );
};

export default Page;
