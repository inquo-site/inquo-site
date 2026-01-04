import { useState, useEffect, useCallback } from 'react';

interface ABTestVariant {
  id: string;
  weight: number; // 0-100 percentage
}

interface ABTest {
  testId: string;
  variants: ABTestVariant[];
  defaultVariant?: string;
}

interface ABTestResult {
  variant: string;
  trackEvent: (eventName: string, data?: Record<string, any>) => void;
}

const STORAGE_KEY_PREFIX = 'inquo_ab_test_';

// Predefined A/B tests
const AB_TESTS: Record<string, ABTest> = {
  hero_cta: {
    testId: 'hero_cta',
    variants: [
      { id: 'start_free', weight: 50 },
      { id: 'try_now', weight: 50 }
    ],
    defaultVariant: 'start_free'
  },
  pricing_layout: {
    testId: 'pricing_layout',
    variants: [
      { id: 'cards', weight: 50 },
      { id: 'table', weight: 50 }
    ],
    defaultVariant: 'cards'
  },
  testimonials_style: {
    testId: 'testimonials_style',
    variants: [
      { id: 'carousel', weight: 50 },
      { id: 'grid', weight: 50 }
    ],
    defaultVariant: 'carousel'
  },
  cta_color: {
    testId: 'cta_color',
    variants: [
      { id: 'accent', weight: 50 },
      { id: 'gradient', weight: 50 }
    ],
    defaultVariant: 'accent'
  }
};

function selectVariant(test: ABTest): string {
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (const variant of test.variants) {
    cumulative += variant.weight;
    if (random <= cumulative) {
      return variant.id;
    }
  }
  
  return test.defaultVariant || test.variants[0].id;
}

export function useABTest(testId: string): ABTestResult {
  const [variant, setVariant] = useState<string>('');
  
  useEffect(() => {
    const test = AB_TESTS[testId];
    if (!test) {
      console.warn(`A/B test "${testId}" not found`);
      setVariant('default');
      return;
    }
    
    const storageKey = `${STORAGE_KEY_PREFIX}${testId}`;
    
    // Check if user already has an assigned variant
    const storedVariant = localStorage.getItem(storageKey);
    
    if (storedVariant && test.variants.some(v => v.id === storedVariant)) {
      setVariant(storedVariant);
    } else {
      // Assign new variant
      const newVariant = selectVariant(test);
      localStorage.setItem(storageKey, newVariant);
      setVariant(newVariant);
      
      // Track assignment
      trackABEvent(testId, 'assigned', { variant: newVariant });
    }
  }, [testId]);
  
  const trackEvent = useCallback((eventName: string, data?: Record<string, any>) => {
    trackABEvent(testId, eventName, { variant, ...data });
  }, [testId, variant]);
  
  return { variant, trackEvent };
}

function trackABEvent(testId: string, eventName: string, data?: Record<string, any>) {
  // Store events locally for analytics
  const eventsKey = 'inquo_ab_events';
  const events = JSON.parse(localStorage.getItem(eventsKey) || '[]');
  
  events.push({
    testId,
    eventName,
    data,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId()
  });
  
  // Keep last 100 events
  if (events.length > 100) {
    events.shift();
  }
  
  localStorage.setItem(eventsKey, JSON.stringify(events));
  
  // Console log for debugging (can be sent to analytics service)
  console.log(`[A/B Test] ${testId}:${eventName}`, data);
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('inquo_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('inquo_session_id', sessionId);
  }
  return sessionId;
}

// Get all A/B test results for current user
export function getABTestResults(): Record<string, string> {
  const results: Record<string, string> = {};
  
  Object.keys(AB_TESTS).forEach(testId => {
    const storageKey = `${STORAGE_KEY_PREFIX}${testId}`;
    const variant = localStorage.getItem(storageKey);
    if (variant) {
      results[testId] = variant;
    }
  });
  
  return results;
}

// Reset all A/B tests (for testing)
export function resetABTests(): void {
  Object.keys(AB_TESTS).forEach(testId => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${testId}`);
  });
  localStorage.removeItem('inquo_ab_events');
}

// Get A/B test analytics
export function getABAnalytics(): any[] {
  return JSON.parse(localStorage.getItem('inquo_ab_events') || '[]');
}
