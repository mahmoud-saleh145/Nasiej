import { Schema, models, model } from "mongoose";

const couponSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    discountType: {
        type: String,
        enum: ["percentage"],
        default: "percentage"
    },
    discountValue: {
        type: Number,
        required: true
    },

    userEmail: {
        type: String,
        required: true
    },

    isUsed: {
        type: Boolean,
        default: false
    },

    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const couponModel = models.coupon || model("coupon", couponSchema);
export default couponModel;
