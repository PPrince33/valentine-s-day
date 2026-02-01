document.addEventListener("DOMContentLoaded", () => {
    
    // --- PART 1: INDEX.HTML LOGIC (Sender creates link) ---
    const createLinkBtn = document.getElementById("createLinkBtn");

    if (createLinkBtn) {
        const senderNameInput = document.getElementById("senderName");
        const senderPhoneInput = document.getElementById("senderPhone");
        const resultArea = document.getElementById("resultArea");
        const generatedLinkInput = document.getElementById("generatedLink");
        const copyBtn = document.getElementById("copyBtn");

        createLinkBtn.addEventListener("click", () => {
            const name = senderNameInput.value.trim();
            const phone = senderPhoneInput.value.trim();

            if (!name || !phone) {
                alert("Please enter both your Name and WhatsApp Number! 🌸");
                return;
            }

            // Clean phone number (remove spaces, +, -)
            const cleanPhone = phone.replace(/\D/g, '');

            // Construct the Link
            // It finds where valentine.html is relative to the current page
            const currentUrl = window.location.href;
            const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/")) + "/valentine.html";
            
            // We encode the data into the URL
            const finalLink = `${baseUrl}?sender=${encodeURIComponent(name)}&phone=${cleanPhone}`;

            generatedLinkInput.value = finalLink;
            resultArea.classList.remove("hidden");
        });

        // Copy logic
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
    const displaySenderName = document.getElementById("displaySenderName");

    if (displaySenderName) {
        // 1. Get Params from URL
        const params = new URLSearchParams(window.location.search);
        const sender = params.get("sender") || "Someone";
        const phone = params.get("phone");
        
        displaySenderName.textContent = sender;

        const yesBtn = document.getElementById("yesBtn");
        const noBtn = document.getElementById("noBtn");
        const interactionArea = document.getElementById("interactionArea");
        const successMessage = document.getElementById("successMessage");
        const receiverNameInput = document.getElementById("receiverName");

        // "NO" Button - Runs away
        const moveButton = () => {
            const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 20);
            const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 20);
            noBtn.style.position = "absolute";
            noBtn.style.left = `${x}px`;
            noBtn.style.top = `${y}px`;
        };
        noBtn.addEventListener("mouseover", moveButton);
        noBtn.addEventListener("touchstart", moveButton);
        noBtn.addEventListener("click", (e) => e.preventDefault());

        // "YES" Button - Redirects to WhatsApp
        yesBtn.addEventListener("click", () => {
            const receiver = receiverNameInput.value.trim();

            if (!receiver) {
                alert("Please enter your name first! 💕");
                return;
            }

            // Hide inputs, show success
            interactionArea.style.display = "none";
            successMessage.classList.remove("hidden");

            // Construct WhatsApp Message
            // Format: "Hey [Sender], It's [Receiver]. I said YES! 💖"
            const message = `Hey ${sender}! It's ${receiver}. I said YES to being your Valentine! 💖💘`;
            
            // Create WhatsApp Link
            // Check if phone exists, otherwise fallback (shouldn't happen if created correctly)
            const waNumber = phone ? phone : ""; 
            const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

            // Delay slightly so they see the "Success" message, then redirect
            setTimeout(() => {
                window.location.href = waLink;
            }, 1500);
        });
    }
});
