(function () {
  "use strict";

  var picture = function (basePath, alt, className, sizes) {
    return (
      '<picture>' +
      '<source srcset="' + basePath + '.webp" type="image/webp">' +
      '<img src="' + basePath + '.jpg" alt="' + alt + '" class="' + (className || "") + '" loading="lazy" decoding="async"' +
      (sizes ? ' sizes="' + sizes + '"' : "") +
      '>' +
      '</picture>'
    );
  };

  /* ---------------------------------------------------------
     Header: sombra ao rolar + menu mobile
  --------------------------------------------------------- */
  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var body = document.body;

  function onScroll() {
    if (window.scrollY > 8) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Esconde o WhatsApp flutuante enquanto o Hero está visível */
  var whatsappFloat = document.querySelector(".whatsapp-float");
  var heroSection = document.getElementById("topo");
  if (whatsappFloat && heroSection && "IntersectionObserver" in window) {
    var heroIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          whatsappFloat.classList.toggle("is-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.35 }
    );
    heroIO.observe(heroSection);
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      body.style.overflow = isOpen ? "hidden" : "";
    });
  }

  document.querySelectorAll(".mobile-nav a, .mobile-nav .btn").forEach(function (el) {
    el.addEventListener("click", function () {
      body.classList.remove("nav-open");
      body.style.overflow = "";
      if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------------------------------------------------------
     Reveal on scroll (observa também elementos injetados depois)
  --------------------------------------------------------- */
  var revealIO = null;
  if ("IntersectionObserver" in window) {
    revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
  }

  function observeReveal(root) {
    var scope = root || document;
    var els = scope.querySelectorAll(".reveal:not([data-observed])");
    els.forEach(function (el) {
      el.setAttribute("data-observed", "true");
      if (revealIO) {
        revealIO.observe(el);
      } else {
        el.classList.add("is-visible");
      }
    });
  }

  /* ---------------------------------------------------------
     Links dinâmicos (WhatsApp, Instagram, site)
  --------------------------------------------------------- */
  function bindDynamicLinks(root) {
    var scope = root || document;

    scope.querySelectorAll("[data-whatsapp]").forEach(function (el) {
      var customMessage = el.getAttribute("data-whatsapp-message");
      el.setAttribute("href", buildWhatsAppLink(customMessage));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });

    scope.querySelectorAll("[data-whatsapp-display]").forEach(function (el) {
      var formatted = SITE_CONFIG.whatsappNumber.replace(/^55/, "");
      var ddd = formatted.slice(0, 2);
      var rest = formatted.slice(2);
      var num = rest.length === 9 ? rest.slice(0, 5) + "-" + rest.slice(5) : rest.slice(0, 4) + "-" + rest.slice(4);
      el.textContent = "(" + ddd + ") " + num;
    });

    scope.querySelectorAll("[data-instagram]").forEach(function (el) {
      el.setAttribute("href", SITE_CONFIG.instagramUrl);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });

    scope.querySelectorAll("[data-site-url]").forEach(function (el) {
      if (el.hasAttribute("data-site-link")) {
        el.setAttribute("href", "https://" + SITE_CONFIG.siteUrl);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
      el.textContent = SITE_CONFIG.siteUrl;
    });
  }

  document.querySelectorAll("[data-whatsapp-product]").forEach(function (el) {
    el.setAttribute(
      "data-whatsapp-message",
      "Olá! Tenho interesse na " + PRODUCT.name + " e gostaria de solicitar um projeto."
    );
  });

  bindDynamicLinks(document);

  /* ---------------------------------------------------------
     Seção 02 — Apresentação do produto
  --------------------------------------------------------- */
  var galleryState = { images: [], index: 0 };

  function renderProductIntro() {
    var root = document.getElementById(PRODUCT.slug) || document.getElementById("projeto");
    if (!root) return;

    root.querySelectorAll("[data-pd-name]").forEach(function (el) {
      el.textContent = PRODUCT.name;
    });
    root.querySelectorAll("[data-pd-tagline]").forEach(function (el) {
      el.textContent = PRODUCT.tagline;
    });

    var mainWrap = root.querySelector("[data-pd-main]");
    var thumbsWrap = root.querySelector("[data-pd-thumbs]");
    if (mainWrap && thumbsWrap) {
      mainWrap.innerHTML = picture(PRODUCT.images[0].src, PRODUCT.images[0].alt, "", "(min-width: 1024px) 50vw, 100vw");
      thumbsWrap.innerHTML = PRODUCT.images
        .map(function (img, i) {
          return (
            '<button type="button" class="pd-thumb' + (i === 0 ? " is-active" : "") + '" data-thumb-index="' + i + '" aria-label="Ver imagem ' + (i + 1) + '">' +
            picture(img.src, img.alt) +
            "</button>"
          );
        })
        .join("");

      galleryState.images = PRODUCT.images;
      galleryState.index = 0;

      thumbsWrap.querySelectorAll(".pd-thumb").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var idx = parseInt(btn.getAttribute("data-thumb-index"), 10);
          setActiveImage(idx);
        });
      });

      mainWrap.addEventListener("click", function () {
        openLightbox(PRODUCT.images, galleryState.index);
      });
    }

    function setActiveImage(idx) {
      galleryState.index = idx;
      var img = PRODUCT.images[idx];
      mainWrap.innerHTML = picture(img.src, img.alt);
      mainWrap.addEventListener("click", function () {
        openLightbox(PRODUCT.images, galleryState.index);
      });
      thumbsWrap.querySelectorAll(".pd-thumb").forEach(function (btn, i) {
        btn.classList.toggle("is-active", i === idx);
      });
    }

    var specGrid = root.querySelector("[data-pd-specs]");
    if (specGrid) {
      var specs = [
        { icon: "ruler", label: "Medidas", value: PRODUCT.dimensions.length + " x " + PRODUCT.dimensions.width + " x " + PRODUCT.dimensions.height },
        { icon: "users", label: "Capacidade", value: PRODUCT.capacity },
        { icon: "flame", label: "Gerador", value: PRODUCT.generator.power + " — " + PRODUCT.generator.brand },
        { icon: "glass", label: "Vidro", value: PRODUCT.glass },
        { icon: "sliders", label: "Controle", value: PRODUCT.panel },
        { icon: "shield", label: "Garantia", value: PRODUCT.warranty }
      ];
      specGrid.innerHTML = specs
        .map(function (s) {
          return (
            '<div class="spec-item">' +
            '<svg class="icon" aria-hidden="true"><use href="#icon-' + s.icon + '"></use></svg>' +
            '<span class="spec-label">' + s.label + "</span>" +
            '<span class="spec-value">' + s.value + "</span>" +
            "</div>"
          );
        })
        .join("");
    }

    document.querySelectorAll("[data-pd-dim-length]").forEach(function (el) { el.textContent = PRODUCT.dimensions.length; });
    document.querySelectorAll("[data-pd-dim-width]").forEach(function (el) { el.textContent = PRODUCT.dimensions.width; });
    document.querySelectorAll("[data-pd-dim-height]").forEach(function (el) { el.textContent = PRODUCT.dimensions.height; });
    document.querySelectorAll("[data-pd-generator-power]").forEach(function (el) { el.textContent = PRODUCT.generator.power; });
    document.querySelectorAll("[data-pd-generator-brand]").forEach(function (el) { el.textContent = PRODUCT.generator.brand; });
    document.querySelectorAll("[data-pd-wiring]").forEach(function (el) { el.textContent = PRODUCT.electrical.wiring; });
    document.querySelectorAll("[data-pd-breaker]").forEach(function (el) { el.textContent = PRODUCT.electrical.breaker; });
    document.querySelectorAll("[data-pd-warranty]").forEach(function (el) { el.textContent = PRODUCT.warranty.toUpperCase(); });
  }

  /* ---------------------------------------------------------
     Seção 03 — Detalhes (lista editorial alternada)
  --------------------------------------------------------- */
  function renderFeatures() {
    var list = document.getElementById("feature-list");
    if (!list) return;

    list.innerHTML = FEATURES.map(function (f, i) {
      return (
        '<article class="feature-row reveal' + (i % 2 === 1 ? " reverse" : "") + '">' +
        '<div class="feature-row-media">' + picture(f.image.src, f.image.alt, "", "(min-width: 860px) 50vw, 100vw") + "</div>" +
        '<div class="feature-row-body">' +
        '<span class="feature-row-number">' + f.number + "</span>" +
        "<h3>" + f.title + "</h3>" +
        "<p>" + f.text + "</p>" +
        "</div>" +
        "</article>"
      );
    }).join("");

    observeReveal(list);
  }

  /* ---------------------------------------------------------
     Seção 07 — Ciência, calor & bem-estar
  --------------------------------------------------------- */
  function renderWellbeing() {
    var list = document.getElementById("wellbeing-list");
    if (!list) return;

    list.innerHTML = WELLBEING_TOPICS.map(function (t) {
      return (
        '<li class="wellbeing-item">' +
        '<svg class="icon" aria-hidden="true"><use href="#icon-' + t.icon + '"></use></svg>' +
        "<span>" + t.label + "</span>" +
        "</li>"
      );
    }).join("");
  }

  /* ---------------------------------------------------------
     Seção 09 — Processo
  --------------------------------------------------------- */
  function renderTimeline() {
    var grid = document.getElementById("timeline-grid");
    if (!grid) return;

    grid.innerHTML = TIMELINE.map(function (step) {
      return (
        '<div class="step-item reveal">' +
        '<span class="step-number">' + step.number + "</span>" +
        "<h3>" + step.title + "</h3>" +
        "<p>" + step.text + "</p>" +
        "</div>"
      );
    }).join("");

    observeReveal(grid);
  }

  /* ---------------------------------------------------------
     Carrossel genérico
  --------------------------------------------------------- */
  function initCarousel(config) {
    var track = config.track;
    var prevBtn = config.prevBtn;
    var nextBtn = config.nextBtn;
    var dotsWrap = config.dotsWrap;
    var dotLabel = config.dotLabel || function (i) { return "Ir para o item " + (i + 1); };
    if (!track) return;

    var slides = Array.prototype.slice.call(track.children);
    if (!slides.length) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollLeft = 0;

    if (dotsWrap) {
      dotsWrap.hidden = slides.length <= 1;
      dotsWrap.innerHTML = slides
        .map(function (_, i) {
          return '<button type="button" class="carousel-dot" data-dot-index="' + i + '" aria-label="' + dotLabel(i) + '"></button>';
        })
        .join("");
    }
    var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.querySelectorAll(".carousel-dot")) : [];

    function slideLeft(slide) {
      return slide.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    }

    function currentIndex() {
      var pos = track.scrollLeft;
      var closest = 0;
      var closestDist = Infinity;
      slides.forEach(function (slide, i) {
        var dist = Math.abs(slideLeft(slide) - pos);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      return closest;
    }

    var requestedIndex = 0;

    function scrollToIndex(index) {
      requestedIndex = Math.max(0, Math.min(slides.length - 1, index));
      track.scrollTo({ left: slideLeft(slides[requestedIndex]), behavior: reduceMotion ? "auto" : "smooth" });
    }

    function updateActiveState() {
      var index = currentIndex();
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
      if (prevBtn) prevBtn.classList.toggle("is-disabled", track.scrollLeft <= 4);
      if (nextBtn) {
        var atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
        nextBtn.classList.toggle("is-disabled", atEnd);
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        scrollToIndex(i);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        scrollToIndex(requestedIndex - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        scrollToIndex(requestedIndex + 1);
      });
    }

    var isDown = false;
    var startX = 0;
    var startScroll = 0;
    var moved = false;
    var downTarget = null;

    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      isDown = true;
      moved = false;
      downTarget = e.target;
      track.dataset.dragged = "false";
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.classList.add("is-dragging");
      track.setPointerCapture(e.pointerId);
    });

    track.addEventListener("pointermove", function (e) {
      if (!isDown) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) {
        moved = true;
        track.dataset.dragged = "true";
      }
      track.scrollLeft = startScroll - dx;
    });

    function endDrag() {
      if (!isDown) return;
      isDown = false;
      track.classList.remove("is-dragging");
      if (moved) {
        scrollToIndex(currentIndex());
      } else if (config.onSlideClick && downTarget && downTarget.closest) {
        // setPointerCapture on the track can suppress the native "click"
        // event for real mouse input, so trigger the slide action here
        // whenever the pointer didn't actually drag.
        var slideEl = downTarget.closest(".carousel-slide, .product-card");
        if (slideEl) {
          var idx = slides.indexOf(slideEl);
          if (idx > -1) config.onSlideClick(slideEl, idx);
        }
      }
      setTimeout(function () {
        track.dataset.dragged = "false";
      }, 0);
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointerleave", endDrag);
    track.addEventListener("pointercancel", endDrag);

    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollToIndex(currentIndex() + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToIndex(currentIndex() - 1);
      }
    });

    var scrollRaf = null;
    track.addEventListener(
      "scroll",
      function () {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(function () {
          updateActiveState();
          scrollRaf = null;
        });
      },
      { passive: true }
    );

    updateActiveState();
    requestAnimationFrame(updateActiveState);
  }

  /* ---------------------------------------------------------
     Seção 10 — Galeria
  --------------------------------------------------------- */
  function renderGallery() {
    var track = document.getElementById("gallery-track");
    if (!track) return;

    track.innerHTML = GALLERY
      .map(function (item, i) {
        var isVideo = item.type === "video";
        var media = isVideo
          ? picture(item.poster, item.alt, "", "(min-width: 1200px) 360px, (min-width: 768px) 34vw, 72vw") +
            '<span class="carousel-play-badge"><svg class="icon" aria-hidden="true"><use href="#icon-play"></use></svg></span>'
          : picture(item.src, item.alt, "", "(min-width: 1200px) 360px, (min-width: 768px) 34vw, 72vw");
        return (
          '<figure class="carousel-slide' + (isVideo ? " is-video" : "") + '" data-gallery-index="' + i + '">' +
          media +
          "</figure>"
        );
      })
      .join("");

    track.querySelectorAll(".carousel-slide").forEach(function (fig) {
      fig.addEventListener("click", function () {
        if (track.dataset.dragged === "true") return;
        var idx = parseInt(fig.getAttribute("data-gallery-index"), 10);
        openLightbox(GALLERY, idx);
      });
    });

    initCarousel({
      track: track,
      prevBtn: document.getElementById("gallery-prev"),
      nextBtn: document.getElementById("gallery-next"),
      dotsWrap: document.getElementById("gallery-dots"),
      dotLabel: function (i) { return "Ir para a imagem " + (i + 1); },
      onSlideClick: function (slideEl, idx) {
        openLightbox(GALLERY, idx);
      }
    });
  }

  /* ---------------------------------------------------------
     Lightbox reutilizável
  --------------------------------------------------------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  var lightboxVideo = lightbox ? lightbox.querySelector("video") : null;
  var lightboxSet = [];
  var lightboxIndex = 0;

  function openLightbox(images, index) {
    if (!lightbox || !lightboxImg) return;
    lightboxSet = images;
    lightboxIndex = index;
    updateLightboxMedia();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function updateLightboxMedia() {
    var item = lightboxSet[lightboxIndex];
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute("src");
      lightboxVideo.load();
    }
    if (item.type === "video") {
      lightboxImg.hidden = true;
      if (lightboxVideo) {
        lightboxVideo.hidden = false;
        lightboxVideo.src = item.src;
        lightboxVideo.poster = item.poster + ".jpg";
        lightboxVideo.play().catch(function () {});
      }
    } else {
      if (lightboxVideo) lightboxVideo.hidden = true;
      lightboxImg.hidden = false;
      lightboxImg.src = item.src + ".jpg";
      lightboxImg.alt = item.alt;
    }
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lightboxVideo) lightboxVideo.pause();
  }

  if (lightbox) {
    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", function () {
      lightboxIndex = (lightboxIndex - 1 + lightboxSet.length) % lightboxSet.length;
      updateLightboxMedia();
    });
    lightbox.querySelector(".lightbox-next").addEventListener("click", function () {
      lightboxIndex = (lightboxIndex + 1) % lightboxSet.length;
      updateLightboxMedia();
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightbox.querySelector(".lightbox-prev").click();
      if (e.key === "ArrowRight") lightbox.querySelector(".lightbox-next").click();
    });
  }

  /* ---------------------------------------------------------
     Vídeo do Hero — autoplay mudo em mobile e desktop + botão de som
  --------------------------------------------------------- */
  var heroVideo = document.getElementById("hero-video");
  var heroSoundBtn = document.getElementById("hero-video-sound");

  if (heroVideo) {
    var tryPlay = function () {
      var playPromise = heroVideo.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {});
      }
    };
    if (heroVideo.readyState >= 2) {
      tryPlay();
    } else {
      heroVideo.addEventListener("loadedmetadata", tryPlay, { once: true });
    }
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) tryPlay();
    });
  }

  if (heroSoundBtn && heroVideo) {
    heroSoundBtn.addEventListener("click", function () {
      heroVideo.muted = !heroVideo.muted;
      heroSoundBtn.classList.toggle("is-unmuted", !heroVideo.muted);
      heroSoundBtn.setAttribute("aria-pressed", String(!heroVideo.muted));
      heroSoundBtn.setAttribute("aria-label", heroVideo.muted ? "Ativar som do vídeo" : "Silenciar vídeo");
    });
  }

  /* ---------------------------------------------------------
     Ano do rodapé
  --------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Init */
  observeReveal(document);
  renderProductIntro();
  renderFeatures();
  renderWellbeing();
  renderTimeline();
  renderGallery();
  bindDynamicLinks(document);
})();
