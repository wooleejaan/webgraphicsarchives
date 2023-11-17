import ComponentModel from "../models/component.model";
import PaletteCard from "../components/PaletteCard";

export default class HomePage extends ComponentModel {
  render() {
    this.el.innerHTML = /* html */ ``;

    this.el.append(
      new PaletteCard({
        props: { color: "#454086", backgroundColor: "#fff3f1" },
      }).el,
      new PaletteCard({
        props: { color: "#424687", backgroundColor: "#f2fff8" },
      }).el,
      new PaletteCard({
        props: { color: "#3f4094", backgroundColor: "#e2dfd1" },
      }).el,
      new PaletteCard({
        props: { color: "#3b3f88", backgroundColor: "#fbf4e4" },
      }).el,
      new PaletteCard({
        props: { color: "#404393", backgroundColor: "#fffff1" },
      }).el,
      new PaletteCard({
        props: { color: "#423e88", backgroundColor: "#f9f7ed" },
      }).el,
      new PaletteCard({
        props: { color: "#383331", backgroundColor: "#c0a575" },
      }).el,
      new PaletteCard({
        props: { color: "#080906", backgroundColor: "#a73032" },
      }).el,
      new PaletteCard({
        props: { color: "#857652", backgroundColor: "#c3baaf" },
      }).el
    );

    this.el.style.display = "flex";
    this.el.style.flexWrap = "wrap";
  }
}
