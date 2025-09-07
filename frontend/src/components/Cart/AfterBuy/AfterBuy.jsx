import React from 'react';
import './AfterBuy.module.css'; // Import the CSS below

const AfterBuy = ({ orderNumber = '123456', total = '99.99', onBackToShop }) => {
  return (
    <div className="orderCompleteContainer">
      <div className="orderCompleteCard">
        <h1>🎉 Thank You!</h1>
        <p>Your order has been successfully placed.</p>

        <div className="orderDetails">
          <p><strong>Order Number:</strong> #{orderNumber}</p>
          <p><strong>Total:</strong> R{total}</p>
          <p><strong>Delivery:</strong> Within 3-5 business days</p>
        </div>

        <button className="backToShopBtn" onClick={onBackToShop}>
          Back to Shop
        </button>
      </div>
    </div>
  );
};

export default AfterBuy;
