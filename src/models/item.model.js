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
    discription: {
        type: String,
        required: true
    },
    itemImageUrl: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        enum: ['superb', 'good', 'ok'],
        required: true,
    },
    usedInMonths: {
        type: Number,
        enum: [1, 6, 12],
        required: true,
    }
},{
    timestamps: true
})

export const Item = mongoose.model("Item", itemSchema)