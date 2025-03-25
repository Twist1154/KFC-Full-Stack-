import { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { 
  Container, 
  Grid, 
  CircularProgress, 
  Box, 
  Fab, 
  AppBar, 
  Toolbar, 
  Typography,
  Tabs,
  Tab,
  Snackbar,
  Alert 
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import theme from './theme';
import MenuItem from './components/MenuItem';
import OrderSummary from './components/OrderSummary';
import CartPopup from './components/CartPopup';
import menuData from './data.json';
import { HoundifyService } from './services/houndifyService';
import { orderService } from './services/orderService';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [cart, setCart] = useState(null);
  const [spokenResponse, setSpokenResponse] = useState('');
  const houndifyService = useRef(new HoundifyService());

  useEffect(() => {
    const initializeHoundify = async () => {
      try {
        await houndifyService.current.initialize();
      } catch (error) {
        console.error('Failed to initialize Houndify:', error);
        showNotification('Failed to initialize voice recognition', 'error');
      }
    };

    initializeHoundify();

    try {
      const uniqueCategories = [...new Set(menuData.map(item => item.category))].sort();
      setCategories(uniqueCategories);
      setMenuItems(menuData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load menu data:', err);
      setLoading(false);
    }

    // Load initial cart
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cartData = await orderService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await orderService.removeFromCart(itemId);
      await loadCart();
      showNotification('Item removed from cart', 'success');
    } catch (error) {
      showNotification('Failed to remove item', 'error');
    }
  };

  const processVoiceCommand = async (transcript) => {
    try {
      const result = await orderService.addToCart(transcript);
      if (result.success) {
        if (result.order) {
          setCurrentOrder(result.order);
          setOrderDialogOpen(true);
        }
        setCart(result.cart);
        showNotification(result.message, 'success');
      } else {
        showNotification(result.message, 'warning');
      }
    } catch (error) {
      showNotification('Failed to process your order', 'error');
      console.error('Order processing error:', error);
    }
  };

  const handleVoiceCommand = async () => {
    try {
      if (isListening) {
        await houndifyService.current.stop();
        setIsListening(false);
        return;
      }

      setIsListening(true);
      await houndifyService.current.startVoiceSearch(
        async (response) => {
          setIsListening(false);
          if (response.transcript) {
            setSpokenResponse(response.transcript);
            await processVoiceCommand(response.transcript);
          }
        },
        async (error) => {
          setIsListening(false);
          showNotification('Error processing voice command', 'error');
          console.error('Voice recognition error:', error);
        }
      );
    } catch (error) {
      setIsListening(false);
      showNotification('Failed to start voice recognition', 'error');
      console.error('Voice command error:', error);
    }
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleCloseOrderDialog = () => {
    setOrderDialogOpen(false);
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              KFC Drive-Through
            </Typography>
          </Toolbar>
          <Tabs 
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              bgcolor: 'white',
              '& .MuiTab-root': { color: 'text.primary' },
              '& .Mui-selected': { color: 'primary.main' }
            }}
          >
            <Tab value="all" label="All Items" />
            {categories.map(category => (
              <Tab key={category} value={category} label={category} />
            ))}
          </Tabs>
        </AppBar>

        <Container sx={{ mt: 4, mb: 4 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.item_id}>
                  <MenuItem item={{
                    itemName: item.item_name,
                    description: item.description,
                    estimatedPrice: item.estimated_price,
                    currency: item.currency,
                    category: item.category,
                    imageUrl: item.image_url
                  }} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

        <CartPopup 
          open={isListening || (cart?.items.length > 0)}
          cart={cart}
          onRemoveItem={handleRemoveFromCart}
          spokenResponse={spokenResponse}
        />

        <Fab 
          color={isListening ? "secondary" : "primary"}
          aria-label="mic"
          onClick={handleVoiceCommand}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            animation: isListening ? 'pulse 1.5s infinite' : 'none',
            '@keyframes pulse': {
              '0%': {
                boxShadow: '0 0 0 0 rgba(228, 0, 43, 0.4)'
              },
              '70%': {
                boxShadow: '0 0 0 10px rgba(228, 0, 43, 0)'
              },
              '100%': {
                boxShadow: '0 0 0 0 rgba(228, 0, 43, 0)'
              }
            }
          }}
        >
          <MicIcon />
        </Fab>

        <OrderSummary 
          order={currentOrder}
          open={orderDialogOpen}
          onClose={handleCloseOrderDialog}
        />

        <Snackbar 
          open={notification.open} 
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;