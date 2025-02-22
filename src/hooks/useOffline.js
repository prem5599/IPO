"use client";

import { useState, useEffect } from 'react';
import { offlineManager } from '../services/offlineManager';

export function useOffline() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Ensure this only runs on the client-side
        if (typeof window !== 'undefined') {
            // Initial check for offline status (client-side only)
            setIsOffline(!offlineManager.isOnline);

            const handleStatusChange = (isOnline) => {
                setIsOffline(!isOnline);
            };

            // Add event listener
            offlineManager.addListener(handleStatusChange);

            // Cleanup listener on unmount
            return () => {
                offlineManager.removeListener(handleStatusChange);
            };
        }
    }, []);

    return {
        isOffline,
        getOfflineData: offlineManager.getOfflineData,
        saveOfflineData: offlineManager.saveOfflineData
    };
}