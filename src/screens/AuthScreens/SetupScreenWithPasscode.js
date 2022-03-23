import React, {useEffect, useState} from 'react';
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {GoogleIcon, PlusCircleIcon, WalletIcon} from '../../../assets/icons';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import CustomButton from '../../components/CustomButton';
import CustomLoader from '../../components/CustomLoader';
import CustomPopup from '../../components/CustomPopup';
import RobotoBold from '../../components/RobotoBold';
import RobotoRegular from '../../components/RobotoRegular';
import PasscodeBottomSheet from '../../components/PasscodeBottomSheet';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
} from 'react-native-confirmation-code-field';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {
  GDrive,
  ListQueryBuilder,
  MimeTypes,
} from '@robinbobin/react-native-google-drive-api-wrapper';
import {useDispatch} from 'react-redux';
import {decryptionHelper} from '../../../constants/helper';
import {restoreUsingDrive} from '../../redux/actions/wallet';
import {CommonActions} from '@react-navigation/native';

let CELL_COUNT = 6;
GoogleSignin.configure({
  scopes: [
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file',
  ],
  offlineAccess: true,
  webClientId:
    '356319347151-9c32bk23lvscrp3rlhhef971g9jn6nlv.apps.googleusercontent.com',
});

const SetupScreenWithPasscode = ({navigation}) => {
  let gdrive = new GDrive();
  const dispatch = useDispatch();
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');

  const [values, setValues] = useState({
    showPasscodeBottomSheet: false,
    errorMessage: '',
    bottomSheetTitle: '',
    bottomSheetSubTitle: '',
    bottomSheetType: '',
    showPopup: false,
    popupMessage: '',
    popupType: '',
    popupMessageType: '',
    showLoader: false,
    loaderMessage: '',
  });

  const {
    showPasscodeBottomSheet,
    errorMessage,
    bottomSheetSubTitle,
    bottomSheetTitle,
    bottomSheetType,
    loaderMessage,
    popupMessage,
    popupMessageType,
    popupType,
    showLoader,
    showPopup,
  } = values;

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

  useEffect(() => {
    GoogleSignin.signOut();
  }, []);

  useEffect(() => {
    if (confirmPasscode.length === CELL_COUNT) {
      Keyboard.dismiss();

      if (passcode.length > 0 && passcode !== confirmPasscode) {
        setPasscode('');
        setConfirmPasscode('');
        setValues({
          ...values,
          errorMessage: 'Passcodes do not match. Try again',
        });
        return;
      }
    }
  }, [confirmPasscode]);

  useEffect(() => {
    if (passcode.length > 0) {
      setValues({
        ...values,
        errorMessage: '',
      });
    }
    if (passcode.length === 6 && bottomSheetType === 'restore') {
      Keyboard.dismiss();
    }
  }, [passcode]);

  const handleCreateNewWallet = () => {
    setValues({...values, showPasscodeBottomSheet: false});
    navigation.navigate('CreateWalletScreen', {withEncryption: true, passcode});
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

  const createWalletPasscodeContent = () => (
    <View>
      {passcode.length < CELL_COUNT && (
        <CodeField
          // onEndEditing={() => console.log('submit editing')}
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={passcode}
          onChangeText={setPasscode}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
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
      <CustomButton
        disabled={
          passcode.length > 0 && passcode !== confirmPasscode
            ? true
            : passcode.length === 0
            ? true
            : false
        }
        icon={<PlusCircleIcon />}
        title="Create new Wallet"
        onPress={handleCreateNewWallet}
      />
    </View>
  );
  const restoreWalletPasscodeContent = () => (
    <View>
      <CodeField
        // onEndEditing={() => console.log('submit editing')}
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={passcode}
        onChangeText={setPasscode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
      <CustomButton
        disabled={passcode.length === 6 ? false : true}
        title="Confirm"
        onPress={googleSignin}
      />
    </View>
  );
  const onRestoreFromDriveSuccess = () => {
    setValues({...values, showLoader: false, showPasscodeModal: false});
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Tabs'}],
      }),
    );
  };

  const onRestoreFromDriveError = e => {
    console.log(e);
    let error = JSON.stringify(e);
    setValues(values => ({
      ...values,
      showLoader: false,
      showPopup: true,
      popupType: 'alert',
      popupMessageType: 'Error',
      popupMessage: error,
    }));
  };

  const handleRestoreWallet = async data => {
    setValues(values => ({
      ...values,
      showLoader: true,
      loaderMessage: 'Restoring your wallet. Please wait...',
    }));
    try {
      let binaryFileData, encryptedData;
      binaryFileData = await gdrive.files.getBinary(data.files[0].id);
      encryptedData = JSON.parse(
        String.fromCharCode.apply(null, binaryFileData),
      );
      const walletInfo = await decryptionHelper(
        encryptedData.cipher,
        encryptedData.iv,
        passcode,
      );

      dispatch(
        restoreUsingDrive(
          walletInfo,
          passcode,
          onRestoreFromDriveSuccess,
          onRestoreFromDriveError,
        ),
      );
    } catch (e) {
      console.log(e);
      let errorMessage = '';
      if (
        e?.message ===
        'error:1e000065:Cipher functions:OPENSSL_internal:BAD_DECRYPT'
      ) {
        errorMessage = 'Invalid Passcode. Please try again';
      }
      setValues(values => ({
        ...values,
        showLoader: false,
        showPasscodeModal: false,
        showPopup: true,
        popupType: 'alert',
        popupMessageType: 'Error',
        popupMessage:
          errorMessage !== ''
            ? errorMessage
            : 'Something went wrong. Please try again',
      }));
    }
  };

  const initializeGDrive = async () => {
    setValues(values => ({
      ...values,
      showLoader: true,
      loaderMessage: 'Checking your drive for backup files',
    }));
    try {
      gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
      let data = await gdrive.files.list({
        q: new ListQueryBuilder()
          .e('name', 'rumsan_wallet_backup')
          .and()
          .e('mimeType', 'application/octet-stream'),
      });
      if (data.files?.length === 0) {
        return setValues(values => ({
          ...values,
          showLoader: false,
          showPopup: true,
          popupType: 'alert',
          popupMessageType: 'Info',
          popupMessage:
            'Sorry, Your drive does not contain rumsan wallet backup file.',
        }));
      }

      handleRestoreWallet(data);

      // handleBackupToDrive();
    } catch (e) {
      console.log(e);
      setValues(values => ({
        ...values,
        showLoader: false,
        showPopup: true,
        popupType: 'alert',
        popupMessageType: 'Error',
        popupMessage: 'Something went wrong. Please try again',
      }));
    }
  };

  const googleSignin = async () => {
    setValues({...values, showPasscodeBottomSheet: false});
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      initializeGDrive();
    } catch (error) {
      console.log(error);
      setValues(values => ({
        ...values,
        showLoader: false,
        showPopup: true,
        popupType: 'alert',
        popupMessageType: 'Error',
      }));
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setValues(values => ({
          ...values,
          popupMessage: 'Signin Cancelled',
        }));
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setValues(values => ({
          ...values,
          popupMessage: 'Play services not available',
        }));
      } else {
        setValues(values => ({
          ...values,
          popupMessage: 'Something went wrong. Please try again',
        }));
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.introView}>
        <CustomLoader show={showLoader} message={loaderMessage} />
        <CustomPopup
          show={showPopup}
          message={popupMessage}
          messageType={popupMessageType}
          popupType={popupType}
          onConfirmAlert={() => {
            setValues({...values, showPopup: false});
            setPasscode('');
          }}
        />
        <RobotoBold fontSize={FontSize.xlarge * 1.4}>Rumsan Wallet</RobotoBold>
        <RobotoRegular>
          Rumsan Wallet is a secure way to connect to Rumsan services and
          blockchain applications. You can scan, store and manage your identity
          documents and digital assets.
        </RobotoRegular>
        <RobotoRegular>
          Let’s setup your wallet. You can either create a new wallet or restore
          an existing wallet.
        </RobotoRegular>
      </View>
      {/* <View style={styles.buttonsView}> */}
      <PasscodeBottomSheet
        title={bottomSheetTitle}
        subTitle={bottomSheetSubTitle}
        onDismiss={() => setValues({...values, showPasscodeBottomSheet: false})}
        modalProps={{
          onRequestClose: () => {
            setPasscode('');
            setConfirmPasscode('');
            setValues({
              ...values,
              showPasscodeBottomSheet: false,
              errorMessage: '',
            });
          },
        }}
        isVisible={showPasscodeBottomSheet}
        // buttonDisabled={passcodeButtonDisabled}
        errorMessage={errorMessage}
        // onPress={() => alert('haha')}
      >
        <View>
          {bottomSheetType === 'create'
            ? createWalletPasscodeContent()
            : restoreWalletPasscodeContent()}
        </View>
      </PasscodeBottomSheet>
      {/* <CustomButton title="Create Wallet" onPress={createWallet} /> */}
      <CustomButton
        icon={<WalletIcon />}
        title="Create new Wallet"
        onPress={() =>
          setValues({
            ...values,
            showPasscodeBottomSheet: true,
            bottomSheetTitle: 'Setup Passcode',
            bottomSheetSubTitle: 'Setup your wallet passcode',
            bottomSheetType: 'create',
          })
        }
      />
      <CustomButton
        icon={<WalletIcon />}
        title="Restore Wallet from mnemonics"
        color={colors.yellow}
        onPress={() => navigation.navigate('RestoreMnemonicScreen')}
      />
      <CustomButton
        icon={<GoogleIcon />}
        title="Restore from Google Drive"
        color={colors.green}
        onPress={() =>
          setValues({
            ...values,
            showPasscodeBottomSheet: true,
            bottomSheetTitle: 'Passcode',
            bottomSheetSubTitle:
              'Enter your passcode you used to backup your wallet to the google drive',
            bottomSheetType: 'restore',
          })
        }
      />
    </View>
    // </View>
  );
};

export default SetupScreenWithPasscode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: Spacing.hs,
    // alignItems: 'center',
    // paddingHorizontal: Spacing.hs,
  },
  introView: {marginBottom: Spacing.vs * 2},
  buttonsView: {
    marginBottom: Spacing.vs * 2,
  },

  codeFieldRoot: {
    // alignItems: 'center',
    marginBottom: Spacing.vs,
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
