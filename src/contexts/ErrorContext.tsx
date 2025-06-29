// File: src/contexts/ErrorContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ApiError {
  errorCode: number;
  errorMessage: string;
}


interface ErrorContextType {
  showError: (error: string | ApiError | ApiError[]) => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const ErrorProvider: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    title: '',
    severity: 'error' as 'error' | 'success' | 'warning' | 'info'
  });

  const showError = (error: string | ApiError | ApiError[]) => {
    let message = '';
    let title = t('errors.title');

    if (typeof error === 'string') {
      message = error;
    } else if (Array.isArray(error)) {
      // Multiple errors
      if (error.length === 1) {
        message = error[0].errorMessage;
        title = getErrorTitle(error[0].errorCode);
      } else {
        message = error.map(e => e.errorMessage).join('\n');
        title = t('errors.multipleErrors');
      }
    } else {
      // Single error object
      message = error.errorMessage;
      title = getErrorTitle(error.errorCode);
    }

    setSnackbar({
      open: true,
      message,
      title,
      severity: 'error'
    });
  };

  const showSuccess = (message: string) => {
    setSnackbar({
      open: true,
      message,
      title: t('success.title'),
      severity: 'success'
    });
  };

  const showWarning = (message: string) => {
    setSnackbar({
      open: true,
      message,
      title: t('warning.title'),
      severity: 'warning'
    });
  };

  const showInfo = (message: string) => {
    setSnackbar({
      open: true,
      message,
      title: t('info.title'),
      severity: 'info'
    });
  };

  const getErrorTitle = (errorCode: number): string => {
    switch (errorCode) {
      case 400:
        return t('errors.validationError');
      case 401:
        return t('errors.unauthorized');
      case 403:
        return t('errors.forbidden');
      case 404:
        return t('errors.notFound');
      case 409:
        return t('errors.conflict');
      case 500:
        return t('errors.serverError');
      default:
        return t('errors.title');
    }
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <ErrorContext.Provider value={{ showError, showSuccess, showWarning, showInfo }}>
      {children}
      
      <Snackbar
        open={snackbar.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%', 
            color: 'white',
            whiteSpace: 'pre-line' // للسماح بعرض أخطاء متعددة في أسطر منفصلة
          }}
        >
          <AlertTitle>{snackbar.title}</AlertTitle>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};
