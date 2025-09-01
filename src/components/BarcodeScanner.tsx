import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Scan, X, CheckCircle, AlertCircle, QrCode, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { BrowserMultiFormatReader, Result } from '@zxing/library';
import { IOSCameraHelper } from './IOSCameraHelper';

interface BarcodeScannerProps {
  onBarcodeDetected: (barcode: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onBarcodeDetected, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraSupported, setCameraSupported] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<string>('unknown');
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [showIOSHelper, setShowIOSHelper] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        // Check device capabilities
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
        const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
        const isSafariBrowser = /Safari/.test(userAgent) && !/Chrome/.test(userAgent) && !/CriOS/.test(userAgent) && !/FxiOS/.test(userAgent);
        
        setIsMobile(isMobileDevice);
        setIsIOS(isIOSDevice);
        setIsSafari(isSafariBrowser);
        
        // Check camera support
        const hasCameraSupport = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        setCameraSupported(hasCameraSupport);
        
        if (!hasCameraSupport) {
          setError('Camera wordt niet ondersteund op dit apparaat/browser');
          setIsInitializing(false);
          return;
        }

        // Check camera permissions
        await checkCameraPermissions();
        
        // Get available devices
        await getAvailableDevices();
        
        // Initialize ZXing reader
        codeReaderRef.current = new BrowserMultiFormatReader();
        
        // Auto-start camera with delay for iOS
        const delay = isIOSDevice ? 1000 : 500;
        setTimeout(async () => {
          try {
            await startScanning();
          } catch (err) {
            console.error('Auto-start camera failed:', err);
            setIsInitializing(false);
          }
        }, delay);
        
      } catch (err) {
        console.error('Scanner initialization failed:', err);
        setError('Kan scanner niet initialiseren');
        setIsInitializing(false);
      }
    };

    initializeScanner();

    return () => {
      cleanup();
    };
  }, []);

  const checkCameraPermissions = async () => {
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCameraPermission(permission.state);
        
        // Listen for permission changes
        permission.onchange = () => {
          setCameraPermission(permission.state);
        };
      }
    } catch (error) {
      console.error('Error checking camera permissions:', error);
    }
  };

  const getAvailableDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableDevices(videoDevices);
      console.log('Available video devices:', videoDevices);
    } catch (error) {
      console.error('Error getting available devices:', error);
    }
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.style.display = 'none';
    }
  };

  const startScanning = async () => {
    try {
      setError(null);
      setScanResult(null);
      setIsInitializing(true);
      
      if (!codeReaderRef.current) {
        throw new Error('Barcode reader niet geïnitialiseerd');
      }

      // Request camera permission first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: isMobile ? 'environment' : 'user' // Use back camera on mobile
        }
      });
      
      streamRef.current = stream;
      
      // Set video source and ensure it plays
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.style.display = 'block';
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().then(resolve);
            };
          }
        });
      }

      // Get available video devices after permission
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      // Select best camera for mobile
      let selectedDeviceId = undefined;
      if (isMobile && videoDevices.length > 1) {
        // Prefer back camera
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('environment') ||
          device.label.toLowerCase().includes('achter') ||
          device.label.toLowerCase().includes('rear')
        );
        if (backCamera) {
          selectedDeviceId = backCamera.deviceId;
          console.log('Selected back camera:', backCamera.label);
        } else {
          // If no back camera found, use the second camera (usually back camera on mobile)
          selectedDeviceId = videoDevices[1]?.deviceId;
          console.log('Using second camera:', videoDevices[1]?.label);
        }
      }

      // Start ZXing scanning
      await codeReaderRef.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current!,
        (result: Result | null, error: any) => {
          if (result) {
            const barcode = result.getText();
            console.log('Barcode detected:', barcode);
            setScanResult(barcode);
            setIsScanning(false);
            toast.success(`Barcode gedetecteerd: ${barcode}`);
            
            // Stop scanning and call callback
            if (codeReaderRef.current) {
              codeReaderRef.current.reset();
            }
            onBarcodeDetected(barcode);
          }
          
          if (error && error.name !== 'NotFoundException') {
            console.error('Scanning error:', error);
            // Don't show error for NotFoundException as it's normal during scanning
          }
        }
      );

      setIsScanning(true);
      setIsInitializing(false);
      toast.info('Camera gestart! Richt je camera op een barcode.');
      
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setIsInitializing(false);
      
      let errorMessage = 'Kan camera niet openen.';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera toegang geweigerd. Geef toegang tot je camera in je browser instellingen.';
        if (isIOS) {
          errorMessage += ' Ga naar Instellingen → Safari → Camera → Toestaan';
        }
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'Geen camera gevonden op dit apparaat.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera wordt al gebruikt door een andere applicatie.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera voldoet niet aan de vereiste specificaties.';
      } else if (err.name === 'TypeError') {
        errorMessage = 'Camera niet ondersteund op dit apparaat.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Camera wordt niet ondersteund in deze browser.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const stopScanning = () => {
    cleanup();
    setIsScanning(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onBarcodeDetected(manualBarcode.trim());
      setManualBarcode('');
    }
  };

  const handleDemoBarcode = () => {
    // Demo barcode for testing
    const demoBarcode = '1234567890123';
    setManualBarcode(demoBarcode);
    toast.success('Demo barcode ingevoerd');
  };

  const retryCamera = async () => {
    setError(null);
    await startScanning();
  };

  const showIOSHelperModal = () => {
    setShowIOSHelper(true);
  };

  const handleIOSHelperRetry = () => {
    setShowIOSHelper(false);
    retryCamera();
  };

  const handleIOSHelperClose = () => {
    setShowIOSHelper(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Barcode Scanner</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Camera Fout</p>
                    <p>{error}</p>
                    <div className="mt-2 space-y-2">
                      {error.includes('toegang geweigerd') && (
                        <Button 
                          onClick={retryCamera}
                          variant="outline" 
                          size="sm" 
                          className="mr-2"
                        >
                          Opnieuw proberen
                        </Button>
                      )}
                      {isIOS && error.includes('toegang geweigerd') && (
                        <Button 
                          onClick={showIOSHelperModal}
                          variant="outline" 
                          size="sm"
                        >
                          iPhone Helper
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {scanResult && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">Barcode gedetecteerd: {scanResult}</span>
              </div>
            )}

            {/* Camera Scanner */}
            {cameraSupported && (
              <div className="mb-6">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {isInitializing ? (
                    <div className="w-full h-64 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm">Camera wordt gestart...</p>
                      </div>
                    </div>
                  ) : isScanning ? (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        className="w-full h-64 object-cover bg-black"
                        autoPlay
                        playsInline
                        muted
                        style={{ display: 'block' }}
                      />
                      {/* Scanning overlay */}
                      <div className="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-32 h-1 bg-blue-500 animate-pulse"></div>
                        </div>
                      </div>
                      {/* Mobile indicator */}
                      {isMobile && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center">
                          <Smartphone className="w-3 h-3 mr-1" />
                          Mobiel
                        </div>
                      )}
                      {/* Camera permission indicator */}
                      {cameraPermission === 'granted' && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Camera OK
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Camera niet actief</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!isScanning ? (
                    <Button
                      onClick={startScanning}
                      className="flex-1"
                      disabled={!!error || isInitializing}
                    >
                      <Scan className="w-4 h-4 mr-2" />
                      {isInitializing ? 'Initialiseren...' : 'Start Camera'}
                    </Button>
                  ) : (
                    <Button
                      onClick={stopScanning}
                      variant="outline"
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Stop Camera
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Manual Input */}
            <div className="border-t pt-6">
              <Label htmlFor="manual-barcode" className="text-sm font-medium text-gray-700 mb-2 block">
                Barcode handmatig invoeren
              </Label>
              <form onSubmit={handleManualSubmit} className="space-y-3">
                <Input
                  id="manual-barcode"
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  placeholder="Voer barcode in (bijv. 1234567890123)"
                  className="w-full"
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={!manualBarcode.trim()} className="flex-1">
                    <QrCode className="w-4 h-4 mr-2" />
                    Barcode Gebruiken
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDemoBarcode}
                    className="flex-shrink-0"
                  >
                    Demo
                  </Button>
                </div>
              </form>
            </div>

            {/* Info */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Hoe werkt het?</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Start de camera en richt op een barcode</li>
                    <li>• Houd de camera stil voor betere detectie</li>
                    <li>• Of voer de barcode handmatig in</li>
                    <li>• Ondersteunde formaten: EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Troubleshooting for iPhone */}
            {isMobile && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium mb-1">iPhone Tips:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Zorg dat je Safari gebruikt (niet Chrome/Firefox)</li>
                      <li>• Geef camera toegang wanneer gevraagd</li>
                      <li>• Houd de camera ongeveer 10-15cm van de barcode</li>
                      <li>• Zorg voor goede belichting</li>
                      {isIOS && !isSafari && (
                        <li className="font-bold text-red-600">⚠️ Gebruik Safari browser voor beste resultaten</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-xs">
                <summary className="cursor-pointer text-gray-600">Debug Info</summary>
                <div className="mt-2 p-2 bg-gray-50 rounded space-y-1">
                  <div>Mobile: {isMobile ? 'Ja' : 'Nee'}</div>
                  <div>iOS: {isIOS ? 'Ja' : 'Nee'}</div>
                  <div>Safari: {isSafari ? 'Ja' : 'Nee'}</div>
                  <div>Camera Support: {cameraSupported ? 'Ja' : 'Nee'}</div>
                  <div>Camera Permission: {cameraPermission}</div>
                  <div>Available Devices: {availableDevices.length}</div>
                </div>
              </details>
            )}
          </div>
        </div>
      </div>

      {/* iOS Camera Helper Modal */}
      {showIOSHelper && (
        <IOSCameraHelper
          onRetry={handleIOSHelperRetry}
          onClose={handleIOSHelperClose}
        />
      )}
    </>
  );
};
