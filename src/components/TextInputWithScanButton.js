import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import {QRIcon} from '../../assets/icons';
import colors from '../../constants/colors';
import {Spacing} from '../../constants/utils';
import CustomTextInput from './CustomTextInput';

const TextInputWithScanButton = ({
  label,
  placeholder,
  labelLeftAlign,
  value,
  onChangeText,
  maxLength,
  onPressScan,
  defaultValue,
}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <CustomTextInput
        label={label}
        placeholder={placeholder || ''}
        style={{width: widthPercentageToDP(64)}}
        labelLeftAlign={labelLeftAlign ? true : false}
        value={value}
        maxLength={maxLength}
        onChangeText={onChangeText}
        defaultValue={defaultValue}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.buttonView}>
          <Pressable
            style={styles.qrButton}
            // disabled={isSubmitting}
            onPress={onPressScan}
            android_ripple={{
              color: 'rgba(0,0,0, 0.1)',
              borderless: false,
            }}>
            <QRIcon />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default TextInputWithScanButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: Spacing.hs / 1.5,
    alignSelf: 'flex-start',
    marginTop: Spacing.vs * 2.5,
  },
  buttonView: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  qrButton: {
    backgroundColor: colors.blue,
    width: widthPercentageToDP(11),
    height: heightPercentageToDP(6),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
