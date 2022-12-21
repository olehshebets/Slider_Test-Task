import React, {useEffect, useRef, useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  FlatList,
  Text,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

type dataType = {
  value: number | string;
  label: number | string;
  color: string;
};

interface WheelNumberPickerProps {
  data: dataType[];
  width: number;
  selectedValue?: number | string;
  onValueChange?: (value: number | string) => void;
}
const widthItem = Dimensions.get('window').width;
const heightItem = Dimensions.get('window').height;

const Slider = ({
  width = 25,
  selectedValue = 0,
  onValueChange,
  data = [],
}: WheelNumberPickerProps) => {
  const [dataArray] = useState<dataType[]>([...data, ...data, ...data]);
  const [value, setValue] = useState<number | string>(selectedValue);

  const flatListRef = useRef<FlatList>();
  const currentXOffset = useRef<number>(0);
  const numberOfValue = useRef<number>(data.length);
  const initialOffset = useRef<number>((data.length - 0.5) * width);

  useEffect(() => {
    if (!onValueChange) {
      return;
    }
    onValueChange(value);
  }, [value, onValueChange]);

  const onScroll = ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = nativeEvent.contentOffset.x;
    let index = Math.ceil((offsetX % initialOffset.current) / width);
    index = index < numberOfValue.current ? index : numberOfValue.current - 1;
    const selectedValueItem = data[index].value;
    if (value !== selectedValueItem) {
      setValue(selectedValueItem);
    }

    if (offsetX < currentXOffset.current) {
      if (offsetX <= initialOffset.current - width) {
        flatListRef.current?.scrollToOffset({
          offset: offsetX + width * numberOfValue.current,
          animated: false,
        });
        currentXOffset.current = offsetX + width * numberOfValue.current;
        return;
      }
    }

    if (offsetX > currentXOffset.current) {
      if (offsetX > initialOffset.current + width) {
        flatListRef.current?.scrollToOffset({
          offset: offsetX - width * numberOfValue.current,
          animated: false,
        });
        currentXOffset.current = offsetX - width * numberOfValue.current;
        return;
      }
    }

    currentXOffset.current = offsetX;
  };

  return (
    <View style={styles.constiner}>
      <FlatList
        horizontal
        data={dataArray}
        onScroll={onScroll}
        ref={flatListRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={width}
        scrollEventThrottle={12}
        decelerationRate="fast"
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => {
          return (
            <View
              style={[
                styles.conatinerItem,
                {
                  backgroundColor: item.color,
                },
              ]}>
              <Text style={styles.text}>{item.label}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
  conatinerItem: {
    width: widthItem,
    height: heightItem,
    alignItems: 'center',
    justifyContent: 'center',
  },
  constiner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Slider;
