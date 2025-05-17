const Role = require("../models/Role");

exports.assignRole = async (req, res) => {
    const { email, role } = req.body;

    try {
        // Check if the role is already assigned
        const existingRole = await Role.findOne({ role });

        if (existingRole) {
            return res.status(400).json({ message: `The role "${role}" is already taken!` });
        }

        // Assign role
        const newRole = new Role({ email, role });
        await newRole.save();

        res.status(201).json({ message: `Role "${role}" assigned to ${email} successfully!` });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
