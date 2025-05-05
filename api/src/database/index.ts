import mongoose from "mongoose";

export const connect = async () => {
    const mongoUri = process.env.MONGO_URI;
    if(!mongoUri){
        console.log("Mongo URI not found");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Database connection failed", (error as Error).message);
    }
}