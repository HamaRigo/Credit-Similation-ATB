import React from "react";
import "./loader.scss";
import { Spin } from "antd";

const Loader = () => (
  <div className="fallback-spinner">
      <div className="loading">
          <Spin size="large"/>
      </div>
  </div>
);
export default Loader;
