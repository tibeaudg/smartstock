import { useEffect, useRef } from 'react';

interface StructuredDataProps {
  data: object | object[];
}

/**
 * Component to safely inject JSON-LD structured data into the document head
 * This prevents React from trying to manage script tags in the component tree
 * which can cause "Failed to execute 'removeChild' on 'Node'" errors
 */
export function StructuredData({ data }: StructuredDataProps) {
  const scriptsRef = useRef<HTMLScriptElement[]>([]);
  const dataStringRef = useRef<string>('');

  useEffect(() => {
    const dataArray = Array.isArray(data) ? data : [data];
    const newDataString = JSON.stringify(dataArray);
    
    // Only update if data actually changed (deep comparison via JSON)
    if (newDataString === dataStringRef.current) {
      return;
    }
    
    dataStringRef.current = newDataString;
    
    // Remove old scripts
    scriptsRef.current.forEach((script) => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    scriptsRef.current = [];

    // Add new scripts
    dataArray.forEach((item) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
      scriptsRef.current.push(script);
    });

    // Cleanup function to remove scripts when component unmounts
    return () => {
      scriptsRef.current.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      scriptsRef.current = [];
    };
  }, [data]);

  // This component doesn't render anything
  return null;
}

