import React from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import CustomHeader from '../components/CustomHeader';
import {EtherIcon} from '../../assets/icons';
import Card from '../components/Card';
import RobotoRegular from '../components/RobotoRegular';
import {FontSize, Spacing} from '../../constants/utils';
import colors from '../../constants/colors';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import CustomButton from '../components/CustomButton';

const AssetDetailScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();

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
        onBackPress={() => navigation.pop()}
        title="Token Details"
      />
      <View style={{paddingHorizontal: Spacing.hs}}>
        <Card>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={styles.rowView}>
              <EtherIcon />
              <View style={{paddingHorizontal: Spacing.hs}}>
                <RobotoRegular noPadding>{route.params?.name}</RobotoRegular>
                <RobotoRegular
                  color={colors.gray}
                  noPadding
                  fontSize={FontSize.small}>
                  {route.params?.symbol || 'ETH'}
                </RobotoRegular>
              </View>
            </View>
            <RobotoRegular
              color={colors.blue}
              style={{width: widthPercentageToDP(30)}}>
              {route.params?.balance}
            </RobotoRegular>
          </View>
          <View
            style={{
              height: heightPercentageToDP(0.2),
              width: widthPercentageToDP(80),
              backgroundColor: colors.lightGray,
              marginVertical: Spacing.vs * 2,
            }}
          />

          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <RobotoRegular color={colors.lightGray}>
              {route.params?.network}
            </RobotoRegular>
            <CustomButton
              title="Send"
              width={widthPercentageToDP(20)}
              titleFontSize={FontSize.small}
              onPress={() =>
                navigation.navigate('SendTokenScreen', route.params)
              }
            />
          </View>
        </Card>
      </View>
    </>
  );
};

export default AssetDetailScreen;

const styles = StyleSheet.create({
  rowView: {flexDirection: 'row', alignItems: 'center'},
});
