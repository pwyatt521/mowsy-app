import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants';
import { HomeScreen } from '../screens/home/HomeScreen';
import { JobsScreen } from '../screens/jobs/JobsScreen';
import { PostJobScreen } from '../screens/jobs/PostJobScreen';
import { UpdateJobScreen } from '../screens/jobs/UpdateJobScreen';
import { ApplyToJobScreen } from '../screens/jobs/ApplyToJobScreen';
import { EquipmentScreen } from '../screens/equipment/EquipmentScreen';
import { AddEquipmentScreen } from '../screens/equipment/AddEquipmentScreen';
import { UpdateEquipmentScreen } from '../screens/equipment/UpdateEquipmentScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

export type MainStackParamList = {
  MainTabs: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Jobs: undefined;
  Equipment: undefined;
  Profile: undefined;
};

export type JobsStackParamList = {
  JobsList: undefined;
  CreateJob: undefined;
  UpdateJob: { id: string };
  ApplyToJob: { id: string };
};

export type EquipmentStackParamList = {
  EquipmentList: undefined;
  AddEquipment: undefined;
  UpdateEquipment: { id: string };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<MainStackParamList>();
const JobsStack = createStackNavigator<JobsStackParamList>();
const EquipmentStack = createStackNavigator<EquipmentStackParamList>();

const JobsNavigator = () => {
  return (
    <JobsStack.Navigator screenOptions={{ headerShown: false }}>
      <JobsStack.Screen name="JobsList" component={JobsScreen} />
      <JobsStack.Screen name="CreateJob" component={PostJobScreen} />
      <JobsStack.Screen name="UpdateJob" component={UpdateJobScreen} />
      <JobsStack.Screen name="ApplyToJob" component={ApplyToJobScreen} />
    </JobsStack.Navigator>
  );
};

const EquipmentNavigator = () => {
  return (
    <EquipmentStack.Navigator screenOptions={{ headerShown: false }}>
      <EquipmentStack.Screen name="EquipmentList" component={EquipmentScreen} />
      <EquipmentStack.Screen name="AddEquipment" component={AddEquipmentScreen} />
      <EquipmentStack.Screen name="UpdateEquipment" component={UpdateEquipmentScreen} />
    </EquipmentStack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Equipment') {
            iconName = focused ? 'construct' : 'construct-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Jobs" component={JobsNavigator} />
      <Tab.Screen name="Equipment" component={EquipmentNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};