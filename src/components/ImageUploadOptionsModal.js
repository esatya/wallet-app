import {Modal, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Spacing} from '../../constants/utils';
import CustomButton from './CustomButton';
import colors from '../../constants/colors';
import { widthPercentageToDP as wp} from 'react-native-responsive-screen';

const ImageUploadOptionsModal = ({
  show,
  hide,
  onPressTakePhoto,
  onPressChooseFromGallery,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={show}
      style={{marginHorizontal: Spacing.hs}}
      onRequestClose={hide}>
      <View style={styles.centeredModalView}>
        <View style={styles.modalView}>
          <CustomButton
            title={'Take a Photo'}
            color={colors.green}
            width={wp(80)}
            onPress={onPressTakePhoto}
          />
          <CustomButton
            title={'Choose from Gallery'}
            color={colors.green}
            width={wp(80)}
            onPress={onPressChooseFromGallery}
          />
          <CustomButton
            title={'Cancel'}
            outlined
            color={colors.gray}
            width={wp(80)}
            onPress={hide}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ImageUploadOptionsModal;

const styles = StyleSheet.create({
  modalView: {
    paddingHorizontal: Spacing.vs,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: Spacing.hs,
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

  centeredModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});
