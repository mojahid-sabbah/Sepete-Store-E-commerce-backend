
import dotenv from 'dotenv';
import express from 'express';
import   connectDB   from'./DB/connection.js';
const app = express()
const port = 3000
dotenv.config({path:"./config/.env"})
app.use(express.json())

import * as indexRouter from './src/modules/index.router.js';
connectDB(); 
const userUrl = process.env.BASEURL;

//app.use(`${userUrl}/upload` , express.static('./upload')) add file to any file in my project files
app.use(`${userUrl}/auth` , indexRouter.authRouter)
app.use(`${userUrl}/product` , indexRouter.productRouter)
app.use(`${userUrl}/user` , indexRouter.userRouter)
app.use(`${userUrl}/category` , indexRouter.categoryRouter)
app.use(`${userUrl}/brand` , indexRouter.brandRouter)
app.use(`${userUrl}/coupon` , indexRouter.couponRouter)
app.use(`${userUrl}/wishlist` , indexRouter.wishlistRouter)
app.use(`${userUrl}/cart` , indexRouter.cartRouter)
app.use(`${userUrl}/order` , indexRouter.orderRouter)
app.use(`${userUrl}/review` , indexRouter.reviewRouter)
app.get('*', (req, res) => res.status(404).send('Not Found !'))



app.listen(port, () => console.log(`Example app listening on port ${port}!`))