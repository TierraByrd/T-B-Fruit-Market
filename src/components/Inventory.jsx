import React from 'react';
import { useSelector } from 'react-redux';

const Inventory = () => {
  const inventory = useSelector(state => state.inventory);

  return (
    <div id="inventory">
      {Object.keys(inventory).map(fruitId => (
        inventory[fruitId].quantity > 0 && (
          <div className="fruit-item" key={fruitId}>
            <h3>{inventory[fruitId].name}</h3>
            <p>Quantity: {inventory[fruitId].quantity}</p>
          </div>
        )
      ))}
    </div>
  );
};

export default Inventory;