import { Router } from "express";
import ManagerProducts from '../manager/managerProducts.js'
import { __dirname } from "../utils.js";
import { validateFields } from "../middleware/verifyField.js";
const router=Router()
const managerProducts=new ManagerProducts(__dirname+'/manager/products.json')
router.get('/', async(req,res)=>{
    //traer todos los productos con el limit incluido
    const limit=parseInt(req.query.limit)
    console.log(limit)
    try {
        const product=await managerProducts.getProducts()
        if(isNaN(limit)){
            return  res.json(product)
        }
        res.json(product.slice(0,limit))
        
    } catch (error) {
        res.status(500).send({state:"error",message:error.message})
    }
})
router.get('/:pid', async(req,res)=>{
    //traer el producto con el id seleccionado
    try {
        const{pid}=req.params;
        console.log(pid)
        const user=await managerProducts.getProductsById(Number(pid))
        console.log(user)
        if(user)res.json(user)
        else res.status(400).json({message: 'Product not found'});
    } catch (error) {
        res.status(500).send({state:"error",message:error.message})
    }
})
router.post('/', async(req,res)=>{
    //agregar un nuevo producto
    //id(no desde el bodi),string(title,description,code,category,thumbnails(no obligatorio)),number(price,stock)boolean(status:true)
    const products=await managerProducts.getProducts()
    try {
        const {title,description,code,price,stock,category,thumbnails}=req.body
       
        const obj={
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails
        }
        
        const verifyCode=products.find(prod=>prod.code===obj.code)
       
        if (title===""||description===""||code===""||isNaN(price)||isNaN(stock)||category==="") {
          return res.status(401).send("Faltan completar campos")
      }
      if(verifyCode)return res.status(401).send("codigo duplicado")
        const newUser = await managerProducts.addProducts(obj);
        res.json(newUser);
      
        
    } catch (error) {
        res.status(500).send({state:"error",message:error.message})
    }
})
router.put('/:pid', async(req,res)=>{
    //actualizar los campos enviados desde el body,sin actualizar id o eliminarlo 
    const products=await managerProducts.getProducts()
    try {
        
        const {pid}=req.params
        const prodExist=products.find(prod=>prod.id===Number(pid))
        
        if(prodExist){//verifico que exista prod
        const filterid=products.filter(prod=>prod.id!==Number(pid))//quito de la lista a ese producto
        
        const {title,description,code,price,stock,category,thumbnails}=req.body
        const obj={
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails
        }
        const verifyCode=filterid.find(prod=>prod.code===obj.code)//en el nuevo arrary verifico que no halla codigo duplicado
        if(!verifyCode){
            if (title===""||description===""||code===""||isNaN(price)||isNaN(stock)||category==="") {
                return res.status(401).send("Faltan completar campos")
                }else{ 
                    await managerProducts.updateProduct(obj,Number(pid))
                    return res.json({estado:"productos actualizado",prodNew:obj})
                }
        }else {
            return res.status(401).send("codigo duplicado")
        }
    }else{ 
        return res.status(401).send("ID not found")
    }
       

    } catch (error) {
        res.status(500).send({state:"error",message:error.message})
    }
})

router.delete('/:pid', async(req,res)=>{
    try {
        
        const {pid}=req.params
        const prod=await managerProducts.getProductsById(Number(pid))
        if(prod){
            await managerProducts.deleteProduct(Number(pid))
            res.json({msg:'producto eliminado'})
        }else{
            res.status(401).send('no existe producto con ese ID')
        }
        
    } catch (error) {
        res.status(500).send({state:"error",message:error.message})
    }
})

export default router;