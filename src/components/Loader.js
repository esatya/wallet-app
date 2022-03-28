import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import colors from '../../constants/colors';
import RegularText from './RegularText';

const Loader = ({message}) => {
  return (
    <>
      <ActivityIndicator size="large" color={colors.blue} />
      <RegularText>{message}</RegularText>
    </>
  );
};

export default Loader;

const styles = StyleSheet.create({});
