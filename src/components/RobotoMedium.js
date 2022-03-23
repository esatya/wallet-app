import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../constants/colors';
import {FontSize, Spacing} from '../../constants/utils';

const RobotoMedium = props => {
  return (
    <Text
      {...props}
      style={[
        styles.text,
        {
          color: props.color || colors.black,
          fontSize: props.fontSize ? props.fontSize : FontSize.medium,
          paddingVertical: props.noPadding ? 0 : Spacing.vs / 2,
        },
        {...props.style},
      ]}>
      {props.children}
    </Text>
  );
};

export default RobotoMedium;

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Roboto-Medium',
  },
});
