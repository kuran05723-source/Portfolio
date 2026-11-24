
"use strict";

/* =================================
   MOBILE NAVIGATION
================================= */

const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {

  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "メニューを閉じる" : "メニューを開く"
    );
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "メニューを開く");
    });
  });
}


/* =================================
   WORK FILTER
================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const workCards = document.querySelectorAll(".work-card");

filterButtons.forEach(button => {

  button.addEventListener("click", () => {
    const category = button.dataset.filter;

    filterButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    workCards.forEach(card => {
      if (
        category === "all" ||
        card.dataset.category === category
      ) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });

});


/* =================================
   IMAGE PLACEHOLDERS
================================= */

document.querySelectorAll(".image-placeholder img")
  .forEach(img => {

    const showPlaceholder = () => {
      img.style.display = "none";
    };

    img.addEventListener("error", showPlaceholder);

    if (img.complete && img.naturalWidth === 0) {
      showPlaceholder();
    }
  });


/* =================================
   IMAGE MODAL
================================= */

// モーダルのHTMLを自動生成
const modal = document.createElement("div");

modal.className = "image-modal";
modal.setAttribute("role", "dialog");
modal.setAttribute("aria-modal", "true");
modal.setAttribute("aria-label", "作品画像の拡大表示");

modal.innerHTML = `
  <button class="modal-close"
          type="button"
          aria-label="閉じる">×</button>

  <button class="modal-prev"
          type="button"
          aria-label="前の作品">‹</button>

  <div class="modal-content">
    <img class="modal-image" alt="">
    <div class="modal-caption"></div>
    <div class="modal-counter"></div>
  </div>

  <button class="modal-next"
          type="button"
          aria-label="次の作品">›</button>
`;

document.body.appendChild(modal);

const modalImage = modal.querySelector(".modal-image");
const modalCaption = modal.querySelector(".modal-caption");
const modalCounter = modal.querySelector(".modal-counter");
const modalClose = modal.querySelector(".modal-close");
const modalPrev = modal.querySelector(".modal-prev");
const modalNext = modal.querySelector(".modal-next");

const images = Array.from(
  document.querySelectorAll(".work-card .work-image img")
);

let currentIndex = 0;
let activeImages = images;
let previousFocus = null;


// 表示対象の画像を取得
function getVisibleImages() {
  return images.filter(img =>
    !img.closest(".work-card").classList.contains("hidden") &&
    img.naturalWidth > 0
  );
}


// 画像と作品名を表示
function showImage(index) {

  if (activeImages.length === 0) return;

  currentIndex =
    (index + activeImages.length) % activeImages.length;

  const selected = activeImages[currentIndex];
  const card = selected.closest(".work-card");
  const title = card.querySelector("h3")?.textContent || "";

  modalImage.src = selected.src;
  modalImage.alt = selected.alt;
  modalCaption.textContent = title;

  modalCounter.textContent =
    `${currentIndex + 1} / ${activeImages.length}`;
}


// 開く
function openModal(img) {

  activeImages = getVisibleImages();
  currentIndex = activeImages.indexOf(img);

  if (currentIndex === -1) return;

  previousFocus = document.activeElement;

  showImage(currentIndex);

  modal.classList.add("open");
  document.body.classList.add("modal-open");
  modalClose.focus();
}


// 閉じる
function closeModal() {

  modal.classList.remove("open");
  document.body.classList.remove("modal-open");

  modalImage.removeAttribute("src");

  if (previousFocus) {
    previousFocus.focus();
  }
}


// 作品クリック
images.forEach(img => {

  img.setAttribute("tabindex", "0");
  img.setAttribute("role", "button");
  img.setAttribute(
    "aria-label",
    `${img.alt}を拡大表示`
  );

  img.addEventListener("click", () => {
    openModal(img);
  });

  img.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal(img);
    }
  });
});


// 閉じるボタン
modalClose.addEventListener("click", closeModal);


// 前の作品
modalPrev.addEventListener("click", () => {
  showImage(currentIndex - 1);
});


// 次の作品
modalNext.addEventListener("click", () => {
  showImage(currentIndex + 1);
});


// 背景クリックで閉じる
modal.addEventListener("click", event => {
  if (event.target === modal) {
    closeModal();
  }
});


// キーボード操作
document.addEventListener("keydown", event => {

  if (!modal.classList.contains("open")) return;

  if (event.key === "Escape") {
    closeModal();
  }

  if (event.key === "ArrowLeft") {
    showImage(currentIndex - 1);
  }

  if (event.key === "ArrowRight") {
    showImage(currentIndex + 1);
  }

  // Tabキーをモーダル内に留める
  if (event.key === "Tab") {
    const buttons = [
      modalClose,
      modalPrev,
      modalNext
    ];

    const current = buttons.indexOf(document.activeElement);

    if (event.shiftKey && current <= 0) {
      event.preventDefault();
      buttons[buttons.length - 1].focus();
    } else if (!event.shiftKey && current === buttons.length - 1) {
      event.preventDefault();
      buttons[0].focus();
    }
  }
});


/* =================================
   COPYRIGHT YEAR
================================= */

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}


/* =================================
   AUTO IMAGE ORIENTATION
================================= */

document.querySelectorAll(".work-image img")
  .forEach(img => {

    function checkOrientation() {
      if (img.naturalWidth > img.naturalHeight) {
        img.classList.add("landscape");
      } else {
        img.classList.remove("landscape");
      }
    }

    if (img.complete && img.naturalWidth > 0) {
      checkOrientation();
    } else {
      img.addEventListener("load", checkOrientation);
    }

  });
