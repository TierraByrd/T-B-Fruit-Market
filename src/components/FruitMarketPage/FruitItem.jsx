import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const FruitItem = ({ fruit }) => {
  const dispatch = useDispatch();
  
  // Access the inventory from the Redux store
  const inventory = useSelector(state => state.fruit.inventory);

  const handleBuy = () => {
    dispatch({
      type: 'BUY_FRUIT_REQUEST',
      payload: {
        fruitId: fruit.id,
        quantity: 1,
      },
    });
  };

  const handleSell = () => {
    dispatch({
      type: 'SELL_FRUIT_REQUEST',
      payload: {
        fruitId: fruit.id,
        quantity: 1,
      },
    });
  };

  // Determine available quantity for selling
  const availableQuantity = inventory[fruit.id] || 0;

  return (
    <div className="fruit-item">
      <h3>{fruit.name}</h3>
      <p>Average Price: ${parseFloat(fruit.current_price).toFixed(2)}</p>
      <button onClick={handleBuy}>Buy</button>
      <button 
        onClick={handleSell} 
        disabled={availableQuantity <= 0}
      >
        Sell ({availableQuantity})
      </button>
    </div>
  );
};

export default FruitItem;