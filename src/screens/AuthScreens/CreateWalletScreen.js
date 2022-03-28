import {CommonActions} from '@react-navigation/routers';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import {FontSize, Spacing} from '../../../constants/utils';
import CustomButton from '../../components/CustomButton';
import CustomLoader from '../../components/CustomLoader';
import HeaderText from '../../components/HeaderText';
import Loader from '../../components/Loader';
import RegularText from '../../components/RegularText';
import RobotoRegular from '../../components/RobotoRegular';
import SmallText from '../../components/SmallText';
import {getWallet} from '../../redux/actions/wallet';
import Card from '../../components/Card';
import CustomPopup from '../../components/CustomPopup';

const CreateWalletScreen = ({navigation, route}) => {
  const {withEncryption} = route.params;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const {wallet} = useSelector(state => state.wallet);

  useEffect(() => {
    withEncryption
      ? dispatch(
          getWallet(
            'createWithEncryption',
            createWalletSuccess,
            createWalletError,
            '',
            route.params.passcode,
          ),
        )
      : dispatch(getWallet('create', createWalletSuccess, createWalletError));
  }, []);

  useEffect(() => {
    const array = wallet?._mnemonic().phrase?.split[' '];
    console.log(array);
  }, [wallet]);

  const createWalletSuccess = () => {
    setLoading(false);
  };

  const createWalletError = e => {
    Alert.alert('Error', `${e || 'Something went wrong. Please try again.'}`, [
      {text: 'OK', onPress: () => navigation.replace('SetupScreen')},
    ]);
  };

  const goToWallet = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Tabs'}],
      }),
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader message="Creating your wallet. Please wait..." />
      ) : (
        <>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <CustomPopup
              show={showPopup}
              messageType="Success"
              message="Would you like to backup your wallet in Google Drive"
              firstButtonText="Yes, backup"
              secondButtonText="No, Take me to home page"
              onFirstButtonPress={goToWallet}
              onSecondButtonPress={goToWallet}
            />
            <RobotoRegular>
              These 12 words are the key to your wallet. Back it up manually and
              store it safely. Do not share this with anyone !!
            </RobotoRegular>
            <RobotoRegular color={colors.yellow}>
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
                {wallet
                  ?._mnemonic()
                  .phrase?.split(' ')
                  .map((word, index) => (
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
          </View>
          <View style={{marginBottom: Spacing.vs * 2}}>
            <CustomButton
              title="I have written it down"
              // onPress={() => setShowPopup(true)}
              onPress={goToWallet}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default CreateWalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.hs,
    backgroundColor: colors.white,
  },
});
