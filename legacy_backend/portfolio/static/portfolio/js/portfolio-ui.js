
/**
 * Portfolio UI Controller
 * Shared contact modal, email validation and Web3Forms submission.
 */
(() => {
  "use strict";

  const modal = document.getElementById("floating-contact-modal");
  const closeButton = document.getElementById("close-contact-modal");
  let previousFocus = null;

  const setStatus = (box, message, type = "") => {
    if (!box) return;
    box.textContent = message;
    box.className = "form-status-alert";
    if (type) box.classList.add(`alert-${type}`);
    box.hidden = !message;
  };

  function openModal() {
    if (!modal) return;

    previousFocus = document.activeElement;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("contact-modal-open");

    window.setTimeout(() => {
      modal.querySelector('input[name="name"]')?.focus();
    }, 120);
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("contact-modal-open");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  // Any element with data-contact-open opens the shared modal.
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-contact-open]");
    if (trigger) {
      event.preventDefault();
      openModal();
    }
  });

  closeButton?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal?.classList.contains("active")) {
      closeModal();
    }
  });

  // Support all Web3Forms contact forms on the site.
  document.querySelectorAll(
    "#floating-contact-form, #contact-form"
  ).forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const emailInput = form.querySelector('input[name="email"]');
      const submitButton = form.querySelector('button[type="submit"]');
      const statusBox = form.id === "floating-contact-form"
        ? document.getElementById("modal-alert-box")
        : document.getElementById("form-alert-box");

      const buttonText = submitButton?.querySelector("span");
      const originalText = buttonText?.textContent || "Transmit Message";

      if (!emailInput) {
        setStatus(statusBox, "Email field is missing. Please refresh and try again.", "error");
        return;
      }

      const email = emailInput.value.trim().toLowerCase();
      emailInput.value = email;

      // Browser validation checks format. Django checks the domain's DNS.
      try {
        const validationUrl = new URL(
          "/validate-email-domain/",
          window.location.origin
        );
        validationUrl.searchParams.set("email", email);

        if (buttonText) buttonText.textContent = "Checking email...";
        if (submitButton) submitButton.disabled = true;

        const validationResponse = await fetch(validationUrl, {
          headers: { "Accept": "application/json" }
        });

        const validationData = await validationResponse.json();

        if (!validationResponse.ok || !validationData.valid) {
          setStatus(
            statusBox,
            validationData.message || "Please check your email address.",
            "error"
          );
          emailInput.setCustomValidity(
            validationData.message || "Please check your email address."
          );
          emailInput.reportValidity();
          return;
        }
      } catch (error) {
        setStatus(
          statusBox,
          "Email-domain verification is temporarily unavailable. Please try again.",
          "error"
        );
        return;
      } finally {
        if (submitButton) submitButton.disabled = false;
        if (buttonText) buttonText.textContent = originalText;
      }

      // Clear any previous custom validation message.
      emailInput.setCustomValidity("");

      try {
        if (submitButton) submitButton.disabled = true;
        if (buttonText) buttonText.textContent = "Transmitting...";
        setStatus(statusBox, "Sending your message...");

        const response = await fetch(form.action, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(Object.fromEntries(new FormData(form)))
        });

        const result = await response.json();

        if (!response.ok || result.success !== true) {
          throw new Error(result.message || "Message delivery failed.");
        }

        form.reset();
        setStatus(
          statusBox,
          "Message sent successfully. Thank you for reaching out.",
          "success"
        );
      } catch (error) {
        setStatus(
          statusBox,
          error.message || "Unable to send your message. Please try again or email directly.",
          "error"
        );
      } finally {
        if (submitButton) submitButton.disabled = false;
        if (buttonText) buttonText.textContent = originalText;
      }
    });
  });
})();
