import {useIsFocused} from '@react-navigation/native';
import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';
import colors from '../../constants/colors';
import {Spacing} from '../../constants/utils';
import Card from '../components/Card';
import CustomButton from '../components/CustomButton';
import CustomHeader from '../components/CustomHeader';
import RobotoRegular from '../components/RobotoRegular';

const BackupMnemonicScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const {walletInfo} = useSelector(state => state.wallet);
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
      <View
        style={{flex: 1, alignItems: 'center', paddingHorizontal: Spacing.hs}}>
        <RobotoRegular
          style={{paddingTop: Spacing.vs * 2, paddingBottom: Spacing.vs}}>
          These 12 words are the key to your wallet. Back it up manually and
          store it safely. Do not share this with anyone !!
        </RobotoRegular>
        <RobotoRegular
          color={colors.yellow}
          style={{paddingBottom: Spacing.vs}}>
          You will need this secret to restore your wallet
        </RobotoRegular>
        <Card>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}>
            {walletInfo?.mnemonic?.split(' ').map((word, index) => (
              <RobotoRegular
                key={index}
                style={{
                  width: widthPercentageToDP(25),
                  // textAlign: 'center',
                  paddingTop: Spacing.vs / 2,
                }}>
                {index + 1}. {word}
              </RobotoRegular>
            ))}
          </View>
        </Card>
        <View style={{marginTop: Spacing.vs * 2}}>
          <CustomButton
            title={'I have written it down'}
            onPress={() => navigation.pop()}
          />
        </View>
      </View>
    </>
  );
};

export default BackupMnemonicScreen;

const styles = StyleSheet.create({});
