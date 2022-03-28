import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../constants/colors';
import {FontSize, Spacing} from '../../constants/utils';
import Card from '../components/Card';
import CustomHeader from '../components/CustomHeader';
import RobotoRegular from '../components/RobotoRegular';
import {getWalletBalance, sendToken} from '../redux/actions/wallet';
import CustomTextInput from '../components/CustomTextInput';
import TextInputWithScanButton from '../components/TextInputWithScanButton';
import CustomButton from '../components/CustomButton';
import CustomLoader from '../components/CustomLoader';
import {ethers} from 'ethers';
import Contract from '../../blockchain/contract';

const SendTokenScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {provider, wallet} = useSelector(state => state.wallet);
  const [values, setValues] = useState({
    providerName: route.params?.network || '',
    destinationAddress: route.params?.destinationAddress,
    tokenName: route.params?.name || 'Ether',
    tokenAddress: route.params?.address,
    balance: route.params?.balance,
    symbol: route.params?.symbol,
    decimal: route.params?.decimal,
    amount: '',
    showLoader: false,
    loaderMessage: '',
  });
  const {
    destinationAddress,
    showLoader,
    loaderMessage,
    amount,
    providerName,
    tokenName,
    balance,
    symbol,
    decimal,
    tokenAddress,
  } = values;


  useEffect(() => {
    if (route?.params?.destinationAddress) {
      setValues({
        ...values,
        destinationAddress: route?.params?.destinationAddress,
      });
    }
  }, [route]);

  const Details = ({title, value}) => (
    <View style={{flexDirection: 'row'}}>
      <RobotoRegular color={colors.lightGray}>{title}</RobotoRegular>
      <RobotoRegular
        style={{paddingHorizontal: Spacing.hs, width: widthPercentageToDP(55)}}>
        {value}
      </RobotoRegular>
    </View>
  );

  const confirmSend = () => {
    if (destinationAddress === '' || amount === '') {
      Alert.alert('Info', `Please fill out all the fields`, [
        {
          text: 'Ok',
        },
      ]);
      return;
    }
    setValues({
      ...values,
      showLoader: true,
      loaderMessage: 'Transferring token. Please wait...',
    });
    // setLoadingMessage('Sending Eth token...');
  };

  useEffect(() => {
    if (showLoader) {
      if (!ethers.utils.isAddress(destinationAddress)) {
        setValues({
          ...values,
          showLoader: false,
        });
        return alert('Invalid destination address');
      }
      if (symbol === 'ETH') {
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
      } else {
        sendERCToken();
      }
    }
  }, [showLoader]);

  const sendERCToken = async () => {
    try {
      const tokenContract = Contract({
        wallet,
        address: tokenAddress,
        type: 'erc20',
      }).get();
      let parsedAmount = ethers.utils.parseUnits(amount, decimal);
      // console.log(temp, 'temp');

      await tokenContract.transfer(destinationAddress, parsedAmount);
      onSuccess();
    } catch (e) {
      console.log(e);
      setValues({
        ...values,
        showLoader: false,
      });
    }
  };

  const onSuccess = () => {
    setValues({...values, showLoader: false});
    Alert.alert(
      'Success',
      `Sent ${amount} token to ${destinationAddress} successfully`,
      [
        {
          text: 'Ok',
          onPress: () => navigation.replace('Tabs'),
        },
      ],
    );
  };
  const onError = e => {
    console.log(e.error, 'asd');
    setValues({...values, showLoader: false});
    Alert.alert(
      'Error',
      `${e?.error || 'Something went wrong. Please try again'}`,
      [
        {
          text: 'Ok',
        },
      ],
    );
  };

  return (
    <>
      {isFocused && (
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />
      )}
      <CustomHeader
        title="Transfer Token"
        onBackPress={() => navigation.pop()}
        // onRightIconPress={() => navigation.navigate('ImportTokenScreen')}
      />
      <CustomLoader message={loaderMessage} show={showLoader} />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Card>
            <Details title="Token Name:" value={tokenName} />
            <Details title="Current Balance:" value={balance} />
            <Details title="Current Network:" value={providerName} />
          </Card>

          <Card style={{paddingVertical: Spacing.vs * 2}}>
            <TextInputWithScanButton
              label="Destination Address"
              placeholder="Enter receiver's address"
              value={destinationAddress}
              // defaultValue={route?.params?.destinationAddress || ''}
              labelLeftAlign
              onChangeText={value =>
                setValues({...values, destinationAddress: value})
              }
              onPressScan={() =>
                navigation.navigate('ScanAssetsScreen', route.params)
              }
            />
            <CustomTextInput
              label="Amount"
              labelLeftAlign
              keyboardType="numeric"
              placeholder="Enter amount to send"
              style={{width: widthPercentageToDP(78)}}
              onChangeText={value => setValues({...values, amount: value})}
            />

            <RobotoRegular
              fontSize={FontSize.small / 1.2}
              color={colors.gray}
              style={{paddingVertical: Spacing.vs}}>
              Important: Please double check the address and amount before
              sending. Transactions cannot be reversed.
            </RobotoRegular>

            <CustomButton
              title="Send Now"
              color={colors.green}
              width={widthPercentageToDP(78)}
              onPress={confirmSend}
            />
          </Card>
        </View>
      </ScrollView>
    </>
  );
};

export default SendTokenScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.hs,
  },
});
