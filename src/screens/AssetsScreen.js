import React, {useEffect, useState} from 'react';
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
import {AngleRightIcon, EtherIcon, PlusIcon} from '../../assets/icons';
import Card from '../components/Card';
import {FontSize, Spacing} from '../../constants/utils';
import RobotoRegular from '../components/RobotoRegular';
import {useDispatch, useSelector} from 'react-redux';
import {getAssetBalances, getWalletBalance} from '../redux/actions/wallet';
import CustomLoader from '../components/CustomLoader';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const AssetsScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {provider, balance, wallet, assets, providerName} = useSelector(
    state => state.wallet,
  );
  const [values, setValues] = useState({
    showLoader: true,
    loaderMessage: 'Fetching balance',
  });
  const {loaderMessage, showLoader} = values;

  const onGetAssetBalancesSuccess = () => {
    if (isFocused) {
      setValues({...values, showLoader: false, loaderMessage: ''});
    }
  };

  useEffect(() => {
    if (provider !== null) {
      dispatch(getWalletBalance(provider, wallet));

      if (assets?.length === 0) {
        if (isFocused) {
          setValues({...values, showLoader: false});
        }
      }
      if (assets?.length > 0) {
        dispatch(getAssetBalances(assets, wallet, onGetAssetBalancesSuccess));
      }
    }
  }, [provider]);

  const AssetComponent = ({icon, title, subtitle, balance, onPress}) => (
    <Pressable onPress={onPress}>
      <Card style={styles.assetCard}>
        <View style={styles.rowView}>
          {icon || <EtherIcon />}
          <View style={{paddingHorizontal: Spacing.hs}}>
            <RobotoRegular noPadding>{title}</RobotoRegular>
            <RobotoRegular
              color={colors.lightGray}
              noPadding
              fontSize={FontSize.small}>
              {subtitle}
            </RobotoRegular>
          </View>
        </View>
        <View style={styles.rowView}>
          <View style={styles.balanceView}>
            <RobotoRegular
              color={colors.white}
              noPadding
              style={styles.balance}
              fontSize={FontSize.small}>
              {balance}
            </RobotoRegular>
          </View>
          <AngleRightIcon />
        </View>
      </Card>
    </Pressable>
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
      <CustomHeader
        hideBackButton
        title="Assets"
        rightIcon={<PlusIcon />}
        onRightIconPress={() => navigation.navigate('ImportTokenScreen')}
      />
      <CustomLoader show={showLoader} message={loaderMessage} />
      <ScrollView>
        <View style={styles.container}>
          <AssetComponent
            title="Ether"
            subtitle="ETH"
            balance={balance}
            onPress={() =>
              navigation.navigate('AssetDetailScreen', {
                name: 'Ether',
                balance,
                network: providerName,
                symbol: 'ETH',
              })
            }
          />
          {assets?.length !== 0 &&
            assets?.map(
              (asset, index) =>
                asset.network === providerName && (
                  <AssetComponent
                    key={index}
                    title={asset.name}
                    subtitle={asset.symbol}
                    balance={asset.balance}
                    onPress={() =>
                      navigation.navigate('AssetDetailScreen', asset)
                    }
                  />
                ),
            )}
        </View>
      </ScrollView>
    </>
  );
};

export default AssetsScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.hs,
  },
  assetCard: {
    paddingTop: Spacing.vs * 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowView: {flexDirection: 'row', alignItems: 'center'},
  balanceView: {
    paddingHorizontal: Spacing.hs,
    alignItems: 'center',
    borderRadius: 20,
    maxWidth: widthPercentageToDP(35),
  },
  balance: {
    paddingHorizontal: Spacing.hs / 2,
    paddingVertical: Spacing.vs / 2,
    borderRadius: 20,
    backgroundColor: colors.blue,
  },
});
