import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {QRIcon} from '../../assets/icons';
import colors from '../../constants/colors';
import {Spacing} from '../../constants/utils';
import Card from '../components/Card';
import CustomHeader from '../components/CustomHeader';
import CustomLoader from '../components/CustomLoader';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import Contract from '../../blockchain/contract';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ethers} from 'ethers';

const ImportTokenScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {wallet, assets, provider, providerName} = useSelector(
    state => state.wallet,
  );
  const [values, setValues] = useState({
    tokenAddress: route?.params?.contractAddress || '',
    tokenName: '',
    tokenSymbol: '',
    decimalsOfPrecision: '',
    currentBalance: '',
    showLoader: false,
    loaderMessage: '',
  });
  const {
    currentBalance,
    decimalsOfPrecision,
    tokenAddress,
    tokenName,
    tokenSymbol,
    showLoader,
    loaderMessage,
  } = values;

  useEffect(() => {
    if (route?.params?.contractAddress) {
      setValues({...values, tokenAddress: route.params.contractAddress});
    }
  }, [route]);

  const fetchTokenDetails = async () => {
    setValues(values => ({
      ...values,
      showLoader: true,
      loaderMessage: 'Fetching token details. Please wait..',
    }));
    try {
      const tokenContract = Contract({
        wallet,
        address: tokenAddress,
        type: 'erc20',
      }).get();
      const symbol = await tokenContract.symbol();
      const name = await tokenContract.name();
      const decimal = await tokenContract.decimals();
      const balance = await tokenContract.balanceOf(wallet.address);
      const formattedBalance = ethers.utils.formatEther(balance);
      setValues(values => ({
        ...values,
        tokenSymbol: symbol,
        tokenName: name,
        decimalsOfPrecision: decimal,
        currentBalance: formattedBalance,
        showLoader: false,
      }));

      // console.log(tokenContract, 'contract');
    } catch (e) {
      console.log(e);
      alert(e);
      setValues({...values, showLoader: false});
    }
  };

  useEffect(() => {
    if (tokenAddress.length === 42) {
      fetchTokenDetails();
    } else {
      setValues({
        ...values,
        currentBalance: '',
        decimalsOfPrecision: '',
        tokenName: '',
        tokenSymbol: '',
      });
    }
  }, [tokenAddress]);

  const handleImportToken = () => {
    if (tokenName === '') {
      return alert('Enter valid contract token address');
    }
    let tokenAlreadyExists = assets?.some(item => item.name === tokenName);
    if (tokenAlreadyExists) {
      return alert(`${tokenName} Asset already exists`);
    }

    setValues(values => ({
      ...values,
      showLoader: false,
      loaderMessage: 'Importing token. Please wait...',
    }));

    let newAssets = [
      ...assets,
      {
        address: tokenAddress,
        type: 'erc20',
        name: tokenName,
        symbol: tokenSymbol,
        decimal: decimalsOfPrecision,
        balance: currentBalance,
        network: providerName,
      },
    ];
    AsyncStorage.setItem('assets', JSON.stringify(newAssets))
      .then(() => {
        dispatch({type: 'UPDATE_ASSETS', payload: newAssets});
        setValues(values => ({
          ...values,
          showLoader: false,
          loaderMessage: '',
        }));
        navigation.pop();
      })
      .catch(e => {
        alert(e, 'error ');
      });
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
      <CustomHeader onBackPress={() => navigation.pop()} title="Import Token" />
      <CustomLoader show={showLoader} message={loaderMessage} />
      <ScrollView>
        <View style={styles.container}>
          <Card style={{paddingVertical: Spacing.vs * 2}}>
            <View style={{flexDirection: 'row'}}>
              <CustomTextInput
                label="Token Contract Address:"
                placeholder="Enter token contract address"
                style={{width: widthPercentageToDP(64)}}
                labelLeftAlign
                value={tokenAddress}
                maxLength={42}
                onChangeText={value =>
                  setValues({...values, tokenAddress: value})
                }
              />
              <View style={styles.buttonContainer}>
                <View style={styles.buttonView}>
                  <Pressable
                    style={styles.qrButton}
                    // disabled={isSubmitting}
                    onPress={() => navigation.navigate('ScanTokenAddress')}
                    android_ripple={{
                      color: 'rgba(0,0,0, 0.1)',
                      borderless: false,
                    }}>
                    <QRIcon />
                  </Pressable>
                </View>
              </View>
            </View>
            <CustomTextInput
              label="Token Name:"
              labelLeftAlign
              style={{width: widthPercentageToDP(78)}}
              value={`${tokenName}`}
              editable={false}
            />
            <CustomTextInput
              label="Token Symbol:"
              labelLeftAlign
              style={{width: widthPercentageToDP(78)}}
              editable={false}
              value={`${tokenSymbol}`}
            />
            <CustomTextInput
              label="Decimals of Precision:"
              labelLeftAlign
              style={{width: widthPercentageToDP(78)}}
              value={`${decimalsOfPrecision}`}
              editable={false}
            />
            <CustomTextInput
              label="Current Balance:"
              style={{width: widthPercentageToDP(78)}}
              labelLeftAlign
              value={`${currentBalance}`}
              editable={false}
            />
            <View style={{marginTop: Spacing.vs}}>
              <CustomButton
                title="Import"
                onPress={handleImportToken}
                width={widthPercentageToDP(78)}
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    </>
  );
};

export default ImportTokenScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.hs,
  },
  buttonContainer: {
    marginHorizontal: Spacing.hs / 1.5,
    alignSelf: 'flex-start',
    marginTop: Spacing.vs * 2.5,
  },
  buttonView: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  qrButton: {
    backgroundColor: colors.blue,
    width: widthPercentageToDP(11),
    height: heightPercentageToDP(6),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
