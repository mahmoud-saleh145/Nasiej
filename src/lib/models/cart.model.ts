import { Schema, models, model } from "mongoose";
import "./product.model"
import "./user.model"
const cartSchema = new Schema({
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
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
                min: 0
            },
            color: {
                type: String,
                required: true,
                trim: true,
            }
        }
    ],
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } }, // TTL

}, {
    timestamps: true
})

const cartModel = models.cart || model('cart', cartSchema);

export default cartModel;