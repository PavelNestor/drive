"use strict";

(function() {
  var menuImg = document.getElementById("menu-image");
  var menuClose = document.getElementById("menu-close");
  var menuContent = document.getElementById("menu-content");

  const onToogleMenu = () => {
    menuContent.classList.toggle("menu-show");
  };

  menuImg.addEventListener("click", onToogleMenu);
  menuImg.addEventListener("touch", onToogleMenu);
  menuClose.addEventListener("click", onToogleMenu);
})();
