import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Scan, X, CheckCircle, AlertCircle, QrCode, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    // Check if camera is supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setCameraSupported(true);
    }
    
    // Check if mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    
    // Initialize ZXing reader
    codeReaderRef.current = new BrowserMultiFormatReader();
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      setScanResult(null);
      
      if (!codeReaderRef.current) {
        throw new Error('Barcode reader niet geïnitialiseerd');
      }

      // Get available video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      // Prefer back camera on mobile devices
      let selectedDeviceId = undefined;
      if (isMobile && videoDevices.length > 1) {
        // Try to find back camera (usually has "back" or "environment" in the label)
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('environment') ||
          device.label.toLowerCase().includes('achter')
        );
        if (backCamera) {
          selectedDeviceId = backCamera.deviceId;
        }
      }

      // Start scanning with ZXing
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
      toast.info('Camera gestart! Richt je camera op een barcode.');
      
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      
      let errorMessage = 'Kan camera niet openen.';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera toegang geweigerd. Geef toegang tot je camera in je browser instellingen.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'Geen camera gevonden op dit apparaat.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera wordt al gebruikt door een andere applicatie.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera voldoet niet aan de vereiste specificaties.';
      } else if (err.name === 'TypeError') {
        errorMessage = 'Camera niet ondersteund op dit apparaat.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const stopScanning = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
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

  return (
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
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">{error}</span>
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
                {isScanning ? (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full h-64 object-cover"
                      autoPlay
                      playsInline
                      muted
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
                    disabled={!!error}
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    Start Camera
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
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
