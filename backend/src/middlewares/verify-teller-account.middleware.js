export const verifyTellerAccount = async (req, res, next) => {
    const account = req.user;
    if (account.role !== "TELLER") {
        return res.status(403).json({ message: "Permission denied" });
    }
    next();
};
