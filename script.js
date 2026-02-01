document.addEventListener("DOMContentLoaded", () => {
    
    // --- PART 1: INDEX.HTML LOGIC ---
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

            const cleanPhone = phone.replace(/\D/g, '');
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/")) + "/valentine.html";
            const finalLink = `${baseUrl}?sender=${encodeURIComponent(sender)}&crush=${encodeURIComponent(crush)}&phone=${cleanPhone}`;

            generatedLinkInput.value = finalLink;
            crushNameDisplay.textContent = crush;
            resultArea.classList.remove("hidden");
        });

        copyBtn.addEventListener("click", () => {
            generatedLinkInput.select();
            generatedLinkInput.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(generatedLinkInput.value).then(() => {
                copyBtn.textContent = "Copied!";
                setTimeout(() => copyBtn.textContent = "Copy", 2000);
            });
        });
    }

    // --- PART 2: VALENTINE.HTML LOGIC ---
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

        // Initialize button position variables
        // We set position absolute here so it can move freely
        noBtn.style.position = "absolute"; 

        // --- THE "MAGNETIC" REPULSION LOGIC ---
        const moveButton = (mouseX, mouseY) => {
            const btnRect = noBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            // Calculate the distance vector (Button - Mouse)
            let deltaX = btnCenterX - mouseX;
            let deltaY = btnCenterY - mouseY;

            // If the mouse is directly on top (0 distance), give it a random nudge
            if (deltaX === 0 && deltaY === 0) {
                deltaX = (Math.random() - 0.5) * 10;
                deltaY = (Math.random() - 0.5) * 10;
            }

            // Calculate the angle to move away
            const angle = Math.atan2(deltaY, deltaX);

            // Move Distance: A short hop (150px) instead of random teleport
            const moveDistance = 150; 

            // Calculate new position
            let newX = btnRect.left + (Math.cos(angle) * moveDistance);
            let newY = btnRect.top + (Math.sin(angle) * moveDistance);

            // --- BOUNDARY CHECKS (Keep it on screen) ---
            const padding = 20; // Keep away from edge
            const maxWidth = window.innerWidth - btnRect.width - padding;
            const maxHeight = window.innerHeight - btnRect.height - padding;

            // If it hits the Left/Right wall, bounce it back to center
            if (newX < padding) newX = padding + 50;
            if (newX > maxWidth) newX = maxWidth - 50;

            // If it hits Top/Bottom wall, bounce it back to center
            if (newY < padding) newY = padding + 50;
            if (newY > maxHeight) newY = maxHeight - 50;

            // Apply new position
            noBtn.style.left = `${newX}px`;
            noBtn.style.top = `${newY}px`;
        };

        // 1. Mobile Touch (Instant Jump)
        noBtn.addEventListener("touchstart", (e) => {
             e.preventDefault();
             // Pass touch coordinates
             const touch = e.touches[0];
             moveButton(touch.clientX, touch.clientY);
        });

        // 2. Desktop Mouse (Proximity Slide)
        document.addEventListener("mousemove", (e) => {
            const btnRect = noBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            // Distance Math
            const distance = Math.sqrt(
                Math.pow(e.clientX - btnCenterX, 2) + 
                Math.pow(e.clientY - btnCenterY, 2)
            );

            // TRIGGER DISTANCE: 100px
            // If mouse gets closer than 100px, push the button away
            if (distance < 100) {
                moveButton(e.clientX, e.clientY);
            }
        });
        
        // Fallback click handler
        noBtn.addEventListener("click", (e) => { 
            e.preventDefault(); 
            moveButton(e.clientX, e.clientY); 
        });

        // --- YES BUTTON LOGIC ---
        yesBtn.addEventListener("click", () => {
            const finalReceiverName = receiverInput.value.trim() || crush;

            interactionArea.style.display = "none";
            successMessage.classList.remove("hidden");

            const message = `Hey ${sender}! It's ${finalReceiverName}. I said YES to being your Valentine! 💖💘`;
            const waNumber = phone ? phone : ""; 
            const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

            setTimeout(() => {
                window.location.href = waLink;
            }, 1500);
        });
    }
});
