const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'helper'],
            default: 'user',
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: true,
            // REMOVED: default: 'Pali'
        },
        state: {
            type: String,
            required: true,
            // REMOVED: default: 'Rajasthan'
        },
        // --- HELPER-SPECIFIC FIELDS ---
        isProfileComplete: {
            type: Boolean,
            default: false,
        },
        profilePicture: {
            type: String,
            default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        },
        bio: {
            type: String,
            maxlength: 500,
            default: '',
        },
        services: [
            {
                type: String,
            },
        ],
        experience: {
            type: Number,
            default: 0,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        hourlyRate: {
            type: Number,
            default: 0,
        },
        areaOfOperation: {
            type: [String],
            default: [],
        },
        availability: {
            type: String,
            default: 'Full-time',
        },
        aadhaarNumber: {
            type: String,
            required: function() { return this.role === 'helper'; },
            sparse: true,
        },
        idProofUrl: {
            type: String,
            default: '',
        },
        isIdentityVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;