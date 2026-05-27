document.getElementById("serviceForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const address = document.querySelector("textarea").value;

    try {
        const response = await fetch("/get-services", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ address: address })
        });

        const data = await response.json();

        console.log("API DATA:", data);

        // Clear previous results
        document.getElementById("hospital").innerText = "";
        document.getElementById("bank").innerText = "";
        document.getElementById("food").innerText = "";
        document.getElementById("education").innerText = "";

        // No results
        if (data.message) {
            document.getElementById("hospital").innerText = data.message;
            return;
        }

        // Show results
        document.getElementById("hospital").innerText =
            data.hospital.length ? data.hospital.join(", ") : "Not found";

        document.getElementById("bank").innerText =
            data.bank.length ? data.bank.join(", ") : "Not found";

        document.getElementById("food").innerText =
            data.food.length ? data.food.join(", ") : "Not found";

        document.getElementById("education").innerText =
            data.education.length ? data.education.join(", ") : "Not found";

    } catch (error) {
        console.error("Error:", error);
    }
});

// Show selected file name
document.getElementById("document").addEventListener("change", function() {
    const file = this.files[0];
    document.getElementById("fileName").innerText =
        file ? "Selected: " + file.name : "";
});

// Upload file
document.getElementById("uploadForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const fileInput = document.getElementById("document");

    const formData = new FormData();
    formData.append("document", fileInput.files[0]);

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        const result = await response.text();

        document.getElementById("uploadStatus").innerText = result;

    } catch (error) {
        console.error("Upload Error:", error);
        document.getElementById("uploadStatus").innerText = "Upload failed!";
    }
});

document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        document.getElementById("loginMessage").innerText = data.message;

    } catch (error) {
        console.log(error);
        document.getElementById("loginMessage").innerText = "Error sending email";
    }
});