const requireOption = require("../requireOption");


module.exports = function (objectrepository) {

    const  ChirpModel  = requireOption(objectrepository, "ChirpModel");
    return function (req, res, next) {
        
        
        const redirectPath = req.session.url || "/chirps";
        if(req.method === "POST" || req.method === "PUT") {
            if(!req.body.text) {
                return res.render("chirps", {
                    textError: "Text is required",
                    formData: req.body,
                  });
            }
            const chirpData = {
                text: req.body.text,
                user: req.session.userId,
                date: req.params.id ? undefined : Date.now(),
            };

            return ChirpModel.findById(req.params.id)
                .then((chirp) => {
                    if (chirp) {
                        chirp.text = req.body.text;
                        return chirp.save();
                    } else {
                        const newChirp = new ChirpModel(chirpData);
                        return newChirp.save();
                    }
                })
                .then(() => {
                    req.toastr.success("Chirp saved successfully!");
                    return res.redirect(redirectPath);
                })
                .catch((err) => {
                    console.error("Error saving chirp:", err);
                    req.toastr.error("Error saving chirp");
                    return res.redirect(redirectPath);
                });

        }
        else if(req.method === "GET") {
            return ChirpModel.find({ user: req.session.userId })
                .populate("user")
                .sort({ date: -1 })
                .exec()
                .then((chirps) => {
                    res.locals.chirps = chirps;
                    res.locals.userName = req.session.userName;
                    res.locals.userEmail = req.session.userEmail;
                    res.locals.userId = req.session.userId;
                    req.session.url = "/yourchirps";
                    return next();
                })
                .catch((err) => {
                    console.error("Error fetching chirps:", err);
                    req.toastr.error("Error fetching chirps");
                    return res.redirect(redirectPath);
                });
        }
        else if (req.method === "DELETE") {
            return ChirpModel.findById(req.params.id)
                .then((chirp) => {
                    if (!chirp) {
                        req.toastr.error("Chirp not found!");
                        return res.json({ success: false });
                    }
                    
                    if (req.session.userId !== chirp.user._id.toString()) {
                        req.toastr.error("You can only delete your own chirps!");
                        return res.json({ success: false });
                    }
                    
                    return chirp.deleteOne();
                })
                .then(() => {
                    req.toastr.success("Chirp deleted successfully!");
                    return res.json({ success: true });
                })
                .catch((err) => {
                    console.error("Error deleting chirp:", err);
                    req.toastr.error("Error deleting chirp");
                    return res.json({ success: false });
                });
        }
        return next();
    }
};