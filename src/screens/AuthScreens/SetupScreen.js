import React, {useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {GoogleIcon, WalletIcon} from '../../../assets/icons';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import CustomButton from '../../components/CustomButton';
import RobotoBold from '../../components/RobotoBold';
import RobotoRegular from '../../components/RobotoRegular';

const SetupScreen = ({navigation}) => {
  const createWallet = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to create a new rumsan wallet?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Create',
          onPress: () =>
            navigation.navigate('CreateWalletScreen', {withEncryption: false}),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.introView}>
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
      <View style={styles.buttonsView}>
        {/* <CustomButton title="Create Wallet" onPress={createWallet} /> */}
        <CustomButton
          icon={<WalletIcon />}
          title="Create new Wallet"
          onPress={createWallet}
        />
        <CustomButton
          icon={<WalletIcon />}
          title="Restore Wallet from mnemonics"
          color={colors.yellow}
          onPress={() => navigation.navigate('RestoreMnemonicScreen')}
        />
        {/* <CustomButton
          icon={<GoogleIcon />}
          title="Restore from Google Drive"
          color={colors.green}
          onPress={() => navigation.navigate('RestoreMnemonicScreen')}
        /> */}
      </View>
    </View>
  );
};

export default SetupScreen;

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
});
