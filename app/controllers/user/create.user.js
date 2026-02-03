const { db } = require("../../models");

const Users = db.users;

module.exports.createUser = async (newUser) => {
    try {
        // Validate required fields
        if (!newUser || !newUser.email) {
            throw new Error('Email is required');
        }

        // Log the user data being created
        //console.log('Creating user with data:', newUser);

        // Create the user
        const user = await Users.create(newUser, {
            hooks: true  // Disable hooks temporarily
            //hooks: true,
            //returning: true,
            //alidate: true		
        });

        // Log successful creation
        console.log('User created successfully:', user);

        // Return status, message, and the user object for immediate use (eliminates extra SELECT trip)
        return [true, 'User account has been created.', user];
    } catch (err) {
        console.error('createUser Error:', err.message);

        // Handle specific Sequelize errors
        if (err.name === 'SequelizeUniqueConstraintError') {
            return [false, 'User with this email or reference number already exists.'];
        }

        if (err.name === 'SequelizeValidationError') {
            return [false, err.errors.map(e => e.message).join(', ')];
        }

        // Return generic error message
        return [false, 'Error occurred, user creation has failed.'];
    }

};

