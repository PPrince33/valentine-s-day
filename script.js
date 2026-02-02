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
                // --- PART 2: VALENTINE.HTML LOGIC ---
                const mainQuestion = document.getElementById("mainQuestion");
                
                if (mainQuestion) {
                    const params = new URLSearchParams(window.location.search);
                    const sender = params.get("sender") || "Admirer";
                    const crush = params.get("crush") || "You";
                    const phone = params.get("phone");
                
                    document.getElementById("displaySenderName").textContent = sender;
                    mainQuestion.innerHTML = `Dear ${crush}, will you be my Valentine? 💖`;
                
                    const yesBtn = document.getElementById("yesBtn");
                    const noBtn = document.getElementById("noBtn");
                    const interactionArea = document.getElementById("interactionArea");
                    const successMessage = document.getElementById("successMessage");
                
                    // --- SMOOTH TEASING LOGIC ---
                
                    let hasMoved = false;   // Has it left its original spot?
                    let isAnimating = false; // Is it currently gliding?
                
                    // 1. Helper to get the natural position next to Yes
                    const getOriginalPos = () => {
                        const yesRect = yesBtn.getBoundingClientRect();
                        return {
                            x: yesRect.right + 20,
                            y: yesRect.top
                        };
                    };
                
                    const moveNoBtn = (mouseX, mouseY) => {
                        // If it's currently gliding to a new spot, don't interrupt it
                        if (isAnimating) return;
                
                        const btnRect = noBtn.getBoundingClientRect();
                        const btnCenterX = btnRect.left + btnRect.width / 2;
                        const btnCenterY = btnRect.top + btnRect.height / 2;
                
                        const distance = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);
                
                        // If mouse gets closer than 100px
                        if (distance < 100) {
                            
                            // A. FIRST MOVE SETUP
                            if (!hasMoved) {
                                // Lock current position so it doesn't jump visually
                                noBtn.style.position = "absolute";
                                noBtn.style.left = `${btnRect.left + window.scrollX}px`;
                                noBtn.style.top = `${btnRect.top + window.scrollY}px`;
                                
                                // Add the smooth transition (The "Slow" part)
                                // 0.5s means it takes half a second to glide to the new spot
                                noBtn.style.transition = "left 0.5s ease-out, top 0.5s ease-out";
                                
                                hasMoved = true;
                            }
                
                            // B. CALCULATE NEW SPOT
                            isAnimating = true; // Lock movement until finished
                
                            // Move randomly between 50px and 150px away
                            const randomX = (Math.random() * 200) - 100; 
                            const randomY = (Math.random() * 200) - 100; 
                
                            let newX = (parseFloat(noBtn.style.left) || 0) + randomX;
                            let newY = (parseFloat(noBtn.style.top) || 0) + randomY;
                
                            // Keep it on screen (Padding logic)
                            const padding = 20;
                            const maxLeft = window.innerWidth - noBtn.offsetWidth - padding;
                            const maxTop = window.innerHeight - noBtn.offsetHeight - padding;
                
                            newX = Math.min(Math.max(newX, padding), maxLeft);
                            newY = Math.min(Math.max(newY, padding), maxTop);
                
                            // Apply new coordinates
                            noBtn.style.left = `${newX}px`;
                            noBtn.style.top = `${newY}px`;
                
                            // C. RESET COOLDOWN
                            // Wait 500ms (match the transition time) before checking mouse again
                            setTimeout(() => {
                                isAnimating = false; 
                            }, 500);
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
