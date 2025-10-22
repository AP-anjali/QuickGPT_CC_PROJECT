import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('database connected..!'));
        await mongoose.connect(`${process.env.MONGODB_URI}/quickgpt`); // quickgpt name no database.. [nai hoy to create thai jase DW]
    } catch (error) {
        console.log('error while connecting to database', error.message);
    }
}

export default connectDB;