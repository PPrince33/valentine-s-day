document.addEventListener("DOMContentLoaded", () => {
    // Determine which page we are on based on the existence of specific elements
    const senderInput = document.getElementById("senderNameInput");
    const displaySenderName = document.getElementById("displaySenderName");

    // --- LOGIC FOR INDEX.HTML (Landing Page) ---
    if (senderInput) {
        const createLinkBtn = document.getElementById("createLinkBtn");
        const resultArea = document.getElementById("resultArea");
        const generatedLinkInput = document.getElementById("generatedLink");
        const copyBtn = document.getElementById("copyBtn");

        createLinkBtn.addEventListener("click", () => {
            const name = senderInput.value.trim();
            if (!name) {
                alert("Please enter your name gently... 🌸");
                return;
            }

            // Generate absolute URL for valentine.html with query param
            const currentUrl = window.location.href;
            // Handle if index.html is explicit in URL or implicit (folder root)
            const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/")) + "/valentine.html";
            const finalLink = `${baseUrl}?sender=${encodeURIComponent(name)}`;

            generatedLinkInput.value = finalLink;
            resultArea.classList.remove("hidden");
        });

        copyBtn.addEventListener("click", () => {
            generatedLinkInput.select();
            document.execCommand("copy"); // Fallback compatibility
            navigator.clipboard.writeText(generatedLinkInput.value).then(() => {
                copyBtn.textContent = "Copied! 💖";
                setTimeout(() => copyBtn.textContent = "Copy", 2000);
            });
        });
    }

    // --- LOGIC FOR VALENTINE.HTML (Question Page) ---
    if (displaySenderName) {
        // 1. Get Sender Name from URL
        const params = new URLSearchParams(window.location.search);
        const sender = params.get("sender") || "Admirer";
        displaySenderName.textContent = sender;

        // 2. Button Logic
        const noBtn = document.getElementById("noBtn");
        const yesBtn = document.getElementById("yesBtn");
        const interactionArea = document.getElementById("interactionArea");
        const successMessage = document.getElementById("successMessage");
        const receiverInput = document.getElementById("receiverNameInput");

        // "No" Button Movement
        // We use mouseover for desktop and touchstart for mobile to make it jump
        const moveButton = () => {
            const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 20);
            const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 20);
            
            noBtn.style.position = "absolute";
            noBtn.style.left = `${x}px`;
            noBtn.style.top = `${y}px`;
        };

        noBtn.addEventListener("mouseover", moveButton);
        noBtn.addEventListener("touchstart", moveButton); // For mobile
        noBtn.addEventListener("click", (e) => {
            e.preventDefault(); // Just in case they manage to click it
            moveButton();
        });

        // "Yes" Button Logic
        yesBtn.addEventListener("click", () => {
            const receiverName = receiverInput.value.trim();
            
            if (!receiverName) {
                alert("Please enter your name so I know who said Yes! 💕");
                return;
            }

            // 3. EmailJS Sending
            // Ensure you have initialized EmailJS in the HTML head
            const serviceID = "YOUR_SERVICE_ID";   // Replace this
            const templateID = "YOUR_TEMPLATE_ID"; // Replace this

            const templateParams = {
                sender_name: sender,
                receiver_name: receiverName,
                time: new Date().toLocaleString(),
                page_url: window.location.href
            };

            yesBtn.textContent = "Sending... 💌";
            
            emailjs.send(serviceID, templateID, templateParams)
                .then(() => {
                    // Success UI Update
                    interactionArea.style.display = "none";
                    successMessage.classList.remove("hidden");
                }, (err) => {
                    console.error("Failed to send email", err);
                    alert("A tiny bird failed to deliver the message, but consider it a YES! (EmailJS Error)");
                    // Still show success to not ruin the moment
                    interactionArea.style.display = "none";
                    successMessage.classList.remove("hidden");
                });
        });
    }
});
