// File: src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { IconBug, IconRefresh } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            gap: 3,
            p: 3
          }}
        >
          <IconBug size={64} color="error" />
          
          <Typography variant="h4" component="h1">
            حدث خطأ غير متوقع
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            نعتذر عن هذا الخطأ. يرجى تحديث الصفحة أو المحاولة مرة أخرى.
          </Typography>

          {this.state.error && (
            <Alert severity="error" sx={{ width: '100%', maxWidth: 600, textAlign: 'left' }}>
              <Typography variant="caption" component="pre">
                {this.state.error.message}
              </Typography>
            </Alert>
          )}

          <Button
            variant="contained"
            startIcon={<IconRefresh />}
            onClick={() => window.location.reload()}
            size="large"
          >
            تحديث الصفحة
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
