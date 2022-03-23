import {CommonActions} from '@react-navigation/routers';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../constants/colors';
import CustomButton from '../components/CustomButton';
import HeaderText from '../components/HeaderText';
import RegularText from '../components/RegularText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  clearWallet,
  getWalletBalance,
} from '../redux/actions/wallet';

const ProfileScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {wallet, provider, balance} = useSelector(state => state.wallet);

  const [reloading, setReloading] = useState(false);

  const removeWallet = () => {
    dispatch(clearWallet(onClearSuccess));
  };

  const onClearSuccess = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'SetupScreen'}],
      }),
    );
  };

  useEffect(() => {
    if (reloading || route?.params?.fromSendToken) {
      dispatch(getWalletBalance(provider, wallet, getBalanceSuccess));
    }
  }, [reloading, route]);

  const getBalanceSuccess = () => {
    setReloading(false);
  };

  const reload = () => {
    setReloading(true);
  };

  return (
    <View style={styles.container}>
      {provider && (
        <>
          <HeaderText>Connected to {provider?._network?.name}</HeaderText>
          <TouchableOpacity
            onPress={reload}
            disabled={reloading ? true : false}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <RegularText>Your balance is {balance} ETH </RegularText>
            <Ionicons name="reload" size={20} />
          </TouchableOpacity>
        </>
      )}
      <CustomButton
        title="Change Network"
        onPress={() => navigation.navigate('ChangeNetworkScreen')}
      />
      <CustomButton
        title="Send Ether Token"
        color={colors.green}
        onPress={() => navigation.navigate('SendTokenScreen')}
      />
      <CustomButton
        title="Clear Wallet"
        color={colors.danger}
        onPress={removeWallet}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});
