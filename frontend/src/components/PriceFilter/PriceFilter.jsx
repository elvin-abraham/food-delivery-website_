import React, { useContext, useState } from 'react'
import './PriceFilter.css';
import { StoreContext } from '../../context/StoreContext';

const PriceFilter = () => {
    const { priceFilter, setPriceFilter } = useContext(StoreContext);
    const [localRange, setLocalRange] = useState({ min: priceFilter.min, max: priceFilter.max });

    const handleApplyFilter = () => {
        setPriceFilter({ min: localRange.min, max: localRange.max });
    };

    const handleResetFilter = () => {
        const resetRange = { min: 0, max: 1000 };
        setLocalRange(resetRange);
        setPriceFilter(resetRange);
    };

    return (
        <div className='price-filter'>
            <h3>Filter by Price</h3>
            <div className="price-inputs">
                <div className="input-group">
                    <label>Min Price (₹)</label>
                    <input 
                        type="number" 
                        value={localRange.min} 
                        onChange={(e) => setLocalRange({...localRange, min: Number(e.target.value)})}
                        min="0"
                    />
                </div>
                <div className="input-group">
                    <label>Max Price (₹)</label>
                    <input 
                        type="number" 
                        value={localRange.max} 
                        onChange={(e) => setLocalRange({...localRange, max: Number(e.target.value)})}
                        min="0"
                    />
                </div>
            </div>
            <div className="filter-buttons">
                <button onClick={handleApplyFilter} className="apply-btn">Apply Filter</button>
                <button onClick={handleResetFilter} className="reset-btn">Reset</button>
            </div>
            <div className="current-range">
                Current Range: ₹{priceFilter.min} - ₹{priceFilter.max}
            </div>
        </div>
    )
}

export default PriceFilter;