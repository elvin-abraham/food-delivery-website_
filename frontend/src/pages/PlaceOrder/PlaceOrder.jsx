

import React, { useContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // ✅ Calculate these ON EVERY RENDER so JSX can use them
  const subtotal = getTotalCartAmount();
  const delivery = subtotal === 0 ? 0 : 2;
  const total = subtotal + delivery;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    const orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id],
        });
      }
    });

    // ✅ Stripe needs at least ₹50
    if (total < 50) {
      alert("Minimum order amount is ₹50.");
      return;
    }

    const orderData = {
      address: data,
      items: orderItems,
      amount: total,
    };

    try {
      const res = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (res.data.success) {
        window.location.replace(res.data.session_url);
      } else {
        alert(res.data.message || "Payment session could not be created");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  const navigate= useNavigate();

  useEffect(()=>{
     if(!token){
       navigate('/cart')
     }else if(getTotalCartAmount()==0){
      navigate('/cart')
     }
  },[token])

  return (
    <form onSubmit={placeOrder} className="place-order">
      {/* ---- Delivery Info ---- */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-feilds">
          <input
            required
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          type="text"
          placeholder="Street"
        />
        <div className="multi-feilds">
          <input
            required
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-feilds">
          <input
            required
            name="zipcode"
            value={data.zipcode}
            onChange={onChangeHandler}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          type="text"
          placeholder="Phone"
        />
      </div>

      {/* ---- Cart Totals ---- */}
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{subtotal}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{delivery}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>₹{total}</b>
          </div>
        </div>
        <button type="submit" className="proceed-to-payment">PROCEED TO PAYMENT</button>
      </div>
    </form>
  );
};

export default PlaceOrder;