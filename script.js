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

            // Clean phone number (digits only)
            const cleanPhone = phone.replace(/\D/g, '');

            // Construct Link
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/")) + "/valentine.html";
            
            // Encode all data
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

    // --- PART 2: VALENTINE.HTML LOGIC (Receiver sees question) ---
    const mainQuestion = document.getElementById("mainQuestion");

    if (mainQuestion) {
        // 1. Get Params
        const params = new URLSearchParams(window.location.search);
        const sender = params.get("sender") || "Admirer";
        const crush = params.get("crush") || "You";
        const phone = params.get("phone");

        // 2. Personalize Page
        // "Hey [Crush], will you be [Sender]'s Valentine?"
        // Or simply update the names in existing elements
        document.getElementById("displaySenderName").textContent = sender;
        document.getElementById("receiverName").value = crush; // Pre-fill their name
        mainQuestion.innerHTML = `Hey ${crush}, be my Valentine? 💖`;

        const yesBtn = document.getElementById("yesBtn");
        const noBtn = document.getElementById("noBtn");
        const interactionArea = document.getElementById("interactionArea");
        const successMessage = document.getElementById("successMessage");
        const receiverInput = document.getElementById("receiverName");

        // 3. THE IRRITATING "NO" BUTTON LOGIC (Proximity Check)
        const moveButton = () => {
            const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 20);
            const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 20);
            noBtn.style.position = "fixed"; // Fixed ensures it breaks out of the flex container
            noBtn.style.left = `${x}px`;
            noBtn.style.top = `${y}px`;
        };

        // Standard hover/click (fallback)
        noBtn.addEventListener("click", (e) => { e.preventDefault(); moveButton(); });
        noBtn.addEventListener("mouseover", moveButton);

        // Advanced Proximity Logic (The "Force Field")
        document.addEventListener("mousemove", (e) => {
            const btnRect = noBtn.getBoundingClientRect();
            const btnCenterX = btnRect.left + btnRect.width / 2;
            const btnCenterY = btnRect.top + btnRect.height / 2;

            // Calculate distance between mouse and button center
            const distance = Math.sqrt(
                Math.pow(e.clientX - btnCenterX, 2) + 
                Math.pow(e.clientY - btnCenterY, 2)
            );

            // If closer than 150px (approx 3-4cm), MOVE IT!
            if (distance < 150) {
                moveButton();
            }
        });

        // 4. YES Button Logic
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
