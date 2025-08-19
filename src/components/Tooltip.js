import React, { useState } from "react";

function Tooltip({ children, text }) {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && <div className="tooltip-bubble">{text}</div>}
    </div>
  );
}

export default Tooltip;
