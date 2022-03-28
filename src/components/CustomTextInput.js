import React, {forwardRef} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import colors from '../../constants/colors';
import {FontSize, Spacing} from '../../constants/utils';
import RegularText from './RegularText';
import RobotoRegular from './RobotoRegular';

const CustomTextInput = forwardRef((props, ref) => {
  return (
    <View style={{flexDirection: 'column'}}>
      <RobotoRegular
        fontSize={FontSize.small * 1.1}
        style={{
          textAlign: props.labelLeftAlign ? 'left' : 'center',
          paddingHorizontal: props.labelPadding || 0,
        }}>
        {props.label}
      </RobotoRegular>
      <TextInput
        ref={ref && ref}
        {...props}
        style={[
          styles.textInput,
          {
            ...props.style,
            color: props.color || colors.black,
            width: props.width || wp(90),
          },
        ]}
      />
      {props.error && (
        <RobotoRegular
          noPadding
          color={colors.danger}
          style={{paddingHorizontal: Spacing.hs}}>
          {props.error}
        </RobotoRegular>
      )}
    </View>
  );
});

export default CustomTextInput;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,

    paddingHorizontal: Spacing.hs / 2,
    fontSize: FontSize.medium,
    marginBottom: Spacing.vs / 2,
  },
});
