import { Schema, models, model } from "mongoose";
import "./product.model"
import "./user.model"
const wishListSchema = new Schema({
    sessionId: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        default: null
    },
    items: [
        {
            _id: false,
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'product',
            },
        }]
}, {
    timestamps: true
})

const wishListModel = models.wishList || model('wishList', wishListSchema);

export default wishListModel;