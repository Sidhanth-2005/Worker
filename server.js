const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const multer = require("multer");

const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const app = express();
app.use(cors());
app.use(express.json());


// File storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // folder where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});


// Create DB
const db = new sqlite3.Database("services.db");

// Create table + insert data
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT,
            name TEXT,
            location TEXT
        )
    `);

    // Clear old data
    db.run(`DELETE FROM services`);

    // Insert data
    db.run(`INSERT INTO services VALUES (NULL,'hospital','City Hospital','Howrah')`);
    db.run(`INSERT INTO services VALUES (NULL,'bank','State Bank','Howrah')`);
    db.run(`INSERT INTO services VALUES (NULL,'food','Food Center','Howrah')`);
    db.run(`INSERT INTO services VALUES (NULL,'education','Govt School','Howrah')`);

    db.run(`INSERT INTO services VALUES (NULL,'hospital','Apollo Hospital','Kolkata')`);
    db.run(`INSERT INTO services VALUES (NULL,'bank','HDFC Bank','Kolkata')`);
    db.run(`INSERT INTO services VALUES (NULL,'food','Community Kitchen','Kolkata')`);
    db.run(`INSERT INTO services VALUES (NULL,'education','Kolkata College','Kolkata')`);

    db.run(`INSERT INTO services VALUES (NULL,'hospital','AIIMS','Delhi')`);
    db.run(`INSERT INTO services VALUES (NULL,'bank','ICICI Bank','Delhi')`);
    db.run(`INSERT INTO services VALUES (NULL,'food','Food Shelter','Delhi')`);
    db.run(`INSERT INTO services VALUES (NULL,'education','Delhi University','Delhi')`);


    db.run(`INSERT INTO services VALUES (NULL,'hospital','Lilavati Hospital','Mumbai')`);
    db.run(`INSERT INTO services VALUES (NULL,'bank','Axis Bank','Mumbai')`);
    db.run(`INSERT INTO services VALUES (NULL,'food','Mumbai Food Center','Mumbai')`);
    db.run(`INSERT INTO services VALUES (NULL,'education','Mumbai University','Mumbai')`);


    db.run(`INSERT INTO services VALUES (NULL,'hospital','Apollo Chennai','Chennai')`);
    db.run(`INSERT INTO services VALUES (NULL,'bank','Indian Bank','Chennai')`);
    db.run(`INSERT INTO services VALUES (NULL,'food','Amma Canteen','Chennai')`);
    db.run(`INSERT INTO services VALUES (NULL,'education','Anna University','Chennai')`);


    db.run(`INSERT INTO services VALUES (NULL,'hospital','Manipal Hospital','Bangalore')`);
    db.run(`INSERT INTO services VALUES (NULL,'bank','Canara Bank','Bangalore')`);
    db.run(`INSERT INTO services VALUES (NULL,'food','Indira Canteen','Bangalore')`);
    db.run(`INSERT INTO services VALUES (NULL,'education','IISc Bangalore','Bangalore')`);


    db.run(`INSERT INTO services VALUES (NULL,'hospital','Yashoda Hospital','Hyderabad')`);
    db.run(`INSERT INTO services VALUES (NULL,'bank','SBI Hyderabad','Hyderabad')`);
    db.run(`INSERT INTO services VALUES (NULL,'food','Annapurna Canteen','Hyderabad')`);
    db.run(`INSERT INTO services VALUES (NULL,'education','Osmania University','Hyderabad')`);

    db.run(`INSERT INTO services VALUES (NULL,'hospital','Ruby Hall Clinic','Pune')`);
    db.run(`INSERT INTO services VALUES (NULL,'bank','Bank of Maharashtra','Pune')`);
    db.run(`INSERT INTO services VALUES (NULL,'food','Pune Food Shelter','Pune')`);
    db.run(`INSERT INTO services VALUES (NULL,'education','Savitribai Phule University','Pune')`);
});

// API route
app.post("/get-services", (req, res) => {
    const address = req.body.address.toLowerCase();

    // remove extra spaces
    const cleanedInput = address.replace(/[^a-z\s]/g, "").trim();

    // split words
    const words = cleanedInput.split(/\s+/);

        db.all(`SELECT * FROM services`, [], (err, rows) => {
            if (err) {
                return res.status(500).send(err);
        }

    const filtered = rows.filter(service => {
        const location = service.location.toLowerCase();

        // match if ANY word is contained
            return words.some(word =>
                location.includes(word) || word.includes(location)
            );
        });

        if (filtered.length === 0) {
            return res.json({ message: "No services found" });
        }

    // group results
        const result = {
            hospital: [],
            bank: [],
            food: [],
            education: []
        };

        filtered.forEach(service => {
            result[service.type].push(service.name);
        });

        res.json(result);
    });
});

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

// Upload API
app.post("/upload", upload.single("document"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    console.log("Uploaded File:", req.file);

    res.send("File uploaded successfully!");
});


app.post("/login", async (req, res) => {
    const { email } = req.body;

    console.log("📩 Request received for:", email);

    try {
        await transporter.sendMail({
            from: "sidhanthshaw913@gmail.com",
            to: email,
            subject: "Login Successful",
            text: "You have successfully logged in."
        });

        console.log("✅ Email sent successfully");

        res.json({ message: "Login successful! Check your email." });

    } catch (error) {
        console.log("ERROR FULL:", error);
        res.json({ message: "Error sending email" });
    }
});


// Start server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
