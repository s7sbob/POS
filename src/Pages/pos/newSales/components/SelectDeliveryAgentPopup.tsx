// File: src/Pages/pos/newSales/components/SelectDeliveryAgentPopup.tsx
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
import * as deliveryAgentsApi from 'src/utils/api/pagesApi/deliveryAgentsApi';

/**
 * Popup component that lists available delivery agents and allows the user
 * to select one.  When a delivery agent is selected the `onSelect` callback
 * is invoked with the selected agent.  The popup will close automatically
 * after selection.
 */
interface SelectDeliveryAgentPopupProps {
  open: boolean;
  onClose: () => void;
  onSelect: (agent: deliveryAgentsApi.DeliveryAgent) => void;
}

const SelectDeliveryAgentPopup: React.FC<SelectDeliveryAgentPopupProps> = ({ open, onClose, onSelect }) => {
  const [agents, setAgents] = React.useState<deliveryAgentsApi.DeliveryAgent[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Load the list of delivery agents whenever the popup is opened.  If the
  // list has already been loaded we skip the API call on subsequent opens.
  React.useEffect(() => {
    if (open && agents.length === 0) {
      setLoading(true);
      deliveryAgentsApi
        .getAll()
        .then((data) => {
          setAgents(data);
        })
        .catch((err) => {
          console.error('Failed to load delivery agents', err);
        })
        .finally(() => setLoading(false));
    }
  }, [open, agents.length]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>اختر مندوب التوصيل</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 120 }}>
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {agents.map((agent) => (
              <Grid item xs={12} sm={6} md={4} key={agent.id}>
                <Card>
                  <CardActionArea
                    onClick={() => {
                      onSelect(agent);
                      onClose();
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {agent.name}
                      </Typography>
                      {agent.phone && (
                        <Typography variant="body2" color="text.secondary">
                          {agent.phone}
                        </Typography>
                      )}
                      {agent.branchName && (
                        <Typography variant="caption" color="text.secondary">
                          {agent.branchName}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
            {agents.length === 0 && !loading && (
              <Grid item xs={12}>
                <Typography align="center">لا يوجد مندوبي توصيل متاحين.</Typography>
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

export default SelectDeliveryAgentPopup;