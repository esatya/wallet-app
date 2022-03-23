import React from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../../constants/colors';
import CustomHeader from '../components/CustomHeader';
import {useIsFocused} from '@react-navigation/native';
import {AngleRightIcon} from '../../assets/icons';
import {FontSize, Spacing} from '../../constants/utils';
import RobotoRegular from '../components/RobotoRegular';
import {heightPercentageToDP} from 'react-native-responsive-screen';

const SettingsScreen = ({navigation}) => {
  const isFocused = useIsFocused();

  const SettingComponent = ({title, onPress}) => (
    <>
      <Pressable style={styles.button} onPress={onPress}>
        <RobotoRegular>{title}</RobotoRegular>
        <AngleRightIcon />
      </Pressable>
      <View style={styles.line} />
    </>
  );

  return (
    <>
      {isFocused && (
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />
      )}
      <CustomHeader hideBackButton title="Settings" />
      <View style={styles.container}>
        <SettingComponent
          title="Backup Wallet"
          onPress={() => navigation.navigate('BackupWalletScreen')}
        />
        <SettingComponent
          title="Change Network"
          onPress={() => navigation.navigate('ChangeNetworkScreen')}
        />
        {/* <SettingComponent title="IPFS" onPress={() => alert('ipfs')} /> */}
      </View>
    </>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.hs,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.vs,
  },
  line: {
    height: heightPercentageToDP(0.1),
    backgroundColor: colors.lightGray,
  },
});
