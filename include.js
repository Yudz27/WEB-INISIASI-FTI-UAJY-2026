// include.js
// File ini bertugas memuat navbar.html dan footer.html secara otomatis
// ke dalam halaman yang punya <div id="navbar-container"></div>
// dan/atau <div id="footer-container"></div>
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const html = document.documentElement;

  const globalStyle = document.createElement("style");
  globalStyle.innerHTML = `
    html, body {
      margin: 0;
      padding: 0;
      background-color: #020617;
      background-image: url("img/error.png");
      background-position: top center;
      background-repeat: no-repeat;
      background-size: cover;
      background-attachment: fixed;
      overscroll-behavior: none;
    }

    body {
      min-height: 100vh;
      overflow-x: hidden;
    }

    #footer-container {
      position: relative;
      z-index: 10;
      display: block;
    }

    #footer-container footer {
      position: relative;
      z-index: 10;
    }

    .nav-link.active .nav-underline {
      transform: scaleX(1) !important;
    }
  `;
  document.head.appendChild(globalStyle);

  if (body) {
    body.style.margin = "0";
    body.style.padding = "0";
    body.style.backgroundColor = "#020617";
    body.style.backgroundImage = 'url("img/error.png")';
    body.style.backgroundPosition = "top center";
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundSize = "cover";
    body.style.backgroundAttachment = "fixed";
    body.style.overscrollBehavior = "none";
  }

  if (html) {
    html.style.margin = "0";
    html.style.padding = "0";
    html.style.backgroundColor = "#020617";
    html.style.backgroundImage = 'url("img/error.png")';
    html.style.backgroundPosition = "top center";
    html.style.backgroundRepeat = "no-repeat";
    html.style.backgroundSize = "cover";
    html.style.backgroundAttachment = "fixed";
    html.style.overscrollBehavior = "none";
  }

  const loadingScreen = document.createElement("div");
  loadingScreen.id = "loading-screen";
  loadingScreen.className =
    "fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-sm transition-opacity duration-500";
  loadingScreen.innerHTML = `
    <div class="flex flex-col items-center gap-4 text-center text-white">
      <div class="relative h-16 w-16">
        <div class="absolute inset-0 rounded-full border-4 border-white/20"></div>
        <div class="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
      </div>
      <div class="space-y-2">
        <p class="text-lg font-semibold tracking-[0.25em] text-cyan-300">
          MEMUAT HALAMAN
        </p>
        <p class="text-sm text-slate-300">
          Sedang menyiapkan pengalaman terbaik...
        </p>
      </div>
    </div>
  `;

  if (body) {
    body.insertBefore(loadingScreen, body.firstChild);
  }

  let isLoadingHidden = false;
  const hideLoadingScreen = () => {
    if (isLoadingHidden) return;
    isLoadingHidden = true;

    loadingScreen.classList.add("opacity-0", "pointer-events-none");
    setTimeout(() => loadingScreen.remove(), 500);
  };

  window.addEventListener("load", hideLoadingScreen, { once: true });
  setTimeout(hideLoadingScreen, 1800);

  // ==============================
  // LOAD NAVBAR
  // ==============================
  const navbarContainer = document.getElementById("navbar-container");

  if (navbarContainer) {
    fetch("navbar.html")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal fetch navbar.html, status: " + res.status);
        }
        return res.text();
      })
      .then((data) => {
        navbarContainer.innerHTML = data;

        const setActiveNavLink = () => {
          const currentPage =
            window.location.pathname.split("/").filter(Boolean).pop() ||
            "index.html";

          navbarContainer.querySelectorAll(".nav-link").forEach((link) => {
            const targetPage = (
              link.getAttribute("data-nav-link") || "index.html"
            )
              .split("/")
              .pop();
            const isHomePage =
              currentPage === "" ||
              currentPage === "index.html" ||
              currentPage === "/";
            const isActive =
              targetPage === "index.html"
                ? isHomePage
                : currentPage === targetPage;

            link.classList.toggle("active", isActive);
            link.classList.toggle("text-cyan-200", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "page");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        };

        setActiveNavLink();

        // Setelah navbar berhasil dimasukkan ke halaman,
        // pasang event listener untuk tombol hamburger
        const hamburgerBtn = document.getElementById("hamburger-btn");
        const menuMobile = document.getElementById("menu-mobile");

        if (hamburgerBtn && menuMobile) {
          hamburgerBtn.addEventListener("click", () => {
            const isOpen = menuMobile.classList.toggle("hidden") === false;
            menuMobile.classList.toggle("flex", isOpen);
            hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
            hamburgerBtn.setAttribute(
              "aria-label",
              isOpen ? "Tutup menu navigasi" : "Buka menu navigasi",
            );
          });
        }

        // Pastikan konten tidak tertutup oleh navbar fixed:
        // Atur padding-top pada <body> sesuai tinggi navbar
        const nav = navbarContainer.querySelector("nav");
        function setBodyNavSpacing() {
          if (nav) {
            document.body.style.paddingTop = nav.offsetHeight + "px";
            document.body.style.transition = "padding-top 0.2s ease";
          }
        }

        requestAnimationFrame(() => {
          setBodyNavSpacing();
        });

        window.addEventListener("resize", setBodyNavSpacing);

        // Jika browser mendukung ResizeObserver, gunakan untuk menyesuaikan
        if (typeof ResizeObserver !== "undefined" && nav) {
          const ro = new ResizeObserver(setBodyNavSpacing);
          ro.observe(nav);
        }
      })
      .catch((err) => {
        console.error("Gagal load navbar:", err);
      });
  }

  // ==============================
  // LOAD FOOTER
  // ==============================
  const footerContainer = document.getElementById("footer-container");

  if (footerContainer) {
    fetch("footer.html")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal fetch footer.html, status: " + res.status);
        }
        return res.text();
      })
      .then((data) => {
        footerContainer.innerHTML = data;
      })
      .catch((err) => {
        console.error("Gagal load footer:", err);
      });
  }
});
