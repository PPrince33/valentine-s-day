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

        // Update text content as requested
        document.getElementById("displaySenderName").textContent = sender;
        mainQuestion.innerHTML = `Dear ${crush}, will you be my Valentine? 💖`;

        const yesBtn = document.getElementById("yesBtn");
        const noBtn = document.getElementById("noBtn");
        const interactionArea = document.getElementById("interactionArea");
        const successMessage = document.getElementById("successMessage");

        // --- TEASING LOGIC (Smooth Dodge) ---
        // Position No button near Yes button initially
        const getOriginalPos = () => {
            const yesRect = yesBtn.getBoundingClientRect();
            return {
                x: yesRect.right + 20,
                y: yesRect.top
            };
        };

        let noBtnOriginalPos = getOriginalPos();
        let isAnimating = false;
        let returnTimeout;

        // Set initial style and position for No button
        noBtn.style.position = "absolute";
        noBtn.style.left = `${noBtnOriginalPos.x}px`;
        noBtn.style.top = `${noBtnOriginalPos.y}px`;
        noBtn.style.transition = "left 0.5s ease-out, top 0.5s ease-out";

        const maxMoveDistance = 100;
        const dodgeDistanceTrigger = 80;
        
        const moveNoBtn = (mouseX, mouseY) => {
            if (isAnimating) return;

            const btnRect = noBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            const distance = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);

            if (distance < dodgeDistanceTrigger) {
                isAnimating = true;

                // Random offset between -maxMoveDistance and +maxMoveDistance
                const offsetX = (Math.random() * 2 - 1) * maxMoveDistance;
                const offsetY = (Math.random() * 2 - 1) * maxMoveDistance;

                let newX = noBtnOriginalPos.x + offsetX;
                let newY = noBtnOriginalPos.y + offsetY;

                // Keep button inside viewport boundaries with padding
                const padding = 20;
                const maxLeft = window.innerWidth - noBtn.offsetWidth - padding;
                const maxTop = window.innerHeight - noBtn.offsetHeight - padding;

                newX = Math.min(Math.max(newX, padding), maxLeft);
                newY = Math.min(Math.max(newY, padding), maxTop);

                noBtn.style.left = `${newX}px`;
                noBtn.style.top = `${newY}px`;

                // Clear any existing timeout before setting a new one
                if (returnTimeout) clearTimeout(returnTimeout);

                // After 1.5 seconds, return smoothly to original position
                returnTimeout = setTimeout(() => {
                    noBtn.style.left = `${noBtnOriginalPos.x}px`;
                    noBtn.style.top = `${noBtnOriginalPos.y}px`;
                    isAnimating = false;
                }, 1500);
            }
        };

        document.addEventListener("mousemove", (e) => moveNoBtn(e.clientX, e.clientY));

        // Mobile touch support
        noBtn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            moveNoBtn(touch.clientX, touch.clientY);
        });

        // --- YES BUTTON LOGIC ---
        yesBtn.addEventListener("click", () => {
            interactionArea.style.display = "none";
            successMessage.classList.remove("hidden");

            const message = `Hey ${sender}! It's ${crush}. I said YES to being your Valentine! 💖💘`;
            const waNumber = phone ? phone : ""; 
            const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

            setTimeout(() => {
                window.location.href = waLink;
            }, 1500);
        });
    }
});
