import { Schema, models, model } from "mongoose";

const couponSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        trim: true
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
    isGlobal: {
        type: Boolean,
        default: false
    },
    usageLimit: {
        type: Number,
        default: 1
    },

    usedCount: {
        type: Number,
        default: 0
    },
    userEmail: {
        type: String,
        default: undefined
    },

    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const couponModel = models.coupon || model("coupon", couponSchema);
export default couponModel;
