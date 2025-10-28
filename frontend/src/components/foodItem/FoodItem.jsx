



import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const FoodItem = ({id,name,price,description,image}) => {
    const {cartItems,addToCart,removeFromCart,url}=useContext(StoreContext)
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/food/${id}`);
    };

    const handleAddToCartClick = (e) => {
        e.stopPropagation(); 
        addToCart(id);
    };

    const handleRemoveFromCartClick = (e) => {
        e.stopPropagation(); 
        removeFromCart(id);
    };

    return (
        <div className='food-item' onClick={handleCardClick}>
            <div className="food-item-img-container">
                <img className='food-item-image' src={url+"/images/"+image} alt={name} />
                {!cartItems[id]
                ?<img className='add' onClick={handleAddToCartClick} src={assets.add_icon_white} alt="Add to cart" />
                : <div className='food-item-counter'>
                     <img onClick={handleRemoveFromCartClick} src={assets.remove_icon_red} alt="Remove from cart" />
                     <p>{cartItems[id]}</p>
                     <img onClick={handleAddToCartClick} src={assets.add_icon_green} alt="Add more" />
                </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">₹{price}</p>
            </div>
        </div>
    )
}

export default FoodItem

