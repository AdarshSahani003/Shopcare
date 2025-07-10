import mongoose, {Schema} from "mongoose";

const itemSchema = new Schema({
    itemName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    itemImageUrl: {
        type: [String],
        required: true
    }, 
    condition: {
        type: String,
        enum: ['super', 'good', 'ok'],
        required: true,
    },
    usedInMonths: {
        type: String,
        enum: ["1 Month", "6 Months", "12 Months"],
        required: true,
    },
    category : {
        type : String,
        required : true,
    }
},{
    timestamps: true
})

export const Item = mongoose.model("Item", itemSchema)