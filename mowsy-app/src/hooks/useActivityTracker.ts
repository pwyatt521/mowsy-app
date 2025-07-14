import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateLastActivity, checkSessionExpiry } from '../store/slices/authSlice';

export const useActivityTracker = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const updateActivity = useCallback(() => {
    if (isAuthenticated) {
      dispatch(updateLastActivity());
    }
  }, [dispatch, isAuthenticated]);

  const checkSession = useCallback(async () => {
    if (isAuthenticated) {
      await dispatch(checkSessionExpiry());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Update activity on any user interaction
    const handleUserActivity = () => {
      updateActivity();
    };

    // Add event listeners for user activity
    // In React Native, we'll track this through navigation and button presses
    // The actual implementation will be handled by individual components

    return () => {
      // Cleanup if needed
    };
  }, [isAuthenticated, updateActivity]);

  return {
    updateActivity,
    checkSession,
  };
};