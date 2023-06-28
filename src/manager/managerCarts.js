import fs from 'fs'
import ManagerProducts from './managerProducts.js'
import { __dirname } from '../utils.js';
const managerProducts=new ManagerProducts(__dirname+'/manager/products.json')
class ManagerCarts{
    constructor(path){
        this.path=path;
    }

    async #getCart(){
        try {
            if(fs.existsSync(this.path)){
                const data=await fs.promises.readFile(this.path,"utf-8");
                const cartJSON= JSON.parse(data);
                return cartJSON
            }else{
                return [];
            }
        } catch (error) {
            console.log(error)
        }
    }
    async #getMaxId() {
        try{
        let maxId = 0;
        const users = await this.#getCart();
        users.map((product) => { 
          if (product.id > maxId) maxId = product.id;                                       
        });
        return maxId;
    }
        catch(error){
            console.log("error")
        }
    }

    async addCart(){
        try{
            const cart={
                id:(await this.#getMaxId())+1,
                products:[]
            }
            const products=await this.#getCart();
            products.push(cart)
            await fs.promises.writeFile(this.path,JSON.stringify(products))
            return cart
        }catch(err){
            console.log(err)
        }
    }
    async getCartById (id) {
        try {
          const carts = await this.#getCart();
          const cart = carts.find((prod) => prod.id === id);
          if (cart) {
            return cart;
          }
          return false
        } catch (error) {
          console.log(error);
        }
      }
    async addProductCart(idCart,idProduct){
        try{
            console.log(__dirname)
            //console.log("id delproduct",idProduct)
        const cartsFile = await this.#getCart();
        const cartExist = await this.getCartById(idCart);
        //console.log(cartExist)
        const cardIndex=cartsFile.findIndex(cart=>cart.id===idCart)
        //verificar si el producto existe
        const prodExists = await managerProducts.getProductsById(idProduct);
        console.log("product desde manager cart",prodExists)
        //console.log("carts:",cartExist)
        if(prodExists){
        if(cartExist) {
            const prodExistsinCart = cartExist.products.find(prod => prod.id === idProduct);
            if(prodExistsinCart) {
                const index=cartExist.products.findIndex(cart=>cart.id==idProduct)
                console.log("idproduct",index)
                prodExistsinCart.quantity+=1
                console.log("prod act",prodExistsinCart)
                cartsFile[cardIndex].products[index]=prodExistsinCart
                
            } else {
                const prod = {
                id: idProduct,
                quantity: 1
                }
                cartExist.products.push(prod);
                cartsFile[cardIndex]=cartExist;
                console.log(cartExist)
            }
            await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
            return cartExist
        }else {return false}
        } else {
        return false
        }
        }catch(err){
            console.log(err)
        }
        }

      
}
// const manager=new ManagerCarts('carts.json')
// async function test(){
//     await manager.addProductCart(1,2)
// }
// test()
export default ManagerCarts



