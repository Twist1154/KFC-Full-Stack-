import React from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function CartPopup({ open, cart, onRemoveItem, spokenResponse }) {
  if (!cart) return null;

  return (
    <Dialog 
      open={open} 
      sx={{
        '& .MuiDialog-paper': {
          position: 'fixed',
          bottom: 80,
          right: 16,
          m: 0,
          width: 300,
          maxHeight: '60vh'
        }
      }}
    >
      <DialogTitle>
        Current Order
        {spokenResponse && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            "{spokenResponse}"
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        {cart.items.length === 0 ? (
          <Typography color="text.secondary">Your cart is empty</Typography>
        ) : (
          <>
            <List>
              {cart.items.map((item, index) => (
                <ListItem
                  key={`${item.id}-${index}`}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => onRemoveItem(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={item.name}
                    secondary={`${item.currency || 'ZAR'} ${item.price.toFixed(2)}`}
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 2, borderTop: 1, pt: 2, borderColor: 'divider' }}>
              <Typography variant="h6">
                Total: ZAR {cart.total.toFixed(2)}
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CartPopup;