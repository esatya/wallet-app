import React, {forwardRef} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import colors from '../../constants/colors';
import {FontSize, Spacing} from '../../constants/utils';

const CustomTextInput = forwardRef((props, ref) => {
  return (
    <View style={{marginBottom: Spacing.vs}}>
      <TextInput
        ref={ref && ref}
        {...props}
        placeholder={props.placeholder}
        style={[styles.textInput, {...props.style}]}
        maxLength={1}
        keyboardType="numeric"
        
      />
    </View>
  );
});

export default CustomTextInput;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.gray,
    paddingHorizontal: Spacing.hs / 1.5,
    textAlign: 'center',
    fontSize: FontSize.medium,
    color: colors.gray,
  },
});
