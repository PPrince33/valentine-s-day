document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // --- PART 1: INDEX.HTML (GENERATOR) ---
    // ==========================================
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
            // Assumes valentine.html is in the same folder
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/")) + "/valentine.html";
            const finalLink = `${baseUrl}?sender=${encodeURIComponent(sender)}&crush=${encodeURIComponent(crush)}&phone=${cleanPhone}`;

            generatedLinkInput.value = finalLink;
            crushNameDisplay.textContent = crush;
            resultArea.classList.remove("hidden");
        });

        copyBtn.addEventListener("click", () => {
            generatedLinkInput.select();
            generatedLinkInput.setSelectionRange(0, 99999); // For mobile
            navigator.clipboard.writeText(generatedLinkInput.value).then(() => {
                copyBtn.textContent = "Copied!";
                setTimeout(() => copyBtn.textContent = "Copy", 2000);
            });
        });
    }

    // ==========================================
    // --- PART 2: VALENTINE.HTML (RECEIVER) ---
    // ==========================================
    const mainQuestion = document.getElementById("mainQuestion");

    if (mainQuestion) {
        // 1. Get URL Parameters
        const params = new URLSearchParams(window.location.search);
        const sender = params.get("sender") || "Admirer";
        const crush = params.get("crush") || "You";
        const phone = params.get("phone");

        // 2. Set Text Content
        const senderDisplay = document.getElementById("displaySenderName");
        if(senderDisplay) senderDisplay.textContent = sender;
        mainQuestion.innerHTML = `Dear ${crush}, will you be my Valentine? 💖`;

        // 3. Get Elements
        const yesBtn = document.getElementById("yesBtn");
        const noBtn = document.getElementById("noBtn");
        const interactionArea = document.getElementById("interactionArea");
        const successMessage = document.getElementById("successMessage");

        // --- TEASING LOGIC (The Smooth Dodge) ---
        
        // State variables
        let hasMoved = false;     // Tracks if we have switched to absolute positioning
        let isAnimating = false;  // Tracks if the button is currently gliding

        const moveNoBtn = (mouseX, mouseY) => {
            // Don't calculate if currently mid-animation
            if (isAnimating) return;

            const btnRect = noBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            // Calculate distance between mouse and button center
            const distance = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);

            // TRIGGER DISTANCE: If mouse gets within 100px
            if (distance < 100) {
                
                // STEP A: The Initial Switch
                // The first time the user gets close, we lock the button's 
                // visual position but switch it to 'absolute' so it can move freely.
                if (!hasMoved) {
                    noBtn.style.position = "absolute";
                    noBtn.style.left = `${btnRect.left + window.scrollX}px`;
                    noBtn.style.top = `${btnRect.top + window.scrollY}px`;
                    
                    // Add smooth transition for the movement
                    noBtn.style.transition = "left 0.4s ease-out, top 0.4s ease-out";
                    hasMoved = true;
                }

                // STEP B: The Move
                isAnimating = true;

                // Move small pixels away (Teasing effect: 30px to 80px jumps)
                // We use Math.random() to make it unpredictable
                const moveRange = 80; 
                const offsetX = (Math.random() * moveRange * 2) - moveRange; 
                const offsetY = (Math.random() * moveRange * 2) - moveRange; 

                let newX = (parseFloat(noBtn.style.left) || 0) + offsetX;
                let newY = (parseFloat(noBtn.style.top) || 0) + offsetY;

                // Screen Boundary Checks (Keep it on screen)
                const padding = 20;
                const maxLeft = window.innerWidth - noBtn.offsetWidth - padding;
                const maxTop = window.innerHeight - noBtn.offsetHeight - padding;

                newX = Math.min(Math.max(newX, padding), maxLeft);
                newY = Math.min(Math.max(newY, padding), maxTop);

                // Apply new position
                noBtn.style.left = `${newX}px`;
                noBtn.style.top = `${newY}px`;

                // Reset animation flag after transition finishes (400ms)
                setTimeout(() => {
                    isAnimating = false;
                }, 400);
            }
        };

        // Desktop: Run away on mouse hover
        document.addEventListener("mousemove", (e) => moveNoBtn(e.clientX, e.clientY));
        
        // Mobile: Run away on touch
        noBtn.addEventListener("touchstart", (e) => {
            e.preventDefault(); // Prevents "click"
            const touch = e.touches[0];
            moveNoBtn(touch.clientX, touch.clientY);
        });
        
        // Fallback: Click
        noBtn.addEventListener("click", (e) => {
            e.preventDefault();
            moveNoBtn(e.clientX, e.clientY);
        });

        // --- YES BUTTON LOGIC ---
        yesBtn.addEventListener("click", () => {
            interactionArea.style.display = "none";
            successMessage.classList.remove("hidden");

            const message = `Hey ${sender}! It's ${crush}. I said YES to being your Valentine! 💖💘`;
            const waNumber = phone ? phone : ""; 
            const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

            // Wait 1.5 seconds so they can see the success message, then redirect
            setTimeout(() => {
                window.location.href = waLink;
            }, 1500);
        });
    }
});
