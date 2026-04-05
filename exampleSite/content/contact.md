---
title: "Contact"
description: "Questions, corrections, or just want to share what you made — get in touch."
---

{{< columns >}}
{{< col >}}
### Get in touch

<form class="contact-form" action="https://formspree.io/f/your-form-id" method="POST">
  <div class="contact-form__field">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" placeholder="Your name" required>
  </div>
  <div class="contact-form__field">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" placeholder="you@example.com" required>
  </div>
  <div class="contact-form__field">
    <label for="message">Message</label>
    <textarea id="message" name="message" placeholder="What's on your mind?" required></textarea>
  </div>
  <button type="submit" class="contact-form__submit">Send message</button>
</form>
{{< /col >}}
{{< col >}}
### Find me online

<ul class="social-links">
  <li>
    <a href="https://www.instagram.com/example" class="social-link" rel="noopener">
      <span class="material-symbols-outlined" aria-hidden="true">photo_camera</span>
      Instagram — @example
    </a>
  </li>
  <li>
    <a href="https://github.com/example/cookbook" class="social-link" rel="noopener">
      <span class="material-symbols-outlined" aria-hidden="true">code</span>
      GitHub — example/cookbook
    </a>
  </li>
</ul>

I read everything but can't always reply promptly. For recipe questions, the most useful detail to include is what you changed and what went wrong.
{{< /col >}}
{{< /columns >}}
