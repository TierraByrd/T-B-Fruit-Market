import React, {useEffect} from 'react';
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
 // Fetch updated average price when component mounts or fruit ID changes
 useEffect(() => {
  dispatch({ type: 'FETCH_FRUIT_AVERAGE_PRICE_REQUEST', payload: { fruitId: fruit.id } });
}, [dispatch, fruit.id]);

  // Determine available quantity for selling
  const availableQuantity = inventory[fruit.id] || 0;

  return (
    <div className="fruit-item">
      {fruit.imageUrl && <img src={fruit.imageUrl} alt={fruit.name} className="fruit-image" />}
        <h3>{fruit.name}</h3>
        <p>Market Price: ${parseFloat(fruit.current_price).toFixed(2)}</p>
        <p>Average Price: ${parseFloat(fruit.averagePurchasedPrice).toFixed(2)}</p>
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