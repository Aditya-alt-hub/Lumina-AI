import mongoose from "mongoose";

const userSchema=new mongoose.Schema(
    {
        firebaseUid:{
            type:String,
            unique:true
        },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, trim: true },
        // password: { type: String, required: function () { return !this.firebaseUID; } },
        avatar:String,
        plan:{
            type:String,
            default:"free"
        },
        credits:{
            type:Number,
            default:100
        },
        totalCredits:{
            type:Number,
            default:100
        }
    },
    {
        timestamps:true
    }
)

// userSchema.pre("save", async function () {
//     if (!this.isModified("password")) {
//         // return next();
//         return;
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     // next();
// })

// userSchema.methods.matchPassword = async function (enteredPassword) {
//     if (!this.password) {
//         return false;
//     }
//     return await bcrypt.compare(enteredPassword, this.password);
// }
const User = mongoose.model("User", userSchema);
export default User;