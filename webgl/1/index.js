import LoadWebGL from "./init/index.js";

(function () {
  function initialize() {
    LoadWebGL("webgl");
  }
  window.addEventListener("DOMContentLoaded", initialize);
})();
