import ComponentModel from "../models/component.model";

export default class PaletteCard extends ComponentModel {
  constructor(payload) {
    super({
      props: payload.props,
    });
  }

  render() {
    const { color, backgroundColor } = this.props;

    this.el.innerHTML = /* html */ `
      <div>
        <p>color : ${color}</p>
        <p>bgColor : ${backgroundColor}</p>
    </div>
    `;

    this.el.style.width = "200px";
    this.el.style.height = "200px";
    this.el.style.display = "flex";
    this.el.style.justifyContent = "center";
    this.el.style.alignItems = "center";
    this.el.style.textAlign = "center";
    this.el.style.color = color;
    this.el.style.backgroundColor = backgroundColor;
    this.el.style.padding = "10px";
    this.el.style.margin = "10px";
    this.el.style.borderRadius = "10px";
  }
}
