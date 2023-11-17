import ComponentModel from "./models/component.model";
import router from "./pages";

class App extends ComponentModel {
  render() {
    const routeView = document.createElement("route-view");
    this.el.append(routeView);
  }
}

(function () {
  function init() {
    const root = document.querySelector("#root");
    root.append(new App().el);
    router();
  }
  window.addEventListener("DOMContentLoaded", init);
})();
