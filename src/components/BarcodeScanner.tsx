import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  onScanSuccess?: () => void;
  settings?: {
    sound_enabled?: boolean;
    vibration_enabled?: boolean;
    auto_focus?: boolean;
    flash_enabled?: boolean;
    scan_timeout?: number;
    camera_resolution?: 'high' | 'medium' | 'low';
  };
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onBarcodeDetected, onClose, onScanSuccess, settings }) => {
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

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
          setError('Camera is not supported on this device/browser');
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
        setError('Cannot initialize scanner');
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
        throw new Error('Barcode reader not initialized');
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
            toast.success(`Barcode detected: ${barcode}`);
            
            // Stop scanning and call callback
            if (codeReaderRef.current) {
              codeReaderRef.current.reset();
            }
            
            // Trigger scan success feedback
            if (onScanSuccess) {
              onScanSuccess();
            }
            
            onBarcodeDetected(barcode);
          }
          
          if (error && !error.name?.includes('NotFoundException')) {
            console.error('Scanning error:', error);
            // Don't show error for NotFoundException as it's normal during scanning
          }
        }
      );

      setIsScanning(true);
      setIsInitializing(false);
      toast.info('Camera started! Point your camera at a barcode.');
      
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setIsInitializing(false);
      
      let errorMessage = 'Cannot open camera.';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Grant access to your camera in your browser settings.';
        if (isIOS) {
          errorMessage += ' Go to Settings → Safari → Camera → Allow';
        }
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera does not meet required specifications.';
      } else if (err.name === 'TypeError') {
        errorMessage = 'Camera not supported on this device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Camera is not supported in this browser.';
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
    toast.success('Demo barcode entered');
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

  const modalContent = (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: '1rem'
        }}
        onClick={(e) => {
          // Close on backdrop click
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div 
          className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          style={{
            maxWidth: '28rem',
            width: '100%',
            maxHeight: '90vh',
            margin: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
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
                    <p className="font-medium mb-1">Camera Error</p>
                    <p>{error}</p>
                    <div className="mt-2 space-y-2">
                      {error.includes('access denied') && (
                        <Button 
                          onClick={retryCamera}
                          variant="outline" 
                          size="sm" 
                          className="mr-2"
                        >
                          Try Again
                        </Button>
                      )}
                      {isIOS && error.includes('access denied') && (
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
                <span className="text-sm">Barcode detected: {scanResult}</span>
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
                        <p className="text-sm">Camera is starting...</p>
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
                          Mobile
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
                        <p className="text-sm">Camera not active</p>
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
                      {isInitializing ? 'Initializing...' : 'Start Camera'}
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



            {/* Info */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">How does it work?</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Start the camera and point it at a barcode</li>
                    <li>• Hold the camera still for better detection</li>
                    <li>• Or enter the barcode manually</li>
                    <li>• Supported formats: EAN-13, EAN-8, UPC-A, UPC-E, Code 128, Code 39</li>
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
                      <li>• Make sure you use Safari (not Chrome/Firefox)</li>
                      <li>• Grant camera access when prompted</li>
                      <li>• Hold the camera about 10-15cm from the barcode</li>
                      <li>• Ensure good lighting</li>
                      {isIOS && !isSafari && (
                        <li className="font-bold text-red-600">⚠️ Use Safari browser for best results</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
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

  // Use portal to render at document root level, ensuring it's always on top
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  
  return modalContent;
};
