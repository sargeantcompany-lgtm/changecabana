const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");

if (contactForm && contactStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };
    if (!payload.name || !payload.email || !payload.message) {
      contactStatus.textContent = "Please fill in all fields.";
      contactStatus.dataset.state = "error";
      return;
    }
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    contactStatus.textContent = "Sending...";
    contactStatus.dataset.state = "loading";
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong.");
      contactForm.reset();
      contactStatus.textContent = "Message sent. We'll be in touch soon.";
      contactStatus.dataset.state = "success";
    } catch (error) {
      contactStatus.textContent = error.message || "Unable to send right now.";
      contactStatus.dataset.state = "error";
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

const form = document.querySelector("#waitlist-form");
const status = document.querySelector("#form-status");

if (form && status) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email) {
      status.textContent = "Please add your name and email.";
      status.dataset.state = "error";
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
    }

    status.textContent = "Joining waitlist...";
    status.dataset.state = "loading";

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      form.reset();
      status.textContent = "Thanks. You're on the Change Cabana waitlist.";
      status.dataset.state = "success";
    } catch (error) {
      status.textContent = error.message || "Unable to submit right now.";
      status.dataset.state = "error";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}
