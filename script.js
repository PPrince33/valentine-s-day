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
        const receiverInput = document.getElementById("receiverName");
        receiverInput.value = crush;
        mainQuestion.innerHTML = `Hey ${crush}, be my Valentine? 💖`;

        const yesBtn = document.getElementById("yesBtn");
        const noBtn = document.getElementById("noBtn");
        const interactionArea = document.getElementById("interactionArea");
        const successMessage = document.getElementById("successMessage");

        // Make NO button position absolute and add smooth transition for movement
        noBtn.style.position = "absolute";
        noBtn.style.transition = "left 0.3s ease, top 0.3s ease";

        // Save NO button original position on load
        let noBtnOriginalPos = { x: 0, y: 0 };
        const rect = noBtn.getBoundingClientRect();
        noBtnOriginalPos.x = rect.left;
        noBtnOriginalPos.y = rect.top;

        noBtn.style.left = `${noBtnOriginalPos.x}px`;
        noBtn.style.top = `${noBtnOriginalPos.y}px`;

        const maxMoveDistance = 30; // Max pixels to move in any direction
        let moveTimeout;

        // Function to move NO button teasingly within box around original pos
        const moveNoBtn = (mouseX, mouseY) => {
            const btnRect = noBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            // Calculate distance from mouse to center of button
            const distance = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);

            if (distance < 80) {
                // Random offset in range [-maxMoveDistance, maxMoveDistance]
                const offsetX = (Math.random() * 2 - 1) * maxMoveDistance;
                const offsetY = (Math.random() * 2 - 1) * maxMoveDistance;

                let newX = noBtnOriginalPos.x + offsetX;
                let newY = noBtnOriginalPos.y + offsetY;

                // Clamp inside viewport with 10px padding
                const padding = 10;
                const maxLeft = window.innerWidth - noBtn.offsetWidth - padding;
                const maxTop = window.innerHeight - noBtn.offsetHeight - padding;

                newX = Math.min(Math.max(newX, padding), maxLeft);
                newY = Math.min(Math.max(newY, padding), maxTop);

                noBtn.style.left = `${newX}px`;
                noBtn.style.top = `${newY}px`;

                // Clear previous reset timeout and set new one to reset position
                if (moveTimeout) clearTimeout(moveTimeout);
                moveTimeout = setTimeout(() => {
                    noBtn.style.left = `${noBtnOriginalPos.x}px`;
                    noBtn.style.top = `${noBtnOriginalPos.y}px`;
                }, 2000);
            }
        };

        // Mousemove listener to trigger NO button move near cursor
        document.addEventListener("mousemove", (e) => {
            moveNoBtn(e.clientX, e.clientY);
        });

        // Touch support for mobile
        noBtn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            moveNoBtn(touch.clientX, touch.clientY);
        });

        // Prevent default NO button click, move it instead
        noBtn.addEventListener("click", (e) => {
            e.preventDefault();
            moveNoBtn(e.clientX, e.clientY);
        });

        // YES button click handler
        yesBtn.addEventListener("click", () => {
            const finalReceiverName = receiverInput.value.trim() || crush;

            interactionArea.style.display = "none";
            successMessage.classList.remove("hidden");

            // Compose WhatsApp message with sender and receiver names
            const message = `Hey ${sender}! It's ${finalReceiverName}. I said YES to being your Valentine! 💖💘`;
            const waNumber = phone ? phone : ""; 
            const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

            // Redirect to WhatsApp after short delay
            setTimeout(() => {
                window.location.href = waLink;
            }, 1500);
        });
    }
});
