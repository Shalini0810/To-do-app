const mongoose = require("mongoose");

const conn = async (req, res) =>{
    try {
        await mongoose.connect("mongodb+srv://shalinikotha08:Sweety2005@cluster0.zpz1yge.mongodb.net/").then(() =>{
            console.log("Connected");
        });
    } catch (error) {
        res.status(400).json({
            message: "Not Connected",
        });
    }
};
conn();