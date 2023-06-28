import { Router } from "express";
import ManagerCarts from "../manager/managerCarts.js";
import ManagerProducts from "../manager/managerProducts.js";
import { __dirname } from "../utils.js";
const router=Router()
const manager=new ManagerCarts(__dirname+'/manager/carts.json')
const managerProducts=new ManagerProducts(__dirname+'/manager/products.json')
router.post('/',async(req,res)=>{
    try {
        await manager.addCart()
        res.status(200).send({estado:"ok",message:"carrito creado"})
    } catch (error) {
        res.status(500).send({state:"error",message:error.message})
    }
})
router.post('/:cid/products/:pid',async(req,res)=>{
    //agrego al carrito seleccionado(cid)
    //el producto seleccionado(pid)
     try {
        const {cid,pid}=req.params   
      
        const prodExist=await managerProducts.getProductsById(Number(pid))
        console.log("prod exis",prodExist)
        //console.log(cart)
        const prodToCart=await manager.addProductCart(Number(cid),Number(pid))
       //console.log("prod Aregado",prodToCart)
        if( prodToCart){
            res.status(200).json({estado:"ok",message:"se guardo"})
            
        }else{
            res.status(401).json({estado:"error",message:"carrito o producto no existe"})
        }
        
     }
     catch(error) {
        res.status(500).send({state:"error",message:error.message})
    }
})


router.get('/:cid',async(req,res)=>{
    //trae todos los productos de ese carrito
    try {
        const {cid}=req.params
        const cart=await manager.getCartById(Number(cid))
       
        if(cart){
            return  res.json({estado:"ok",Products:cart.products})
        }else return res.json({estado:"error",message:"Cart no encontrado"})
    } catch (error) {
        res.status(500).send({state:"error",message:error.message})
    }
})


export default router;
