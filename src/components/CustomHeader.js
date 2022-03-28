import React from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FontSize, Spacing} from '../../constants/utils';
import HeaderBack from '../../assets/icons/HeaderBack';
import RobotoRegular from '../components/RobotoRegular';
import colors from '../../constants/colors';

let androidPadding = 0;
if (Platform.OS === 'android') {
  androidPadding = StatusBar.currentHeight;
}

const CustomHeader = ({
  title,
  onBackPress,
  rightIcon,
  onRightIconPress,
  hideBackButton,
  backgroundColor,
  color,
}) => {
  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: backgroundColor || colors.blue},
      ]}>
      {!hideBackButton ? (
        <Pressable onPress={onBackPress} hitSlop={20}>
          <HeaderBack />
        </Pressable>
      ) : (
        <View />
      )}
      <RobotoRegular
        style={{fontSize: FontSize.large, color: color || colors.white}}>
        {title}
      </RobotoRegular>
      {rightIcon ? (
        <Pressable onPress={onRightIconPress} hitSlop={40}>
          {rightIcon}
        </Pressable>
      ) : (
        <View />
      )}
    </SafeAreaView>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    paddingTop: androidPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.hs,
    alignItems: 'center',
    paddingVertical: Spacing.vs,
  },
});
