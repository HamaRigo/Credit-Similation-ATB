import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

const Buttons = () => {
  const [cSelected, setCSelected] = useState([]);
  const [rSelected, setRSelected] = useState(null);

  const onRadioBtnClick = (rSelected) => {
    setRSelected(rSelected);
  };

  const onCheckboxBtnClick = (selected) => {
    const index = cSelected.indexOf(selected);
    if (index < 0) {
      setCSelected([...cSelected, selected]);
    } else {
      setCSelected(cSelected.filter(item => item !== selected));
    }
  };

  // Button definitions for repeatability
  const buttonColors = ["primary", "secondary", "success", "info", "warning", "danger"];
  const buttonSizes = ["lg", "sm"];

  const renderButtons = (color, size = "") => {
    return buttonSizes.map((size) => (
      <Button key={`${color}-${size}`} color={color} size={size} className="mb-2">
        {`${color.charAt(0).toUpperCase() + color.slice(1)} ${size ? size.toUpperCase() : ''}`}
      </Button>
    ));
  };

  return (
    <div>
      {/* Row for all Button Groups */}
      <Row>
        {/* Card 1: Regular Buttons */}
        <Col xs="12" md="6">
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">Buttons</CardTitle>
            <CardBody>
              <div className="button-group">
                {buttonColors.map(color => (
                  <Button key={color} color={color} className="mb-2">
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                </Button>
                ))}
                <Button color="link" className="mb-2">Link</Button>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Card 2: Outline Buttons */}
        <Col xs="12" md="6">
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">Outline Buttons</CardTitle>
            <CardBody>
              <div className="button-group">
                {buttonColors.map(color => (
                  <Button key={color} outline color={color} className="mb-2">
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Card 3: Large Size Buttons */}
        <Col xs="12" md="6">
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">Large Size Buttons</CardTitle>
            <CardBody>
              {renderButtons("primary", "lg")}
              {renderButtons("secondary", "lg")}
            </CardBody>
          </Card>
        </Col>

        {/* Card 4: Small Size Buttons */}
        <Col xs="12" md="6">
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">Small Size Buttons</CardTitle>
            <CardBody>
              {renderButtons("primary", "sm")}
              {renderButtons("secondary", "sm")}
            </CardBody>
          </Card>
        </Col>

        {/* Card 5: Active State Buttons */}
        <Col xs="12" md="6">
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">Active State Buttons</CardTitle>
            <CardBody>
              <Button color="primary" size="lg" active className="mb-2">Primary Active</Button>
              <Button color="secondary" size="lg" active className="mb-2">Secondary Active</Button>
            </CardBody>
          </Card>
        </Col>

        {/* Card 6: Disabled State Buttons */}
        <Col xs="12" md="6">
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">Disabled State Buttons</CardTitle>
            <CardBody>
              <Button color="primary" size="lg" disabled className="mb-2">Primary Disabled</Button>
              <Button color="secondary" size="lg" disabled className="mb-2">Secondary Disabled</Button>
            </CardBody>
          </Card>
        </Col>

        {/* Card 7: Block Buttons */}
        <Col xs="12" md="6">
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">Block Buttons</CardTitle>
            <CardBody>
              <Button color="primary" size="lg" block className="mb-2">Block Level Primary</Button>
              <Button color="secondary" size="lg" block className="mb-2">Block Level Secondary</Button>
            </CardBody>
          </Card>
        </Col>

        {/* Card 8: Checkbox Stateful Buttons */}
        <Col xs="12" md="6">
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">Checkbox Buttons</CardTitle>
            <CardBody>
              <ButtonGroup>
                {[1, 2, 3].map(item => (
                  <Button key={item} color="primary" onClick={() => onCheckboxBtnClick(item)} active={cSelected.includes(item)}>
                    {`Option ${item}`}
                </Button>
                ))}
              </ButtonGroup>
              <p className="mb-0">Selected: {JSON.stringify(cSelected)}</p>
            </CardBody>
          </Card>
        </Col>

        {/* Card 9: Radio Stateful Buttons */}
        <Col xs="12" md="6">
          <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">Radio Buttons</CardTitle>
            <CardBody>
              <ButtonGroup>
                {[1, 2, 3].map(item => (
                  <Button key={item} color="primary" onClick={() => onRadioBtnClick(item)} active={rSelected === item}>
                    {`Option ${item}`}
                </Button>
                ))}
              </ButtonGroup>
              <p className="mb-0">Selected: {rSelected}</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Buttons;
