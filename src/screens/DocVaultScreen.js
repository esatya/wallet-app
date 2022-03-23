import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import colors from '../../constants/colors';
import CustomHeader from '../components/CustomHeader';
import {useIsFocused} from '@react-navigation/native';
import {LargeDocVaultIcon, PlusIcon} from '../../assets/icons';
import Card from '../components/Card';
import {Spacing} from '../../constants/utils';
import CustomButton from '../components/CustomButton';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import CustomLoader from '../components/CustomLoader';
import CustomPopup from '../components/CustomPopup';
import ImagePicker from 'react-native-image-crop-picker';
import {useDispatch} from 'react-redux';
import {uploadDocument} from '../redux/actions/wallet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageUploadOptionsModal from '../components/ImageUploadOptionsModal';
const imagePickerConfigs = {
  cropping: true,
  cropperStatusBarColor: colors.blue,
  cropperToolbarColor: colors.blue,
  cropperToolbarTitle: 'Edit Image',
  cropperToolbarWidgetColor: colors.white,
  includeBase64: true,
};

const DocVaultScreen = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [values, setValues] = useState({
    showLoader: false,
    loaderMessage: '',
    showPopup: false,
    popupMessage: '',
    popupMessageType: '',
    popupType: '',
    showOptionsModal: false,
    documentsList: [],
  });
  const {
    loaderMessage,
    popupMessage,
    popupMessageType,
    popupType,
    showLoader,
    showPopup,
    showOptionsModal,
    documentsList,
  } = values;

  const getDocumentsFromStorage = async () => {
    try {
      let data = await AsyncStorage.getItem('docVault');
      if (data) {
        setValues({...values, documentsList: JSON.parse(data)});
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const unsubscribe = getDocumentsFromStorage();
    return () => unsubscribe;
  }, []);

  const handleSelectedImage = image => {
    setValues(values => ({
      ...values,
      showLoader: true,
      loaderMessage: 'Uploading your document. Please wait...',
    }));
    let base64Image = `data:${image.mime};base64,` + image.data;
    handleUpload(base64Image);
  };

  const handleTakePhoto = () => {
    setValues({...values, showOptionsModal: false});
    ImagePicker.openCamera(imagePickerConfigs)
      .then(image => {
        handleSelectedImage(image);
      })
      .catch(e => {
        alert(e);
      });
  };
  const handleChooseFromGallery = () => {
    setValues({...values, showOptionsModal: false});
    ImagePicker.openPicker(imagePickerConfigs)
      .then(image => {
        handleSelectedImage(image);
      })
      .catch(e => {
        alert(e);
      });
  };

  const onUploadSuccess = async res => {
    let uploadedDocHash;
    let temp = [];
    uploadedDocHash = res?.data.cid;
    temp = [...documentsList, uploadedDocHash];
    AsyncStorage.setItem('docVault', JSON.stringify(temp))
      .then(() => {
        setValues(values => ({
          ...values,
          showLoader: false,
          showPopup: true,
          popupMessage: 'Document uploaded successfully',
          popupMessageType: 'Success',
          popupType: 'alert',
          documentsList: temp,
        }));
      })
      .catch(e => {
        console.log(e);
        setValues(values => ({
          ...values,
          showLoader: false,
          showPopup: true,
          popupMessage: 'Something went wrong while storing data.',
          popupMessageType: 'Error',
          popupType: 'alert',
        }));
      });
  };
  const onUploadError = e => {
    // console.log('error', e.response);
    setValues(values => ({
      ...values,
      showLoader: false,
      showPopup: true,
      popupMessage:
        'Something went wrong while uploading your document. Please try again.',
      popupMessageType: 'Error',
      popupType: 'alert',
    }));
  };
  const handleUpload = image => {
    const data = {file: image};
    dispatch(uploadDocument(data, onUploadSuccess, onUploadError));
  };

  return (
    <>
      {isFocused && (
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />
      )}
      <ImageUploadOptionsModal
        show={showOptionsModal}
        hide={() => setValues({...values, showOptionsModal: false})}
        onPressTakePhoto={handleTakePhoto}
        onPressChooseFromGallery={handleChooseFromGallery}
      />
      <CustomHeader
        hideBackButton
        title="DocVault"
        rightIcon={<PlusIcon />}
        onRightIconPress={() => setValues({...values, showOptionsModal: true})}
      />
      <CustomLoader show={showLoader} message={loaderMessage} />
      <CustomPopup
        show={showPopup}
        message={popupMessage}
        messageType={popupMessageType}
        popupType={popupType}
        onConfirmAlert={() => setValues({...values, showPopup: false})}
      />

      {documentsList.length === 0 ? (
        <View style={styles.container}>
          <Card style={{alignItems: 'center', paddingVertical: Spacing.vs * 2}}>
            <View style={{paddingVertical: Spacing.vs * 2}}>
              <LargeDocVaultIcon />
            </View>
            <CustomButton
              title="Upload Picture"
              icon={<PlusIcon />}
              color={colors.green}
              style={{width: widthPercentageToDP(75)}}
              onPress={() => setValues({...values, showOptionsModal: true})}
            />
          </Card>
        </View>
      ) : (
        <ScrollView>
          {documentsList.map((item, index) => (
            <Image
              key={index}
              source={{uri: `https://ipfs.rumsan.com/ipfs/${item}`}}
              style={styles.image}
              resizeMode={'contain'}
            />
          ))}
        </ScrollView>
      )}
    </>
  );
};

export default DocVaultScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.hs,
  },

  image: {
    height: heightPercentageToDP(30),
    width: widthPercentageToDP(90),
    alignSelf: 'center',
    marginTop: Spacing.vs,
    borderRadius: 30,
    marginBottom: Spacing.vs / 2,
  },
});
