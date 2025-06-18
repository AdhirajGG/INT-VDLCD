// components/IntercomChat.tsx
'use client';
import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import Intercom from '@intercom/messenger-js-sdk';

const IntercomChat = () => {
  const { isSignedIn, getToken } = useAuth();
const intercomAppId = process.env.NEXT_PUBLIC_INTERCOM_APP_ID;
  useEffect(() => {
    if (!isSignedIn) {
      Intercom('shutdown');
      return;
    }

    const initializeIntercom = async () => {
      try {
        const token = await getToken({ template: 'Intercom' });
        if (!token) return;
        
        // Decode JWT without verification
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedClaims = JSON.parse(atob(base64));
        
        // Convert created_at from milliseconds to seconds
        const createdAt = Math.floor(decodedClaims.metadata?.created_at / 1000);
        
        Intercom({
          app_id:intercomAppId,
          user_id: decodedClaims.sub, // User ID from claims
          name: decodedClaims.metadata?.name || '',
          email: decodedClaims.email || '',
          created_at: createdAt,
          custom_attributes: {
            role: decodedClaims.metadata?.role || 'user'
          }
        });
      } catch (error) {
        console.error('Intercom initialization failed:', error);
      }
    };

    initializeIntercom();

    return () => {
      Intercom('shutdown');
    };
  }, [isSignedIn, getToken]);

  return null;
};

export default IntercomChat;