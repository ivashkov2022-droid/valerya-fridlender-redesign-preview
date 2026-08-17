(function () {
  "use strict";

  var storageKey = "vf_cookie_consent_v3";
  var choice = null;

  try {
    choice = window.localStorage.getItem(storageKey);
  } catch (_error) {
    choice = null;
  }

  var optionalAllowed = choice === "all";

  function restoreYouTube(root) {
    if (!optionalAllowed || !root) return;

    var elements = [];
    if (root.nodeType === 1 && root.matches("[data-youtube-consent-id]")) {
      elements.push(root);
    }
    if (root.querySelectorAll) {
      elements = elements.concat(
        Array.prototype.slice.call(root.querySelectorAll("[data-youtube-consent-id]")),
      );
    }

    elements.forEach(function (element) {
      var id = element.getAttribute("data-youtube-consent-id");
      if (id) element.setAttribute("data-youtubeid", id);
    });
  }

  if (optionalAllowed && document.documentElement && window.MutationObserver) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        Array.prototype.forEach.call(mutation.addedNodes, restoreYouTube);
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function activateAnalytics() {
    if (!optionalAllowed) return;
    document.querySelectorAll('script[type="text/plain"][data-vf-consent="analytics"]').forEach(function (source) {
      if (source.dataset.vfActivated === "true") return;
      var script = document.createElement("script");
      Array.prototype.forEach.call(source.attributes, function (attribute) {
        if (attribute.name !== "type" && attribute.name !== "data-vf-consent") {
          script.setAttribute(attribute.name, attribute.value);
        }
      });
      script.type = "text/javascript";
      script.text = source.textContent || "";
      source.dataset.vfActivated = "true";
      source.parentNode.insertBefore(script, source.nextSibling);
    });
  }

  function remember(value) {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch (_error) {
      // The choice remains valid for the current page even if storage is unavailable.
    }
  }

  function initBanner() {
    restoreYouTube(document);
    activateAnalytics();

    document.querySelectorAll("[data-vf-cookie-reset]").forEach(function (button) {
      button.addEventListener("click", function () {
        try {
          window.localStorage.removeItem(storageKey);
        } catch (_error) {
          // The page reload still gives the visitor a new choice for this session.
        }
        window.location.reload();
      });
    });

    var banner = document.querySelector("[data-vf-cookie-banner]");
    if (!banner) return;

    if (choice === "all" || choice === "necessary") {
      banner.hidden = true;
      return;
    }

    banner.hidden = false;
    banner.querySelector("[data-vf-cookie-accept]")?.addEventListener("click", function () {
      remember("all");
      window.location.reload();
    });
    banner.querySelector("[data-vf-cookie-reject]")?.addEventListener("click", function () {
      remember("necessary");
      banner.hidden = true;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBanner, { once: true });
  } else {
    initBanner();
  }
})();
