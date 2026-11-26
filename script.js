document.addEventListener("DOMContentLoaded", () => {
  /* =================================
     1. コピーライト年号の自動更新
  ================================= */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* =================================
     2. ハンバーガーメニュー開閉
  ================================= */
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* =================================
     3. 作品ジャンルフィルター
  ================================= */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const workCards = document.querySelectorAll(".works-grid .work-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetFilter = btn.dataset.filter;

      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      workCards.forEach((card) => {
        const cardCategory = card.dataset.category;
        if (targetFilter === "all" || cardCategory === targetFilter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  /* =================================
     4. 作品画像モーダル拡大表示
  ================================= */
  const modal = document.createElement("div");
  modal.className = "image-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "作品画像の拡大表示");
  modal.innerHTML = `
    <button type="button" class="modal-close" aria-label="閉じる">&times;</button>
    <button type="button" class="modal-prev" aria-label="前の作品">&#8249;</button>
    <div class="modal-content">
      <img src="" alt="" class="modal-image" />
      <p class="modal-caption"></p>
      <p class="modal-counter"></p>
    </div>
    <button type="button" class="modal-next" aria-label="次の作品">&#8250;</button>
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector(".modal-image");
  const modalCaption = modal.querySelector(".modal-caption");
  const modalCounter = modal.querySelector(".modal-counter");
  const closeBtn = modal.querySelector(".modal-close");
  const prevBtn = modal.querySelector(".modal-prev");
  const nextBtn = modal.querySelector(".modal-next");

  const galleryItems = Array.from(document.querySelectorAll(".works-grid .work-image img")).map((img) => {
    const card = img.closest(".work-card");
    const title = card ? card.querySelector(".work-info h3")?.textContent.trim() : "";
    return {
      src: img.getAttribute("src"),
      alt: title || img.alt || ""
    };
  });

  let currentIndex = 0;

  function renderModal(index) {
    if (!galleryItems.length) return;
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    modalImg.src = item.src;
    modalImg.alt = item.alt;
    modalCaption.textContent = item.alt;
    modalCounter.textContent = `${currentIndex + 1} / ${galleryItems.length}`;
  }

  function openModal(index) {
    renderModal(index);
    modal.classList.add("open");
    document.body.classList.add("modal-open");
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
    modalImg.src = "";
  }

  document.querySelectorAll(".works-grid .work-image img").forEach((img, idx) => {
    img.setAttribute("tabindex", "0");
    img.addEventListener("click", () => openModal(idx));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(idx);
      }
    });
  });

  closeBtn.addEventListener("click", closeModal);
  prevBtn.addEventListener("click", () => renderModal(currentIndex - 1));
  nextBtn.addEventListener("click", () => renderModal(currentIndex + 1));

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") renderModal(currentIndex - 1);
    if (e.key === "ArrowRight") renderModal(currentIndex + 1);
  });
});
