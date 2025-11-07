const categories = ["automotive", "products", "socialmedia", "personal"];
let currentCategory = "automotive";
let images = [];
let currentIndex = 0;

// Elements
const gallery = document.getElementById("gallery");
const buttons = document.querySelectorAll(".side-btn");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lbCounter = document.getElementById("lb-counter");
const btnPrev = document.getElementById("lb-prev");
const btnNext = document.getElementById("lb-next");
const btnClose = document.getElementById("lb-close");

// Hamburger
const hamburger = document.getElementById("hamburger");
const sideNav = document.getElementById("sideNav");

if (hamburger && sideNav) {
  hamburger.addEventListener("click", () => {
    sideNav.classList.toggle("open");
  });

  // Zamknij menu po kliknięciu w kategorię
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      sideNav.classList.remove("open");
    });
  });
}

// Load images
function loadCategory(category) {
  gallery.innerHTML = "";
  currentCategory = category;
  images = [];

  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === category);
  });

  fetch(`images/${category}/list.json`)
    .then(response => {
      if (!response.ok) throw new Error("Brak list.json w " + category);
      return response.json();
    })
    .then(data => {
      images = data;
      displayGallery();
    })
    .catch(err => {
      console.error(err);
      gallery.innerHTML = `<p style="color:red;">Brak danych w ${category}</p>`;
    });
}

// Miniatures
function displayGallery() {
  gallery.innerHTML = "";
  images.forEach((img, index) => {
    const div = document.createElement("div");
    div.className = "thumb";

    const image = document.createElement("img");
    image.src = `images/${currentCategory}/${img}`;
    image.alt = img;

    image.addEventListener("click", () => openLightbox(index));
    div.appendChild(image);
    gallery.appendChild(div);
  });
}

// Open image
function openLightbox(index) {
  currentIndex = index;
  if (!lightboxImg) return;
  lightboxImg.src = `images/${currentCategory}/${images[currentIndex]}`;
  lbCounter.textContent = `${currentIndex + 1} / ${images.length}`;
  lightbox.classList.add("visible");
}

function closeLightbox() {
  lightbox.classList.remove("visible");
}

function changeImage(step) {
  if (images.length === 0) return;
  currentIndex = (currentIndex + step + images.length) % images.length;
  lightboxImg.src = `images/${currentCategory}/${images[currentIndex]}`;
  lbCounter.textContent = `${currentIndex + 1} / ${images.length}`;
}

// Events
buttons.forEach(btn => {
  btn.addEventListener("click", () => loadCategory(btn.dataset.category));
});

btnClose.addEventListener("click", closeLightbox);
btnPrev.addEventListener("click", () => changeImage(-1));
btnNext.addEventListener("click", () => changeImage(1));

lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation (PC)
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("visible")) return;

  if (e.key === "ArrowRight") {
    changeImage(1);
  } else if (e.key === "ArrowLeft") {
    changeImage(-1);
  } else if (e.key === "Escape") {
    closeLightbox();
  }
});

// Start
loadCategory(currentCategory);
