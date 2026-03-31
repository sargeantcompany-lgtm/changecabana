const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const contactStatus = document.querySelector("#contact-status");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    formData.append("access_key", "ea1dc0a7-6d8d-47b9-bbc9-123f70ed45e0");

    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        contactForm.reset();
        contactStatus.textContent = "Message sent. We'll be in touch soon.";
        contactStatus.dataset.state = "success";
      } else {
        contactStatus.textContent = data.message || "Something went wrong.";
        contactStatus.dataset.state = "error";
      }
    } catch (error) {
      contactStatus.textContent = "Something went wrong. Please try again.";
      contactStatus.dataset.state = "error";
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
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
