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
        
        // Setup initial position
        const yesRect = yesBtn.getBoundingClientRect();

        const noBtnOriginalPos = {
          x: yesRect.right + 20,  // 20px to the right of Yes button
          y: yesRect.top          // aligned vertically with Yes button
        };
        
        noBtn.style.position = "absolute";
        noBtn.style.left = `${noBtnOriginalPos.x}px`;
        noBtn.style.top = `${noBtnOriginalPos.y}px`;
        noBtn.style.transition = "left 0.2s ease, top 0.2s ease";

        const maxMoveDistance = 50; 
        let moveTimeout;

        const moveNoBtn = (mouseX, mouseY) => {
            const btnRect = noBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            const distance = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);

            // Dodge if close (80px)
            if (distance < 80) {
                const offsetX = (Math.random() * 2 - 1) * maxMoveDistance;
                const offsetY = (Math.random() * 2 - 1) * maxMoveDistance;

                let newX = noBtnOriginalPos.x + offsetX;
                let newY = noBtnOriginalPos.y + offsetY;

                const padding = 10;
                const maxLeft = window.innerWidth - noBtn.offsetWidth - padding;
                const maxTop = window.innerHeight - noBtn.offsetHeight - padding;

                newX = Math.min(Math.max(newX, padding), maxLeft);
                newY = Math.min(Math.max(newY, padding), maxTop);

                noBtn.style.left = `${newX}px`;
                noBtn.style.top = `${newY}px`;

                if (moveTimeout) clearTimeout(moveTimeout);
                moveTimeout = setTimeout(() => {
                    noBtn.style.left = `${noBtnOriginalPos.x}px`;
                    noBtn.style.top = `${noBtnOriginalPos.y}px`;
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
