import Admin from "../../models/admins.js";

export default async function (req, res, next) {
    try {
        const admin = await Admin.findById(req.currentUser._id);
        if (!admin) {
            return res.status(403).send({
                error: true,
                message: "this user does not exist",
            });
        }
        if (!admin.role == "super admin")
            return res.status(403).send({
                error: true,
                message: "Access denied, only admins can perform this operation.",
            });

        next();
    } catch (e) {
        console.log(e);
        res.status(400).json({
            error: true,
            message: "Invalid token.",
        });
    }
}
