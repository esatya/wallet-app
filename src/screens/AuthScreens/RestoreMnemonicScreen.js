import {CommonActions} from '@react-navigation/routers';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
  Keyboard,
  ScrollView,
  StatusBar,
} from 'react-native';
import {useDispatch} from 'react-redux';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import CustomButton from '../../components/CustomButton';
import CustomTextInput from '../../components/CustomTextInput';
import HeaderText from '../../components/HeaderText';
import Loader from '../../components/Loader';
import PasscodeBottomSheet from '../../components/PasscodeBottomSheet';
import RobotoRegular from '../../components/RobotoRegular';
import {getWallet} from '../../redux/actions/wallet';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  isLastFilledCell,
  MaskSymbol,
} from 'react-native-confirmation-code-field';
import {PlusCircleIcon} from '../../../assets/icons';
import CustomPopup from '../../components/CustomPopup';
import CustomLoader from '../../components/CustomLoader';
import {useIsFocused} from '@react-navigation/native';

let CELL_COUNT = 6;
let TOTAL_WORDS = 12;

const RestoreMnemonicScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [showPasscodeBottomSheet, setShowPasscodeBottomSheet] = useState(true);
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const ref = useBlurOnFulfill({passcode, cellCount: CELL_COUNT});
  const ref2 = useBlurOnFulfill({confirmPasscode, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: passcode,
    setValue: setPasscode,
  });
  const [props2, getCellOnLayoutHandler2] = useClearByFocusCell({
    value: confirmPasscode,
    setValue: setConfirmPasscode,
  });

  const [values, setValues] = useState({
    errorFlag: false,
    showPopup: false,
    popupType: '',
    messageType: '',
    popupMessage: '',
    mnemonic: '',
    loading: false,
  });

  const {
    errorFlag,
    showPopup,
    popupType,
    messageType,
    popupMessage,
    mnemonic,
    loading,
  } = values;

  const inputRef = useRef([]);

  useEffect(() => {
    if (confirmPasscode.length === CELL_COUNT) {
      if (passcode.length > 0 && passcode !== confirmPasscode) {
        setErrorMessage('Passcodes do not match. Try again');
        setPasscode('');
        setConfirmPasscode('');
        return;
      }
    }
  }, [confirmPasscode]);

  useEffect(() => {
    if (passcode.length > 0) {
      setErrorMessage('');
    }
  }, [passcode]);

  useEffect(() => {
    if (confirmPasscode.length === 6) {
      Keyboard.dismiss();
    }
  }, [confirmPasscode]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        dispatch(
          getWallet(
            'restoreUsingMnemonic',
            onRestoreSuccess,
            onRestoreError,
            mnemonic.trim(),
            passcode,
          ),
        );
      }, 20);
    }
  }, [loading]);

  const onRestoreSuccess = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Tabs'}],
      }),
    );
  };

  const onRestoreError = e => {
    setValues({...values, loading: false});
    Alert.alert('Error', `${e || 'Something went wrong. Please try again.'}`, [
      {text: 'OK'},
    ]);
  };

  const handleSubmit = () => {
    let temp = '';

    if (Object.keys(values).length < 7 + TOTAL_WORDS) {
      return setValues({
        ...values,
        showPopup: true,
        popupType: 'alert',
        messageType: 'Info',
        popupMessage: `Please fill all the ${TOTAL_WORDS} secret words`,
      });
    }

    for (let i = 1; i <= TOTAL_WORDS; i++) {
      temp = `${temp} ${values[`word${i}`]}`;
    }
    setValues({...values, mnemonic: temp, loading: true});
  };

  const renderCell = ({index, symbol, isFocused}) => {
    let textChild = null;

    if (symbol) {
      textChild = <MaskSymbol maskSymbol="*">{symbol}</MaskSymbol>;
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={getCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };
  const renderCell2 = ({index, symbol, isFocused}) => {
    let textChild = null;

    if (symbol) {
      textChild = <MaskSymbol maskSymbol="*">{symbol}</MaskSymbol>;
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={getCellOnLayoutHandler2(index)}>
        {textChild}
      </Text>
    );
  };

  return (
    <ScrollView>
      {isFocused && (
        <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      )}
      <CustomLoader
        show={loading}
        message={'Restoring your wallet. Please wait...'}
      />

      <View style={styles.container}>
        <RobotoRegular color={colors.yellow}>
          Enter your 12 word secret recovery phase to restore your wallet. This
          is a 12 word phrase you were given when you created your wallet.
        </RobotoRegular>
        <RobotoRegular color={colors.yellow}>
          One word in each box
        </RobotoRegular>

        <CustomPopup
          show={showPopup}
          hide={() => setValues({...values, showPopup: false})}
          popupType={popupType}
          messageType={messageType}
          message={popupMessage}
        />

        {Array.from({length: 12}).map((_, index) => (
          <CustomTextInput
            key={index}
            label={`Word ${index + 1}`}
            labelLeftAlign
            onChangeText={text =>
              setValues({
                ...values,
                [`word${index + 1}`]: text,
                errorFlag: false,
              })
            }
            returnKeyType={index + 1 === TOTAL_WORDS ? 'done' : 'next'}
            ref={el => (inputRef.current[index] = el)}
            onSubmitEditing={
              index + 1 < TOTAL_WORDS
                ? () => inputRef.current[index + 1].focus()
                : null
            }
            error={values[`word${index + 1}`] === '' ? 'Required' : null}
            blurOnSubmit={index + 1 === TOTAL_WORDS ? true : false}
            autoCapitalize="none"
          />
        ))}
        <View style={{marginVertical: Spacing.vs}}>
          <CustomButton title="Restore" onPress={handleSubmit} />
        </View>

        <PasscodeBottomSheet
          onDismiss={() => setShowPasscodeBottomSheet(false)}
          modalProps={{
            onRequestClose: () => {
              setShowPasscodeBottomSheet(false);
              setErrorMessage('');
              setPasscode('');
              setConfirmPasscode('');
              navigation.pop();
            },
          }}
          isVisible={showPasscodeBottomSheet}
          errorMessage={errorMessage}
          >
          <View>
            <View style={{marginBottom: Spacing.vs}}>
              {passcode.length < CELL_COUNT && (
                <CodeField
                  ref={ref}
                  {...props}
                  value={passcode}
                  onChangeText={setPasscode}
                  cellCount={CELL_COUNT}
                  rootStyle={styles.codeFieldRoot}
                  keyboardType="number-pad"
                  textContentType="password"
                  renderCell={renderCell}
                />
              )}
              {passcode.length >= CELL_COUNT && (
                <View>
                  <CodeField
                    ref={ref2}
                    {...props2}
                    // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                    value={confirmPasscode}
                    onChangeText={setConfirmPasscode}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={renderCell2}
                  />
                  {confirmPasscode.length < 6 && (
                    <RobotoRegular
                      fontSize={FontSize.small}
                      style={{textAlign: 'center', paddingTop: Spacing.vs}}>
                      Please enter passcode again
                    </RobotoRegular>
                  )}
                </View>
              )}
              {errorMessage !== '' && (
                <RobotoRegular
                  fontSize={FontSize.small}
                  color={colors.danger}
                  style={{textAlign: 'center'}}>
                  {errorMessage}
                </RobotoRegular>
              )}
            </View>
            <CustomButton
              disabled={
                passcode.length > 0 && passcode !== confirmPasscode
                  ? true
                  : passcode.length === 0
                  ? true
                  : false
              }
              // icon={<PlusCircleIcon />}
              title="Confirm"
              onPress={() => setShowPasscodeBottomSheet(false)}
            />
          </View>
        </PasscodeBottomSheet>
      </View>
    </ScrollView>
  );
};

export default RestoreMnemonicScreen;

const styles = StyleSheet.create({
  container: {paddingHorizontal: Spacing.hs, paddingTop: Spacing.vs * 2},
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
