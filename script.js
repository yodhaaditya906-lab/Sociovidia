const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const counters = document.querySelectorAll("[data-counter]");
const form = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
}

function closeNav() {
  nav.classList.remove("is-open");
  header.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  header.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeNav();
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const element = entry.target;
    const target = Number(element.dataset.counter);
    const hasDecimal = !Number.isInteger(target);
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      element.textContent = hasDecimal ? value.toFixed(1) : Math.round(value);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
    observer.unobserve(element);
  });
}, { threshold: 0.5 });

counters.forEach((counter) => counterObserver.observe(counter));

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = data.get("name").trim();
  const email = data.get("email").trim();

  if (!name || !email) {
    formNote.textContent = "Lengkapi nama dan email terlebih dahulu.";
    return;
  }

  formNote.textContent = `Terima kasih, ${name}. Tim kami akan menghubungi ${email} dalam 1 hari kerja.`;
  form.reset();
});
