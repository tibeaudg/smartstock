import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Camera, Smartphone, CheckCircle, XCircle, Info, Play, Square, ArrowLeft } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { BrowserMultiFormatReader } from '@zxing/library';

export const CameraDebugInfo: React.FC = () => {
  const { isMobile, isIOS, isSafari, cameraSupported, userAgent } = useMobile();
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [permissions, setPermissions] = useState<{ camera: string; microphone: string }>({
    camera: 'unknown',
    microphone: 'unknown'
  });
  const [testStream, setTestStream] = useState<MediaStream | null>(null);
  const [testVideo, setTestVideo] = useState<HTMLVideoElement | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  useEffect(() => {
    const checkDevices = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const deviceList = await navigator.mediaDevices.enumerateDevices();
          setDevices(deviceList);
          addTestResult(`Gevonden apparaten: ${deviceList.length} totaal`);
          
          const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
          addTestResult(`Video apparaten: ${videoDevices.length}`);
          
          videoDevices.forEach((device, index) => {
            addTestResult(`Camera ${index + 1}: ${device.label || 'Onbekende camera'}`);
          });
        }
      } catch (error) {
        console.error('Error enumerating devices:', error);
        addTestResult(`Fout bij ophalen apparaten: ${error}`);
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
          addTestResult(`Camera permissie: ${cameraPermission.state}`);
          addTestResult(`Microfoon permissie: ${microphonePermission.state}`);
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        addTestResult(`Fout bij controleren permissies: ${error}`);
      }
    };

    checkDevices();
    checkPermissions();
  }, []);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testCamera = async () => {
    try {
      setIsTesting(true);
      addTestResult('Start camera test...');
      
      const constraints = {
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: isMobile ? 'environment' : 'user'
        }
      };
      
      addTestResult(`Camera constraints: ${JSON.stringify(constraints)}`);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setTestStream(stream);
      addTestResult('Camera stream verkregen!');
      
      if (testVideo) {
        testVideo.srcObject = stream;
        await testVideo.play();
        addTestResult('Video element gestart');
      }
      
      // Get stream info
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        addTestResult(`Video resolutie: ${settings.width}x${settings.height}`);
        addTestResult(`Video framerate: ${settings.frameRate || 'onbekend'}`);
        addTestResult(`Camera device: ${videoTrack.label}`);
        setSelectedCamera(videoTrack.label);
      }
      
    } catch (error: any) {
      console.error('Camera test failed:', error);
      addTestResult(`Camera test gefaald: ${error.name} - ${error.message}`);
      
      if (error.name === 'NotAllowedError') {
        addTestResult('Tip: Geef camera toegang in browser instellingen');
      } else if (error.name === 'NotFoundError') {
        addTestResult('Tip: Geen camera gevonden op dit apparaat');
      } else if (error.name === 'NotReadableError') {
        addTestResult('Tip: Camera wordt al gebruikt door een andere app');
      }
    } finally {
      setIsTesting(false);
    }
  };

  const stopTest = () => {
    if (testStream) {
      testStream.getTracks().forEach(track => track.stop());
      setTestStream(null);
      if (testVideo) {
        testVideo.srcObject = null;
      }
      addTestResult('Camera test gestopt');
    }
  };

  const testZXing = async () => {
    try {
      addTestResult('Test ZXing library...');
      const reader = new BrowserMultiFormatReader();
      addTestResult('ZXing reader geïnitialiseerd');
      
      // Test device enumeration
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      addTestResult(`ZXing kan ${videoDevices.length} video apparaten vinden`);
      
      // Test specific camera if selected
      if (selectedCamera) {
        const device = videoDevices.find(d => d.label === selectedCamera);
        if (device) {
          addTestResult(`Test camera: ${device.label}`);
        }
      }
      
    } catch (error: any) {
      addTestResult(`ZXing test gefaald: ${error.message}`);
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
                  {device.label && (
                    <div className="text-xs text-blue-600">
                      {device.label.toLowerCase().includes('back') || 
                       device.label.toLowerCase().includes('environment') || 
                       device.label.toLowerCase().includes('achter') || 
                       device.label.toLowerCase().includes('rear') ? '🔙 Achtercamera' : '📱 Voorkamera'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Geen camera's gevonden</div>
          )}
        </div>

        {/* Test Video */}
        {testStream && (
          <div className="space-y-2">
            <h3 className="font-medium">Camera Test Video</h3>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <video
                ref={setTestVideo}
                className="w-full h-48 object-cover"
                autoPlay
                playsInline
                muted
              />
              {selectedCamera && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  {selectedCamera}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="space-y-2">
          <h3 className="font-medium">Test Resultaten</h3>
          <div className="max-h-32 overflow-y-auto text-xs bg-gray-50 p-2 rounded">
            {testResults.length > 0 ? (
              testResults.map((result, index) => (
                <div key={index} className="mb-1">{result}</div>
              ))
            ) : (
              <div className="text-gray-500">Nog geen tests uitgevoerd</div>
            )}
          </div>
        </div>

        {/* Test Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={testCamera} 
            variant="outline" 
            disabled={isTesting}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            Test Camera
          </Button>
          <Button 
            onClick={stopTest} 
            variant="outline" 
            disabled={!testStream}
            className="flex-1"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop Test
          </Button>
        </div>
        
        <Button 
          onClick={testZXing} 
          variant="outline" 
          className="w-full"
        >
          Test ZXing Library
        </Button>

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
                  <li>• Sluit andere apps die de camera gebruiken</li>
                  {!isSafari && (
                    <li className="font-bold text-red-600">⚠️ Je gebruikt niet Safari - dit kan problemen veroorzaken</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* General Troubleshooting */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Algemene Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Zorg dat je HTTPS gebruikt</li>
                <li>• Geef camera toegang wanneer gevraagd</li>
                <li>• Sluit andere apps die de camera gebruiken</li>
                <li>• Probeer de browser te verversen</li>
                <li>• Controleer browser instellingen voor camera toegang</li>
                <li>• Houd de camera ongeveer 10-15cm van de barcode</li>
                <li>• Zorg voor goede belichting</li>
              </ul>
            </div>
          </div>
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
