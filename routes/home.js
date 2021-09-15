const {Router}= require('express')

const router=Router()

router.get('/',(req,res)=>{
    res.status(200)
    res.render('index',{
        isHome:true,
        title:"Home page"
    })
})
module.exports=router;