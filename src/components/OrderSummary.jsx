import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';

function OrderSummary({ order, open, onClose }) {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Order Summary</DialogTitle>
      <DialogContent>
        <List>
          {order.items.map((item, index) => (
            <React.Fragment key={`${item.id}-${index}`}>
              <ListItem>
                <ListItemText
                  primary={item.name}
                  secondary={`ZAR ${item.price.toFixed(2)}`}
                />
              </ListItem>
              {index < order.items.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
        <Typography variant="h6" align="right" sx={{ mt: 2 }}>
          Total: ZAR {order.total.toFixed(2)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Confirm Order
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OrderSummary;
