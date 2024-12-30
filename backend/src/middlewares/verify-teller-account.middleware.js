export const verifyTellerAccount = async (req, res, next) => {
    const account = req.user;
    if (account.role !== "TELLER") {
        return res.status(403).json({ message: "Permission denied" });
    }
    next();
};

export const verifyAdminAccount = async (req, res, next) => {
    const account = req.user;
    if (account.role.toLowerCase() !== "ADMIN".toLowerCase()) {
        return res.status(403).json({ message: "Permission denied" });
    }
    next();
};

