export function validateFields(req,res,next) {
    const user=req.body
    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
  
    for (const field of requiredFields) {
      if (user[field] === '') {
        res.status(401).send("Faltan completar campos")
      }else next();
    }
  }