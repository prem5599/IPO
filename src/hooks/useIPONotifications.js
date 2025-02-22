'use client';

import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

export function useIPONotifications(ipoSymbol) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ipoSymbol) {
      setIsLoading(false);
      return;
    }

    const checkSubscriptionStatus = async () => {
      try {
        // Check if notifications are supported and permitted
        const hasPermission = notificationService.checkPermission();
        
        // Check local storage for existing subscription
        const storedPref = notificationService.getPreferences(ipoSymbol);
        
        setIsSubscribed(storedPref?.enabled && hasPermission);
        setIsLoading(false);
      } catch (err) {
        console.error('Error checking notification status:', err);
        setError(err);
        setIsLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [ipoSymbol]);

  const subscribe = useCallback(async (ipo) => {
    if (!ipo?.symbol) return;
    
    try {
      setIsLoading(true);
      setError(null);

      // Request notification permission
      const hasPermission = await notificationService.requestPermission();
      if (!hasPermission) {
        throw new Error('Notification permission denied');
      }

      // Save subscription preference
      const preference = {
        enabled: true,
        ipoSymbol: ipo.symbol,
        timestamp: Date.now()
      };

      notificationService.savePreferences(ipo.symbol, preference);

      // Show confirmation notification
      await notificationService.showNotification(
        `IPO Alert Set: ${ipo.name}`,
        {
          body: `You'll be notified about important updates for ${ipo.name} IPO.`,
          icon: '/favicon.ico',
          tag: `ipo-alert-${ipo.symbol}`,
          onClick: () => {
            window.focus();
            window.location.href = `/ipo/${ipo.symbol.toLowerCase()}`;
          }
        }
      );

      setIsSubscribed(true);
    } catch (err) {
      console.error('Error subscribing to notifications:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async (ipoSymbol) => {
    if (!ipoSymbol) return;
    
    try {
      setIsLoading(true);
      setError(null);

      // Remove from local storage
      localStorage.removeItem(`ipo-notifications-${ipoSymbol}`);
      
      setIsSubscribed(false);
    } catch (err) {
      console.error('Error unsubscribing from notifications:', err);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe
  };
}