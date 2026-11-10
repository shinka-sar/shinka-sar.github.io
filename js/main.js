const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Открыть меню");
    navigation.classList.remove("is-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const phoneDialog = document.querySelector(".phone-dialog");
const phoneDialogClose = document.querySelector(".phone-dialog-close");

if (phoneDialog instanceof HTMLDialogElement && phoneDialogClose) {
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const phoneLink = event.target.closest('a[href^="tel:"]');
    if (!phoneLink || phoneDialog.contains(phoneLink) || window.matchMedia("(max-width: 600px)").matches) return;
    event.preventDefault();
    if (!phoneDialog.open) phoneDialog.showModal();
  });

  phoneDialogClose.addEventListener("click", () => phoneDialog.close());
  phoneDialog.addEventListener("click", (event) => {
    if (event.target === phoneDialog) phoneDialog.close();
  });
}

const sizeButtons = document.querySelectorAll(".size-picker button");
const desktopPriceRows = [...document.querySelectorAll(".price-table tbody tr[data-mobile-price]")];
const mobilePriceRows = [...document.querySelectorAll(".mobile-price-table tbody tr")];

if (sizeButtons.length && desktopPriceRows.length === mobilePriceRows.length) {
  const selectSize = (sizeIndex) => {
    sizeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.sizeIndex) === sizeIndex));
    });

    desktopPriceRows.forEach((row, rowIndex) => {
      const price = row.cells[sizeIndex + 1]?.textContent.trim();
      const priceCell = mobilePriceRows[rowIndex]?.querySelector("td");
      if (price && priceCell) priceCell.textContent = `${price} ₽`;
    });
  };

  sizeButtons.forEach((button) => {
    button.addEventListener("click", () => selectSize(Number(button.dataset.sizeIndex)));
  });
  selectSize(2);
}

const revealItems = document.querySelectorAll("[data-reveal]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealItems.length && !reducedMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
}
