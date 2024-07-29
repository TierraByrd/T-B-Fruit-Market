import React from 'react';
import { useSelector } from 'react-redux';

const UserInfo = () => {
  const { totalCash, averagePrice } = useSelector(state => state.user);

  return (
    <div id="user-info">
      <p>Total Cash: ${totalCash.toFixed(2)}</p>
      <p>Average Purchased Price: ${averagePrice.toFixed(2)}</p>
    </div>
  );
};

export default UserInfo;