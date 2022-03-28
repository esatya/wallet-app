import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/routers';
import {ethers} from 'ethers';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import colors from '../../constants/colors';
import {setWallet} from '../redux/actions/wallet';
import PasscodeBottomSheet from '../components/PasscodeBottomSheet';
import CustomButton from '../components/CustomButton';
import RobotoRegular from '../components/RobotoRegular';
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
  Cursor,
} from 'react-native-confirmation-code-field';
import {FontSize, Spacing} from '../../constants/utils';

let CELL_COUNT = 6;

const LoadingScreenWithPasscode = ({navigation}) => {
  const dispatch = useDispatch();

  const [passcode, setPasscode] = useState('');

  const ref = useBlurOnFulfill({passcode, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: passcode,
    setValue: setPasscode,
  });

  const [values, setValues] = useState({
    showPasscodeBottomSheet: false,
    parsedWallet: null,
    errorMessage: '',
    loading: true,
    loadingMessage: '',
  });

  const {
    parsedWallet,
    showPasscodeBottomSheet,
    errorMessage,
    loading,
    loadingMessage,
  } = values;

  useEffect(() => {
    AsyncStorage.getItem('walletInfo').then(async walletInfo => {
      if (walletInfo !== null) {
        const temp = JSON.parse(walletInfo);
        setValues({
          showPasscodeBottomSheet: true,
          parsedWallet: temp,
          loading: false,
        });
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'SetupScreenWithPasscode'}],
          }),
        );
      }
    });
  }, []);

  useEffect(() => {
    if (passcode.length === 6) {
      Keyboard.dismiss();
    }
  }, [passcode]);

  const handleConfirm = () => {
    const provider = new ethers.providers.EtherscanProvider('rinkeby');

    setValues(values => ({
      ...values,
      loading: true,
      showPasscodeBottomSheet: false,
      loadingMessage: 'Fetching your wallet info. Please wait...',
    }));

    setTimeout(async () => {
      try {
        const walletRandom = await ethers.Wallet.fromEncryptedJson(
          parsedWallet,
          passcode,
        );
        let connectedWallet = walletRandom.connect(provider);
        dispatch(setWallet(connectedWallet, provider, setWalletSuccess));
      } catch (e) {
        console.log(e);
        setValues(values => ({
          ...values,
          errorMessage: e.toString() || '',
          loading: false,
          showPasscodeBottomSheet: true,
          loadingMessage: '',
        }));
      }
    }, 10);
  };

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
      <>
        <ActivityIndicator
          animating={loading}
          size="large"
          color={colors.blue}
        />
        <RobotoRegular>{loadingMessage}</RobotoRegular>
      </>

      <View>
        <PasscodeBottomSheet
          isVisible={showPasscodeBottomSheet}
          isSetup={false}
          errorMessage={errorMessage}>
          <View>
            <>
              <CodeField
                // onEndEditing={() => console.log('submit editing')}
                onSubmitEditing={handleConfirm}
                {...props}
                ref={ref}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={passcode}
                onChangeText={setPasscode}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />

              {errorMessage !== '' && (
                <RobotoRegular
                  // noPadding
                  fontSize={FontSize.small}
                  color={colors.danger}
                  style={{textAlign: 'center'}}>
                  {errorMessage}
                </RobotoRegular>
              )}
            </>
            <CustomButton
              // disabled={passcode.length === CELL_COUNT ? false : true}
              title="Confirm"
              onPress={handleConfirm}
            />
          </View>
        </PasscodeBottomSheet>
      </View>
    </View>
  );
};

export default LoadingScreenWithPasscode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  codeFieldRoot: {
    // alignItems: 'center',
  },
  cell: {
    width: 50,
    height: 50,
    // lineHeight: 38,
    borderRadius: 10,
    fontSize: FontSize.medium * 1.1,
    borderWidth: 1,
    borderColor: colors.lightGray,
    color: colors.blue,
    textAlign: 'center',
    marginRight: Spacing.hs / 3,
    paddingVertical: Spacing.vs / 1.2,
  },
  focusCell: {
    borderColor: colors.blue,
  },
});
