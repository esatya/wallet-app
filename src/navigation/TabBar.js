import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';

import HomeScreen from '../screens/HomeScreen';
import {
  AssetsIcon,
  SettingsIcon,
  HomeIcon,
  QRIcon,
  DocVaultIcon,
} from '../../assets/icons';
import colors from '../../constants/colors';
import AssetsScreen from '../screens/AssetsScreen';
import DocVaultScreen from '../screens/DocVaultScreen';
import ScanScreen from '../screens/ScanScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const MainTabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarActiveBackgroundColor: 'white',
        tabBarInactiveBackgroundColor: 'white',
        tabBarInactiveTintColor: 'black',
        tabBarActiveTintColor: '#0075AA',
        tabBarLabelPosition: 'below-icon',
        tabBarColor: 'white',
        tabBarHideOnKeyboard: true,
        unmountOnBlur: true,
        headerShown: false,
        tabBarStyle: {
          height: hp('8%'),
          paddingVertical: hp('1%'),
          position: 'relative',
        },
        tabBarLabelStyle: {
          fontSize: wp('4%'),
        },
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => (
            <HomeIcon color={focused ? colors.blue : colors.black} />
          ),
        }}
      />
      <Tab.Screen
        name="AssetsScreen"
        component={AssetsScreen}
        options={{
          tabBarLabel: 'Assets',
          tabBarIcon: ({focused}) => (
            <AssetsIcon color={focused ? colors.blue : colors.black} />
          ),
        }}
      />
      <Tab.Screen
        name="ScanScreen"
        component={ScanScreen}
        options={{
          tabBarLabelStyle: {
            color: 'white',
          },
          tabBarIcon: ({focused}) => (
            <View style={styles.qrCode}>
              <QRIcon color={focused ? colors.blue : colors.black} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="DocVaultScreen"
        component={DocVaultScreen}
        options={{
          tabBarLabel: 'Doc Vault',
          tabBarIcon: ({focused}) => (
            <DocVaultIcon color={focused ? colors.blue : colors.black} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({focused}) => (
            <SettingsIcon color={focused ? colors.blue : colors.black} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabScreen;

const styles = StyleSheet.create({
  qrCode: {
    backgroundColor: '#0075AA',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderRadius: wp(10),
    position: 'absolute',
    top: -20,
  },
});
