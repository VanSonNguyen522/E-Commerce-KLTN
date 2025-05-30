import mongoose, { Schema } from "mongoose";

const CommentSchema = new Schema({
    clerkId: { 
        type: String, 
        default: null
}, // ID người dùng từ Clerk
  name: {
    type: String,
    required: true
}, // Tên người dùng tự nhập
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true }, // Tham chiếu đến _id của Product
  content: {
    type: String,
    required: true }, // Nội dung comment
  createdAt: {
    type: Date,
    default: Date.now
},
});

export const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);