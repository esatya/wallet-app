import React from 'react';
import {StatusBar} from 'react-native';
import Routes from './src/navigation/Routes';
import 'react-native-get-random-values';
import '@ethersproject/shims';

import store from './src/redux/store';
import {Provider} from 'react-redux';

const App = () => {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Provider store={store}>
        <Routes />
      </Provider>
    </>
  );
};

export default App;
