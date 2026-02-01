document.addEventListener("DOMContentLoaded", () => {
    
    // --- PART 1: INDEX.HTML LOGIC (Sender creates link) ---
    const createLinkBtn = document.getElementById("createLinkBtn");

    if (createLinkBtn) {
        const senderNameInput = document.getElementById("senderName");
        const crushNameInput = document.getElementById("crushName");
        const senderPhoneInput = document.getElementById("senderPhone");
        const resultArea = document.getElementById("resultArea");
        const generatedLinkInput = document.getElementById("generatedLink");
        const crushNameDisplay = document.getElementById("crushNameDisplay");
        const copyBtn = document.getElementById("copyBtn");

        createLinkBtn.addEventListener("click", () => {
            const sender = senderNameInput.value.trim();
            const crush = crushNameInput.value.trim();
            const phone = senderPhoneInput.value.trim();

            if (!sender || !crush || !phone) {
                alert("Please fill in all details! 🌸");
                return;
            }

            // Remove non-numeric characters from phone
            const cleanPhone = phone.replace(/\D/g, '');

            // Construct the Link
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/")) + "/valentine.html";
            const finalLink = `${baseUrl}?sender=${encodeURIComponent(sender)}&crush=${encodeURIComponent(crush)}&phone=${cleanPhone}`;

            generatedLinkInput.value = finalLink;
            crushNameDisplay.textContent = crush;
            resultArea.classList.remove("hidden");
        });

        copyBtn.addEventListener("click", () => {
            generatedLinkInput.select();
            generatedLinkInput.setSelectionRange(0, 99999); // Mobile fix
            navigator.clipboard.writeText(generatedLinkInput.value).then(() => {
                copyBtn.textContent = "Copied!";
                setTimeout(() => copyBtn.textContent = "Copy", 2000);
            });
        });
    }

    // --- PART 2: VALENTINE.HTML LOGIC (Receiver sees question) ---
    const mainQuestion = document.getElementById("mainQuestion");

    if (mainQuestion) {
        const params = new URLSearchParams(window.location.search);
        const sender = params.get("sender") || "Admirer";
        const crush = params.get("crush") || "You";
        const phone = params.get("phone");

        document.getElementById("displaySenderName").textContent = sender;
        document.getElementById("receiverName").value = crush;
        mainQuestion.innerHTML = `Hey ${crush}, be my Valentine? 💖`;

        const yesBtn = document.getElementById("yesBtn");
        const noBtn = document.getElementById("noBtn");
        const interactionArea = document.getElementById("interactionArea");
        const successMessage = document.getElementById("successMessage");
        const receiverInput = document.getElementById("receiverName");

        // --- TEASING MOVE LOGIC ---
        const moveButton = () => {
            // Calculate a random position within the window
            const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 20);
            const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 20);
            
            noBtn.style.position = "fixed"; // Fixed allows free movement over everything
            noBtn.style.left = `${x}px`;
            noBtn.style.top = `${y}px`;
        };

        // 1. Mobile Touch (Instant Jump)
        noBtn.addEventListener("touchstart", (e) => {
             e.preventDefault(); 
             moveButton(); 
        });

        // 2. Desktop Mouse Proximity (Teasing Slide)
        document.addEventListener("mousemove", (e) => {
            const btnRect = noBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            // Calculate distance between mouse and button center
            const distance = Math.sqrt(
                Math.pow(e.clientX - btnCenterX, 2) + 
                Math.pow(e.clientY - btnCenterY, 2)
            );

            // TEASING DISTANCE: 80px (approx 2cm)
            // It lets you get closer before running away!
            if (distance < 80) {
                moveButton();
            }
        });
        
        // Fallback click handler
        noBtn.addEventListener("click", (e) => { e.preventDefault(); moveButton(); });

        // --- YES BUTTON LOGIC ---
        yesBtn.addEventListener("click", () => {
            const finalReceiverName = receiverInput.value.trim() || crush;

            interactionArea.style.display = "none";
            successMessage.classList.remove("hidden");

            const message = `Hey ${sender}! It's ${finalReceiverName}. I said YES to being your Valentine! 💖💘`;
            const waNumber = phone ? phone : ""; 
            const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

            // Wait 1.5 seconds to show the cute GIF, then redirect
            setTimeout(() => {
                window.location.href = waLink;
            }, 1500);
        });
    }
});
