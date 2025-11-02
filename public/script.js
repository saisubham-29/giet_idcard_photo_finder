function expandRange(range) {
    const [start, end] = range.split('-').map(r => r.trim().toUpperCase());
    const prefix = start.slice(0, start.length - 3);
    const startNum = parseInt(start.slice(-3), 10);
    const endNum = parseInt(end.slice(-3), 10);
    let rolls = [];
    for (let i = startNum; i <= endNum; i++) {
        rolls.push(`${prefix}${i.toString().padStart(3, '0')}`);
    }
    return rolls;
}

function fetchPhotos() {
    const input = document.getElementById("rollNumbers").value.trim();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
    
    if (!input) {
        resultDiv.innerHTML = "<div class='error'>⚠ Please enter at least one roll number</div>";
        return;
    }

    let rolls = [];
    const entries = input.split(/[\n,]+/).map(r => r.trim()).filter(r => r);
    
    entries.forEach(entry => {
        entry = entry.toUpperCase();
        if (entry.includes('-')) {
            rolls.push(...expandRange(entry));
        } else {
            rolls.push(entry);
        }
    });

    rolls.forEach(roll => {
        const card = document.createElement("div");
        card.classList.add("card");

        // ✅ Updated to new official ERP endpoint
        const imgUrl = `https://gietuerp.in/Student/GetStudentImage?rollno=${roll}`;

        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = roll;

        const title = document.createElement("p");
        title.innerHTML = `<strong>${roll}</strong>`;

        img.onerror = function () {
            card.innerHTML = `<p><strong>${roll}</strong></p><div class='error'>❌ Image not found</div>`;
        };

        // 💾 Click to download image
        card.onclick = function () {
            const a = document.createElement("a");
            a.href = imgUrl;
            a.download = `${roll}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        card.appendChild(title);
        card.appendChild(img);
        resultDiv.appendChild(card);
    });
}

// ---------- ❤️ Like & Review Logic ----------

async function loadLikes() {
    try {
        const res = await fetch('/api/getLikes');
        const data = await res.json();

        document.getElementById("likeCount").innerText = data.likes || 0;

        const reviewsDiv = document.getElementById("reviews");
        reviewsDiv.innerHTML = "";

        if (data.reviews && Array.isArray(data.reviews)) {
            data.reviews.forEach(r => {
                const rev = document.createElement("div");
                rev.classList.add("review");
                rev.innerText = r;
                reviewsDiv.appendChild(rev);
            });
        }
    } catch (err) {
        console.error("Error loading likes:", err);
    }
}

async function likeSite() {
    const userName = prompt("Enter your name:");
    if (!userName) return;

    const userComment = prompt("Leave a quick comment (optional):");
    const likeCountElem = document.getElementById("likeCount");

    let current = parseInt(likeCountElem.innerText) || 0;
    current++;
    likeCountElem.innerText = current;

    await fetch('/api/updateLikes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            likes: current,
            review: userComment
                ? `${userName}: ${userComment}`
                : `${userName} liked this`
        })
    });

    loadLikes();
}

loadLikes();
