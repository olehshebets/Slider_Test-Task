import React, {useState} from 'react';
import {Dimensions} from 'react-native';
import Slider from './src/component/Slider';

const App = () => {
  const [data] = useState([
    {value: '0', label: '1', color: '#89CFF0'},
    {value: '1', label: '2', color: '#FBCEB1'},
  ]);
  const widthItem = Dimensions.get('window').width;
  return <Slider width={widthItem} data={data} />;
};

export default App;
