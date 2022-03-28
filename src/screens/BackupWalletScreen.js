import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Keyboard,
} from 'react-native';
import colors from '../../constants/colors';
import {FontSize, Spacing} from '../../constants/utils';
import CustomButton from '../components/CustomButton';
import CustomHeader from '../components/CustomHeader';
import RobotoMedium from '../components/RobotoMedium';
import RobotoRegular from '../components/RobotoRegular';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
} from 'react-native-confirmation-code-field';
import PasscodeBottomSheet from '../components/PasscodeBottomSheet';
import CustomLoader from '../components/CustomLoader';
import CustomPopup from '../components/CustomPopup';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GDrive,
  ListQueryBuilder,
  MimeTypes,
} from '@robinbobin/react-native-google-drive-api-wrapper';
import {encryptionHelper} from '../../constants/helper';
import {useSelector} from 'react-redux';

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

const BackupWalletScreen = ({navigation}) => {
  let gdrive = new GDrive();
  const {walletInfo} = useSelector(state => state.wallet);
  const isFocused = useIsFocused();
  const [passcode, setPasscode] = useState('');
  const ref = useBlurOnFulfill({passcode, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: passcode,
    setValue: setPasscode,
  });

  const [values, setValues] = useState({
    showLoader: false,
    loaderMessage: '',
    errorMessage: '',
    showPasscodeBottomSheet: false,
    showPopup: false,
    popupMessage: '',
    popupMessageType: '',
    popupType: '',
  });

  const {
    errorMessage,
    loaderMessage,
    showLoader,
    showPasscodeBottomSheet,
    showPopup,
    popupMessage,
    popupMessageType,
    popupType,
  } = values;

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

  useEffect(() => {
    if (passcode.length === 6) {
      Keyboard.dismiss();
    }
  }, [passcode]);

  useEffect(() => {
    GoogleSignin.signOut();
  }, []);

  const handleBackupToDrive = async () => {
    setValues(values => ({
      ...values,
      loaderMessage: 'Encrypting your wallet. Please wait...',
    }));

    try {
      let encryptedData = await encryptionHelper(walletInfo, passcode);
      if (encryptedData.cipher) {
        await gdrive.files
          .newMultipartUploader()
          .setData(JSON.stringify(encryptedData), MimeTypes.BINARY)
          .setRequestBody({
            name: 'rumsan_wallet_backup',
          })
          .execute();
        setValues(values => ({
          ...values,
          showLoader: false,
          loaderMessage: '',
          showPopup: true,
          popupType: 'alert',
          popupMessageType: 'Success',
          popupMessage: 'Wallet backed up to your google drive successfully',
        }));
      }
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

  const initializeGDrive = async () => {
    setValues(values => ({
      ...values,
      showLoader: true,
      loaderMessage: 'Checking your drive for backup',
    }));
    try {
      gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
      let data = await gdrive.files.list({
        q: new ListQueryBuilder()
          .e('name', 'rumsan_wallet_backup')
          .and()
          .e('mimeType', 'application/octet-stream'),
      });
      if (data.files?.length !== 0) {
        return setValues(values => ({
          ...values,
          showLoader: false,
          showPopup: true,
          popupType: 'alert',
          popupMessageType: 'Info',
          popupMessage: 'Your wallet is already backed up in your google drive',
        }));
      }
      handleBackupToDrive();
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
    // dispatch({type: 'BACKUP_TO_DRIVE_STATUS', payload: true});
    setValues({...values, showPasscodeBottomSheet: false});
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      initializeGDrive();
    } catch (error) {
      // dispatch({type: 'BACKUP_TO_DRIVE_STATUS', payload: false});
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
    <>
      {isFocused && (
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />
      )}
      <CustomHeader
        title="Backup Wallet"
        onBackPress={() => navigation.pop()}
      />
      <ScrollView style={styles.container}>
        <CustomLoader show={showLoader} message={loaderMessage} />
        <CustomPopup
          show={showPopup}
          popupType={popupType}
          message={popupMessage}
          messageType={popupMessageType}
          onConfirmAlert={() => {
            setValues({...values, showPopup: false});
            setPasscode('');
          }}
        />
        <View style={styles.aboutView}>
          <RobotoMedium
            style={{paddingBottom: Spacing.vs / 2}}
            fontSize={FontSize.medium * 1.1}>
            Backup your wallet
          </RobotoMedium>
          <RobotoRegular color={colors.danger}>
            Important! Read very carefully
          </RobotoRegular>
          <RobotoRegular
            noPadding
            style={styles.description}
            fontSize={FontSize.small * 1.1}>
            For the privacy and security, this application never sends any of
            your private key and wallet information to our or any of our server.
            This means that if you lose or reset your device, we won't be able
            to recover your wallet or any fund associated with it. Hence,
            creating backup of your wallet is very important. There are two ways
            to backup your wallet. You have complete control over your backups.
          </RobotoRegular>
        </View>
        <View style={styles.aboutView}>
          <RobotoRegular>
            Option 1: Write down your 12 secret words (mnemonic).
          </RobotoRegular>
          <RobotoRegular
            style={styles.description}
            fontSize={FontSize.small * 1.1}>
            This is the safest way to backup your wallet. Click the button below
            to reveal your secret words. Check no one is looking your screen.
            Make sure you write down in a paper (or save in an encrypted file)
            and store safely. NEVER lose it. If you ever need to restore your
            wallet use these secret words. You can even use these secret words
            to restore wallet in other blockchain based wallet. Be careful where
            you restore your wallet. There a lot of scammers out there.
          </RobotoRegular>
          <CustomButton
            title="Backup Secret Words"
            color={colors.green}
            onPress={() => navigation.navigate('BackupMnemonicScreen')}
          />
        </View>
        <View style={styles.aboutView}>
          <RobotoRegular>Option 2: Backup to Google Drive.</RobotoRegular>
          <RobotoRegular style={styles.description}>
            Another easier way to backup is just storing an encrypted form of
            your wallet in your Google Drive. You still have to remember or
            write down your 6 digit app passcode, as the app uses this passcode
            to encrypt the wallet before sending to Google Drive, for security.
            You will need to sign in with Google and give access to Drive. The
            app will create a folder called 'eSatyaWalletBackup'. NEVER delete
            it or any contents within it.
          </RobotoRegular>
          <CustomButton
            color={colors.blue}
            title="Backup to Google Drive"
            onPress={() =>
              setValues({...values, showPasscodeBottomSheet: true})
            }
          />
        </View>
        <PasscodeBottomSheet
          title="Setup Passcode"
          subTitle="You'll need this passcode to restore your wallet from the drive"
          onDismiss={() =>
            setValues({...values, showPasscodeBottomSheet: false})
          }
          modalProps={{
            onRequestClose: () => {
              setValues({
                ...values,
                showPasscodeBottomSheet: false,
                errorMessage: '',
                passcode: '',
              });
            },
          }}
          isVisible={showPasscodeBottomSheet}
          // buttonDisabled={passcodeButtonDisabled}
          errorMessage={errorMessage}
          onPress={() => alert('haha')}>
          <View>
            <View style={{marginBottom: Spacing.vs}}>
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
              disabled={passcode.length === 6 ? false : true}
              title="Confirm"
              onPress={googleSignin}
            />
          </View>
        </PasscodeBottomSheet>
      </ScrollView>
    </>
  );
};

export default BackupWalletScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.vs,
  },
  description: {
    textAlign: 'justify',
    color: colors.lightGray,
    paddingBottom: Spacing.vs,
  },
  aboutView: {marginBottom: Spacing.vs},
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
