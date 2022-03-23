import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {FontSize, Spacing} from '../../constants/utils';
import RegularText from './RegularText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';
import RobotoMedium from './RobotoMedium';
import CustomButton from './CustomButton';
import {widthPercentageToDP} from 'react-native-responsive-screen';

const CustomPopup = ({
  show,
  hide,
  onConfirm,
  message,
  messageType,
  popupType,
  firstButtonText,
  secondButtonText,
  onFirstButtonPress,
  onSecondButtonPress,
  popupTitle,
  buttonsRowView,
  onConfirmAlert,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      statusBarTranslucent
      visible={show}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Ionicons
              name={
                messageType === 'Success' ? 'checkmark-circle' : 'alert-circle'
              }
              size={62}
              color={colors.blue}
              style={{padding: 0}}
            />
            <RobotoMedium
              fontSize={FontSize.large * 1.2}
              style={styles.title}
              color={colors.gray}>
              {popupTitle || messageType}
            </RobotoMedium>
            <RegularText
              fontSize={FontSize.medium}
              style={styles.subtitle}
              color={colors.gray}>
              {message}
            </RegularText>
            {popupType === 'alert' ? (
              <CustomButton
                width={widthPercentageToDP(80)}
                title="Okay"
                onPress={onConfirmAlert || hide}
              />
            ) : (
              <View
                style={{
                  flexDirection: buttonsRowView ? 'row' : 'column',
                  justifyContent: buttonsRowView ? 'space-between' : 'center',
                  width: widthPercentageToDP(80),
                }}>
                <CustomButton
                  title={firstButtonText || 'Cancel'}
                  color={colors.blue}
                  width={widthPercentageToDP(buttonsRowView ? 35 : 75)}
                  onPress={onFirstButtonPress || hide}
                />
                <CustomButton
                  title={secondButtonText || 'Okay'}
                  color={colors.darkRed}
                  width={widthPercentageToDP(buttonsRowView ? 35 : 75)}
                  onPress={onSecondButtonPress || hide}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomPopup;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: Spacing.vs,
    paddingHorizontal: Spacing.hs,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    marginBottom: Spacing.vs / 3,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: Spacing.vs,

    textAlign: 'center',
    // textTransform: 'uppercase',
  },
});
