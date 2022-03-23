import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../constants/colors';
import {FontSize, Spacing} from '../../constants/utils';
import {getWalletBalance} from '../redux/actions/wallet';
import RobotoBold from '../components/RobotoBold';
import RobotoRegular from '../components/RobotoRegular';
import RobotoMedium from '../components/RobotoMedium';
import Card from '../components/Card';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import QRCode from 'react-native-qrcode-svg';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const {wallet, provider, balance, providerName} = useSelector(
    state => state.wallet,
  );

  useEffect(() => {
    if (provider !== null) {
      dispatch(getWalletBalance(provider, wallet));
    }
  }, [provider]);

  return (
    <View style={styles.container}>
      <RobotoBold fontSize={FontSize.xlarge * 1.3}>Rumsan Wallet</RobotoBold>
      <Card style={styles.card}>
        <View style={{alignItems: 'center'}}>
          <QRCode value={`ethereum:${wallet?.address}`} size={200} />
          <RobotoRegular
            fontSize={FontSize.small / 1.1}
            selectable
            style={styles.regularText}
            color={colors.gray}>
            {wallet?.address}
          </RobotoRegular>
          <RobotoRegular
            fontSize={FontSize.small / 1.1}
            selectable
            style={styles.regularText}
            color={colors.lightGray}>
            Scan the QR Code or use the address to receive tokens to your
            account.
          </RobotoRegular>
          <View style={styles.line} />
        </View>
        <View style={styles.rowView}>
          <RobotoRegular
            fontSize={FontSize.medium}
            selectable
            style={{paddingBottom: Spacing.vs}}
            color={colors.lightGray}>
            {providerName}
          </RobotoRegular>
          <RobotoMedium
            fontSize={FontSize.medium}
            selectable
            style={{paddingBottom: Spacing.vs, width: widthPercentageToDP(30)}}
            color={colors.black}>
            Balance: {balance} ETH
          </RobotoMedium>
        </View>
      </Card>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.hs,
  },
  card: {
    marginVertical: Spacing.vs * 2,
    paddingVertical: Spacing.vs * 2,
  },
  regularText: {paddingVertical: Spacing.vs, textAlign: 'center'},
  line: {
    height: heightPercentageToDP(0.1),
    width: widthPercentageToDP(70),
    backgroundColor: colors.lightGray,
    marginVertical: Spacing.vs,
  },
  rowView: {flexDirection: 'row', justifyContent: 'space-between'},
});
