


// import axios from "axios";
// import { createContext, useEffect, useState } from "react";


// export const StoreContext = createContext(null);

// const StoreContextProvider = (props) => {
//     const [cartItems, setCartItems] = useState({})
//     const url="http://localhost:4000"
//     const [token,setToken]=useState("");
//     const [food_list,setFoodList]=useState([])
//     const [priceFilter, setPriceFilter] = useState({ min: 0, max: 1000 }); // Add price filter state
//     const [appliedCoupon, setAppliedCoupon] = useState(null); // Add coupon state


//     const addToCart = async (itemId) => {
//         if (!cartItems[itemId]) {
//             setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
//         } else {
//             setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
//         }
//         if (token) {
//             await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
//         }
//     }

//     const removeFromCart =async (itemId) => {
//         setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
//         if (token) {
//             await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
//         }
//     }

//     const getTotalCartAmount = () => {
//         let totalAmount = 0;
//         for (const item in cartItems) {
//             if (cartItems[item] > 0) {
//                 let itemInfo = food_list.find((product) => product._id === item);
//                 totalAmount += itemInfo.price * cartItems[item];
//             }
//         }
//         return totalAmount;
//     }

//     const fetchFoodList=async ()=>{
//         const resposne=await axios.get(url+"/api/food/list");
//         setFoodList(resposne.data.data)
//     }

//     const loadCartData= async (token)=>{
//         const response=await axios.post(url+"/api/cart/get",{},{headers:{token}})
//         setCartItems(response.data.cartData)
//     }

//     // Get filtered food list based on price range
//     const getFilteredFoodList = () => {
//         return food_list.filter(item => 
//             item.price >= priceFilter.min && item.price <= priceFilter.max
//         );
//     }

//     useEffect(() => {
//         async function loadData() {
//             await fetchFoodList();
//             if (localStorage.getItem("token")) {
//                 setToken(localStorage.getItem("token"));
//                 await loadCartData(localStorage.getItem("token"));
//             }
//         }
//         loadData();
//     }, []);


//       // Apply coupon function
//     const applyCoupon = async (couponCode) => {
//         try {
//             const response = await axios.post(url + "/api/coupon/validate", {
//                 code: couponCode,
//                 userId: token ? JSON.parse(atob(token.split('.')[1])).id : null,
//                 orderAmount: getTotalCartAmount()
//             }, { headers: { token } });

//             if (response.data.success) {
//                 setAppliedCoupon(response.data.coupon);
//                 return { success: true, message: response.data.message, coupon: response.data.coupon };
//             } else {
//                 return { success: false, message: response.data.message };
//             }
//         } catch (error) {
//             console.log(error);
//             return { success: false, message: "Error applying coupon" };
//         }
//     }


//      // Remove coupon function
//     const removeCoupon = () => {
//         setAppliedCoupon(null);
//     }



//     // Calculate total with discount
//     const getTotalWithDiscount = () => {
//         const subtotal = getTotalCartAmount();
//         const delivery = subtotal === 0 ? 0 : 2;
        
//         if (appliedCoupon) {
//             return appliedCoupon.finalAmount + delivery;
//         }
        
//         return subtotal + delivery;
//     }


//     // Get discount amount
//     const getDiscountAmount = () => {
//         return appliedCoupon ? appliedCoupon.discountAmount : 0;
//     }


//      // Add review function
//     const addReview = async (foodId, rating, comment) => {
//         try {
//             const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
//             const response = await axios.post(url + "/api/review/add", {
//                 foodId,
//                 userId: user.id,
//                 userName: user.name || "User",
//                 rating,
//                 comment
//             }, { headers: { token } });

//             if (response.data.success) {
//                 // Refresh food list to get updated ratings
//                 await fetchFoodList();
//                 return { success: true, message: response.data.message, review: response.data.review };
//             } else {
//                 return { success: false, message: response.data.message };
//             }
//         } catch (error) {
//             console.log(error);
//             return { success: false, message: "Error adding review" };
//         }
//     }


//      // Get reviews for a food item
//     const getFoodReviews = async (foodId) => {
//         try {
//             const response = await axios.get(`${url}/api/review/food/${foodId}`);
//             if (response.data.success) {
//                 return response.data.data;
//             }
//             return [];
//         } catch (error) {
//             console.log(error);
//             return [];
//         }
//     }


//     // Get user's review for a food item
//     const getUserReview = async (foodId) => {
//         if (!token) return null;
        
//         try {
//             const user = JSON.parse(atob(token.split('.')[1]));
//             const response = await axios.get(`${url}/api/review/user/${foodId}/${user.id}`);
//             if (response.data.success) {
//                 return response.data.data;
//             }
//             return null;
//         } catch (error) {
//             console.log(error);
//             return null;
//         }
//     }


//     // Delete review function
// const deleteReview = async (reviewId) => {
//     try {
//         const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
//         const response = await axios.delete(`${url}/api/review/delete/${reviewId}`, {
//             data: { userId: user.id },
//             headers: { token }
//         });

//         if (response.data.success) {
//             return { success: true, message: response.data.message };
//         } else {
//             return { success: false, message: response.data.message };
//         }
//     } catch (error) {
//         console.log(error);
//         return { success: false, message: "Error deleting review" };
//     }
// }




// // Get user profile function
// const getUserProfile = async () => {
//     try {
//         const response = await axios.get(`${url}/api/user/profile`, { headers: { token } });
//         if (response.data.success) {
//             return response.data.user;
//         }
//         return null;
//     } catch (error) {
//         console.error('Error fetching user profile:', error);
//         return null;
//     }
// }

// // Update user profile function
// const updateUserProfile = async (userData) => {
//     try {
//         const response = await axios.put(`${url}/api/user/profile`, userData, { headers: { token } });
//         return response.data;
//     } catch (error) {
//         console.error('Error updating user profile:', error);
//         return { success: false, message: "Error updating profile" };
//     }
// }




//     const contextValue = {
//         food_list,
//         cartItems,
//         setCartItems,
//         addToCart,
//         removeFromCart,
//         getTotalCartAmount,
//         url,
//         token,
//         setToken,
//         priceFilter, // Add to context
//         setPriceFilter, // Add to context
//         getFilteredFoodList, // Add to context
//         appliedCoupon, // Add to context
//         applyCoupon, // Add to context
//         removeCoupon, // Add to context
//         getTotalWithDiscount, // Add to context
//         getDiscountAmount, // Add to context
//            addReview, // Add to context
//         getFoodReviews, // Add to context
//         getUserReview,
//          deleteReview,
//          getUserProfile,
//          updateUserProfile


//     }

//     return (
//         <StoreContext.Provider value={contextValue}>
//             {props.children}
//         </StoreContext.Provider>
//     )
// }

// export default StoreContextProvider;


//..................................****************.............................................................



import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({})
    const url = "http://localhost:4000"
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([])
    const [priceFilter, setPriceFilter] = useState({ min: 0, max: 1000 });
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            try {
                await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } })
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            try {
                await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } })
            } catch (error) {
                console.error("Error removing from cart:", error);
            }
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data)
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    }

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } })
            setCartItems(response.data.cartData)
        } catch (error) {
            console.error("Error loading cart data:", error);
        }
    }

    // Get filtered food list based on price range
    const getFilteredFoodList = () => {
        return food_list.filter(item =>
            item.price >= priceFilter.min && item.price <= priceFilter.max
        );
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                const storedToken = localStorage.getItem("token");
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, []);

    // Apply coupon function
    const applyCoupon = async (couponCode) => {
        try {
            const response = await axios.post(url + "/api/coupon/validate", {
                code: couponCode,
                userId: token ? JSON.parse(atob(token.split('.')[1])).id : null,
                orderAmount: getTotalCartAmount()
            }, { headers: { token } });

            if (response.data.success) {
                setAppliedCoupon(response.data.coupon);
                return { success: true, message: response.data.message, coupon: response.data.coupon };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "Error applying coupon" };
        }
    }

    // Remove coupon function
    const removeCoupon = () => {
        setAppliedCoupon(null);
    }

    // Calculate total with discount
    const getTotalWithDiscount = () => {
        const subtotal = getTotalCartAmount();
        const delivery = subtotal === 0 ? 0 : 2;

        if (appliedCoupon) {
            return appliedCoupon.finalAmount + delivery;
        }

        return subtotal + delivery;
    }

    // Get discount amount
    const getDiscountAmount = () => {
        return appliedCoupon ? appliedCoupon.discountAmount : 0;
    }

    // Add review function
    const addReview = async (foodId, rating, comment) => {
        try {
            const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
            const response = await axios.post(url + "/api/review/add", {
                foodId,
                userId: user.id,
                userName: user.name || "User",
                rating,
                comment
            }, { headers: { token } });

            if (response.data.success) {
                // Refresh food list to get updated ratings
                await fetchFoodList();
                return { success: true, message: response.data.message, review: response.data.review };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "Error adding review" };
        }
    }

    // Get reviews for a food item
    const getFoodReviews = async (foodId) => {
        try {
            const response = await axios.get(`${url}/api/review/food/${foodId}`);
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    // Get user's review for a food item
    const getUserReview = async (foodId) => {
        if (!token) return null;

        try {
            const user = JSON.parse(atob(token.split('.')[1]));
            const response = await axios.get(`${url}/api/review/user/${foodId}/${user.id}`);
            if (response.data.success) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Delete review function
    const deleteReview = async (reviewId) => {
        try {
            const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
            const response = await axios.delete(`${url}/api/review/delete/${reviewId}`, {
                data: { userId: user.id },
                headers: { token }
            });

            if (response.data.success) {
                return { success: true, message: response.data.message };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "Error deleting review" };
        }
    }

    // Get user profile function
    const getUserProfile = async () => {
        try {
            const response = await axios.get(`${url}/api/user/profile`, { headers: { token } });
            if (response.data.success) {
                return response.data.user;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error; // Important: throw error to handle in component
        }
    }

    // Update user profile function
    const updateUserProfile = async (userData) => {
        try {
            const response = await axios.put(`${url}/api/user/profile`, userData, { headers: { token } });
            return response.data;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error; // Important: throw error to handle in component
        }
    }

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        priceFilter,
        setPriceFilter,
        getFilteredFoodList,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        getTotalWithDiscount,
        getDiscountAmount,
        addReview,
        getFoodReviews,
        getUserReview,
        deleteReview,
        getUserProfile,
        updateUserProfile
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;