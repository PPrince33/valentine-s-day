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

        // 1. Update the Text exactly as requested
        document.getElementById("displaySenderName").textContent = sender;
        mainQuestion.innerHTML = `Dear ${crush}, will you be my Valentine? 💖`;

        const yesBtn = document.getElementById("yesBtn");
        const noBtn = document.getElementById("noBtn");
        const interactionArea = document.getElementById("interactionArea");
        const successMessage = document.getElementById("successMessage");

        // --- TEASING LOGIC (The Dodge) ---
        
        // --- TEASING LOGIC (The Dodge) ---
        
        // We track if the button has started moving yet
        let hasMoved = false;

        // Calculate where we WANT it to be relative to the Yes button, 
        // but we won't apply this until the mouse gets close.
        const getOriginalPos = () => {
            const yesRect = yesBtn.getBoundingClientRect();
            return {
                x: yesRect.right + 20, // 20px to the right of Yes
                y: yesRect.top         // Aligned with top of Yes
            };
        };

        // Initialize variables
        const maxMoveDistance = 50; 
        let moveTimeout;

        const moveNoBtn = (mouseX, mouseY) => {
            const btnRect = noBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            const distance = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);

            // Trigger the dodge if mouse is close (within 80px)
            if (distance < 80) {
                
                // 1. FIRST TIME SETUP: 
                // If the button is still static (sitting next to Yes naturally),
                // we switch it to absolute positioning now so it can move.
                if (!hasMoved) {
                    noBtn.style.position = "absolute";
                    // We set the initial coordinates to match its current visual spot
                    // adding scrollX/Y ensures it doesn't jump if the page is scrolled
                    noBtn.style.left = `${btnRect.left + window.scrollX}px`;
                    noBtn.style.top = `${btnRect.top + window.scrollY}px`;
                    hasMoved = true;
                }

                // 2. THE MOVE LOGIC:
                // Now we calculate the random move
                const offsetX = (Math.random() * 2 - 1) * maxMoveDistance;
                const offsetY = (Math.random() * 2 - 1) * maxMoveDistance;

                // We calculate new positions based on where it currently is
                let newX = (parseFloat(noBtn.style.left) || 0) + offsetX;
                let newY = (parseFloat(noBtn.style.top) || 0) + offsetY;

                // Keep within screen bounds
                const padding = 10;
                const maxLeft = window.innerWidth - noBtn.offsetWidth - padding;
                const maxTop = window.innerHeight - noBtn.offsetHeight - padding;

                newX = Math.min(Math.max(newX, padding), maxLeft);
                newY = Math.min(Math.max(newY, padding), maxTop);

                noBtn.style.left = `${newX}px`;
                noBtn.style.top = `${newY}px`;

                // Optional: Reset to near Yes button after 2 seconds
                if (moveTimeout) clearTimeout(moveTimeout);
                moveTimeout = setTimeout(() => {
                    const resetPos = getOriginalPos();
                    noBtn.style.left = `${resetPos.x + window.scrollX}px`;
                    noBtn.style.top = `${resetPos.y + window.scrollY}px`;
                }, 2000);
            }
        };

        document.addEventListener("mousemove", (e) => moveNoBtn(e.clientX, e.clientY));
        
        noBtn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            moveNoBtn(touch.clientX, touch.clientY);
        });

        noBtn.addEventListener("click", (e) => {
            e.preventDefault();
            moveNoBtn(e.clientX, e.clientY);
        });

        // --- YES BUTTON LOGIC ---
        yesBtn.addEventListener("click", () => {
            
            interactionArea.style.display = "none";
            successMessage.classList.remove("hidden");

            // No need to check input anymore, just use the 'crush' variable from URL
            const message = `Hey ${sender}! It's ${crush}. I said YES to being your Valentine! 💖💘`;
            const waNumber = phone ? phone : ""; 
            const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

            setTimeout(() => {
                window.location.href = waLink;
            }, 1500);
        });
    }
});
