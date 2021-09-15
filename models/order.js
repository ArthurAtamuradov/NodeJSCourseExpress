const {model, Schema}=require('mongoose')

const OrderSchema=new Schema(
    {
        courses:[{
            course:{
                type:Object,
                required:true
            },
            count:{
                type:Number,
                required:true
            }
        }],
        user:{
            name:String,
            userId:{
            ref:"User",
            type:Schema.Types.ObjectId,
            required:true
        }
        },
        date:{
            type:Date,
            default:Date.now
        }
    }
)
module.exports=model("Order",OrderSchema)