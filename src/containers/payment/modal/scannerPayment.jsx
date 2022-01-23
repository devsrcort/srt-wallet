import React from "react";

class ScannerModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      barcode: "Vazio"
    };
  }

  render() {
    return (
      <div className="teste">
        <form>
          <input type="file" accept="image/*" onChange={e => this.teste(e)} />
        </form>
        Barcode: {this.state.barcode}
      </div>
    );
  }
  teste() {
    return;
  }
}

export default ScannerModal;
