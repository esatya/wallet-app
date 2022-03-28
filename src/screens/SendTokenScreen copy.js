import {ethers, utils} from 'ethers';
import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../constants/colors';
import {Spacing} from '../../constants/utils';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import HeaderText from '../components/HeaderText';
import Loader from '../components/Loader';
import {sendToken} from '../redux/actions/wallet';

const SendTokenScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [destinationAddress, setDestinationAddress] = useState(
    route?.params?.address || '',
  );
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const {wallet, provider} = useSelector(state => state.wallet);

  // console.log(route.params.address);
  // console.log(provider.formats.receipt)

  const confirmSend = () => {
    if (destinationAddress === '' || amount === '') {
      Alert.alert('Info', `Please fill out all the fields`, [
        {
          text: 'Ok',
        },
      ]);
      return;
    }
    setLoading(true);
    setLoadingMessage('Sending Eth token...');
  };

  useEffect(() => {
    if (loading) {
      dispatch(
        sendToken(
          destinationAddress,
          amount,
          wallet,
          provider,
          onSuccess,
          onError,
        ),
      );
    }
  }, [loading]);

  const onSuccess = () => {
    setLoading(false);
    setLoadingMessage('');
    setDestinationAddress('');
    setAmount('');
    Alert.alert(
      'Success',
      `Sent ${amount} ETH to ${destinationAddress} successfully`,
      [
        {
          text: 'Ok',
          onPress: () =>
            navigation.replace('Tabs', {
              screen: 'ProfileScreen',
              params: {
                fromSendToken: true,
              },
            }),
        },
      ],
    );
  };
  const onError = e => {
    setLoading(false);
    setLoadingMessage('');
    setDestinationAddress('');
    setAmount('');
    Alert.alert('Success', `${e}`, [
      {
        text: 'Ok',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader message={loadingMessage} />
      ) : (
        <>
          <HeaderText>Send Ether Token</HeaderText>

          {route?.params?.address ? (
            <CustomTextInput
              editable={false}
              label="Destination Address"
              value={route.params.address}
              // onChangeText={setDestinationAddress}
            />
          ) : (
            <CustomTextInput
              // editable={}
              label="Destination Address"
              onChangeText={setDestinationAddress}
            />
          )}

          <CustomTextInput
            label="Amount"
            keyboardType="numeric"
            onChangeText={setAmount}
          />

          <CustomButton
            title="Confirm Send"
            style={styles.button}
            onPress={confirmSend}
          />
        </>
      )}
    </View>
  );
};

export default SendTokenScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  button: {marginTop: Spacing.vs},
});
