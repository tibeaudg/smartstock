export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function detectDeviceType(): DeviceType {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

export const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '0.0.0';
