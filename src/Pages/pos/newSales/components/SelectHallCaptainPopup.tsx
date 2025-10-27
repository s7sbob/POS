// File: src/Pages/pos/newSales/components/SelectHallCaptainPopup.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import * as hallCaptainsApi from 'src/utils/api/pagesApi/hallCaptainsApi';

/**
 * Popup component that lists available hall captains and allows the user
 * to select one.  When a hall captain is selected the `onSelect` callback
 * is invoked with the selected captain.  The popup closes automatically
 * after selection.
 */
interface SelectHallCaptainPopupProps {
  open: boolean;
  onClose: () => void;
  onSelect: (captain: hallCaptainsApi.HallCaptain) => void;
}

const SelectHallCaptainPopup: React.FC<SelectHallCaptainPopupProps> = ({ open, onClose, onSelect }) => {
  const [captains, setCaptains] = React.useState<hallCaptainsApi.HallCaptain[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open && captains.length === 0) {
      setLoading(true);
      hallCaptainsApi
        .getAll()
        .then((data) => {
          setCaptains(data);
        })
        .catch((err) => {
          console.error('Failed to load hall captains', err);
        })
        .finally(() => setLoading(false));
    }
  }, [open, captains.length]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>اختر كابتن الصالة</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 120 }}>
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {captains.map((captain) => (
              <Grid item xs={12} sm={6} md={4} key={captain.id}>
                <Card>
                  <CardActionArea
                    onClick={() => {
                      onSelect(captain);
                      onClose();
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {captain.name}
                      </Typography>
                      {captain.phone && (
                        <Typography variant="body2" color="text.secondary">
                          {captain.phone}
                        </Typography>
                      )}
                      {captain.branchName && (
                        <Typography variant="caption" color="text.secondary">
                          {captain.branchName}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
            {captains.length === 0 && !loading && (
              <Grid item xs={12}>
                <Typography align="center">لا يوجد كباتن صالة متاحين.</Typography>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectHallCaptainPopup;