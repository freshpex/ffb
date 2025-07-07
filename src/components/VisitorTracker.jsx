import { useEffect } from 'react';
import * as FingerprintJS from '@fingerprintjs/fingerprintjs';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;
console.log("import.meta.env.VITE_API_BASE_URL", API);

const VisitorTracker = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result.visitorId;
        sessionStorage.setItem('visitorId', visitorId);
        
        // Collect browser and device information
        const browserInfo = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          platform: navigator.platform,
          deviceMemory: navigator.deviceMemory || 'unknown',
          deviceType: /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          browser: getBrowserInfo(),
          os: getOperatingSystem()
        };

        let locationInfo = {};
        try {
          const geoResponse = await axios.get('https://ipapi.co/json/');
          if (geoResponse.data) {
            locationInfo = {
              country: geoResponse.data.country_name,
              countryCode: geoResponse.data.country_code,
              region: geoResponse.data.region,
              city: geoResponse.data.city,
              ip: geoResponse.data.ip
            };
          }
        } catch (geoError) {
          console.error('Non-critical error fetching location:', geoError);
          locationInfo = { error: 'Location unavailable' };
        }

        // Send tracking data to backend
        const response = await fetch(`${API}/tracking/visitor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitorId,
            browserInfo,
            locationInfo,
            timestamp: new Date().toISOString(),
            path: window.location.pathname,
            referrer: document.referrer || 'direct',
            sessionId: sessionStorage.getItem('sessionId') || generateSessionId(),
          }),
          keepalive: true,
        });

        if (!response.ok) {
          console.error('Error tracking visitor (non-critical)');
        } else {
          if (!sessionStorage.getItem('sessionId')) {
            const data = await response.json();
            if (data && data.sessionId) {
              sessionStorage.setItem('sessionId', data.sessionId);
            }
          }
        }
      } catch (error) {
        console.error('Error in visitor tracking (non-critical):', error);
      }
    };

    const getBrowserInfo = () => {
      const ua = navigator.userAgent;
      let browserName = "Unknown";
      let browserVersion = "";

      if (ua.indexOf("Firefox") > -1) {
        browserName = "Firefox";
        browserVersion = ua.match(/Firefox\/([0-9.]+)/)[1];
      } else if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1 && ua.indexOf("OPR") === -1) {
        browserName = "Chrome";
        browserVersion = ua.match(/Chrome\/([0-9.]+)/)[1];
      } else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) {
        browserName = "Safari";
        browserVersion = ua.match(/Version\/([0-9.]+)/)[1];
      } else if (ua.indexOf("Edg") > -1) {
        browserName = "Edge";
        browserVersion = ua.match(/Edg\/([0-9.]+)/)[1];
      } else if (ua.indexOf("OPR") > -1) {
        browserName = "Opera";
        browserVersion = ua.match(/OPR\/([0-9.]+)/)[1];
      }

      return `${browserName} ${browserVersion}`;
    };

    // Helper function to get operating system information
    const getOperatingSystem = () => {
      const ua = navigator.userAgent;
      let os = "Unknown";

      if (ua.indexOf("Win") !== -1) os = "Windows";
      if (ua.indexOf("Mac") !== -1) os = "macOS";
      if (ua.indexOf("Linux") !== -1) os = "Linux";
      if (ua.indexOf("Android") !== -1) os = "Android";
      if (ua.indexOf("like Mac") !== -1) os = "iOS";

      return os;
    };

    const generateSessionId = () => {
      const sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      sessionStorage.setItem('sessionId', sessionId);
      return sessionId;
    };

    if (!sessionStorage.getItem('sessionId')) {
      generateSessionId();
    }

    // Track the visitor
    trackVisitor();

    // Track page navigation within the SPA
    const handleRouteChange = () => {
      try {
        fetch(`${API}/tracking/pageview`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitorId: sessionStorage.getItem('visitorId'),
            sessionId: sessionStorage.getItem('sessionId'),
            timestamp: new Date().toISOString(),
            path: window.location.pathname
          }),
          keepalive: true,
        });
      } catch (error) {
        console.error('Error tracking page view (non-critical):', error);
      }
    };

    // Track when the user leaves the page
    const handleBeforeUnload = () => {
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          visitorId: sessionStorage.getItem('visitorId') || 'unknown',
          sessionId: sessionStorage.getItem('sessionId') || 'unknown',
          timestamp: new Date().toISOString(),
          event: 'page_exit',
          path: window.location.pathname,
        });
        
        navigator.sendBeacon(
          `${API}/tracking/exit`, 
          data
        );
      }
    };

    // Listen for history changes in SPA
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      originalPushState.apply(window.history, arguments);
      handleRouteChange();
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.history.pushState = originalPushState;
    };
  }, []);

  return null;
};

export default VisitorTracker;