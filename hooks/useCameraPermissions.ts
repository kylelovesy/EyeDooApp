import { Camera } from 'expo-camera';
import { useEffect, useState } from 'react';

/**
 * Custom hook to manage camera permissions.
 * This version uses the async methods for wider compatibility with different
 * versions of the `expo-camera` library.
 * @param isActive - Only requests permission if the feature using it is active.
 * @returns An object with the permission status.
 */
export const useCameraPermission = (isActive: boolean) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getPermissions = async () => {
      // Don't do anything if the scanner isn't active
      if (!isActive) {
        return;
      }

      // Request permissions
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getPermissions();
  }, [isActive]); // Rerun effect if the scanner's active state changes

  return { hasPermission };
};