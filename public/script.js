async function fetchLikes() {
    const res = await fetch("/api/getLikes");
    const data = await res.json();
    document.getElementById("likeCount").textContent = data.likes;
    renderComments(data.comments);
}

function renderComments(comments) {
    const reviewsDiv = document.getElementById("reviews");
    reviewsDiv.innerHTML = comments
        .map(c => `<p><strong>${c.username}:</strong> ${c.text}</p>`)
        .join("");
}

async function likeSite() {
    const res = await fetch("/api/updateLikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ like: true })
    });
    const data = await res.json();
    document.getElementById("likeCount").textContent = data.likes;
}

async function submitComment() {
    const username = document.getElementById("username").value.trim();
    const comment = document.getElementById("comment").value.trim();

    if (!username || !comment) return alert("Please enter name and comment");

    const res = await fetch("/api/updateLikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment, username })
    });
    const data = await res.json();
    renderComments(data.comments);
    document.getElementById("comment").value = "";
}

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

function addImage(roll) {
    const img = document.createElement("img");
    img.src = `https://erp.giet.edu/images/students/${roll}.jpg`;
    img.onerror = () => img.style.display = "none";
    img.className = "student-photo";
    document.getElementById("result").appendChild(img);
}

document.addEventListener("DOMContentLoaded", fetchLikes);
