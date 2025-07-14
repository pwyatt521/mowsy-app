import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';
const ACTIVITY_KEY = 'last_activity';

export const tokenStorage = {
  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      console.log('tokenStorage.getToken - retrieved token:', token);
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      console.log('tokenStorage.setToken - storing token:', token);
      console.log('tokenStorage.setToken - token type:', typeof token);
      console.log('tokenStorage.setToken - token length:', token?.length);
      await AsyncStorage.setItem(TOKEN_KEY, token);
      console.log('tokenStorage.setToken - token stored successfully');
      
      // Verify the token was stored
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      console.log('tokenStorage.setToken - verification read:', storedToken);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  async setRefreshToken(refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Error setting refresh token:', error);
    }
  },

  async removeRefreshToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error removing refresh token:', error);
    }
  },

  async getUser(): Promise<any | null> {
    try {
      const userString = await AsyncStorage.getItem(USER_KEY);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async setUser(user: any): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user:', error);
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  },

  async getLastActivity(): Promise<number | null> {
    try {
      const activityString = await AsyncStorage.getItem(ACTIVITY_KEY);
      return activityString ? parseInt(activityString, 10) : null;
    } catch (error) {
      console.error('Error getting last activity:', error);
      return null;
    }
  },

  async setLastActivity(timestamp: number): Promise<void> {
    try {
      await AsyncStorage.setItem(ACTIVITY_KEY, timestamp.toString());
    } catch (error) {
      console.error('Error setting last activity:', error);
    }
  },

  async removeLastActivity(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ACTIVITY_KEY);
    } catch (error) {
      console.error('Error removing last activity:', error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        this.removeToken(),
        this.removeRefreshToken(),
        this.removeUser(),
        this.removeLastActivity(),
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};