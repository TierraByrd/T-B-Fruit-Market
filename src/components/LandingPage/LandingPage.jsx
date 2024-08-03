import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';

// CUSTOM COMPONENTS
import RegisterForm from '../RegisterForm/RegisterForm';

function LandingPage() {
  const [heading, setHeading] = useState('Welcome to Fruit Market');
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <div className="container">
      <h2>{heading}</h2>

      <div className="grid">
        <div className="grid-col grid-col_8">
        <p>
            Discover the best place to buy and sell fresh, high-quality fruits. At Fruit Market, we connect enthusiasts and sellers through a seamless platform, ensuring you get the finest produce with ease.
          </p>

          <p>
            Our platform provides real-time pricing, a diverse selection of fruits, and easy transactions. Whether you're looking to purchase or sell, Fruit Market is here to make your experience enjoyable and efficient.
          </p>

          <p>
            Join our community today and enjoy the benefits of fresh, high-quality fruits delivered right to your doorstep. Explore our range of offerings and experience the best of the fruit market.
          </p>
        </div>
        <div className="grid-col grid-col_4">
          <RegisterForm />

          <center>
            <h4>Already a Member?</h4>
            <button className="btn btn_sizeSm" onClick={onLogin}>
              Login
            </button>
          </center>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
