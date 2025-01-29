import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: true 
    },
    companyName: {
        type: String,
        required: function() {
            return this.role === 'COMPANY';
        }
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: function() {
            return this.role === 'HR';
        }
    },
    role: {
        type: String,
        enum: ['HR', 'COMPANY'],
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});


UserSchema.methods.isCompany = function() {
    return this.role === 'COMPANY';
};

UserSchema.methods.isHR = function() {
    return this.role === 'HR';
};

UserSchema.pre('save', function(next) {
    if (this.role === 'COMPANY' && !this.companyName) {
        next(new Error('Company name is required for company accounts'));
    }
    next();
});

export const User = mongoose.model("User", UserSchema);