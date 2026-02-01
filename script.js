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

        // Set initial position to absolute so it can move
        noBtn.style.position = "absolute"; 

        // --- MAGNETIC LOGIC WITH STRICT WALLS ---
        const moveButton = (mouseX, mouseY) => {
            const btnRect = noBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            // 1. Calculate Vector away from mouse
            let deltaX = btnCenterX - mouseX;
            let deltaY = btnCenterY - mouseY;

            // If mouse is exactly on center, nudge it randomly
            if (deltaX === 0 && deltaY === 0) {
                deltaX = Math.random() < 0.5 ? 10 : -10;
                deltaY = Math.random() < 0.5 ? 10 : -10;
            }

            // 2. Calculate Angle & Move Distance
            const angle = Math.atan2(deltaY, deltaX);
            const moveDistance = 150; // Move 150px away

            // 3. Calculate Potential New Position
            let newX = btnRect.left + (Math.cos(angle) * moveDistance);
            let newY = btnRect.top + (Math.sin(angle) * moveDistance);

            // 4. STRICT WALL CLAMPING (The Fix)
            // This ensures newX is never less than 10, and never more than width-button-10
            const padding = 10;
            const maxLeft = window.innerWidth - noBtn.offsetWidth - padding;
            const maxTop = window.innerHeight - noBtn.offsetHeight - padding;

            // Math.min/max logic:
            // "Don't let it go smaller than 'padding'"
            // "Don't let it go bigger than 'maxLeft'"
            newX = Math.min(Math.max(newX, padding), maxLeft);
            newY = Math.min(Math.max(newY, padding), maxTop);

            // 5. Apply Position
            noBtn.style.left = `${newX}px`;
            noBtn.style.top = `${newY}px`;
        };

        // Mobile Touch
        noBtn.addEventListener("touchstart", (e) => {
             e.preventDefault();
             const touch = e.touches[0];
             moveButton(touch.clientX, touch.clientY);
        });

        // Desktop Mouse
        document.addEventListener("mousemove", (e) => {
            const btnRect = noBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            const distance = Math.sqrt(
                Math.pow(e.clientX - btnCenterX, 2) + 
                Math.pow(e.clientY - btnCenterY, 2)
            );

            // Trigger movement if closer than 100px
            if (distance < 100) {
                moveButton(e.clientX, e.clientY);
            }
        });
        
        // Fallback Click
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
