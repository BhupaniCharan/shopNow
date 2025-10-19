import cookieParser from "cookie-parser";
import express from "express"
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import requestRouter from "./routes/requestRoute.js";
import technicianRouter from "./routes/technicianRoute.js";
import { stripeWebhooks } from "./controllers/orderController.js";

const app=express();
const port=process.env.PORT || 4000;

await connectDB();
if (process.env.SKIP_CLOUDINARY !== "1") {
  await connectCloudinary();
}


const allowedOrigins=[
  "http://localhost:5173",
  "http://localhost:4000",
  "http://127.0.0.1:5173",
  "https://shop-herefrontend.vercel.app"
]

app.post("/stripe",express.raw({type:"application/json"}),stripeWebhooks)

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigins,credentials:true}))


app.get("/",(req,res)=>{
    res.send("API IS WORKING");})

app.use("/api/user",userRouter) ;
app.use("/api/seller",sellerRouter);  
app.use("/api/product",productRouter);
app.use("/api/cart",cartRouter);
app.use("/api/address",addressRouter);
app.use("/api/order",orderRouter);
app.use("/api/requests", requestRouter);
app.use("/api/technician", technicianRouter);



app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})