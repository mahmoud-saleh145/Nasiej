import { Schema, models, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    variants: [
        {
            _id: false,
            color: { type: String, trim: true, required: true },
            images: [
                {
                    _id: false,
                    url: { type: String, required: true, trim: true }
                }
            ],
            stock: { type: Number, min: 0, default: 0 },
            reserved: { type: Number, min: 0, default: 0 }
        }
    ],

    brand: {
        type: String,
        trim: true
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
    },
    raise: {
        type: Number,
        default: 20,

    },
    hide: {
        type: Boolean,
        default: false
    },
    finalPrice: {
        type: Number,
        default: undefined
    },

}, {
    timestamps: true
})

productSchema.pre("save", function () {
    const price = this.price || 0;
    const raise = this.raise || 0;
    const discount = this.discount || 0;
    this.finalPrice = price + (price * raise) / 100 - (price * discount) / 100;

});

const productModel = models.product || model('product', productSchema);

export default productModel;