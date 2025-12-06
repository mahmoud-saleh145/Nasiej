import { Schema, models, model } from "mongoose";

const counterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const counterModel = models.counter || model("counter", counterSchema);
export default counterModel;
