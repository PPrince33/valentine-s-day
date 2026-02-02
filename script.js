document.addEventListener("DOMContentLoaded", () => {
  // ===== PART 1: INDEX.HTML (LINK GENERATOR) =====
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

  // ===== PART 2: VALENTINE.HTML (RECEIVER PAGE) =====
  const mainQuestion = document.getElementById("mainQuestion");

  if (mainQuestion) {
    // 1. Parse URL Parameters
    const params = new URLSearchParams(window.location.search);
    const sender = params.get("sender") || "Admirer";
    const crush = params.get("crush") || "You";
    const phone = params.get("phone");

    // 2. Set Texts
    const senderDisplay = document.getElementById("displaySenderName");
    if (senderDisplay) senderDisplay.textContent = sender;
    mainQuestion.innerHTML = `Dear ${crush}, will you be my Valentine? 💖`;

    // 3. Get buttons and UI elements
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const interactionArea = document.getElementById("interactionArea");
    const successMessage = document.getElementById("successMessage");

    // --- TEASING NO BUTTON LOGIC ---
    let hasSwitchedToAbsolute = false;
    let isAnimating = false;

    const moveNoBtn = (mouseX, mouseY) => {
      if (isAnimating) return;

      const btnRect = noBtn.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      // Distance between cursor/touch and button center
      const distance = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);

      // Trigger distance threshold
      if (distance < 100) {
        // Switch to absolute positioning once on first trigger to avoid jumps
        if (!hasSwitchedToAbsolute) {
          noBtn.style.position = "absolute";
          // Lock position exactly where it visually was
          noBtn.style.left = `${btnRect.left + window.scrollX}px`;
          noBtn.style.top = `${btnRect.top + window.scrollY}px`;
          // Add smooth transition for glide effect
          noBtn.style.transition = "left 0.4s ease-out, top 0.4s ease-out";
          hasSwitchedToAbsolute = true;
        }

        isAnimating = true;

        // Move in small random hops (30 to 80 pixels) to tease user
        const minMove = 30;
        const maxMove = 80;

        // Random offset in either direction
        const offsetX = (Math.random() * (maxMove - minMove) + minMove) * (Math.random() < 0.5 ? -1 : 1);
        const offsetY = (Math.random() * (maxMove - minMove) + minMove) * (Math.random() < 0.5 ? -1 : 1);

        // Calculate new position
        let newX = (parseFloat(noBtn.style.left) || 0) + offsetX;
        let newY = (parseFloat(noBtn.style.top) || 0) + offsetY;

        // Boundary constraints so button stays on screen
        const padding = 20;
        const maxLeft = window.innerWidth - noBtn.offsetWidth - padding;
        const maxTop = window.innerHeight - noBtn.offsetHeight - padding;

        newX = Math.min(Math.max(newX, padding), maxLeft);
        newY = Math.min(Math.max(newY, padding), maxTop);

        // Apply new position
        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;

        // After transition duration reset animation flag
        setTimeout(() => {
          isAnimating = false;
        }, 400);
      }
    };

    // Move No button away on mouse move near it
    document.addEventListener("mousemove", (e) => moveNoBtn(e.clientX, e.clientY));

    // On touch devices, move on touch start to tease finger
    noBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      moveNoBtn(touch.clientX, touch.clientY);
    });

    // Also tease on click just in case
    noBtn.addEventListener("click", (e) => {
      e.preventDefault();
      moveNoBtn(e.clientX, e.clientY);
    });

    // --- YES BUTTON CLICK ---
    yesBtn.addEventListener("click", () => {
      interactionArea.style.display = "none";
      successMessage.classList.remove("hidden");

      const message = `Hey ${sender}! It's ${crush}. I said YES to being your Valentine! 💖💘`;
      const waNumber = phone || "";
      const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

      setTimeout(() => {
        window.location.href = waLink;
      }, 1500);
    });
  }
});
