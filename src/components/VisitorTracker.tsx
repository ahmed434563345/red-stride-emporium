
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) {
    return 'mobile';
  }
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) {
    return 'tablet';
  }
  return 'desktop';
};

const getLocation = async (): Promise<string | null> => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return null;
    const data = await res.json();
    // Example: "Cairo, Egypt"
    const city = data.city;
    const country = data.country_name;
    return city && country ? `${city}, ${country}` : country || null;
  } catch {
    return null;
  }
};

const VisitorTracker = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Visitor/session IDs
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('visitor_id', visitorId);
        }
        let sessionId = sessionStorage.getItem('session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('session_id', sessionId);
        }

        // Device type
        const deviceType = getDeviceType();

        // Get phone number from user profile in localStorage, if possible
        let phoneNumber: string | null = null;
        const user = localStorage.getItem('user');
        if (user) {
          try {
            const userObj = JSON.parse(user);
            if (userObj && userObj.phone) {
              phoneNumber = userObj.phone;
            }
            // If no phone, check in profile object if present
            if (!phoneNumber && userObj && userObj.profile && userObj.profile.phone) {
              phoneNumber = userObj.profile.phone;
            }
          } catch {
            // Fallback: don't set phoneNumber
          }
        }

        // Location
        const location = await getLocation();

        // Track page visit
        await supabase.from('website_analytics').insert({
          visitor_id: visitorId,
          page_path: window.location.pathname,
          session_id: sessionId,
          user_agent: navigator.userAgent,
          device_type: deviceType,
          location: location,
          phone_number: phoneNumber,
        });
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    trackVisitor();
  }, []);

  return null;
};

export default VisitorTracker;
