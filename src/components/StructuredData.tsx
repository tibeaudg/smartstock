import { useEffect } from 'react';

interface StructuredDataProps {
  data: object | object[];
}

/**
 * Component to safely inject JSON-LD structured data into the document head
 * This prevents React from trying to manage script tags in the component tree
 * which can cause "Failed to execute 'removeChild' on 'Node'" errors
 */
export function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    const dataArray = Array.isArray(data) ? data : [data];
    const scriptElements: HTMLScriptElement[] = [];

    dataArray.forEach((item) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
      scriptElements.push(script);
    });

    // Cleanup function to remove scripts when component unmounts
    return () => {
      scriptElements.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [data]);

  // This component doesn't render anything
  return null;
}

