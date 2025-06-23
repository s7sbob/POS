// File: src/components/ImportExportManager.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  LinearProgress,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  IconFileImport,
  IconDownload,
  IconUpload,
  IconFileSpreadsheet,
  IconFile3d,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf/dist/jspdf.es.min.js';
import html2canvas from 'html2canvas';

export interface ColumnConfig {
  field: string;
  headerName: string;
  headerNameEn?: string; // إضافة الترجمة الإنجليزية
  type: 'string' | 'number' | 'date' | 'boolean';
  required?: boolean;
  format?: (value: any) => string;
  validate?: (value: any) => string | null;
  width?: number;
  example?: string;
  exampleEn?: string; // إضافة المثال الإنجليزي
}

export interface ImportExportConfig {
  moduleName: string;
  moduleNameEn?: string; // إضافة الاسم الإنجليزي
  fileName: string;
  title: string;
  titleEn?: string; // إضافة العنوان الإنجليزي
  columns: ColumnConfig[];
  onImport: (data: any[]) => Promise<{ success: number; errors: string[] }>;
  onExport?: () => any[];
  maxRows?: number;
  allowedFileTypes?: string[];
}

interface Props {
  config: ImportExportConfig;
  data?: any[];
  loading?: boolean;
  compact?: boolean;
}

const ImportExportManager: React.FC<Props> = ({
  config,
  data = [],
  loading = false,
  compact = false
}) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isRTL = i18n.language === 'ar';
  // دالة لإعداد خط Cairo في jsPDF
  const [importDialog, setImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);

  // دالة للحصول على النص حسب اللغة
const getLocalizedText = (keyOrText: string, englishKeyOrText?: string) => {
  // إذا كان النص يحتوي على نقطة، فهو key للترجمة
  if (keyOrText.includes('.')) {
    const translatedText = t(keyOrText);
    // إذا كانت الترجمة نفس الـ key، يعني مش موجودة
    if (translatedText === keyOrText) {
      return isRTL ? keyOrText : (englishKeyOrText || keyOrText);
    }
    return translatedText;
  }
  // وإلا استخدم النص مباشرة
  return isRTL ? keyOrText : (englishKeyOrText || keyOrText);
};

  // دالة للحصول على العمود حسب اللغة
  const getLocalizedColumn = (col: ColumnConfig) => ({
    ...col,
    headerName: getLocalizedText(col.headerName, col.headerNameEn),
    example: getLocalizedText(col.example || '', col.exampleEn || '')
  });

  /* ───── Export Functions ───── */
  const exportToExcel = () => {
    const exportData = config.onExport ? config.onExport() : data;
    
    const processedData = exportData.map(item => {
      const row: any = {};
      config.columns.forEach(col => {
        const localizedCol = getLocalizedColumn(col);
        const value = getNestedValue(item, col.field);
        row[localizedCol.headerName] = col.format ? col.format(value) : value;
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(processedData);
    
    // تحسين عرض الأعمدة
    const colWidths = config.columns.map(col => {
      const localizedCol = getLocalizedColumn(col);
      return {
        wch: col.width || Math.max(localizedCol.headerName.length, 15)
      };
    });
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    const sheetName = getLocalizedText(config.moduleName, config.moduleNameEn);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    XLSX.writeFile(wb, `${config.fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

const exportToPDF = async () => {
  // 1. Gather data to export
  const exportData = config.onExport ? config.onExport() : data;

  // 2. Build a hidden container for html2canvas
  const tempDiv = document.createElement('div');
  Object.assign(tempDiv.style, {
    position: 'absolute',
    left: '-9999px',
    top: '-9999px',
    backgroundColor: 'white',
    padding: '40px',
    fontFamily: isRTL ? 'Cairo, Tahoma, Arial, sans-serif' : 'Arial, sans-serif',
    direction: isRTL ? 'rtl' : 'ltr',
    width: '1200px',
    fontSize: '14px',
    lineHeight: '1.6',
    textAlign: isRTL ? 'right' : 'left',
  });

  // 3. Load Cairo font for Arabic if needed
  if (isRTL) {
    const cairoFontLink = document.createElement('link');
    cairoFontLink.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap';
    cairoFontLink.rel = 'stylesheet';
    document.head.appendChild(cairoFontLink);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  // 4. Build the HTML table
  const title = getLocalizedText(config.title, config.titleEn);
  const dateText = `${t('common.exportDate')}: ${new Date().toLocaleDateString()}`;

  // Header -- note the table itself is RTL, so **no array reversing necessary**
  const localizedColumns = config.columns.map((col) => getLocalizedColumn(col));

  let tableHTML = `
    <div style="text-align:${isRTL ? 'right' : 'left'};margin-bottom:30px;direction:${isRTL ? 'rtl' : 'ltr'};unicode-bidi:embed;">
      <h1 style="margin:0 0 15px;font-size:28px;font-weight:700;color:#2c3e50;font-family:${
        isRTL ? 'Cairo, Tahoma, Arial, sans-serif' : 'Arial, sans-serif'
      };direction:${isRTL ? 'rtl' : 'ltr'};unicode-bidi:embed;text-align:${isRTL ? 'right' : 'left'};">
        ${title}
      </h1>
      <p style="margin:0;font-size:16px;color:#7f8c8d;font-family:${
        isRTL ? 'Cairo, Tahoma, Arial, sans-serif' : 'Arial, sans-serif'
      };direction:${isRTL ? 'rtl' : 'ltr'};unicode-bidi:embed;text-align:${isRTL ? 'right' : 'left'};">
        ${dateText}
      </p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border-radius:12px;overflow:hidden;font-family:${
      isRTL ? 'Cairo, Tahoma, Arial, sans-serif' : 'Arial, sans-serif'
    };direction:${isRTL ? 'rtl' : 'ltr'};">
      <thead>
        <tr style="background:linear-gradient(135deg,#3498db,#2980b9);color:white;">`;

  localizedColumns.forEach((col) => {
    tableHTML += `
      <th style="border:none;padding:20px 18px;text-align:${
        isRTL ? 'right' : 'left'
      };font-weight:600;font-size:16px;font-family:${
        isRTL ? 'Cairo, Tahoma, Arial, sans-serif' : 'Arial, sans-serif'
      };direction:${isRTL ? 'rtl' : 'ltr'};unicode-bidi:embed;">${col.headerName}</th>`;
  });

  tableHTML += `</tr></thead><tbody>`;

  // Body rows (keep original column order)
  exportData.forEach((item, index) => {
    const isEven = index % 2 === 0;
    tableHTML += `<tr style="background-color:${isEven ? '#f8f9fa' : 'white'};">`;

    config.columns.forEach((col) => {
      const value = getNestedValue(item, col.field);
      let formattedValue = col.format ? col.format(value) : String(value ?? '');

      if (isRTL) {
        // Quick localisation of common boolean-ish values
        switch (formattedValue) {
          case 'true':
          case 'Active':
          case 'Yes':
            formattedValue = 'نشط';
            break;
          case 'false':
          case 'Inactive':
          case 'No':
            formattedValue = 'غير نشط';
            break;
        }
      }

      tableHTML += `
        <td style="border:1px solid #e9ecef;padding:16px 15px;text-align:${
          isRTL ? 'right' : 'left'
        };color:#2c3e50;font-size:14px;font-family:${
        isRTL ? 'Cairo, Tahoma, Arial, sans-serif' : 'Arial, sans-serif'
      };direction:${isRTL ? 'rtl' : 'ltr'};unicode-bidi:embed;">${formattedValue}</td>`;
    });

    tableHTML += `</tr>`;
  });

  tableHTML += `
      </tbody>
    </table>
    <div style="margin-top:30px;text-align:center;color:#95a5a6;font-size:12px;font-family:${
      isRTL ? 'Cairo, Tahoma, Arial, sans-serif' : 'Arial, sans-serif'
    };">Generated on ${new Date().toLocaleString()}</div>`;

  tempDiv.innerHTML = tableHTML;
  document.body.appendChild(tempDiv);

  // 5. Capture, place into jsPDF
  try {
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 1200,
      height: tempDiv.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1200,
      windowHeight: tempDiv.scrollHeight,
      logging: false,
      imageTimeout: 20000,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });

    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const availW = pdfW - margin * 2;
    const availH = pdfH - margin * 2;

    const canvasRatio = canvas.width / canvas.height;
    const availRatio = availW / availH;

    let finalW, finalH;
    if (canvasRatio > availRatio) {
      finalW = availW;
      finalH = availW / canvasRatio;
    } else {
      finalH = availH;
      finalW = availH * canvasRatio;
    }

    const xOffset = margin + (availW - finalW) / 2;
    const yOffset = margin + (availH - finalH) / 2;

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalW, finalH);
    pdf.save(`${config.fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (err) {
    console.error('Error generating PDF:', err);
  } finally {
    document.body.removeChild(tempDiv);
  }
};



// دالة احتياطية بسيطة

  /* ───── Template Download ───── */
  const downloadTemplate = () => {
    const templateData = [{}];
    
    // إنشاء صف للأمثلة
    const exampleRow: any = {};
    config.columns.forEach(col => {
      const localizedCol = getLocalizedColumn(col);
      exampleRow[localizedCol.headerName] = localizedCol.example || getExampleValue(col.type);
    });
    templateData.push(exampleRow);

    const ws = XLSX.utils.json_to_sheet(templateData);
    
    // إضافة تعليقات للأعمدة المطلوبة
    config.columns.forEach((col, index) => {
      const localizedCol = getLocalizedColumn(col);
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
      if (!ws[cellRef]) ws[cellRef] = { v: localizedCol.headerName };
      
      if (col.required) {
        ws[cellRef].s = {
          fill: { fgColor: { rgb: "FFFF00" } },
          font: { bold: true }
        };
      }
    });

    // تحسين عرض الأعمدة
    const colWidths = config.columns.map(col => {
      const localizedCol = getLocalizedColumn(col);
      return {
        wch: Math.max(localizedCol.headerName.length, 20)
      };
    });
    ws['!cols'] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    
    // إضافة sheet للتعليمات
    const instructionsTitle = isRTL ? 'تعليمات الاستخدام' : 'Usage Instructions';
    const instructions = isRTL ? [
      { [instructionsTitle]: 'يرجى اتباع التعليمات التالية:' },
      { [instructionsTitle]: '1. املأ البيانات في الصف الثاني وما بعده' },
      { [instructionsTitle]: '2. الأعمدة ذات الخلفية الصفراء مطلوبة' },
      { [instructionsTitle]: '3. لا تغير أسماء الأعمدة' },
      { [instructionsTitle]: '4. احفظ الملف بصيغة Excel (.xlsx)' },
      { [instructionsTitle]: '' },
      { [instructionsTitle]: 'أنواع البيانات المطلوبة:' }
    ] : [
      { [instructionsTitle]: 'Please follow these instructions:' },
      { [instructionsTitle]: '1. Fill data in the second row and beyond' },
      { [instructionsTitle]: '2. Columns with yellow background are required' },
      { [instructionsTitle]: '3. Do not change column names' },
      { [instructionsTitle]: '4. Save the file in Excel format (.xlsx)' },
      { [instructionsTitle]: '' },
      { [instructionsTitle]: 'Required data types:' }
    ];

    const instructionsData = [
      ...instructions,
      ...config.columns.map(col => {
        const localizedCol = getLocalizedColumn(col);
        const requiredText = isRTL ? 
          (col.required ? '(مطلوب)' : '(اختياري)') :
          (col.required ? '(Required)' : '(Optional)');
        
        return {
          [instructionsTitle]: `${localizedCol.headerName}: ${getTypeDescription(col.type)} ${requiredText}`
        };
      })
    ];

    const instructionsWs = XLSX.utils.json_to_sheet(instructionsData);
    instructionsWs['!cols'] = [{ wch: 50 }];
    const instructionsSheetName = isRTL ? 'تعليمات' : 'Instructions';
    XLSX.utils.book_append_sheet(wb, instructionsWs, instructionsSheetName);
    
    XLSX.writeFile(wb, `${config.fileName}_template.xlsx`);
  };

  /* ───── Import Functions ───── */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportErrors([]);
      setImportResult(null);
      
      // قراءة الملف
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // تحويل البيانات وتنظيفها
          const processedData = processImportData(jsonData);
          setImportData(processedData);
        } catch (error) {
          setImportErrors([t('import.fileReadError')]);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const processImportData = (rawData: any[]) => {
    const processedData: any[] = [];
    const errors: string[] = [];

    rawData.forEach((row, index) => {
      if (index === 0 && isExampleRow(row)) return;
      
      const processedRow: any = {};
      let hasData = false;

      config.columns.forEach(col => {
        const localizedCol = getLocalizedColumn(col);
        // البحث عن القيمة بكلا الاسمين (العربي والإنجليزي)
        const value = row[localizedCol.headerName] || row[col.headerName] || row[col.headerNameEn || ''];
        
        if (value !== undefined && value !== null && value !== '') {
          hasData = true;
          processedRow[col.field] = convertValue(value, col.type);
        } else if (col.required) {
          errors.push(`${t('import.requiredField')} "${localizedCol.headerName}" ${t('import.inRow')} ${index + 1}`);
        }

        if (col.validate && processedRow[col.field] !== undefined) {
          const validationError = col.validate(processedRow[col.field]);
          if (validationError) {
            errors.push(`${t('import.validationError')} "${localizedCol.headerName}" ${t('import.inRow')} ${index + 1}: ${validationError}`);
          }
        }
      });

      if (hasData) {
        processedData.push(processedRow);
      }
    });

    setImportErrors(errors);
    return processedData;
  };

  const handleImport = async () => {
    if (importData.length === 0) return;
    
    setImporting(true);
    try {
      const result = await config.onImport(importData);
      setImportResult(result);
      
      if (result.errors.length === 0) {
        setTimeout(() => {
          setImportDialog(false);
          setImportFile(null);
          setImportData([]);
          setImportResult(null);
        }, 2000);
      }
    } catch (error) {
      setImportErrors([t('import.importError')]);
    } finally {
      setImporting(false);
    }
  };

  /* ───── Helper Functions ───── */
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const getExampleValue = (type: string) => {
    if (isRTL) {
      switch (type) {
        case 'string': return 'نص تجريبي';
        case 'number': return '123';
        case 'date': return '2024-01-01';
        case 'boolean': return 'نعم';
        default: return 'قيمة تجريبية';
      }
    } else {
      switch (type) {
        case 'string': return 'Sample Text';
        case 'number': return '123';
        case 'date': return '2024-01-01';
        case 'boolean': return 'Yes';
        default: return 'Sample Value';
      }
    }
  };

  const getTypeDescription = (type: string) => {
    if (isRTL) {
      switch (type) {
        case 'string': return 'نص';
        case 'number': return 'رقم';
        case 'date': return 'تاريخ (YYYY-MM-DD)';
        case 'boolean': return 'نعم/لا';
        default: return 'نص';
      }
    } else {
      switch (type) {
        case 'string': return 'Text';
        case 'number': return 'Number';
        case 'date': return 'Date (YYYY-MM-DD)';
        case 'boolean': return 'Yes/No';
        default: return 'Text';
      }
    }
  };

  const isExampleRow = (row: any) => {
    return Object.values(row).some(value => 
      String(value).includes('تجريبي') || 
      String(value).includes('example') ||
      String(value).includes('Sample')
    );
  };

  const convertValue = (value: any, type: string) => {
    switch (type) {
      case 'number':
        const num = Number(value);
        return isNaN(num) ? 0 : num;
      case 'boolean':
        const lowerValue = String(value).toLowerCase();
        return ['نعم', 'yes', 'true', '1', 1, true].includes(lowerValue);
      case 'date':
        return new Date(value).toISOString().split('T')[0];
      default:
        return String(value);
    }
  };

  /* ───── Render ───── */
  return (
    <Box>
      {/* Export & Import Buttons */}
      <Stack 
        direction={compact ? "column" : "row"} 
        spacing={1} 
        sx={{ mb: 2 }}
      >
        {/* Export Buttons */}
        <Button
          variant="outlined"
          startIcon={<IconFileSpreadsheet size={16} />}
          onClick={exportToExcel}
          disabled={loading}
          size={compact ? "small" : "medium"}
          fullWidth={compact}
          sx={{ 
            minWidth: compact ? 'auto' : 140,
            justifyContent: 'flex-start'
          }}
        >
          {t('export.exportExcel')}
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<IconFile3d size={16} />}
          onClick={exportToPDF}
          disabled={loading}
          size={compact ? "small" : "medium"}
          fullWidth={compact}
          sx={{ 
            minWidth: compact ? 'auto' : 140,
            justifyContent: 'flex-start'
          }}
        >
          {t('export.exportPdf')}
        </Button>

        <Divider orientation={compact ? "horizontal" : "vertical"} flexItem />

        {/* Import Buttons */}
        <Button
          variant="outlined"
          startIcon={<IconDownload size={16} />}
          onClick={downloadTemplate}
          size={compact ? "small" : "medium"}
          fullWidth={compact}
          color="secondary"
          sx={{ 
            minWidth: compact ? 'auto' : 160,
            justifyContent: 'flex-start'
          }}
        >
          {t('import.downloadTemplate')}
        </Button>

        <Button
          variant="contained"
          startIcon={<IconFileImport size={16} />}
          onClick={() => setImportDialog(true)}
          size={compact ? "small" : "medium"}
          fullWidth={compact}
          sx={{ 
            minWidth: compact ? 'auto' : 120,
            justifyContent: 'flex-start'
          }}
        >
          {t('import.import')}
        </Button>
      </Stack>

      {/* Import Dialog */}
      <Dialog 
        open={importDialog} 
        onClose={() => setImportDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {t('import.importTitle')} - {getLocalizedText(config.title, config.titleEn)}
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3}>
            {/* File Upload */}
            <Box>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                id="import-file-input"
              />
              <label htmlFor="import-file-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<IconUpload />}
                  fullWidth
                  sx={{ p: 2 }}
                >
                  {importFile ? importFile.name : t('import.selectFile')}
                </Button>
              </label>
            </Box>

            {/* Import Progress */}
            {importing && (
              <Box>
                <Typography variant="body2" gutterBottom>
                  {t('import.importing')}...
                </Typography>
                <LinearProgress />
              </Box>
            )}

            {/* Import Errors */}
            {importErrors.length > 0 && (
              <Alert severity="error">
                <Typography variant="subtitle2" gutterBottom>
                  {t('import.errorsFound')}:
                </Typography>
                {importErrors.map((error, index) => (
                  <Typography key={index} variant="body2">
                    • {error}
                  </Typography>
                ))}
              </Alert>
            )}

            {/* Import Result */}
            {importResult && (
              <Alert severity={importResult.errors.length === 0 ? "success" : "warning"}>
                <Typography variant="subtitle2" gutterBottom>
                  {t('import.importComplete')}
                </Typography>
                <Typography variant="body2">
                  {t('import.successfulRecords')}: {importResult.success}
                </Typography>
                {importResult.errors.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="error">
                      {t('import.failedRecords')}: {importResult.errors.length}
                    </Typography>
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <Typography key={index} variant="caption" display="block">
                        • {error}
                      </Typography>
                    ))}
                    {importResult.errors.length > 5 && (
                      <Typography variant="caption" color="text.secondary">
                        {t('import.andMore', { count: importResult.errors.length - 5 })}
                      </Typography>
                    )}
                  </Box>
                )}
              </Alert>
            )}

            {/* Data Preview */}
            {importData.length > 0 && importErrors.length === 0 && !importResult && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {t('import.dataPreview')} ({importData.length} {t('import.records')}):
                </Typography>
                <Box sx={{ maxHeight: 200, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1, p: 1 }}>
                  {importData.slice(0, 3).map((row, index) => (
                    <Box key={index} sx={{ mb: 1, p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                      {config.columns.map(col => {
                        const localizedCol = getLocalizedColumn(col);
                        return (
                          <Typography key={col.field} variant="caption" display="block">
                            <strong>{localizedCol.headerName}:</strong> {String(row[col.field] || '-')}
                          </Typography>
                        );
                      })}
                    </Box>
                  ))}
                  {importData.length > 3 && (
                    <Typography variant="caption" color="text.secondary">
                      {t('import.andMoreRecords', { count: importData.length - 3 })}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setImportDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={importData.length === 0 || importErrors.length > 0 || importing}
          >
            {importing ? t('import.importing') : t('import.import')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImportExportManager;
