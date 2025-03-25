import React from 'react';

function Cart({ items, onRemoveFromCart, onPlaceOrder }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-fit sticky top-4">
      <h2 className="text-2xl font-bold mb-6">Your Order</h2>
      <div className="border-b border-gray-200 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2">
            <span>{item.name}</span>
            <div>
              <span>R{item.price.toFixed(2)}</span>
              <button 
                onClick={() => onRemoveFromCart(item.id)} 
                className="ml-2 text-kfc-red"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-xl font-semibold">Total:</span>
        <span className="text-xl font-semibold">
          R{total.toFixed(2)}
        </span>
      </div>
      <button 
        onClick={onPlaceOrder} 
        className="btn btn-primary w-full"
      >
        Place Order
      </button>
    </div>
  );
}

export default Cart;