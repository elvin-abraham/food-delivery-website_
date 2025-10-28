import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

// login user


const loginUser = async (req, res) => {
    const {email,password}=req.body;
    try {
        const user=await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"User does'nt exists"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"})
        }
        // Include name and email in the token
        const token=jwt.sign(
            {
                id:user._id, 
                name:user.name, 
                email:user.email
            }, 
            process.env.JWT_SECRET
        );
        res.json({success:true,token})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// register user




const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save()
        // Include name and email in the token
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email
            }, 
            process.env.JWT_SECRET
        )
        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}





// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId).select('-password');
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching profile" });
    }
}


// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const { name, email, phone, address, city, state, zipCode } = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.body.userId,
            { 
                name, 
                email, 
                phone, 
                address, 
                city, 
                state, 
                zipCode 
            },
            { new: true }
        ).select('-password');
        
        res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating profile" });
    }
}



export { loginUser, registerUser };
