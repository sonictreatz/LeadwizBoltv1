import { useState, useCallback } from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';
import React from 'react';
import { colors } from '../constants/colors';

/**
 * Custom hook to manage refresh control state and callbacks
 * @param onRefresh Function to call when refresh is triggered
 * @param refreshDuration Optional duration for the refresh state (defaults to 1500ms)
 * @returns RefreshControl props and refresh state
 */
export const useRefreshControl = (
  onRefresh?: () => Promise<void> | void,
  refreshDuration: number = 1500
) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        // If no refresh function provided, just wait for the duration
        await new Promise(resolve => setTimeout(resolve, refreshDuration));
      }
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, refreshDuration]);

  // Create the refresh control props object
  const refreshControlProps: RefreshControlProps = {
    refreshing,
    onRefresh: handleRefresh,
    colors: [colors.primary[500]],
    tintColor: colors.primary[500],
    progressBackgroundColor: colors.white
  };

  // Create the refresh control component
  const refreshControl = React.createElement(RefreshControl, refreshControlProps);

  return {
    refreshing,
    setRefreshing,
    handleRefresh,
    refreshControl
  };
};