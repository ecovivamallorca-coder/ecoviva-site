document.querySelectorAll("[data-language]").forEach(function (link) {
  link.addEventListener("click", function () {
    try {
      window.localStorage.setItem(
        "ecovivaTechnicalLibraryLanguage",
        link.getAttribute("data-language"),
      );
    } catch (_) {
      // Navigation still works if browser storage is unavailable.
    }
  });
});
