import mongoose from "mongoose";

const Connection = (URL) => {
    try{
        mongoose.connect(URL);
        console.log('Database connected successfully');
    }catch(error){
        console.log('error while connecting with the database ', error);
    }
};

export default Connection; 