import express from 'express';
import morgan from 'morgan';
import routerProducts from './router/products.route.js';
import routerCarts from './router/carts.router.js'

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan("dev"));

app.use('/api/products',routerProducts)
app.use('/api/carts',routerCarts)

app.listen(8080,()=>console.log("server ok, port 8080"))