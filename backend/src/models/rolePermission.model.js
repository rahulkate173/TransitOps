import mongoose from "mongoose";

const rolePermissionSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: [
                "Fleet Manager",
                "Dispatcher",
                "Safety Officer",
                "Financial Analyst",
            ],
            required: true,
        },

        module: {
            type: String,
            enum: [
                "Fleet",
                "Drivers",
                "Trips",
                "Maintenance",
                "FuelExpenses",
                "Dashboard",
                "Analytics",
                "Settings",
            ],
            required: true,
        },

        permissions: {
            view:   { type: Boolean, default: false },
            create: { type: Boolean, default: false },
            update: { type: Boolean, default: false },
            delete: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

// Compound unique index: one record per role+module pair
rolePermissionSchema.index({ role: 1, module: 1 }, { unique: true });

export default mongoose.model("RolePermission", rolePermissionSchema);
