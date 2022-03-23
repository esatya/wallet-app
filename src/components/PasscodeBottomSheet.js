import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {BottomSheet} from 'react-native-elements/dist/bottomSheet/BottomSheet';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomButton from './CustomButton';
import {PlusCircleIcon} from '../../assets/icons';
// import PasscodeBox from '../box/PasscodeBox';
// import LogInButton from '../buttons/LogInButton';
import PasscodeTextInput from '../components/PasscodeTextInput';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {FontSize, Spacing} from '../../constants/utils';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import colors from '../../constants/colors';
import RobotoRegular from '../components/RobotoRegular';

const CELL_COUNT = 6;

const PasscodeBottomSheet = ({
  title,
  subTitle,
  isVisible,
  onPress,
  modalProps,
  buttonDisabled,
  children,
  errorMessage,
  isSetup,
}) => {
  return (
    <BottomSheet
      modalProps={modalProps}
      isVisible={isVisible}
      containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}>
      <View style={styles.passcodeContainer}>
        {!isSetup && (
          <View style={styles.passcodeTextContainer}>
            {title && (
              <Text style={styles.passcodeTitleText}>{title}</Text>
            )}
            <Text style={styles.passcodeDescriptionText}>
              {subTitle || 'Enter your passcode to unlock your Rumsan wallet'}
            </Text>
          </View>
        )}
        {isSetup && (
          <>
            <View style={styles.passcodeTextContainer}>
              <Text style={styles.passcodeDescriptionText}>
                First let's setup your passcode.
              </Text>
            </View>
            <View style={styles.passcodeTextContainer}>
              <Text style={styles.passcodeDescriptionText}>
                You will be asked this passcode to unlock your wallet.
              </Text>
            </View>
            <View
              style={[styles.passcodeTextContainer, {paddingTop: hp('3%')}]}>
              <Text style={styles.choosePasscode}>
                Choose a 6-digit passcode
              </Text>
            </View>
          </>
        )}
        <View style={styles.passcodeBoxContainer}>
          {children}
          {/* {passCode.length < CELL_COUNT && (
            <CodeField
              onEndEditing={() => console.log('submit editing')}
              ref={ref}
              {...props}
              // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
              value={passCode}
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
          )}
          {passCode.length >= CELL_COUNT && (
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
                renderCell={({index, symbol, isFocused}) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler2(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
              {confirmPasscode.length < 6 && (
                <RobotoRegular
                  fontSize={FontSize.small}
                  style={{textAlign: 'center', paddingTop: Spacing.vs}}>
                  Please enter passcode again
                </RobotoRegular>
              )}
            </View>
          )} */}
        </View>

        {/* <CustomButton
          disabled={buttonDisabled}
          icon={<PlusCircleIcon />}
          title="Create new Wallet"
          //   onPress={() => setShowPasscodeBottomSheet(true)}
        /> */}
      </View>
    </BottomSheet>
  );
};

export default PasscodeBottomSheet;
const styles = StyleSheet.create({
  passcodeContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('7%'),
    paddingVertical: hp('3%'),
    borderTopLeftRadius: hp('2%'),
    borderTopRightRadius: hp('2%'),
  },
  passcodeTextContainer: {
    paddingBottom: hp('3%'),
  },
  passcodeTitleText: {
    fontSize: FontSize.medium,
    fontWeight: "600",
    paddingBottom: Spacing.vs / 2
  },
  passcodeDescriptionText: {
    color: 'black',
    fontSize: wp('4%'),
  },
  choosePasscode: {
    color: '#A7A7A7',
    fontSize: wp('4%'),
  },
  passcodeBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: hp('3%'),
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
