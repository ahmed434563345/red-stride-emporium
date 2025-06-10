
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const VisitorTracker = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Generate or get visitor ID
        let visitorId = localStorage.getItem('visitor_id');
        if (!visitorId) {
          visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('visitor_id', visitorId);
        }

        // Generate session ID
        let sessionId = sessionStorage.getItem('session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          sessionStorage.setItem('session_id', sessionId);
        }

        // Track page visit
        await supabase.from('website_analytics').insert({
          visitor_id: visitorId,
          page_path: window.location.pathname,
          session_id: sessionId,
          user_agent: navigator.userAgent
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
