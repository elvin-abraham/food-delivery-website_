



// import React, { useContext, useEffect, useState } from "react";
// import {useNavigate} from 'react-router-dom';
// import "./PlaceOrder.css";
// import { StoreContext } from "../../context/StoreContext";
// import axios from "axios";

// const PlaceOrder = () => {
//   const { 
//     getTotalCartAmount, 
//     token, 
//     food_list, 
//     cartItems, 
//     url,
//     appliedCoupon,
//     getTotalWithDiscount,
//     getDiscountAmount
//   } = useContext(StoreContext);

//   const [data, setData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     zipcode: "",
//     country: "",
//     phone: "",
//   });

//   const subtotal = getTotalCartAmount();
//   const delivery = subtotal === 0 ? 0 : 2;
//   const discount = getDiscountAmount();
//   const total = getTotalWithDiscount();

//   const onChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   const placeOrder = async (e) => {
//     e.preventDefault();

//     const orderItems = [];
//     food_list.forEach((item) => {
//       if (cartItems[item._id] > 0) {
//         orderItems.push({
//           ...item,
//           quantity: cartItems[item._id],
//         });
//       }
//     });

//     // Stripe needs at least ₹50 - use discounted total
//     if (total < 50) {
//       alert("Minimum order amount after discount is ₹50.");
//       return;
//     }

//     const orderData = {
//       address: data,
//       items: orderItems,
//       amount: subtotal,
//       couponCode: appliedCoupon ? appliedCoupon.code : "",
//       discountAmount: discount,
//       finalAmount: total - delivery // Subtract delivery for the actual food amount
//     };

//     try {
//       const res = await axios.post(`${url}/api/order/place`, orderData, {
//         headers: { token },
//       });

//       if (res.data.success) {
//         window.location.replace(res.data.session_url);
//       } else {
//         alert(res.data.message || "Payment session could not be created");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong. Please try again.");
//     }
//   };

//   const navigate= useNavigate();

//   useEffect(()=>{
//      if(!token){
//        navigate('/cart')
//      }else if(getTotalCartAmount()==0){
//       navigate('/cart')
//      }
//   },[token])

//   return (
//     <form onSubmit={placeOrder} className="place-order">
//       {/* ---- Delivery Info ---- */}
//       <div className="place-order-left">
//         <p className="title">Delivery Information</p>
//         <div className="multi-feilds">
//           <input
//             required
//             name="firstName"
//             value={data.firstName}
//             onChange={onChangeHandler}
//             type="text"
//             placeholder="First Name"
//           />
//           <input
//             required
//             name="lastName"
//             value={data.lastName}
//             onChange={onChangeHandler}
//             type="text"
//             placeholder="Last Name"
//           />
//         </div>
//         <input
//           required
//           name="email"
//           value={data.email}
//           onChange={onChangeHandler}
//           type="email"
//           placeholder="Email address"
//         />
//         <input
//           required
//           name="street"
//           value={data.street}
//           onChange={onChangeHandler}
//           type="text"
//           placeholder="Street"
//         />
//         <div className="multi-feilds">
//           <input
//             required
//             name="city"
//             value={data.city}
//             onChange={onChangeHandler}
//             type="text"
//             placeholder="City"
//           />
//           <input
//             required
//             name="state"
//             value={data.state}
//             onChange={onChangeHandler}
//             type="text"
//             placeholder="State"
//           />
//         </div>
//         <div className="multi-feilds">
//           <input
//             required
//             name="zipcode"
//             value={data.zipcode}
//             onChange={onChangeHandler}
//             type="text"
//             placeholder="Zip code"
//           />
//           <input
//             required
//             name="country"
//             value={data.country}
//             onChange={onChangeHandler}
//             type="text"
//             placeholder="Country"
//           />
//         </div>
//         <input
//           required
//           name="phone"
//           value={data.phone}
//           onChange={onChangeHandler}
//           type="text"
//           placeholder="Phone"
//         />
//       </div>

//       {/* ---- Cart Totals ---- */}
//       <div className="place-order-right">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div className="cart-total-details">
//             <p>Subtotal</p>
//             <p>₹{subtotal}</p>
//           </div>
//           <hr />
//           <div className="cart-total-details">
//             <p>Delivery Fee</p>
//             <p>₹{delivery}</p>
//           </div>
//           <hr />
//           {appliedCoupon && (
//             <>
//               <div className="cart-total-details discount">
//                 <p>Discount ({appliedCoupon.discountPercent}% off)</p>
//                 <p>- ₹{discount}</p>
//               </div>
//               <hr />
//             </>
//           )}
//           <div className="cart-total-details">
//             <b>Total</b>
//             <b>₹{total}</b>
//           </div>
          
//           {appliedCoupon && (
//             <div className="applied-coupon-info">
//               <p>Coupon Applied: <strong>{appliedCoupon.code}</strong></p>
//             </div>
//           )}
//         </div>
//         <button type="submit" className="proceed-to-payment">PROCEED TO PAYMENT</button>
//       </div>
//     </form>
//   );
// };

// export default PlaceOrder;


//......................................********..................................................................


// import React, { useContext, useEffect, useState } from "react";
// import {useNavigate} from 'react-router-dom';
// import "./PlaceOrder.css";
// import { StoreContext } from "../../context/StoreContext";
// import axios from "axios";

// const PlaceOrder = () => {
//   const { 
//     getTotalCartAmount, 
//     token, 
//     food_list, 
//     cartItems, 
//     url,
//     appliedCoupon,
//     getTotalWithDiscount,
//     getDiscountAmount,
//     getUserProfile
//   } = useContext(StoreContext);

//   const [loading, setLoading] = useState(false);
//   const [userProfile, setUserProfile] = useState(null);

//   const [data, setData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     zipcode: "",
//     country: "India",
//     phone: "",
//   });

//   // Fetch user profile data
//   const fetchUserProfile = async () => {
//     if (token) {
//       try {
//         setLoading(true);
//         const profile = await getUserProfile();
//         if (profile) {
//           setUserProfile(profile);
          
//           // Split full name into first and last name
//           const nameParts = profile.name ? profile.name.split(' ') : ['', ''];
//           const firstName = nameParts[0] || '';
//           const lastName = nameParts.slice(1).join(' ') || '';
          
//           // Auto-fill the form with profile data
//           setData({
//             firstName: firstName,
//             lastName: lastName,
//             email: profile.email || "",
//             street: profile.address || "",
//             city: profile.city || "",
//             state: profile.state || "",
//             zipcode: profile.zipCode || "",
//             country: "India",
//             phone: profile.phone || "",
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching user profile:', error);
//         // Try to get from localStorage as fallback
//         try {
//           const storedProfile = localStorage.getItem('userProfileData');
//           if (storedProfile) {
//             const profileData = JSON.parse(storedProfile);
//             setUserProfile(profileData);
            
//             const nameParts = profileData.name ? profileData.name.split(' ') : ['', ''];
//             const firstName = nameParts[0] || '';
//             const lastName = nameParts.slice(1).join(' ') || '';
            
//             setData({
//               firstName: firstName,
//               lastName: lastName,
//               email: profileData.email || "",
//               street: profileData.address || "",
//               city: profileData.city || "",
//               state: profileData.state || "",
//               zipcode: profileData.zipCode || "",
//               country: "India",
//               phone: profileData.phone || "",
//             });
//           }
//         } catch (localStorageError) {
//           console.error('Error reading from localStorage:', localStorageError);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
//   }, [token]);

//   const subtotal = getTotalCartAmount();
//   const deliveryFee = subtotal === 0 ? 0 : 2;
//   const discount = getDiscountAmount();
//   const total = getTotalWithDiscount();

//   const onChangeHandler = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//   };

//   const placeOrder = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const orderItems = [];
//     food_list.forEach((item) => {
//       if (cartItems[item._id] > 0) {
//         orderItems.push({
//           ...item,
//           quantity: cartItems[item._id],
//         });
//       }
//     });

//     // Stripe needs at least ₹50 - use discounted total
//     if (total < 50) {
//       alert("Minimum order amount after discount is ₹50.");
//       setLoading(false);
//       return;
//     }

//     const orderData = {
//       address: data,
//       items: orderItems,
//       amount: subtotal,
//       couponCode: appliedCoupon ? appliedCoupon.code : "",
//       discountAmount: discount,
//       finalAmount: total - deliveryFee // Subtract delivery for the actual food amount
//     };

//     try {
//       const res = await axios.post(`${url}/api/order/place`, orderData, {
//         headers: { token },
//       });

//       if (res.data.success) {
//         window.location.replace(res.data.session_url);
//       } else {
//         alert(res.data.message || "Payment session could not be created");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) {
//       navigate('/cart')
//     } else if (getTotalCartAmount() === 0) {
//       navigate('/cart')
//     }
//   }, [token])

//   return (
//     <form onSubmit={placeOrder} className="place-order">
//       {/* ---- Delivery Info ---- */}
//       <div className="place-order-left">
//         <p className="title">Delivery Information</p>
//         <div className="delivery-notice">
//           <p>💡 Your profile information has been auto-filled. You can modify any details below.</p>
//         </div>
        
//         {loading && (
//           <div className="loading-indicator">
//             Loading your profile information...
//           </div>
//         )}
        
//         <div className="multi-fields">
//           <div className="field-group">
//             <label>First Name *</label>
//             <input
//               required
//               name="firstName"
//               value={data.firstName}
//               onChange={onChangeHandler}
//               type="text"
//               placeholder="First Name"
//             />
//           </div>
//           <div className="field-group">
//             <label>Last Name *</label>
//             <input
//               required
//               name="lastName"
//               value={data.lastName}
//               onChange={onChangeHandler}
//               type="text"
//               placeholder="Last Name"
//             />
//           </div>
//         </div>
        
//         <div className="field-group">
//           <label>Email Address *</label>
//           <input
//             required
//             name="email"
//             value={data.email}
//             onChange={onChangeHandler}
//             type="email"
//             placeholder="Email address"
//           />
//         </div>
        
//         <div className="field-group">
//           <label>Street Address *</label>
//           <input
//             required
//             name="street"
//             value={data.street}
//             onChange={onChangeHandler}
//             type="text"
//             placeholder="Full street address"
//           />
//         </div>
        
//         <div className="multi-fields">
//           <div className="field-group">
//             <label>City *</label>
//             <input
//               required
//               name="city"
//               value={data.city}
//               onChange={onChangeHandler}
//               type="text"
//               placeholder="City"
//             />
//           </div>
//           <div className="field-group">
//             <label>State *</label>
//             <input
//               required
//               name="state"
//               value={data.state}
//               onChange={onChangeHandler}
//               type="text"
//               placeholder="State"
//             />
//           </div>
//         </div>
        
//         <div className="multi-fields">
//           <div className="field-group">
//             <label>ZIP Code *</label>
//             <input
//               required
//               name="zipcode"
//               value={data.zipcode}
//               onChange={onChangeHandler}
//               type="text"
//               placeholder="ZIP code"
//             />
//           </div>
//           <div className="field-group">
//             <label>Country *</label>
//             <input
//               required
//               name="country"
//               value={data.country}
//               onChange={onChangeHandler}
//               type="text"
//               placeholder="Country"
//             />
//           </div>
//         </div>
        
//         <div className="field-group">
//           <label>Phone Number *</label>
//           <input
//             required
//             name="phone"
//             value={data.phone}
//             onChange={onChangeHandler}
//             type="text"
//             placeholder="Phone number"
//           />
//         </div>
//       </div>

//       {/* ---- Cart Totals ---- */}
//       <div className="place-order-right">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div className="cart-total-details">
//             <p>Subtotal</p>
//             <p>₹{subtotal}</p>
//           </div>
//           <hr />
//           <div className="cart-total-details">
//             <p>Delivery Fee</p>
//             <p>₹{deliveryFee}</p>
//           </div>
//           <hr />
//           {appliedCoupon && (
//             <>
//               <div className="cart-total-details discount">
//                 <p>Discount ({appliedCoupon.discountPercent}% off)</p>
//                 <p>- ₹{discount}</p>
//               </div>
//               <hr />
//             </>
//           )}
//           <div className="cart-total-details">
//             <b>Total</b>
//             <b>₹{total}</b>
//           </div>
          
//           {appliedCoupon && (
//             <div className="applied-coupon-info">
//               <p>Coupon Applied: <strong>{appliedCoupon.code}</strong></p>
//             </div>
//           )}
//         </div>
//         <button 
//           type="submit" 
//           className="proceed-to-payment" 
//           disabled={loading}
//         >
//           {loading ? 'Processing...' : 'PROCEED TO PAYMENT'}
//         </button>
        
//         <div className="order-note">
//           <p>By placing your order, you agree to our terms and conditions.</p>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PlaceOrder;


//..................................................................................................................


import React, { useContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const PlaceOrder = () => {
  const { 
    getTotalCartAmount, 
    token, 
    food_list, 
    cartItems, 
    url,
    appliedCoupon,
    getTotalWithDiscount,
    getDiscountAmount,
    getUserProfile
  } = useContext(StoreContext);

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
    phone: "",
  });

  // Get user data from multiple sources with priority
  const getUserDataFromAllSources = () => {
    let userData = null;
    
    // 1. Try localStorage first (most reliable)
    try {
      const storedProfile = localStorage.getItem('userProfileData');
      if (storedProfile) {
        userData = JSON.parse(storedProfile);
        console.log('Found user data in localStorage:', userData);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    
    // 2. If no localStorage data, try to extract from token
    if (!userData && token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        userData = {
          name: tokenData.name || '',
          email: tokenData.email || '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: ''
        };
        console.log('Extracted user data from token:', userData);
      } catch (tokenError) {
        console.error('Error parsing token:', tokenError);
      }
    }
    
    return userData;
  };

  // Auto-fill form with user data
  const autoFillForm = (profileData) => {
    if (!profileData) return;
    
    console.log('Auto-filling form with:', profileData);
    
    // Split full name into first and last name
    const nameParts = profileData.name ? profileData.name.trim().split(' ') : ['', ''];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    setData(prev => ({
      ...prev,
      firstName: firstName || prev.firstName,
      lastName: lastName || prev.lastName,
      email: profileData.email || prev.email,
      street: profileData.address || prev.street,
      city: profileData.city || prev.city,
      state: profileData.state || prev.state,
      zipcode: profileData.zipCode || prev.zipcode,
      phone: profileData.phone || prev.phone,
    }));
  };

  // Fetch user profile data with multiple fallbacks
  const fetchUserProfile = async () => {
    setProfileLoading(true);
    
    // First, try to get data from immediate sources (localStorage, token)
    const immediateUserData = getUserDataFromAllSources();
    if (immediateUserData) {
      autoFillForm(immediateUserData);
      setUserProfile(immediateUserData);
    }

    // Then try API if we have token
    if (token) {
      try {
        console.log('Fetching profile from API...');
        const profile = await getUserProfile();
        if (profile) {
          console.log('API profile response:', profile);
          setUserProfile(profile);
          autoFillForm(profile);
          
          // Also update localStorage with fresh API data
          try {
            localStorage.setItem('userProfileData', JSON.stringify(profile));
          } catch (localError) {
            console.error('Error updating localStorage:', localError);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile from API:', error);
        // If API fails, we already have data from immediate sources
      }
    }
    
    setProfileLoading(false);
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]);

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const discount = getDiscountAmount();
  const total = getTotalWithDiscount();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'phone'];
    const missingFields = requiredFields.filter(field => !data[field].trim());
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    const orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id],
        });
      }
    });

    // Stripe needs at least ₹50 - use discounted total
    if (total < 50) {
      alert("Minimum order amount after discount is ₹50.");
      setLoading(false);
      return;
    }

    const orderData = {
      address: data,
      items: orderItems,
      amount: subtotal,
      couponCode: appliedCoupon ? appliedCoupon.code : "",
      discountAmount: discount,
      finalAmount: total - deliveryFee
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
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/cart')
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token]);

  // Debug: Log current state
  useEffect(() => {
    console.log('Current form data:', data);
    console.log('User profile:', userProfile);
    console.log('Token exists:', !!token);
  }, [data, userProfile, token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      {/* ---- Delivery Info ---- */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        
        {profileLoading ? (
          <div className="loading-indicator">
            Loading your profile information...
          </div>
        ) : userProfile ? (
          <div className="delivery-notice success">
            {/* <p>✅ Your profile information has been auto-filled. You can modify any details below.</p> */}
          </div>
        ) : (
          <div className="delivery-notice info">
            <p>ℹ Please fill in your delivery information. Save your details in your profile for faster checkout next time!</p>
          </div>
        )}
        
        <div className="multi-fields">
          <div className="field-group">
            <label>First Name *</label>
            <input
              required
              name="firstName"
              value={data.firstName}
              onChange={onChangeHandler}
              type="text"
              placeholder="First Name"
            />
          </div>
          <div className="field-group">
            <label>Last Name *</label>
            <input
              required
              name="lastName"
              value={data.lastName}
              onChange={onChangeHandler}
              type="text"
              placeholder="Last Name"
            />
          </div>
        </div>
        
        <div className="field-group">
          <label>Email Address *</label>
          <input
            required
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            type="email"
            placeholder="Email address"
          />
        </div>
        
        <div className="field-group">
          <label>Street Address *</label>
          <input
            required
            name="street"
            value={data.street}
            onChange={onChangeHandler}
            type="text"
            placeholder="Full street address"
          />
        </div>
        
        <div className="multi-fields">
          <div className="field-group">
            <label>City *</label>
            <input
              required
              name="city"
              value={data.city}
              onChange={onChangeHandler}
              type="text"
              placeholder="City"
            />
          </div>
          <div className="field-group">
            <label>State *</label>
            <input
              required
              name="state"
              value={data.state}
              onChange={onChangeHandler}
              type="text"
              placeholder="State"
            />
          </div>
        </div>
        
        <div className="multi-fields">
          <div className="field-group">
            <label>ZIP Code *</label>
            <input
              required
              name="zipcode"
              value={data.zipcode}
              onChange={onChangeHandler}
              type="text"
              placeholder="ZIP code"
            />
          </div>
          <div className="field-group">
            <label>Country *</label>
            <input
              required
              name="country"
              value={data.country}
              onChange={onChangeHandler}
              type="text"
              placeholder="Country"
            />
          </div>
        </div>
        
        <div className="field-group">
          <label>Phone Number *</label>
          <input
            required
            name="phone"
            value={data.phone}
            onChange={onChangeHandler}
            type="text"
            placeholder="Phone number"
          />
        </div>
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
            <p>₹{deliveryFee}</p>
          </div>
          <hr />
          {appliedCoupon && (
            <>
              <div className="cart-total-details discount">
                <p>Discount ({appliedCoupon.discountPercent}% off)</p>
                <p>- ₹{discount}</p>
              </div>
              <hr />
            </>
          )}
          <div className="cart-total-details">
            <b>Total</b>
            <b>₹{total}</b>
          </div>
          
          {appliedCoupon && (
            <div className="applied-coupon-info">
              <p>Coupon Applied: <strong>{appliedCoupon.code}</strong></p>
            </div>
          )}
        </div>
        <button 
          type="submit" 
          className="proceed-to-payment" 
          disabled={loading || profileLoading}
        >
          {loading ? 'Processing...' : profileLoading ? 'Loading...' : 'PROCEED TO PAYMENT'}
        </button>
        
        <div className="order-note">
          <p>By placing your order, you agree to our terms and conditions.</p>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;