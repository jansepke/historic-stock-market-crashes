import Tooltip from "@material-ui/core/Tooltip";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import React from "react";

const TouchTooltip = ({ withIcon, children, ...props }) => (
  <Tooltip {...props} enterTouchDelay={50} leaveTouchDelay={5000}>
    <span>
      {children}
      {withIcon ? " " : null}
      {withIcon ? <HelpOutlineIcon fontSize="inherit" /> : null}
    </span>
  </Tooltip>
);

export default TouchTooltip;
