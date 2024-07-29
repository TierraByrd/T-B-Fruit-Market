import React from 'react';
import { useDispatch } from 'react-redux';


const FruitItem = ({ fruit }) => {
  const dispatch = useDispatch();

  const handleBuy = () => {
    dispatch({
      type: 'BUY_FRUIT_REQUEST',
      payload: {
        fruitId: fruit.id,
        quantity: 1, 
      },
    });
  };


  return (
      <div className="fruit-item">
          <h3>{fruit.name}</h3>
          <p>Price: ${parseFloat(fruit.current_price).toFixed(2)}</p>
          <button onClick={handleBuy}>Buy</button>
      </div>
  );
};

export default FruitItem;