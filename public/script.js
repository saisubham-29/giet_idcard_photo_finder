// Fetch likes + comments from backend
async function fetchLikes() {
    try {
        const res = await fetch("/api/getLikes");
        const data = await res.json();
        document.getElementById("likeCount").textContent = data.likes || 0;
        renderComments(data.comments || []);
    } catch (err) {
        console.error("Error fetching likes:", err);
    }
}

// Render comments in reviews section
function renderComments(comments) {
    const reviewsDiv = document.getElementById("reviews");
    reviewsDiv.innerHTML = comments
        .map(c => `<p><strong>${c.username}:</strong> ${c.text}</p>`)
        .join("");
}

// Like button handler
async function likeSite() {
    try {
        const res = await fetch("/api/updateLikes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ like: true })
        });
        const data = await res.json();
        document.getElementById("likeCount").textContent = data.likes;
    } catch (err) {
        console.error("Error updating like:", err);
    }
}

// Comment submission
async function submitComment() {
    const username = document.getElementById("username").value.trim();
    const comment = document.getElementById("comment").value.trim();

    if (!username || !comment) return alert("Please enter name and comment");

    try {
        const res = await fetch("/api/updateLikes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment, username })
        });
        const data = await res.json();
        renderComments(data.comments);
        document.getElementById("comment").value = "";
    } catch (err) {
        console.error("Error submitting comment:", err);
    }
}

// Fetch photos for given roll numbers
async function fetchPhotos() {
    const rollNumbers = document.getElementById("rollNumbers").value.trim();
    if (!rollNumbers) return alert("Please enter roll numbers");

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    const rolls = rollNumbers.split(",").map(r => r.trim());

    rolls.forEach(roll => {
        if (roll.includes("-")) {
            let [start, end] = roll.split("-");
            let prefix = start.match(/^[^\d]+/)[0];
            let startNum = parseInt(start.match(/\d+$/)[0]);
            let endNum = parseInt(end.match(/\d+$/)[0]);
            for (let i = startNum; i <= endNum; i++) {
                addImage(prefix + i.toString().padStart(3, "0"));
            }
        } else {
            addImage(roll);
        }
    });
}

// Add image with extension fallback
function addImage(roll) {
    const extensions = ["jpg", "JPG", "jpeg"];
    let index = 0;

    function tryNextExtension() {
        if (index >= extensions.length) {
            console.warn(`Image not found for ${roll}`);
            return;
        }

        const img = document.createElement("img");
        img.src = `https://erp.giet.edu/images/students/${roll}.${extensions[index]}`;
        img.className = "student-photo";

        img.onerror = () => {
            img.remove();
            index++;
            tryNextExtension();
        };

        img.onload = () => console.log(`Loaded: ${img.src}`);
        document.getElementById("result").appendChild(img);
    }

    tryNextExtension();
}

// Load likes + comments on page load
document.addEventListener("DOMContentLoaded", fetchLikes);
