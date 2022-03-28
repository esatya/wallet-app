import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SetupScreen from '../screens/AuthScreens/SetupScreen';
import colors from '../../constants/colors';
import CreateWalletScreen from '../screens/AuthScreens/CreateWalletScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RegularText from '../components/RegularText';
import LoadingScreen from '../screens/LoadingScreen';
import RestoreMnemonicScreen from '../screens/AuthScreens/RestoreMnemonicScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChangeNetworkScreen from '../screens/ChangeNetworkScreen';
import SendTokenScreen from '../screens/SendTokenScreen';
import ScanScreen from '../screens/ScanScreen';
import LoadingScreenWithPasscode from '../screens/LoadingScreenWithPasscode';
import SetupScreenWithPasscode from '../screens/AuthScreens/SetupScreenWithPasscode';
import TabBar from './TabBar';
import ImportTokenScreen from '../screens/ImportTokenScreen';
import BackupWalletScreen from '../screens/BackupWalletScreen';
import BackupMnemonicScreen from '../screens/BackupMnemonicScreen';
import AssetDetailScreen from '../screens/AssetDetailScreen';
import ScanAssetsScreen from '../screens/ScanAssetsScreen';
import ScanTokenAddress from '../screens/ScanTokenAddress';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const navTheme = DefaultTheme;
navTheme.colors.background = '#fff';

const Routes = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="LoadingScreen"
        // initialRouteName="LoadingScreenWithPasscode"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
        {/* <Stack.Screen
          name="LoadingScreenWithPasscode"
          component={LoadingScreenWithPasscode}
        /> */}
        <Stack.Screen name="Tabs" component={TabBar} />

        {/* <Stack.Screen name="SetupScreen" component={SetupScreen} /> */}
        <Stack.Screen
          name="SetupScreenWithPasscode"
          component={SetupScreenWithPasscode}
        />

        <Stack.Screen
          name="CreateWalletScreen"
          component={CreateWalletScreen}
        />
        <Stack.Screen
          name="RestoreMnemonicScreen"
          component={RestoreMnemonicScreen}
        />
        <Stack.Screen
          name="ChangeNetworkScreen"
          component={ChangeNetworkScreen}
        />
        <Stack.Screen name="SendTokenScreen" component={SendTokenScreen} />

        <Stack.Screen name="ImportTokenScreen" component={ImportTokenScreen} />

        <Stack.Screen
          name="BackupWalletScreen"
          component={BackupWalletScreen}
        />
        <Stack.Screen
          name="BackupMnemonicScreen"
          component={BackupMnemonicScreen}
        />
        <Stack.Screen name="AssetDetailScreen" component={AssetDetailScreen} />
        <Stack.Screen name="ScanAssetsScreen" component={ScanAssetsScreen} />
        <Stack.Screen name="ScanTokenAddress" component={ScanTokenAddress} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;

const styles = StyleSheet.create({});
