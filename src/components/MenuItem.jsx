import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

const MenuItem = ({ item }) => {
  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={item.imageUrl}
        alt={item.itemName}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {item.itemName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            {item.currency} {item.estimatedPrice.toFixed(2)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {item.category}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MenuItem;