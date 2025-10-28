


import React, { useContext, useState } from 'react'
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { 
    cartItems, 
    food_list, 
    removeFromCart, 
    getTotalCartAmount, 
    url,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getTotalWithDiscount,
    getDiscountAmount
  } = useContext(StoreContext);

  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoMessage('Please enter a promo code');
      return;
    }

    const result = await applyCoupon(promoCode);
    setPromoMessage(result.message);
    
    if (result.success) {
      setPromoCode('');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setPromoMessage('');
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const discount = getDiscountAmount();
  const total = getTotalWithDiscount();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className='cart-items-title cart-items-item'>
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>Rs.{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>Rs.{item.price * cartItems[item._id]}</p>
                  <p className='cross' onClick={() => removeFromCart(item._id)}>x</p>
                </div>
                <hr />
              </div>
            )
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>Rs.{subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>Rs.{deliveryFee}</p>
            </div>
            <hr />
            {appliedCoupon && (
              <>
                <div className="cart-total-details discount">
                  <p>Discount ({appliedCoupon.discountPercent}% off)</p>
                  <p>- Rs.{discount}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-total-details">
              <b>Total</b>
              <b>Rs.{total}</b>
            </div>
          </div>
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, enter it here</p>
            {appliedCoupon ? (
              <div className="applied-coupon">
                <p>Applied: {appliedCoupon.code} ({appliedCoupon.discountPercent}% off)</p>
                <button onClick={handleRemoveCoupon} className="remove-coupon">Remove</button>
              </div>
            ) : (
              <div className='cart-promocode-input'>
                <input 
                  type="text" 
                  placeholder='Promo code' 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyPromo()}
                />
                <button onClick={handleApplyPromo}>Apply</button>
              </div>
            )}
            {promoMessage && (
              <p className={`promo-message ${appliedCoupon ? 'success' : 'error'}`}>
                {promoMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart