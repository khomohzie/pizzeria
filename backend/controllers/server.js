export async function get(req, res, next) {
    try {
        return res.status(200).send({ error: false, message: "Server active" });
    } catch (error) {
        next();
        return res.status(500).send({ error: true, message: "Database operation failed" });
    }
}
