(function () {
  "use strict";

  var money = function (value) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    });
  };

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

  /* Esconde o WhatsApp flutuante enquanto o Hero (com CTAs próprios) está visível */
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
     Reveal on scroll
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------------------
     WhatsApp links dinâmicos
  --------------------------------------------------------- */
  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    var customMessage = el.getAttribute("data-whatsapp-message");
    el.setAttribute("href", buildWhatsAppLink(customMessage));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  document.querySelectorAll("[data-instagram]").forEach(function (el) {
    el.setAttribute("href", SITE_CONFIG.instagramUrl);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  document.querySelectorAll("[data-maps-address]").forEach(function (el) {
    var address = SITE_CONFIG.address.line1 + ", " + SITE_CONFIG.address.line2;
    el.setAttribute("href", buildMapsLink(address));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  document.querySelectorAll("[data-address-line1]").forEach(function (el) {
    el.textContent = SITE_CONFIG.address.line1;
  });
  document.querySelectorAll("[data-address-line2]").forEach(function (el) {
    el.textContent = SITE_CONFIG.address.line2;
  });

  /* ---------------------------------------------------------
     Catálogo — renderiza cards a partir de PRODUCTS
  --------------------------------------------------------- */
  var catalogGrid = document.getElementById("catalog-grid");

  function renderCatalog() {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = PRODUCTS.map(function (product) {
      var cover = product.images[0];
      var cashLabel = money(product.pricing.cash);
      return (
        '<article class="product-card">' +
        '<div class="product-card-media">' +
        picture(cover.src, cover.alt, "", "(min-width: 900px) 33vw, 100vw") +
        "</div>" +
        '<div class="product-card-body">' +
        "<h3>" + product.name + "</h3>" +
        '<p class="product-card-desc">' + product.shortDescription + "</p>" +
        '<div class="product-meta">' +
        "<span><strong>Medidas:</strong> " + product.dimensions.length + " x " + product.dimensions.width + " x " + product.dimensions.height + "</span>" +
        "<span><strong>Capacidade:</strong> " + product.capacity + "</span>" +
        "</div>" +
        '<p class="product-price-tag">' +
        '<svg class="icon" aria-hidden="true"><use href="#icon-tag"></use></svg>' +
        '<span><span class="product-price-label">A partir de</span>' + cashLabel + "</span>" +
        "</p>" +
        '<div class="product-card-actions">' +
        '<a class="btn btn-outline" href="#' + product.slug + '">Ver detalhes</a>' +
        '<a class="btn btn-accent" href="#" data-whatsapp data-whatsapp-message="Olá! Tenho interesse na ' + product.name + ' e gostaria de solicitar um orçamento.">Solicitar orçamento</a>' +
        "</div>" +
        "</div>" +
        "</article>"
      );
    }).join("");

    // reativa whatsapp links recém-criados
    catalogGrid.querySelectorAll("[data-whatsapp]").forEach(function (el) {
      var customMessage = el.getAttribute("data-whatsapp-message");
      el.setAttribute("href", buildWhatsAppLink(customMessage));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });

    revealCatalogGrid();
  }

  /* Entrada em onda dos cards do catálogo (GSAP, grid-aware, spring easing).
     Cai para o estado final direto sem animação com reduced-motion ou sem GSAP. */
  function revealCatalogGrid() {
    var cards = catalogGrid.querySelectorAll(".product-card");
    if (!cards.length) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var hasGsap = typeof gsap !== "undefined";

    if (!hasGsap || reduceMotion) {
      return;
    }

    gsap.set(cards, { opacity: 0, y: 16, scale: 0.92 });

    var played = false;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !played) {
            played = true;
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.4,
              ease: "back.out(1.4)",
              stagger: { each: 0.06, from: "start", grid: "auto" }
            });
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(catalogGrid);
  }

  /* ---------------------------------------------------------
     Detalhe do produto principal
  --------------------------------------------------------- */
  var galleryState = { images: [], index: 0 };

  function renderProductDetail() {
    var product = PRODUCTS[0];
    if (!product) return;

    var root = document.getElementById(product.slug);
    if (!root) return;

    root.querySelectorAll("[data-pd-name]").forEach(function (el) {
      el.textContent = product.name;
    });
    root.querySelectorAll("[data-pd-tagline]").forEach(function (el) {
      el.textContent = product.tagline;
    });

    // Galeria principal
    var mainWrap = root.querySelector("[data-pd-main]");
    var thumbsWrap = root.querySelector("[data-pd-thumbs]");
    if (mainWrap && thumbsWrap) {
      mainWrap.innerHTML = picture(product.images[0].src, product.images[0].alt, "", "(min-width: 1024px) 50vw, 100vw");
      thumbsWrap.innerHTML = product.images
        .map(function (img, i) {
          return (
            '<button type="button" class="pd-thumb' + (i === 0 ? " is-active" : "") + '" data-thumb-index="' + i + '" aria-label="Ver imagem ' + (i + 1) + '">' +
            picture(img.src, img.alt) +
            "</button>"
          );
        })
        .join("");

      galleryState.images = product.images;
      galleryState.index = 0;

      thumbsWrap.querySelectorAll(".pd-thumb").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var idx = parseInt(btn.getAttribute("data-thumb-index"), 10);
          setActiveImage(idx);
        });
      });

      mainWrap.addEventListener("click", function () {
        openLightbox(product.images, galleryState.index);
      });
    }

    function setActiveImage(idx) {
      galleryState.index = idx;
      var img = product.images[idx];
      mainWrap.innerHTML = picture(img.src, img.alt);
      mainWrap.addEventListener("click", function () {
        openLightbox(product.images, galleryState.index);
      });
      thumbsWrap.querySelectorAll(".pd-thumb").forEach(function (btn, i) {
        btn.classList.toggle("is-active", i === idx);
      });
    }

    // Specs
    var specGrid = root.querySelector("[data-pd-specs]");
    if (specGrid) {
      var specs = [
        { icon: "ruler", label: "Medidas", value: product.dimensions.length + " x " + product.dimensions.width + " x " + product.dimensions.height },
        { icon: "users", label: "Capacidade", value: product.capacity },
        { icon: "flame", label: "Gerador", value: product.generator.power + " — " + product.generator.brand },
        { icon: "glass", label: "Vidro", value: product.glass },
        { icon: "sliders", label: "Controle", value: product.panel },
        { icon: "shield", label: "Garantia", value: product.warranty }
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

    // Estrutura
    var structureList = root.querySelector("[data-pd-structure]");
    if (structureList) {
      structureList.innerHTML = product.structure
        .map(function (item) {
          return (
            "<li>" +
            '<svg class="icon" aria-hidden="true"><use href="#icon-check"></use></svg>' +
            "<span>" + item + "</span>" +
            "</li>"
          );
        })
        .join("");
    }

    // Requisitos elétricos
    root.querySelectorAll("[data-pd-wiring]").forEach(function (el) {
      el.textContent = product.electrical.wiring;
    });
    root.querySelectorAll("[data-pd-breaker]").forEach(function (el) {
      el.textContent = product.electrical.breaker;
    });

    // Diferenciais
    var diffGrid = document.getElementById("diferenciais-grid");
    if (diffGrid) {
      var diffIcons = ["sparkle", "glass", "wood", "sliders", "flame", "bolt", "shield", "shield"];
      diffGrid.innerHTML = product.differentials
        .map(function (item, i) {
          return (
            '<div class="diff-card reveal">' +
            '<span class="diff-icon"><svg class="icon" aria-hidden="true"><use href="#icon-' + (diffIcons[i] || "check") + '"></use></svg></span>' +
            "<p>" + item + "</p>" +
            "</div>"
          );
        })
        .join("");
      if ("IntersectionObserver" in window) {
        var io3 = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                io3.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1 }
        );
        diffGrid.querySelectorAll(".reveal").forEach(function (el) {
          io3.observe(el);
        });
      } else {
        diffGrid.querySelectorAll(".reveal").forEach(function (el) {
          el.classList.add("is-visible");
        });
      }
    }

    // Preço
    root.querySelectorAll("[data-pd-cash]").forEach(function (el) {
      el.textContent = money(product.pricing.cash);
    });
    root.querySelectorAll("[data-pd-installment-total]").forEach(function (el) {
      el.textContent = money(product.pricing.installmentTotal);
    });
    root.querySelectorAll("[data-pd-installments]").forEach(function (el) {
      el.textContent = product.pricing.installments;
    });
    root.querySelectorAll("[data-whatsapp-product]").forEach(function (el) {
      el.setAttribute(
        "data-whatsapp-message",
        "Olá! Tenho interesse na " + product.name + " e gostaria de solicitar um orçamento."
      );
    });
  }

  /* ---------------------------------------------------------
     Galeria de ambientes (carrossel interativo)
  --------------------------------------------------------- */
  var siteGallery = [
    { src: "assets/img/gallery/ambiente-01-piscina", alt: "Sauna e área de lazer com piscina integrada, projeto Hidrolar Banhos" },
    { src: "assets/img/gallery/ambiente-02-madeira", alt: "Estrutura de sauna com acabamento em madeira e vidro sob medida" },
    { src: "assets/img/gallery/ambiente-03-cedro", alt: "Cabine de sauna em madeira de cedro integrada ao paisagismo" },
    { src: "assets/img/product/monaco-02", alt: "Sauna a Vapor Dupla Mônaco vista lateral" },
    { src: "assets/img/product/monaco-04", alt: "Sauna a Vapor Dupla Mônaco em funcionamento" },
    { src: "assets/img/product/monaco-05", alt: "Sauna a Vapor Dupla Mônaco instalada em área externa" }
  ];

  function renderGallery() {
    var track = document.getElementById("gallery-track");
    var dotsWrap = document.getElementById("gallery-dots");
    var prevBtn = document.getElementById("gallery-prev");
    var nextBtn = document.getElementById("gallery-next");
    if (!track) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    track.innerHTML = siteGallery
      .map(function (img, i) {
        return (
          '<figure class="carousel-slide" data-gallery-index="' + i + '">' +
          picture(img.src, img.alt, "", "(min-width: 1200px) 360px, (min-width: 768px) 34vw, 72vw") +
          "</figure>"
        );
      })
      .join("");

    var slides = Array.prototype.slice.call(track.querySelectorAll(".carousel-slide"));
    track.scrollLeft = 0;

    slides.forEach(function (fig) {
      fig.addEventListener("click", function () {
        if (track.dataset.dragged === "true") return;
        var idx = parseInt(fig.getAttribute("data-gallery-index"), 10);
        openLightbox(siteGallery, idx);
      });
    });

    // Dots
    if (dotsWrap) {
      dotsWrap.innerHTML = slides
        .map(function (_, i) {
          return '<button type="button" class="carousel-dot" data-dot-index="' + i + '" aria-label="Ir para o ambiente ' + (i + 1) + '"></button>';
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

    // Arraste com mouse (touch já rola nativamente)
    var isDown = false;
    var startX = 0;
    var startScroll = 0;
    var moved = false;

    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;
      isDown = true;
      moved = false;
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
      }
      setTimeout(function () {
        track.dataset.dragged = "false";
      }, 0);
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointerleave", endDrag);
    track.addEventListener("pointercancel", endDrag);

    // Teclado (quando o track está focado)
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
     Lightbox reutilizável
  --------------------------------------------------------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  var lightboxSet = [];
  var lightboxIndex = 0;

  function openLightbox(images, index) {
    if (!lightbox || !lightboxImg) return;
    lightboxSet = images;
    lightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function updateLightboxImage() {
    var img = lightboxSet[lightboxIndex];
    lightboxImg.src = img.src + ".jpg";
    lightboxImg.alt = img.alt;
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (lightbox) {
    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", function () {
      lightboxIndex = (lightboxIndex - 1 + lightboxSet.length) % lightboxSet.length;
      updateLightboxImage();
    });
    lightbox.querySelector(".lightbox-next").addEventListener("click", function () {
      lightboxIndex = (lightboxIndex + 1) % lightboxSet.length;
      updateLightboxImage();
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
     Vídeo do Hero — autoplay mudo (respeita reduced-motion) + botão de som
  --------------------------------------------------------- */
  var heroVideo = document.getElementById("hero-video");
  var heroSoundBtn = document.getElementById("hero-video-sound");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (heroVideo) {
    if (reduceMotion) {
      heroVideo.removeAttribute("autoplay");
      heroVideo.pause();
    } else {
      heroVideo.play().catch(function () {});
    }
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
  renderCatalog();
  renderProductDetail();
  renderGallery();
})();
