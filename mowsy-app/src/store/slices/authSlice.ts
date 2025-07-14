import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { tokenStorage } from '../../services/storage/tokenStorage';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phone?: string;
  profilePicture?: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  lastActivity: number | null;
}

// Async thunk to load persisted auth data
export const loadPersistedAuth = createAsyncThunk(
  'auth/loadPersisted',
  async () => {
    console.log('=== LOAD PERSISTED AUTH DEBUG ===');
    const token = await tokenStorage.getToken();
    const user = await tokenStorage.getUser();
    const lastActivity = await tokenStorage.getLastActivity();
    console.log('loadPersistedAuth - token from storage:', token);
    console.log('loadPersistedAuth - user from storage:', user);
    console.log('loadPersistedAuth - lastActivity from storage:', lastActivity);
    return { token, user, lastActivity };
  }
);

// Async thunk to persist auth data
export const persistAuth = createAsyncThunk(
  'auth/persist',
  async ({ user, token, refreshToken }: { user: User; token: string; refreshToken?: string }) => {
    console.log('=== PERSIST AUTH DEBUG ===');
    console.log('persistAuth received params:', { user, token, refreshToken });
    console.log('persistAuth - token value:', token);
    console.log('persistAuth - token type:', typeof token);
    console.log('persistAuth - token length:', token?.length);
    console.log('persistAuth - user:', user);
    console.log('persistAuth - refreshToken:', refreshToken);
    
    if (!token) {
      console.error('ERROR: persistAuth received undefined token!');
      throw new Error('Cannot persist auth: token is undefined');
    }
    
    const lastActivity = Date.now();
    console.log('About to store token:', token);
    await tokenStorage.setToken(token);
    console.log('Token stored successfully');
    await tokenStorage.setUser(user);
    await tokenStorage.setLastActivity(lastActivity);
    if (refreshToken) {
      await tokenStorage.setRefreshToken(refreshToken);
    }
    
    console.log('persistAuth completed successfully');
    return { user, token, refreshToken, lastActivity };
  }
);

// Async thunk to clear persisted auth data
export const clearPersistedAuth = createAsyncThunk(
  'auth/clearPersisted',
  async () => {
    await tokenStorage.clearAll();
  }
);

// Async thunk to refresh token
export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const currentToken = state.auth.token;
      
      if (!currentToken) {
        throw new Error('No token to refresh');
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'https://p2mw409ce8.execute-api.us-east-2.amazonaws.com/dev'}/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const lastActivity = Date.now();
      
      await tokenStorage.setToken(data.token);
      await tokenStorage.setUser(data.user);
      await tokenStorage.setLastActivity(lastActivity);
      
      return { user: data.user, token: data.token, lastActivity };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to update last activity
export const updateLastActivity = createAsyncThunk(
  'auth/updateActivity',
  async () => {
    const lastActivity = Date.now();
    await tokenStorage.setLastActivity(lastActivity);
    return lastActivity;
  }
);

// Async thunk to check if session is expired
export const checkSessionExpiry = createAsyncThunk(
  'auth/checkExpiry',
  async (_, { getState, dispatch }) => {
    const state = getState() as { auth: AuthState };
    const { lastActivity, isAuthenticated } = state.auth;
    
    if (!isAuthenticated || !lastActivity) {
      return false;
    }

    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    const isExpired = (now - lastActivity) > oneHour;
    
    if (isExpired) {
      await dispatch(clearPersistedAuth());
      return true;
    }
    
    return false;
  }
);

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  isAuthenticated: false,
  isInitialized: false,
  lastActivity: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.lastActivity = Date.now();
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.lastActivity = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Load persisted auth
      .addCase(loadPersistedAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadPersistedAuth.fulfilled, (state, action) => {
        console.log('=== LOAD PERSISTED AUTH REDUCER ===');
        const { token, user, lastActivity } = action.payload;
        console.log('loadPersistedAuth.fulfilled - token:', token);
        console.log('loadPersistedAuth.fulfilled - user:', user);
        if (token && user) {
          console.log('loadPersistedAuth.fulfilled - Setting auth state');
          state.token = token;
          state.user = user;
          state.lastActivity = lastActivity;
          state.isAuthenticated = true;
        } else {
          console.log('loadPersistedAuth.fulfilled - No token/user, not setting auth state');
        }
        state.isLoading = false;
        state.isInitialized = true;
        console.log('loadPersistedAuth.fulfilled - isInitialized set to true');
      })
      .addCase(loadPersistedAuth.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
      })
      // Persist auth
      .addCase(persistAuth.fulfilled, (state, action) => {
        console.log('=== PERSIST AUTH REDUCER ===');
        console.log('persistAuth.fulfilled - payload:', action.payload);
        console.log('persistAuth.fulfilled - token:', action.payload.token);
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken || null;
        state.lastActivity = action.payload.lastActivity;
        state.isAuthenticated = true;
        console.log('persistAuth.fulfilled - auth state updated');
      })
      // Clear persisted auth
      .addCase(clearPersistedAuth.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.lastActivity = null;
        state.isAuthenticated = false;
      })
      // Refresh token
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.lastActivity = action.payload.lastActivity;
        state.isAuthenticated = true;
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.lastActivity = null;
        state.isAuthenticated = false;
      })
      // Update last activity
      .addCase(updateLastActivity.fulfilled, (state, action) => {
        state.lastActivity = action.payload;
      });
  },
});

export const { setCredentials, logout, setLoading, updateUser } = authSlice.actions;
export { loadPersistedAuth, persistAuth, clearPersistedAuth, refreshAuthToken, updateLastActivity, checkSessionExpiry };
export default authSlice.reducer;