import { logger } from "../../helpers/logger.js";
import { hash, verifyHash } from "../../helpers/helpers.js";

//models
import Admin from "../../models/admins.js";

export const createAdmin = async (data, adminId) => {
    logger.debug("Creating a new admin");
    try {
        let gen_password = Math.floor(100000 + Math.random() * 900000);

        const password = await hash(gen_password.toString());

        const admin = await Admin.create({
            ...data,
            created_by: adminId,
            password: password,
        });

        await admin.save();

        Reflect.deleteProperty(admin._doc, "password pin");

        //send mail here to notify the admin created of account and password

        return {
            code: 200,
            status: "success",
            error: false,
            message: "Admin created successfully",
            data: admin,
        };
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not create admin",
        };
    }
};

export const updatePassword = async (data, id) => {
    logger.debug("updating admin password...");

    try {
        //select the password field in the admin model
        const user = await Admin.findById(id).select("+password");

        //check if current password is valid
        const check = await verifyHash(data.password, user.password);

        if (!check) {
            return {
                code: 401,
                status: "failed",
                error: true,
                message: "Incorrect password",
            };
        }

        //hash the new password entered
        let password = await hash(data.newPassword);

        //update the password field with the new hashed password
        const admin = await Admin.findByIdAndUpdate(id, {
            password: password,
        });

        //delete the password field from the response been sent
        //admin._doc is referring to mongodb => use console.log({...admin}) to see it
        Reflect.deleteProperty(admin._doc, "password");

        return {
            code: 200,
            status: "success",
            error: false,
            message: "password changed successfully",
            data: admin,
        };
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not change password",
        };
    }
};

export const currentAdmin = async adminId => {
    logger.debug("Getting current admin...");
    try {
        //get the details of the admin currently logged in by passing the id in the token
        const admin = await Admin.findById(adminId);
        return {
            code: 200,
            status: "success",
            error: false,
            message: "admin retrieved successfully",
            data: admin,
        };
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not get admin",
        };
    }
};

export const getAllAdmins = async () => {
    logger.debug("Getting all admins...");

    try {
        let admin = await Admin.find();

        return {
            code: 200,
            status: "success",
            error: false,
            message: "admin retrieved successfully",
            data: admin,
        };
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not get admin",
        };
    }
};

export const toggleAdmins = async adminId => {
    logger.debug("deactivate an admin");
    try {
        const admin = await Admin.findById(adminId);

        //check if is_active is set to true, then set is_active to false
        if (admin.is_active == true) {
            admin.is_active = false;
        } else {
            admin.is_active = true;
        }

        await admin.save();

        return {
            code: 200,
            status: "success",
            error: false,
            message: `is_active set to ${admin.is_active} successfully`,
            data: admin,
        };
    } catch (e) {
        logger.error("🔥 error: %o", e);
        return {
            code: 500,
            status: "failed",
            error: true,
            message: "something went wrong, could not deactivate admin",
        };
    }
};

//-----Helpers for this controller----

// check if a unique field exists
export async function checkExists(param, attribute) {
    const query =
        attribute == "username" ? { username: param } : attribute == "phone" ? { phone: param } : { email: param };

    return await Admin.findOne(query).select("+password +pin");
}
