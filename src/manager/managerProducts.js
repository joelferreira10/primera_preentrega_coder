import fs from 'fs'

class ManagerProducts{
    constructor(path){
        this.path=path;
    }
    async #getMaxId() {
        let maxId = 0;
        const users = await this.getProducts();
        users.map((product) => { 
          if (product.id > maxId) maxId = product.id;                                       
        });
        return maxId;
    }

    async getProducts(){
        try{
        if(fs.existsSync(this.path)){
            const data = await fs.promises.readFile(this.path, "utf-8")
            const dataJSON=JSON.parse(data);
            return dataJSON
        }else{
            return []
        }
    }catch(err){
        console.log(err+"error")
    }
    }
    async addProducts(productObj){
        try{
            let products=await this.getProducts();
            
           
            productObj.id=await this.#getMaxId()+1;
            productObj.status=true;
            products.push(productObj)
            await fs.promises.writeFile(this.path,JSON.stringify(products))
            return productObj
            
        }catch(err){
            console.log("err"+err)
        }
        
}
    async getProductsById(id){
        try {
        const productsFile = await this.getProducts();
        //console.log("products desde manager",productsFile)
       // console.log("id desde managerProduct",id)
        const product = productsFile.find((u)=> u.id === id); 
        //console.log("product encontrado desde manager",product)
        //console.log("producto desde manager",product)
        if(product) return product
        else return false
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(obj, id){
        try {
            const productsFile = await this.getProducts();
            const index = productsFile.findIndex(product => product.id === id);
            if(index === -1){
                throw new Error("ID not found");
            } else {
                productsFile[index] = { ...obj, id }
            }
            await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
        } catch (error) {
            console.log(error);
        }
    }
    async deleteProduct(id){
        try {
            const productsFile = await this.getProducts();
            if(productsFile.length > 0){
                const userDelete=productsFile.find(product=>product.id===id)
                if(userDelete){
                    const newArray = productsFile.filter(product => product.id !== id);
                    await fs.promises.writeFile(this.path, JSON.stringify(newArray));
                }else{
                    throw new Error("ID no encontrado")
                }
                  
            } else {
                return 'product not found';
            }
        } catch (error) {
            console.log(error);
        }
    }
}
// const manager=new ManagerProducts("products.json")
// async function test(){
//     const user=await manager.getProductsById(2)
//     console.log("usuario encontrado",user)
// }
// test()

export default ManagerProducts;