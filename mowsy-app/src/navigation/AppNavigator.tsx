import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppState } from 'react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { loadPersistedAuth, checkSessionExpiry, refreshAuthToken } from '../store/slices/authSlice';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { LoadingScreen } from '../components/common/LoadingScreen';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['http://localhost:8081', 'https://mowsy.app'],
  config: {
    screens: {
      Auth: {
        screens: {
          Welcome: '/',
          Login: '/login',
          Register: '/register',
        },
      },
      Main: {
        screens: {
          MainTabs: {
            initialRouteName: 'Home',
            screens: {
              Home: '/home',
              Jobs: {
                initialRouteName: 'JobsList',
                screens: {
                  JobsList: '/jobs',
                  CreateJob: '/jobs/create-job',
                  UpdateJob: '/jobs/update-job/:id',
                  ApplyToJob: '/jobs/apply/:id',
                },
              },
              Equipment: {
                initialRouteName: 'EquipmentList',
                screens: {
                  EquipmentList: '/equipment',
                  AddEquipment: '/equipment/add-equipment',
                  UpdateEquipment: '/equipment/update-equipment/:id',
                },
              },
              Profile: '/profile',
            },
          },
        },
      },
    },
  },
};

export const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadPersistedAuth());
  }, [dispatch]);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'active') {
        // App is coming to foreground, check session and refresh token
        const isExpired = await dispatch(checkSessionExpiry()).unwrap();
        
        if (!isExpired && isAuthenticated) {
          // Try to refresh token if session is still valid
          try {
            await dispatch(refreshAuthToken()).unwrap();
          } catch (error) {
            console.warn('Token refresh failed:', error);
            // Let it fail silently, user will be logged out on next API call
          }
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Also check session on initial load if authenticated
    if (isAuthenticated && isInitialized) {
      dispatch(checkSessionExpiry());
    }

    return () => subscription?.remove();
  }, [dispatch, isAuthenticated, isInitialized]);

  // Show loading state while checking for persisted auth
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};