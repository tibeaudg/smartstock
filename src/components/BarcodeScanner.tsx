import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Scan, X, CheckCircle, AlertCircle, QrCode } from 'lucide-react';
import { toast } from 'sonner';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Check if camera is supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setCameraSupported(true);
    }
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      setScanResult(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        
        // Simulate barcode detection for demo purposes
        // In production, this would use a real barcode detection library
        setTimeout(() => {
          // For now, we'll just show a demo message
          toast.info('Camera gestart! Richt je camera op een barcode of gebruik handmatige invoer.');
        }, 1000);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Kan camera niet openen. Controleer of je camera toegang hebt gegeven.');
      toast.error('Camera toegang geweigerd');
    }
  };

  const stopScanning = () => {
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
                  <li>• Of voer de barcode handmatig in</li>
                  <li>• Klik op "Barcode Gebruiken" om door te gaan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
