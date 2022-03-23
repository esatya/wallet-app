import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../constants/colors';
import {FontSize, Spacing} from '../../constants/utils';

const RegularText = props => {
  return (
    <Text
      {...props}
      style={[
        styles.text,
        {color: props.color || colors.black, ...props.style},
      ]}>
      {props.children}
    </Text>
  );
};

export default RegularText;

const styles = StyleSheet.create({
  text: {
    fontSize: FontSize.medium,
    fontWeight: '600',
    paddingVertical: Spacing.vs / 1.5,
    textAlign: 'center',
  },
});
