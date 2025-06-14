import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { IconX, IconCamera, IconCameraOff, IconRefresh } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

const BarcodeScanner: React.FC<Props> = ({ open, onClose, onScan }) => {
  const { t } = useTranslation();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // تنظيف الكاميرا عند الإغلاق
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // إيقاف الكاميرا عند إغلاق المودال
  useEffect(() => {
    if (!open) {
      stopCamera();
      setError('');
      setHasPermission(null);
      setIsLoading(false);
    }
  }, [open]);

  const checkCameraPermission = async () => {
    try {
      // التحقق من دعم المتصفح للكاميرا
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('المتصفح لا يدعم الوصول للكاميرا');
      }

      // التحقق من الصلاحيات
      try {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        
        if (permission.state === 'denied') {
          throw new Error('تم رفض الوصول للكاميرا. يرجى السماح بالوصول للكاميرا من إعدادات المتصفح');
        }
      } catch (permError) {
        // بعض المتصفحات لا تدعم permissions API
        console.log('Permissions API not supported, continuing...');
      }

      setHasPermission(true);
      return true;
    } catch (err: any) {
      console.error('Permission check error:', err);
      setError(err.message || 'خطأ في التحقق من صلاحيات الكاميرا');
      setHasPermission(false);
      return false;
    }
  };

  const startCamera = async () => {
    try {
      setError('');
      setIsLoading(true);
      
      // التحقق من الصلاحيات أولاً
      const hasAccess = await checkCameraPermission();
      if (!hasAccess) {
        setIsLoading(false);
        return;
      }

      console.log('Starting camera...');

      // محاولة الحصول على الكاميرا الخلفية أولاً
      let constraints = {
        video: { 
          facingMode: 'environment', // الكاميرا الخلفية
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      let stream: MediaStream;
      
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        console.log('Back camera failed, trying front camera:', err);
        // إذا فشلت الكاميرا الخلفية، جرب الأمامية
        constraints = {
          video: { 
            facingMode: 'user', // الكاميرا الأمامية
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (frontErr) {
          console.log('Front camera failed, trying any camera:', frontErr);
          // إذا فشلت الكاميرا الأمامية، جرب أي كاميرا متاحة
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
      }
      
      console.log('Camera stream obtained:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // انتظار تحميل الفيديو
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log('Video playing successfully');
                setIsScanning(true);
                setIsLoading(false);
                startBarcodeDetection();
              })
              .catch((playError) => {
                console.error('Video play error:', playError);
                setError('خطأ في تشغيل الفيديو');
                setIsLoading(false);
              });
          }
        };

        // معالجة أخطاء الفيديو
        videoRef.current.onerror = (videoError) => {
          console.error('Video error:', videoError);
          setError('خطأ في عرض الفيديو');
          setIsLoading(false);
        };
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      let errorMessage = 'خطأ في الوصول للكاميرا';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'تم رفض الوصول للكاميرا. يرجى السماح بالوصول للكاميرا وإعادة المحاولة';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'لم يتم العثور على كاميرا متاحة';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'الكاميرا مستخدمة من تطبيق آخر';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'إعدادات الكاميرا غير مدعومة';
      } else if (err.name === 'AbortError') {
        errorMessage = 'تم إلغاء الوصول للكاميرا';
      } else if (err.name === 'SecurityError') {
        errorMessage = 'خطأ أمني في الوصول للكاميرا';
      }
      
      setError(errorMessage);
      setHasPermission(false);
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    
    // إيقاف البحث عن الباركود
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };

  // محاكاة البحث عن الباركود (يمكن استبدالها بمكتبة حقيقية)
  const startBarcodeDetection = () => {
    // هذا مثال بسيط - في التطبيق الحقيقي يجب استخدام مكتبة مثل QuaggaJS أو ZXing
    scanIntervalRef.current = setInterval(() => {
      // محاكاة اكتشاف الباركود
      if (Math.random() > 0.98) { // احتمال 2% لاكتشاف باركود وهمي
        const mockBarcode = generateMockBarcode();
        handleBarcodeDetected(mockBarcode);
      }
    }, 100);
  };

  const generateMockBarcode = () => {
    // توليد باركود وهمي للاختبار
    const barcodes = [
      '1234567890123',
      '9876543210987',
      '5555666677778',
      '1111222233334',
      '9999888877776'
    ];
    return barcodes[Math.floor(Math.random() * barcodes.length)];
  };

  const handleBarcodeDetected = (barcode: string) => {
    console.log('Barcode detected:', barcode);
    onScan(barcode);
    handleClose();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const simulateScan = () => {
    const mockBarcode = '1234567890123';
    handleBarcodeDetected(mockBarcode);
  };

  const retryCamera = () => {
    setError('');
    setHasPermission(null);
    startCamera();
  };

  // قائمة الكاميرات المتاحة (للتشخيص)
  const listCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      console.log('Available cameras:', cameras);
      return cameras;
    } catch (err) {
      console.error('Error listing cameras:', err);
      return [];
    }
  };

  // تشخيص المشكلة
  const diagnoseCamera = async () => {
    console.log('=== Camera Diagnosis ===');
    console.log('Navigator.mediaDevices:', !!navigator.mediaDevices);
    console.log('getUserMedia support:', !!navigator.mediaDevices?.getUserMedia);
    console.log('Is HTTPS:', window.location.protocol === 'https:');
    console.log('User agent:', navigator.userAgent);
    
    const cameras = await listCameras();
    console.log('Number of cameras found:', cameras.length);
    
    if (cameras.length === 0) {
      setError('لم يتم العثور على أي كاميرا متاحة');
    }
  };

  // تشغيل التشخيص عند فتح المودال
  useEffect(() => {
    if (open) {
      diagnoseCamera();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {t('barcode.scanTitle') || 'مسح الباركود'}
          <IconButton onClick={handleClose}>
            <IconX size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box textAlign="center">
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
              <Box mt={1}>
                <Typography variant="caption" display="block">
                  تأكد من:
                </Typography>
                <Typography variant="caption" component="ul" sx={{ textAlign: 'left', mt: 1 }}>
                  <li>السماح بالوصول للكاميرا في المتصفح</li>
                  <li>عدم استخدام الكاميرا من تطبيق آخر</li>
                  <li>وجود كاميرا متصلة بالجهاز</li>
                  <li>استخدام HTTPS (مطلوب للكاميرا)</li>
                </Typography>
              </Box>
            </Alert>
          )}

          {isLoading && (
            <Box py={2}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 1 }}>
                جاري تشغيل الكاميرا...
              </Typography>
            </Box>
          )}

          {!isScanning && !isLoading ? (
            <Box py={4}>
              <IconCamera size={64} color="gray" />
              <Typography variant="h6" sx={{ mt: 2, mb: 3 }}>
                {hasPermission === false 
                  ? 'يرجى السماح بالوصول للكاميرا' 
                  : (t('barcode.clickToStart') || 'انقر لبدء المسح')
                }
              </Typography>
              <Button
                variant="contained"
                onClick={startCamera}
                startIcon={<IconCamera size={20} />}
                disabled={hasPermission === false}
                sx={{ mb: 2 }}
              >
                {t('barcode.startCamera') || 'تشغيل الكاميرا'}
              </Button>
              
              {error && (
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    onClick={retryCamera}
                    startIcon={<IconRefresh size={20} />}
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    إعادة المحاولة
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => window.location.reload()}
                    size="small"
                  >
                    إعادة تحميل الصفحة
                  </Button>
                </Box>
              )}
            </Box>
          ) : isScanning ? (
            <Box>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: '#000'
                }}
              />
              <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
                {t('barcode.pointCamera') || 'وجه الكاميرا نحو الباركود'}
              </Typography>
              
              <Box display="flex" justifyContent="center" gap={1}>
                <Button
                  variant="outlined"
                  onClick={stopCamera}
                  startIcon={<IconCameraOff size={20} />}
                  size="small"
                >
                  إيقاف الكاميرا
                </Button>
                <Button
                  variant="outlined"
                  onClick={simulateScan}
                  size="small"
                >
                  محاكاة المسح (للاختبار)
                </Button>
              </Box>
            </Box>
          ) : null}

          {!isScanning && !isLoading && (
            <Button
              variant="outlined"
              onClick={simulateScan}
              sx={{ mt: 2 }}
            >
              {t('barcode.simulateScan') || 'محاكاة المسح'} (للاختبار)
            </Button>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          {t('common.cancel') || 'إلغاء'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BarcodeScanner;
