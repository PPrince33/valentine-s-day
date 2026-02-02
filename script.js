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
        setTimeout(() => (copyBtn.textContent = "Copy"), 2000);
      });
    });
  }

  // ===== PART 2: VALENTINE.HTML (RECEIVER PAGE) =====
  const mainQuestion = document.getElementById("mainQuestion");

  if (mainQuestion) {
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const sender = params.get("sender") || "Admirer";
    const crush = params.get("crush") || "You";
    const phone = params.get("phone");

    // Set sender display and main question text
    const senderDisplay = document.getElementById("displaySenderName");
    if (senderDisplay) senderDisplay.textContent = sender;
    mainQuestion.innerHTML = `Dear ${crush}, will you be my Valentine? 💖`;

    // Get buttons and areas
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const interactionArea = document.getElementById("interactionArea");
    const successMessage = document.getElementById("successMessage");

    // State flags
    let hasSwitchedToAbsolute = false;
    let isAnimating = false;

    const moveNoBtn = (mouseX, mouseY) => {
      if (isAnimating) return;

      const btnRect = noBtn.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const distance = Math.hypot(mouseX - btnCenterX, mouseY - btnCenterY);

      if (distance < 100) {
        if (!hasSwitchedToAbsolute) {
          // Lock position and switch to absolute
          noBtn.style.position = "absolute";
          noBtn.style.left = `${btnRect.left + window.scrollX}px`;
          noBtn.style.top = `${btnRect.top + window.scrollY}px`;
          noBtn.style.transition = "left 0.4s ease-out, top 0.4s ease-out";
          hasSwitchedToAbsolute = true;
        }

        isAnimating = true;

        // Random offset between 30 and 80 pixels in random direction
        const minMove = 30;
        const maxMove = 80;

        const offsetX = (Math.random() * (maxMove - minMove) + minMove) * (Math.random() < 0.5 ? -1 : 1);
        const offsetY = (Math.random() * (maxMove - minMove) + minMove) * (Math.random() < 0.5 ? -1 : 1);

        let newX = (parseFloat(noBtn.style.left) || 0) + offsetX;
        let newY = (parseFloat(noBtn.style.top) || 0) + offsetY;

        // Keep inside viewport with padding
        const padding = 20;
        const maxLeft = window.innerWidth - noBtn.offsetWidth - padding;
        const maxTop = window.innerHeight - noBtn.offsetHeight - padding;

        newX = Math.min(Math.max(newX, padding), maxLeft);
        newY = Math.min(Math.max(newY, padding), maxTop);

        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;

        // Reset animation flag after transition ends (400ms)
        setTimeout(() => {
          isAnimating = false;
        }, 400);
      }
    };

    // Mouse move listener to trigger No button move
    document.addEventListener("mousemove", (e) => moveNoBtn(e.clientX, e.clientY));

    // Touch on No button to trigger move (mobile)
    noBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      moveNoBtn(touch.clientX, touch.clientY);
    });

    // Click on No button triggers move too (just in case)
    noBtn.addEventListener("click", (e) => {
      e.preventDefault();
      moveNoBtn(e.clientX, e.clientY);
    });

    // Yes button click handler
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
