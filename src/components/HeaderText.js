import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../constants/colors';
import {FontSize, Spacing} from '../../constants/utils';

const HeaderText = props => {
  return (
    <Text
      {...props}
      style={[styles.text, {color: props.color || colors.black}]}>
      {props.children}
    </Text>
  );
};

export default HeaderText;

const styles = StyleSheet.create({
  text: {
    fontSize: FontSize.xlarge,
    paddingVertical: Spacing.vs / 2,
    fontWeight: 'bold',
  },
});
