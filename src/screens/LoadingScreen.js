import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/routers';
import {ethers} from 'ethers';
import React, {useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, View, Image} from 'react-native';
import {useDispatch} from 'react-redux';
import colors from '../../constants/colors';
import {setWallet} from '../redux/actions/wallet';
import Logo from '../../assets/images/Logo.png';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

const TEST_NETWORK_URL = 'https://testnetwork.esatya.io';
const DEFAULT_PROVIDER_NAME = 'Rumsan Test Network';

const LoadingScreen = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(TEST_NETWORK_URL);

    const keys = ['walletInfo', 'encryptedWallet', 'assets'];

    AsyncStorage.multiGet(keys).then(res => {
      // console.log(JSON.parse(res[0]), 'res');
      let assets = [];
      const walletInfo = JSON.parse(res[0][1]);
      const encryptedWallet = JSON.parse(res[1][1]);
      const storedAssets = JSON.parse(res[2][1]);
      if (storedAssets !== null) {
        assets = storedAssets;
      }
      if (walletInfo !== null && encryptedWallet !== null) {
        const walletRandom = new ethers.Wallet(walletInfo.privateKey);
        let connectedWallet = walletRandom.connect(provider);
        dispatch(
          setWallet(
            connectedWallet,
            walletInfo,
            encryptedWallet,
            provider,
            DEFAULT_PROVIDER_NAME,
            assets,
            setWalletSuccess,
          ),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            // routes: [{name: 'SetupScreen'}],
            routes: [{name: 'SetupScreenWithPasscode'}],
          }),
        );
      }
    });
  }, []);

  const setWalletSuccess = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Tabs'}],
      }),
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={Logo}
        style={{
          height: heightPercentageToDP(20),
          width: widthPercentageToDP(40),
        }}
      />
      <ActivityIndicator size="large" color={colors.blue} />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
