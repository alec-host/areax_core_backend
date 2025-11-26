const { db } = require("../../models");

const Users = db.users;

module.exports.createUser = async(newUser) => {	
     /*
     return new Promise((resolve, reject) => {    
        Users.create(newUser,{ hooks: false }).then(() => {
            resolve([true,'User account has been created.']);
        }).catch(err => {
            console.log(err);
            resolve([false,'Error occurred, user creation has failed.']);
        });
    });
    */
     	
    try {
        // Validate required fields
        if (!newUser || !newUser.email) {
            throw new Error('Email is required');
        }

        // Log the user data being created
        console.log('Creating user with data:', newUser);

        // Create the user
        const user = await Users.create(newUser,{
            hooks: true  // Disable hooks temporarily
            //hooks: true,
            //returning: true,
            //alidate: true		
        });
        
        // Log successful creation
        console.log('User created successfully:', user);

        return [true, 'User account has been created.'];
    } catch (error) {
       // Log the error
        console.error('Error creating user:', error);

        // Handle specific Sequelize errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return [false, 'User with this email or reference number already exists.'];
        }

        if (error.name === 'SequelizeValidationError') {
            return [false, error.errors.map(e => e.message).join(', ')];
        }

        // Return generic error message
        return [false, 'Error occurred, user creation has failed.'];
    } 
   
};
