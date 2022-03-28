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

const ScanTokenAddress = ({navigation, route}) => {
  const isFocused = useIsFocused();

  const onScanSuccess = async res => {
    let data = res.data;
    if (data) {
      let properties = data.split(':');
      if (properties[0] === 'ethereum') {
        navigation.navigate('ImportTokenScreen', {
          contractAddress: properties[1],
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <StatusBar backgroundColor="rgba(0,0,0,0)" barStyle="light-content" />
      )}

      <QRCodeScanner
        cameraStyle={{height: '100%', backgroundColor: colors.blue}}
        showMarker
        markerStyle={{borderColor: colors.blue}}
        reactivate
        // reactivateTimeout={1000}
        onRead={onScanSuccess}
      />

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
          Scan and Add Asset
        </RobotoMedium>
      </View>
    </View>
  );
};

export default ScanTokenAddress;

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
