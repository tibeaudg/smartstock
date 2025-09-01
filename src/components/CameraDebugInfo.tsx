import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Camera, Smartphone, CheckCircle, XCircle, Info } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

export const CameraDebugInfo: React.FC = () => {
  const { isMobile, isIOS, isSafari, cameraSupported, userAgent } = useMobile();
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [permissions, setPermissions] = useState<{ camera: string; microphone: string }>({
    camera: 'unknown',
    microphone: 'unknown'
  });

  useEffect(() => {
    const checkDevices = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const deviceList = await navigator.mediaDevices.enumerateDevices();
          setDevices(deviceList);
        }
      } catch (error) {
        console.error('Error enumerating devices:', error);
      }
    };

    const checkPermissions = async () => {
      try {
        if (navigator.permissions) {
          const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          
          setPermissions({
            camera: cameraPermission.state,
            microphone: microphonePermission.state
          });
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    };

    checkDevices();
    checkPermissions();
  }, []);

  const testCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      alert('Camera test succesvol! Camera werkt correct.');
    } catch (error: any) {
      alert(`Camera test gefaald: ${error.message}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'granted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'denied':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'prompt':
        return <Info className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const audioDevices = devices.filter(device => device.kind === 'audioinput');

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Camera Debug Informatie
        </CardTitle>
        <CardDescription>
          Diagnose informatie voor camera problemen op mobiele apparaten
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Info */}
        <div className="space-y-2">
          <h3 className="font-medium">Apparaat Informatie</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Mobiel: {isMobile ? 'Ja' : 'Nee'}</div>
            <div>iOS: {isIOS ? 'Ja' : 'Nee'}</div>
            <div>Safari: {isSafari ? 'Ja' : 'Nee'}</div>
            <div>Camera Support: {cameraSupported ? 'Ja' : 'Nee'}</div>
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-2">
          <h3 className="font-medium">Camera Toestemmingen</h3>
          <div className="flex items-center gap-2">
            {getStatusIcon(permissions.camera)}
            <span className="text-sm">Camera: {permissions.camera}</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(permissions.microphone)}
            <span className="text-sm">Microfoon: {permissions.microphone}</span>
          </div>
        </div>

        {/* Available Devices */}
        <div className="space-y-2">
          <h3 className="font-medium">Beschikbare Camera's ({videoDevices.length})</h3>
          {videoDevices.length > 0 ? (
            <div className="space-y-1">
              {videoDevices.map((device, index) => (
                <div key={device.deviceId} className="text-sm p-2 bg-gray-50 rounded">
                  <div className="font-medium">Camera {index + 1}</div>
                  <div className="text-gray-600">{device.label || `Camera ${index + 1}`}</div>
                  <div className="text-xs text-gray-500">ID: {device.deviceId.substring(0, 20)}...</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Geen camera's gevonden</div>
          )}
        </div>

        {/* iOS Specific Tips */}
        {isIOS && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium mb-1">iPhone/iPad Tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Gebruik Safari browser (niet Chrome/Firefox)</li>
                  <li>• Ga naar Instellingen → Safari → Camera → Toestaan</li>
                  <li>• Zorg dat je HTTPS gebruikt (niet HTTP)</li>
                  <li>• Probeer de pagina te verversen na het geven van toestemming</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Test Button */}
        <div className="pt-2">
          <Button onClick={testCamera} variant="outline" className="w-full">
            <Camera className="w-4 h-4 mr-2" />
            Test Camera Toegang
          </Button>
        </div>

        {/* User Agent */}
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-600">User Agent (voor debugging)</summary>
          <div className="mt-2 p-2 bg-gray-50 rounded break-all">
            {userAgent}
          </div>
        </details>
      </CardContent>
    </Card>
  );
};
