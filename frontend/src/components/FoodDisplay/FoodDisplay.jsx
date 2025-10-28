


import React, { useContext } from 'react'
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../foodItem/FoodItem';
import PriceFilter from '../PriceFilter/PriceFilter'; // Import the new component

const FoodDisplay = ({category}) => {
    const { getFilteredFoodList } = useContext(StoreContext);
    const filtered_food_list = getFilteredFoodList();

    return (
        <div className='food-display' id='food-display'>
            <h2>Top dishes near you</h2>
            
            {/* Add Price Filter Component */}
            <PriceFilter />
            
            <div className="food-display-list">
                {filtered_food_list.map((item,index)=>{
                    if(category==="All" || category===item.category){
                        return <FoodItem 
                            key={index} 
                            id={item._id} 
                            name={item.name} 
                            description={item.description} 
                            price={item.price} 
                            image={item.image} 
                        />    
                    }
                    return null;
                })}
                
                {/* Show message when no items match filters */}
                {filtered_food_list.filter(item => 
                    category==="All" || category===item.category
                ).length === 0 && (
                    <div className="no-items-message">
                        <p>No food items found matching your criteria.</p>
                        <p>Try adjusting your filters or category selection.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FoodDisplay;
