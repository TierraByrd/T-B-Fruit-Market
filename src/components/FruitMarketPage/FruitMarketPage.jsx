import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FruitItem from './FruitItem';

function FruitMarketPage() {
    const dispatch = useDispatch();
    const fruits = useSelector((state) => state.fruit.fruits);
    const isLoading = useSelector((state) => state.fruit.isLoading);
    const error = useSelector((state) => state.fruit.error);
    const totalCash = useSelector((state) => state.fruit.totalCash);
  
    useEffect(() => {
      dispatch({ type: 'FETCH_FRUIT' });
      dispatch({ type: 'FETCH_USER_BALANCE' });
    
        const interval = setInterval(() => {
            dispatch({ type: 'UPDATE_PRICES_INTERVAL' });
          }, 15000); // 15 seconds
      
          return () => clearInterval(interval);
        }, [dispatch]);

        return (
            <div className="container">
              <h2>Welcome to the Market</h2>
              <p>Total Available Cash: ${parseFloat(totalCash).toFixed(2)}</p>
        
              {isLoading && <p>Loading...</p>}
              {error && <p>Error: {error}</p>}
              <div className="fruit-list">
                {fruits.length > 0 ? (
                  fruits.map((fruit) => (
                    <FruitItem key={fruit.id} fruit={fruit} />
                  ))
                ) : (
                  <p>No fruits available</p>
                )}
              </div>
            </div>
          );
        }
        
        export default FruitMarketPage;