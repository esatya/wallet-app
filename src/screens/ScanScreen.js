import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, StatusBar, Image} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import colors from '../../constants/colors';
import RobotoMedium from '../components/RobotoMedium';
import {useIsFocused} from '@react-navigation/native';
import CustomPopup from '../components/CustomPopup';
import CustomButton from '../components/CustomButton';
import {FontSize} from '../../constants/utils';
import {useSelector} from 'react-redux';
import EthCrypto from 'eth-crypto';
import CustomLoader from '../components/CustomLoader';

const ScanScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const {wallet, encryptedWallet, balance, providerName} = useSelector(
    state => state.wallet,
  );
  const [values, setValues] = useState({
    showPopup: false,
    messageType: '',
    popupMessage: '',
    firstButtonText: '',
    secondButtonText: '',
    popupTitle: '',
    popupType: '',
    data: null,
    encryptionKey: null,
    callbackUrl: '',
    showLoader: false,
    loaderMessage: '',
  });

  const {
    showPopup,
    messageType,
    popupMessage,
    firstButtonText,
    popupTitle,
    secondButtonText,
    popupType,
    data,
    encryptionKey,
    callbackUrl,
    showLoader,
    loaderMessage,
  } = values;

  const isJsonString = str => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  const onScanSuccess = async res => {
    let loginPayload = null;
    // setValues(values => ({
    //   ...values,
    //   showLoader: true,
    //   loaderMessage: 'Please wait...',
    // }));
    let data = res.data;
    if (data) {
      const isJsonStr = isJsonString(data);
      if (isJsonStr === true) {
        loginPayload = JSON.parse(data);
        if (loginPayload && loginPayload.action === 'login')
          return handleQRLogin(loginPayload);
      } else {
        if (data.indexOf(':') === -1) {
          return setValues(values => ({
            ...values,
            showLoader: false,
            loaderMessage: '',
            showPopup: true,
            messageType: 'Error',
            popupMessage: 'This QR Code is not supported by Rumsan Wallet.',
            popupType: 'alert',
          }));
        }
        let properties = data.split(':');
        let symbol = properties[0] === 'ethereum' ? 'ETH' : properties[0];
        if (properties[0] === 'ethereum') {
          navigation.navigate('SendTokenScreen', {
            destinationAddress: properties[1],
            symbol,
            fromScan: true,
            balance,
            network: providerName,
          });
        }

        // setValues(values => ({
        //   ...values,
        //   showLoader: false,
        //   loaderMessage: '',
        //   showPopup: true,
        //   messageType: 'Error',
        //   popupMessage: 'This QR Code is not supported by Rumsan Wallet.',
        //   popupType: 'alert',
        // }));
      }
    }
  };

  const confirmAndSign = async () => {
    setValues(values => ({
      ...values,
      showLoader: true,
      showPopup: false,
      loaderMessage: 'Loggin in. Please wait...',
    }));
    const encrytedWallet = await EthCrypto.encryptWithPublicKey(
      encryptionKey,
      // wallet.toString(),
      encryptedWallet.toString(),
    );
    data.encryptedWallet = EthCrypto.cipher.stringify(encrytedWallet);

    fetch(`${callbackUrl}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        // handleScanModalToggle();
        setValues(values => ({
          ...values,
          showPopup: true,
          showLoader: false,
          loaderMessage: '',
          messageType: 'Success',
          popupMessage: 'Logged in successfully!',
          popupType: 'alert',
        }));
        // Swal.fire('SUCCESS', 'Logged in successfully!', 'success');
      })
      .catch(err => {
        // Swal.fire('ERROR', 'Login using wallet failed!', 'error');
        setValues(values => ({
          ...values,
          showLoader: false,
          loaderMessage: '',
          showPopup: true,
          messageType: 'Error',
          popupMessage: 'Login using wallet failed!',
          popupType: 'alert',
        }));
      });
  };

  const handleQRLogin = async payload => {
    wallet.signMessage(payload.token).then(async signedData => {
      let data = {id: payload.id, signature: signedData};
      if (payload.encryptionKey) {
        // await confirmAndSign(data, payload.encryptionKey);
        setValues(values => ({
          ...values,
          showLoader: false,
          showPopup: true,
          popupTitle: 'Wallet Transfer',
          messageType: 'Info',
          popupMessage: 'Would you like to transfer your wallet and login',
          popupType: 'confirm',
          data,
          encryptionKey: payload.encryptionKey,
          callbackUrl: payload.callbackUrl,
          firstButtonText: 'Yes',
          secondButtonText: 'No',
        }));
      }
    });
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <StatusBar backgroundColor="rgba(0,0,0,0)" barStyle="light-content" />
      )}
      <CustomLoader show={showLoader} message={loaderMessage} />

      <CustomPopup
        show={showPopup}
        messageType={messageType}
        popupType={popupType}
        popupTitle={popupTitle}
        message={popupMessage}
        onConfirmAlert={() => {
          setValues({...values, showPopup: false});
          navigation.navigate('HomeScreen');
        }}
        firstButtonText={firstButtonText}
        secondButtonText={secondButtonText}
        onFirstButtonPress={confirmAndSign}
        hide={() => setValues({...values, showPopup: false})}
        buttonsRowView
      />

      {!showPopup && !showLoader && (
        <QRCodeScanner
          cameraStyle={{height: '100%', backgroundColor: colors.blue}}
          showMarker
          markerStyle={{borderColor: colors.blue}}
          reactivate
          // reactivateTimeout={1000}
          onRead={onScanSuccess}
        />
      )}

      <View style={styles.alignCenter}>
        <RobotoMedium
          color={colors.white}
          fontSize={FontSize.large * 1.2}
          style={{textAlign: 'center', top: 30}}>
          Scan a QR Code
        </RobotoMedium>

        <RobotoMedium
          color={colors.white}
          fontSize={FontSize.small}
          style={styles.text}>
          Send Ether or connect to desktop website
        </RobotoMedium>
      </View>
      {/* <View style={styles.buttonView}>
        <CustomButton
          title="Verify"
          // onPress={() => navigation.navigate('VerifyOTPScreen')}
        />
      </View> */}
      {/* <View style={styles.poweredByView}>
        <RegularText
          color={colors.white}
          style={{
            textAlign: 'center',
            paddingHorizontal: Spacing.hs / 3,
            fontSize: FontSize.small,
          }}>
          Powered By
        </RegularText>
        <RumsanLogo />
      </View> */}
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  alignCenter: {
    position: 'absolute',
    left: 0,
    top: 60,
    right: 0,
  },
  text: {textAlign: 'center', top: 25},
});
