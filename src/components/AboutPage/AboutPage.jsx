import React from 'react';
import './AboutPage.css';
// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  return (
    <div className="container">
      <div>
        <h2>About Fruit Market</h2>
        <p>Welcome to Fruit Market, the primary destination for buying and selling fresh and high-quality fruits. Whether you're a fruit enthusiast or a seller, we provide a seamless platform to connect with others and enjoy a variety of delicious fruits.</p>
        <h3>Our Mission</h3>
        <p>Our mission at Fruit Market is to make it easy for you to buy and sell fruits in a user-friendly and efficient manner. We focus on providing real-time pricing, detailed information, and a smooth transaction experience for a range of popular fruits.</p>
        <h3>What We Offer</h3>
        <p><strong>Fresh Apples:</strong> Discover a variety of apples, from sweet and crisp to tart and juicy. Our apples come from trusted suppliers to ensure top quality.</p>
        <p><strong>Bananas:</strong> Enjoy the convenience and taste of bananas that are perfect for snacking or adding to your favorite recipes. We offer a range of ripeness options to suit your needs.</p>
        <p><strong>Juicy Grapes:</strong> Our grapes are selected for their freshness and sweetness. Whether you prefer red, green, or black grapes, you'll find them at their best.</p>
        <p><strong>Sweet Oranges:</strong> Experience the refreshing taste of oranges that are ideal for a healthy snack or a glass of fresh juice. We ensure our oranges are juicy and flavorful.</p>
        <p><strong>Real-Time Pricing:</strong> Stay informed with up-to-date market prices for all our available fruits. We provide real-time updates to help you make the best buying and selling decisions.</p>
        <p><strong>Easy Transactions:</strong> Our platform makes buying and selling fruits straightforward with just a few clicks. Manage your purchases and sales efficiently.</p>
        <p><strong>Intuitive Interface:</strong> Enjoy a clean and easy-to-navigate interface whether you're on a desktop or mobile device.</p>
        <h3>Join Our Community</h3>
        <p>Become part of the Fruit Market community today. Whether you're looking for fresh apples, bananas, grapes, or oranges, or you want to sell your own produce, Fruit Market is here to help you connect and succeed.</p>
        <div className="card">
        <h3 className="card-title">What's Next</h3>
        <ul className="card-content">
          <li>Mobile Optimization</li>
          <li>Advanced Filtering Options</li>
          <li>Expanded Fruit Selection</li>
          <li>Enhanced User Profiles</li>
        </ul>
      </div>

      <div className="card">
        <h3 className="card-title">Technologies Used</h3>
        <ul className="card-content">
        <li>HTML</li>
        <li>CSS</li>
        <li>Javascript</li>
        <li>React/Redux</li>
        <li>Redux Saga</li>
        <li>REST API</li>
        <li>Node.js</li>
        <li>PostgreSQL</li>
        <li>Express.js</li>
        </ul>
      </div>

      <div className="card">
        <div className="card-body">
          <h3>Connect with me on LinkedIn</h3>
        <img src="IMG_8545F75B5B26-1.jpeg" alt="" className="qr-code" />
        </div>
      </div>
    </div>
  </div>
);
};

export default AboutPage;
