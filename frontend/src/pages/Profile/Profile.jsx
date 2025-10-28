


// import React, { useContext, useState, useEffect } from 'react';
// import { StoreContext } from '../../context/StoreContext';
// import { assets } from '../../assets/assets';
// import './Profile.css';

// const Profile = () => {
//     const { token, getUserProfile, updateUserProfile } = useContext(StoreContext);
//     const [loading, setLoading] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [fetchLoading, setFetchLoading] = useState(true);
    
//     const [userData, setUserData] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         address: '',
//         city: '',
//         state: '',
//         zipCode: ''
//     });

//     // Fetch user data from database with fallback
//     useEffect(() => {
//         const fetchUserData = async () => {
//             if (token) {
//                 try {
//                     setFetchLoading(true);
                    
//                     // First try to get from API
//                     try {
//                         const user = await getUserProfile();
//                         if (user) {
//                             setUserData({
//                                 name: user.name || '',
//                                 email: user.email || '',
//                                 phone: user.phone || '',
//                                 address: user.address || '',
//                                 city: user.city || '',
//                                 state: user.state || '',
//                                 zipCode: user.zipCode || ''
//                             });
//                             return; // Success, exit function
//                         }
//                     } catch (apiError) {
//                         console.log('API call failed, using fallback:', apiError);
//                     }
                    
//                     // Fallback: Try to get from localStorage
//                     const storedUserData = localStorage.getItem('userData');
//                     if (storedUserData) {
//                         const parsedData = JSON.parse(storedUserData);
//                         setUserData(prev => ({
//                             ...prev,
//                             name: parsedData.name || 'User Name',
//                             email: parsedData.email || 'user@example.com'
//                         }));
//                     } else {
//                         // Final fallback: Extract from JWT token
//                         try {
//                             const tokenData = JSON.parse(atob(token.split('.')[1]));
//                             setUserData(prev => ({
//                                 ...prev,
//                                 name: tokenData.name || 'Please log out and log back in',
//                                 email: tokenData.email || 'Please log out and log back in'
//                             }));
//                         } catch (tokenError) {
//                             setUserData(prev => ({
//                                 ...prev,
//                                 name: 'Please log out and log back in',
//                                 email: 'Please log out and log back in'
//                             }));
//                         }
//                     }
                    
//                 } catch (error) {
//                     console.error('Error fetching user data:', error);
//                 } finally {
//                     setFetchLoading(false);
//                 }
//             }
//         };
//         fetchUserData();
//     }, [token, getUserProfile]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setUserData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
        
//         try {
//             const result = await updateUserProfile(userData);
//             if (result.success) {
//                 alert('Profile updated successfully!');
//                 setIsEditing(false);
//             } else {
//                 alert(result.message || 'Error updating profile');
//             }
//         } catch (error) {
//             console.error('Error updating profile:', error);
//             alert('Error updating profile');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = () => {
//         setIsEditing(true);
//     };

//     const handleCancel = () => {
//         setIsEditing(false);
//         // Reload original data
//         window.location.reload();
//     };

//     if (fetchLoading) {
//         return (
//             <div className="profile-page">
//                 <div className="profile-container">
//                     <div className="loading-message">Loading profile...</div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="profile-page">
//             <div className="profile-container">
//                 <div className="profile-header">
//                     <img src={assets.profile_icon} alt="Profile" className="profile-icon" />
//                     <h2>My Profile</h2>
//                     <div style={{color: 'white', fontSize: '12px', marginTop: '10px'}}>
//                         {!userData.name.includes('Please log out') && (
//                             <>If fields are empty, please log out and log back in</>
//                         )}
//                     </div>
//                 </div>

//                 <div className="profile-content">
//                     <form onSubmit={handleSubmit} className="profile-form">
//                         <div className="form-section">
//                             <h3>Personal Information</h3>
//                             <div className="form-row">
//                                 <div className="form-group">
//                                     <label>Full Name</label>
//                                     <input
//                                         type="text"
//                                         name="name"
//                                         value={userData.name}
//                                         onChange={handleInputChange}
//                                         placeholder="Enter your full name"
//                                         disabled={!isEditing}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <label>Email Address</label>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         value={userData.email}
//                                         onChange={handleInputChange}
//                                         placeholder="Enter your email address"
//                                         disabled={!isEditing}
//                                         required
//                                     />
//                                 </div>
//                             </div>
//                             <div className="form-group">
//                                 <label>Phone Number</label>
//                                 <input
//                                     type="tel"
//                                     name="phone"
//                                     value={userData.phone}
//                                     onChange={handleInputChange}
//                                     placeholder="Enter your phone number"
//                                     disabled={!isEditing}
//                                 />
//                             </div>
//                         </div>

//                         <div className="form-section">
//                             <h3>Address Information</h3>
//                             <div className="form-group">
//                                 <label>Address</label>
//                                 <textarea
//                                     name="address"
//                                     value={userData.address}
//                                     onChange={handleInputChange}
//                                     placeholder="Enter your full address"
//                                     rows="3"
//                                     disabled={!isEditing}
//                                 />
//                             </div>
//                             <div className="form-row">
//                                 <div className="form-group">
//                                     <label>City</label>
//                                     <input
//                                         type="text"
//                                         name="city"
//                                         value={userData.city}
//                                         onChange={handleInputChange}
//                                         placeholder="Enter your city"
//                                         disabled={!isEditing}
//                                     />
//                                 </div>
//                                 <div className="form-group">
//                                     <label>State</label>
//                                     <input
//                                         type="text"
//                                         name="state"
//                                         value={userData.state}
//                                         onChange={handleInputChange}
//                                         placeholder="Enter your state"
//                                         disabled={!isEditing}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="form-group">
//                                 <label>ZIP Code</label>
//                                 <input
//                                     type="text"
//                                     name="zipCode"
//                                     value={userData.zipCode}
//                                     onChange={handleInputChange}
//                                     placeholder="Enter your ZIP code"
//                                     disabled={!isEditing}
//                                 />
//                             </div>
//                         </div>

//                         <div className="form-actions">
//                             {!isEditing ? (
//                                 <button type="button" className="edit-btn" onClick={handleEdit}>
//                                     Edit Profile
//                                 </button>
//                             ) : (
//                                 <div className="action-buttons">
//                                     <button type="button" className="cancel-btn" onClick={handleCancel}>
//                                         Cancel
//                                     </button>
//                                     <button type="submit" className="submit-btn" disabled={loading}>
//                                         {loading ? 'Saving...' : 'Save Changes'}
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Profile;


//.......................................************.............................................................



import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';
import './Profile.css';

const Profile = () => {
    const { token, getUserProfile, updateUserProfile } = useContext(StoreContext);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState('');
    
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
    });

    const [originalData, setOriginalData] = useState(null);

    // Get user data from localStorage or initialize
    const getStoredUserData = () => {
        try {
            const stored = localStorage.getItem('userProfileData');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    };

    // Save user data to localStorage
    const saveToLocalStorage = (data) => {
        try {
            localStorage.setItem('userProfileData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    };

    // Fetch user data from database with proper fallbacks
    const fetchUserData = async () => {
        if (!token) {
            // If no token, try to get from localStorage
            const storedData = getStoredUserData();
            if (storedData) {
                setUserData(storedData);
                setOriginalData(storedData);
            }
            setFetchLoading(false);
            return;
        }

        try {
            setFetchLoading(true);
            
            // First try to get from API
            try {
                const user = await getUserProfile();
                if (user) {
                    const userDataWithDefaults = {
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || '',
                        city: user.city || '',
                        state: user.state || '',
                        zipCode: user.zipCode || ''
                    };
                    
                    setUserData(userDataWithDefaults);
                    setOriginalData(userDataWithDefaults);
                    saveToLocalStorage(userDataWithDefaults);
                    setFetchLoading(false);
                    return;
                }
            } catch (apiError) {
                console.log('API call failed, using fallback methods:', apiError);
            }

            // Fallback 1: Try to get from localStorage
            const storedData = getStoredUserData();
            if (storedData) {
                setUserData(storedData);
                setOriginalData(storedData);
                setFetchLoading(false);
                return;
            }

            // Fallback 2: Extract from JWT token
            try {
                const tokenData = JSON.parse(atob(token.split('.')[1]));
                const fallbackData = {
                    name: tokenData.name || 'User',
                    email: tokenData.email || '',
                    phone: '',
                    address: '',
                    city: '',
                    state: '',
                    zipCode: ''
                };
                
                setUserData(fallbackData);
                setOriginalData(fallbackData);
                saveToLocalStorage(fallbackData);
            } catch (tokenError) {
                console.log('Token parsing failed:', tokenError);
                // Final fallback: empty form
                const emptyData = {
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    city: '',
                    state: '',
                    zipCode: ''
                };
                setUserData(emptyData);
                setOriginalData(emptyData);
            }
            
        } catch (error) {
            console.error('Error in fetchUserData:', error);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSaveMessage('');
        
        try {
            // Save to localStorage immediately for better UX
            saveToLocalStorage(userData);
            
            if (token) {
                // Try to save to API if we have token
                try {
                    const result = await updateUserProfile(userData);
                    if (result && result.success) {
                        setSaveMessage('Profile updated successfully!');
                        setOriginalData({...userData});
                        setIsEditing(false);
                    } else {
                        setSaveMessage(result?.message || 'Profile saved locally only. API update failed.');
                    }
                } catch (apiError) {
                    console.error('API update failed:', apiError);
                    setSaveMessage('Profile saved locally. Could not connect to server.');
                }
            } else {
                setSaveMessage('Profile saved locally. Login to sync with server.');
            }
            
        } catch (error) {
            console.error('Error saving profile:', error);
            setSaveMessage('Error saving profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setSaveMessage('');
    };

    const handleCancel = () => {
        // Restore original data
        if (originalData) {
            setUserData(originalData);
        }
        setIsEditing(false);
        setSaveMessage('');
    };

    // Load from localStorage on component mount as backup
    useEffect(() => {
        const storedData = getStoredUserData();
        if (storedData && !originalData) {
            setUserData(storedData);
            setOriginalData(storedData);
        }
    }, []);

    if (fetchLoading) {
        return (
            <div className="profile-page">
                <div className="profile-container">
                    <div className="loading-message">Loading profile...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <img src={assets.profile_icon} alt="Profile" className="profile-icon" />
                    <h2>My Profile</h2>
                    <p className="profile-subtitle">Manage your personal information</p>
                </div>

                {saveMessage && (
                    <div className={`save-message ${saveMessage.includes('successfully') || saveMessage.includes('saved locally') ? 'success' : 'error'}`}>
                        {saveMessage}
                    </div>
                )}

                <div className="profile-content">
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-section">
                            <h3>Personal Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        disabled={!isEditing}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email address"
                                        disabled={!isEditing}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={userData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Address Information</h3>
                            <div className="form-group">
                                <label>Address</label>
                                <textarea
                                    name="address"
                                    value={userData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full address"
                                    rows="3"
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={userData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter your city"
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={userData.state}
                                        onChange={handleInputChange}
                                        placeholder="Enter your state"
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>ZIP Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={userData.zipCode}
                                    onChange={handleInputChange}
                                    placeholder="Enter your ZIP code"
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            {!isEditing ? (
                                <button type="button" className="edit-btn" onClick={handleEdit}>
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="action-buttons">
                                    <button type="button" className="cancel-btn" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;