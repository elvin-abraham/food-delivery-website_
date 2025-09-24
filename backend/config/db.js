import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://FoodDelivery:FoodDelivery123@cluster0.udmspjf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/test').then(()=>{
        console.log("DB Connected")
    })
}


