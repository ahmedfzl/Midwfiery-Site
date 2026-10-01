(function () {
  "use strict";

  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  var dialog = document.querySelector("#consult-dialog");
  var form = dialog.querySelector("form");
  var status = document.querySelector("#consult-status");
  var title = document.querySelector("#consult-title");
  var desktop = window.matchMedia("(min-width: 960px)");

  var labels = {
    companionship: "همراهی بارداری",
    consult: "مشاورهٔ موردی",
    question: "پرسش کوتاه"
  };

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  navToggle.addEventListener("click", function () {
    var open = navToggle.getAttribute("aria-expanded") === "true";
    setNav(!open);
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setNav(false);
    });
  });

  document.addEventListener("click", function (event) {
    if (!nav.classList.contains("is-open") || desktop.matches) return;
    if (nav.contains(event.target) || navToggle.contains(event.target)) return;
    setNav(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setNav(false);
      navToggle.focus();
    }
  });

  function closeNavOnDesktop() {
    if (desktop.matches) setNav(false);
  }

  if (typeof desktop.addEventListener === "function") {
    desktop.addEventListener("change", closeNavOnDesktop);
  } else if (typeof desktop.addListener === "function") {
    desktop.addListener(closeNavOnDesktop);
  }

  document.querySelectorAll("[data-accordion]").forEach(function (item) {
    var button = item.querySelector("button");
    var panel = item.querySelector("[data-panel]");
    button.addEventListener("click", function () {
      var open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", open ? "false" : "true");
      panel.hidden = open;
    });
  });

  function openConsult(kind) {
    setNav(false);
    form.reset();
    status.textContent = "";
    if (kind) {
      var input = form.querySelector('input[name="kind"][value="' + kind + '"]');
      if (input) input.checked = true;
    }
    dialog.showModal();
    title.focus();
  }

  document.querySelectorAll("[data-open-consult]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openConsult(trigger.getAttribute("data-open-consult"));
    });
  });

  form.querySelector("[data-preview]").addEventListener("click", function () {
    var selected = form.querySelector('input[name="kind"]:checked');
    if (!selected) {
      status.textContent = "برای دیدن ادامه، یکی از سه مسیر را انتخاب کن. چیزی ارسال نمی‌شود.";
      return;
    }
    status.textContent =
      "انتخاب نمایشی: " +
      labels[selected.value] +
      ". در این نمونهٔ اولیه هیچ درخواستی ثبت، ارسال یا ذخیره نشد.";
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", function () {
    status.textContent = "";
    form.reset();
  });
})();
