import React from "react";
import "./ImageCreator.css";

import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Placeholder from "react-bootstrap/Placeholder";

import { MESSAGES as msg } from "../../assets/i18n/en";
import * as OPTIONS from "./constants";

export default class ImageCreator extends React.Component {
  constructor() {
    super();
    this.state = {
      createdImageLink: "",
      originalImage: "",
      originalLink: "",
      clicked: false,
      uploadImage: false,
      customText: "",
      overlayColor: OPTIONS.OVERLAY_COLOR,
    };
  }

  handleImage = (e) => {
    const imageFile = e.target.files[0];
    this.setState({
      originalLink: URL.createObjectURL(imageFile),
      originalImage: imageFile,
      outputFileName: imageFile.name,
      uploadImage: true,
    });
  };

  handleCustomText = (e) => {
    this.setState({
      customText: e.target.value,
    });
  };

  handleOverlayColor = (e) => {
    this.setState({
      overlayColor: e.target.value,
    });
  };

  createImage = (e) => {
    e.preventDefault();

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let reader = new FileReader();
    let img = new Image();
    let self = this;
    reader.onload = function (event) {
      img.onload = function () {
        canvas.width = OPTIONS.IMAGE_WIDTH;
        canvas.height = OPTIONS.IMAGE_HEIGHT;
        canvas.crossOrigin = "Anonymous";
        ctx.drawImage(img, 0, 0, OPTIONS.IMAGE_WIDTH, OPTIONS.IMAGE_HEIGHT);
        ctx.globalAlpha = OPTIONS.GLOBAL_ALPHA;
        ctx.fillStyle = self.state.overlayColor;
        ctx.fillRect(0, 0, OPTIONS.IMAGE_WIDTH, OPTIONS.IMAGE_HEIGHT);
        ctx.font = OPTIONS.FONT;
        ctx.fillStyle = OPTIONS.FILL_STYLE;
        ctx.textAlign = OPTIONS.TEXT_ALIGN;
        ctx.fillText(self.state.customText, 150, 100);
        self.setState({
          createdImageLink: canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream"),
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(this.state.originalImage);

    this.setState({ clicked: true });
  };

  render() {
    return (
      <div className="m-5">
        <Alert variant="success">
          <Alert.Heading>{msg.ALERT_INTRO.TITLE}</Alert.Heading>
          <ol>
            <li>{msg.ALERT_INTRO.STEP1}</li>
            <li>{msg.ALERT_INTRO.STEP2}</li>
            <li>{msg.ALERT_INTRO.STEP3}</li>
          </ol>
          <hr />
          <p className="mb-0">{msg.ALERT_INTRO.NOTE}</p>
        </Alert>
        <div className="row mt-5">
          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
            {this.state.uploadImage ? (
              <Card.Img
                className="ht"
                variant="top"
                src={this.state.originalLink}
              ></Card.Img>
            ) : (
              <Placeholder animation="glow">
                <Placeholder xs={12} className="placeholder-image__lg" />
              </Placeholder>
            )}

            <Form>
              <Form.Group className="mb-3 mt-5" controlId="formImage">
                <Form.Label>{msg.FORM.LABEL_UPLOAD}:</Form.Label>
                <Form.Control
                  type="file"
                  required
                  onChange={(e) => this.handleImage(e)}
                />
                <Form.Text className="text-muted">
                  {msg.FORM.REQUIRED}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCustomText">
                <Form.Label>{msg.FORM.LABEL_TEXT}:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Custom text"
                  onChange={(e) => this.handleCustomText(e)}
                />
                <Form.Text className="text-muted">
                  {msg.FORM.OPTIONAL}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formOverlayColor">
                <Form.Label>{msg.FORM.LABEL_OVERLAY}:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="#ff00ff"
                  onChange={(e) => this.handleOverlayColor(e)}
                />
                <Form.Text className="text-muted">
                  {msg.FORM.OPTIONAL}
                </Form.Text>
              </Form.Group>
            </Form>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-12 mb-5 mt-5 col-sm-12 d-flex justify-content-center align-items-baseline">
            <br />
            {this.state.outputFileName ? (
              <Button variant="primary" onClick={(e) => this.createImage(e)}>
                {msg.BUTTON.CREATE_IMAGE}
              </Button>
            ) : (
              <></>
            )}
          </div>

          <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 mt-3">
            <Card.Img
              variant="top"
              src={this.state.createdImageLink}
            ></Card.Img>
            {this.state.clicked ? (
              <div className="d-flex justify-content-center">
                <Button
                  variant="success"
                  href={this.state.createdImageLink}
                  download={this.state.outputFileName}
                  className="mt-2 w-75"
                >
                  {msg.BUTTON.DOWNLOAD}
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    );
  }
}
