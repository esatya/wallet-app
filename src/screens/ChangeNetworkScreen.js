import React, {useEffect, useState} from 'react';
import {StyleSheet, View, StatusBar, ScrollView} from 'react-native';
import colors from '../../constants/colors';
import {FontSize, Spacing} from '../../constants/utils';
import {useDispatch, useSelector} from 'react-redux';
import {connectToNetwork} from '../redux/actions/wallet';
import CustomHeader from '../components/CustomHeader';
import {useIsFocused} from '@react-navigation/native';
import RobotoRegular from '../components/RobotoRegular';
import Card from '../components/Card';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import NETWORK_LIST from '../../constants/networkList';
import CustomTextInput from '../components/CustomTextInput';

const ChangeNetworkScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const {wallet, provider} = useSelector(state => state.wallet);

  const [values, setValues] = useState({
    currentNetwork:
      provider?.connection?.url ||
      'https://rinkeby.infura.io/v3/ae22018377b14a61983be979df457b20',
    currentNetwork: '',
    currentNetworkIndex: NETWORK_LIST.findIndex(
      item => item.value === provider?.connection?.url,
    ),
    message: '',
    messageType: '',
    customNetworkUrl: '',
  });

  const {
    currentNetwork,
    currentNetworkIndex,
    message,
    messageType,
    customNetworkUrl,
  } = values;

  useEffect(() => {
    const isCurrentNetworkCustom = NETWORK_LIST.every(
      item => item.value !== provider?.connection?.url,
    );
    if (isCurrentNetworkCustom) {
      setValues({
        ...values,
        customNetworkUrl: provider?.connection?.url,
        currentNetwork: 'custom',
        currentNetworkIndex: NETWORK_LIST.findIndex(
          item => item.value === 'custom',
        ),
      });
    }
  }, []);

  const onSuccess = () => {
    if (isFocused) {
      setValues(values => ({
        ...values,
        message: 'Network Updated Successfully',
        messageType: 'success',
      }));
    }
  };
  const onError = e => {
    if (e.message.includes('could not detect network')) {
      setValues(values => ({
        ...values,
        message: 'Invalid network Url. Please try again',
        messageType: 'error',
      }));
    }
  };

  const handleCustomNetwork = () => {
    setValues({...values, message: 'Updating network...', messageType: 'info'});
    dispatch(
      connectToNetwork(
        'Custom Network',
        customNetworkUrl,
        wallet,
        onSuccess,
        onError,
      ),
    );
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
      <CustomHeader title="Networks" onBackPress={() => navigation.pop()} />
      <ScrollView>
        <View style={styles.container}>
          <RobotoRegular fontSize={FontSize.large}>
            Select a Network
          </RobotoRegular>
          <RobotoRegular fontSize={FontSize.small} color={colors.lightGray}>
            Please note: changing network will show current balance of only the
            active network
          </RobotoRegular>

          <RobotoRegular>Available Network</RobotoRegular>
          <Card style={{paddingVertical: Spacing.vs * 2}}>
            <RadioForm animation={true}>
              {NETWORK_LIST.map((obj, i) => {
                var onRadioPress = (value, index) => {
                  if (value !== 'custom') {
                    setValues({
                      ...values,
                      currentNetwork: value,
                      currentNetworkIndex: index,
                      message: 'Updating network...',
                      messageType: 'info',
                    });
                    dispatch(
                      connectToNetwork(
                        obj.label,
                        value,
                        wallet,
                        onSuccess,
                        onError,
                      ),
                    );
                  } else {
                    setValues({
                      ...values,
                      currentNetwork: value,
                      currentNetworkIndex: index,
                      message: '',
                    });
                  }
                };
                return (
                  <>
                    <RadioButton labelHorizontal={true} key={i}>
                      {/*  You can set RadioButtonLabel before RadioButtonInput */}
                      <RadioButtonInput
                        selectedButtonColor={colors.blue}
                        obj={obj}
                        index={i}
                        isSelected={currentNetworkIndex === i}
                        onPress={onRadioPress}
                        borderWidth={1}
                        buttonInnerColor={colors.blue}
                        buttonOuterColor={
                          currentNetworkIndex === i ? colors.blue : colors.gray
                        }
                        buttonSize={14}
                        buttonOuterSize={20}
                        buttonWrapStyle={{marginLeft: 10}}
                      />
                      <RadioButtonLabel
                        obj={obj}
                        index={i}
                        labelHorizontal={true}
                        onPress={onRadioPress}
                        labelStyle={{
                          fontSize: FontSize.medium,
                          color: colors.black,
                        }}
                      />
                    </RadioButton>
                    {i !== NETWORK_LIST.length - 1 && (
                      <View style={styles.line} key={Math.random()} />
                    )}
                  </>
                );
              })}
              {currentNetwork === 'custom' && (
                <CustomTextInput
                  labelLeftAlign
                  // labelPadding={Spacing.hs *2}
                  label="Enter Network Url"
                  placeholder="Ethereum network gateway url"
                  onChangeText={value =>
                    setValues({...values, customNetworkUrl: value})
                  }
                  value={customNetworkUrl}
                  autoCapitalize="none"
                  width={wp(80)}
                  onSubmitEditing={handleCustomNetwork}
                />
              )}
            </RadioForm>
            <RobotoRegular
              color={
                messageType === 'success'
                  ? colors.green
                  : messageType === 'info'
                  ? colors.yellow
                  : colors.darkRed
              }
              style={{
                paddingHorizontal: Spacing.hs / 2,
                paddingTop: Spacing.vs,
              }}>
              {message}
            </RobotoRegular>
          </Card>
        </View>
      </ScrollView>
    </>
  );
};

export default ChangeNetworkScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.hs,
  },
  line: {
    height: hp(0.1),
    width: wp(68),
    alignSelf: 'flex-end',
    backgroundColor: colors.lightGray,
    marginTop: Spacing.vs / 2,
    marginBottom: Spacing.vs * 1.5,
  },
});
