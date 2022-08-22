
module.exports = ({roles, allowSameUser}) => {
    return (req, res, next) => {
        const { user } = req;
        const { id } = req.params;
        if (!user)
            return res.status(403).json({ msg: "Authorization Denied" });
        if (allowSameUser && id && user.id === id)
            return next();
        if (!roles)
            return res.status(403).json({ msg: "Fobidden" });
        if (roles.includes(user.role))
            return next();
        return res.status(403).json({ msg: "Fobidden" });
    }
}