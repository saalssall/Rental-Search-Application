import express from "express";
import argon2 from "argon2";
import authorisation from "../middleware/authorisation.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

const router = express.Router();

// =================== Helper Functions ===================

const formatDate = (date) => {
    if (!date) return null;
    if (typeof date === "string") {
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
        return date.split("T")[0];
    }
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const decodeToken = (authHeader) => {
    if (!authHeader) return null;
    if (!authHeader.match(/^Bearer /)) return "malformed";
    const token = authHeader.replace(/^Bearer /, "");
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        if (e.name === "TokenExpiredError") return "expired";
        return "invalid";
    }
};

const isValidDateFormat = (dob) => {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dobRegex.test(dob);
};

const isRealDate = (dob) => {
    const [year, month, day] = dob.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month &&
        date.getDate() === day
    );
};

const isPastDate = (dob) => {
    const [year, month, day] = dob.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date < new Date();
};

const isValidStrings = (...fields) => {
    return fields.every((field) => typeof field === "string");
};

const hasRequiredFields = (...fields) => {
    return fields.every((field) => field !== undefined && field !== null && field !== "");
};

const sendAuthError = (res, decoded) => {
    if (decoded === "malformed") {
        res.status(401).json({ error: true, message: "Authorization header is malformed" });
        return true;
    }
    if (decoded === "expired") {
        res.status(401).json({ error: true, message: "JWT token has expired" });
        return true;
    }
    if (decoded === "invalid") {
        res.status(401).json({ error: true, message: "Invalid JWT token" });
        return true;
    }
    return false;
};

const validateDob = (res, dob) => {
    if (!isValidDateFormat(dob)) {
        res.status(400).json({
            error: true,
            message: "Invalid input: dob must be a real date in format YYYY-MM-DD.",
        });
        return false;
    }
    if (!isRealDate(dob)) {
        res.status(400).json({
            error: true,
            message: "Invalid input: dob must be a real date in format YYYY-MM-DD.",
        });
        return false;
    }
    if (!isPastDate(dob)) {
        res.status(400).json({
            error: true,
            message: "Invalid input: dob must be a date in the past.",
        });
        return false;
    }
    return true;
};

// =================== Routes ===================

// POST /register
router.post("/register", (req, res, next) => {
    const { email, password } = req.body ?? {};

    if (!hasRequiredFields(email, password)) {
        res.status(400).json({
            error: true,
            message: "Request body incomplete - email and password needed",
        });
        return;
    }

    req.db.from("users").select("*").where("email", "=", email)
        .then((users) => {
            if (users.length > 0) throw new Error("User already exists");
            return argon2.hash(password);
        })
        .then((hash) => {
            return req.db.from("users").insert({ email, hash });
        })
        .then(() => {
            res.status(201).json({ success: true, message: "User created" });
        })
        .catch((e) => {
            res.status(500).json({ success: false, message: e.message });
        });
});

// POST /login
router.post("/login", (req, res, next) => {
    const { email, password } = req.body ?? {};

    if (!hasRequiredFields(email, password)) {
        res.status(400).json({
            error: true,
            message: "Request body incomplete - email and password needed",
        });
        return;
    }

    req.db.from("users").select("*").where("email", "=", email)
        .then((users) => {
            if (users.length === 0) {
                res.status(401).json({ error: true, message: "User does not exist" });
                throw new Error("User does not exist");
            }
            return argon2.verify(users[0].hash, password);
        })
        .then((match) => {
            if (match === undefined) return;
            if (match) {
                const expiresIn = 60 * 60 * 24;
                const exp = Math.floor(Date.now() / 1000) + expiresIn;
                const token = jwt.sign({ exp, email }, process.env.JWT_SECRET);
                res.json({ token, tokenType: "Bearer", expiresIn });
            } else {
                res.status(401).json({ error: true, message: "Passwords do not match" });
            }
        })
        .catch((error) => {
            if (!res.headersSent) {
                res.status(500).json({ error: true, message: error.message });
            }
            console.log("Login error:", error.message);
        });
});

// POST /debugLogin
router.post("/debugLogin", (req, res, next) => {
    const { email, password } = req.body ?? {};

    if (!hasRequiredFields(email, password)) {
        res.status(400).json({
            error: true,
            message: "Request body incomplete - email and password needed",
        });
        return;
    }

    req.db.from("users").select("*").where("email", "=", email)
        .then((users) => {
            if (users.length === 0) {
                res.status(401).json({ error: true, message: "User does not exist" });
                throw new Error("User does not exist");
            }
            return argon2.verify(users[0].hash, password);
        })
        .then((match) => {
            if (match === undefined) return;
            if (match) {
                const expiresIn = 1;
                const exp = Math.floor(Date.now() / 1000) + expiresIn;
                const token = jwt.sign({ exp, email }, process.env.JWT_SECRET);
                res.json({ token, tokenType: "Bearer", expiresIn });
            } else {
                res.status(401).json({ error: true, message: "Passwords do not match" });
            }
        })
        .catch((error) => {
            if (!res.headersSent) {
                res.status(500).json({ error: true, message: error.message });
            }
            console.log("Debug login error:", error.message);
        });
});

// GET /:email/profile
router.get("/:email/profile", (req, res, next) => {
    const { email } = req.params;
    const authHeader = req.headers.authorization;

    let authenticatedEmail = null;
    if (authHeader) {
        const decoded = decodeToken(authHeader);
        if (sendAuthError(res, decoded)) return;
        if (decoded) authenticatedEmail = decoded.email;
    }

    req.db.from("users").select("*").where("email", "=", email)
        .then((rows) => {
            if (rows.length === 0) {
                res.status(404).json({ error: true, message: "User not found" });
                return;
            }

            const user = rows[0];
            if (authenticatedEmail === email) {
                res.status(200).json({
                    email: user.email,
                    firstName: user.firstName ?? null,
                    lastName: user.lastName ?? null,
                    dob: formatDate(user.dob),
                    address: user.address ?? null,
                });
            } else {
                res.status(200).json({
                    email: user.email,
                    firstName: user.firstName ?? null,
                    lastName: user.lastName ?? null,
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: true, message: "Error in MySQL query" });
        });
});

// PUT /:email/profile
router.put("/:email/profile", authorisation, (req, res, next) => {
    const { email } = req.params;
    const { firstName, lastName, dob, address } = req.body ?? {};

    // 1. Decode token
    let decoded;
    try {
        const token = req.headers.authorization.replace(/^Bearer /, "");
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ error: true, message: "JWT token has expired" });
        } else {
            res.status(401).json({ error: true, message: "Invalid JWT token" });
        }
        return;
    }

    // 2. Check if user exists first
    req.db.from("users").select("*").where("email", "=", email)
        .then((rows) => {
            if (rows.length === 0) {
                res.status(404).json({ error: true, message: "User not found" });
                return;
            }

            // 3. Check authenticated user matches
            if (decoded.email !== email) {
                res.status(403).json({
                    error: true,
                    message: "Forbidden"
                });
                return;
            }

            // 4. Check all fields are present
            if (!hasRequiredFields(firstName, lastName, dob, address)) {
                res.status(400).json({
                    error: true,
                    message: "Request body incomplete: firstName, lastName, dob and address are required.",
                });
                return;
            }

            // 5. Validate string fields
            if (!isValidStrings(firstName, lastName, address)) {
                res.status(400).json({
                    error: true,
                    message: "Request body invalid: firstName, lastName and address must be strings only.",
                });
                return;
            }

            // 6. Validate dob
            if (!validateDob(res, dob)) return;

            // 7. Update the user profile
            return req.db.from("users").where("email", "=", email)
                .update({ firstName, lastName, dob, address })
                .then(() => {
                    res.status(200).json({ email, firstName, lastName, dob, address });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: true, message: "Error in MySQL query" });
        });
});

export default router;