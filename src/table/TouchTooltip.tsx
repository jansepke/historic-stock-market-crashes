import Tooltip, { TooltipProps } from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import React from "react";

interface TouchTooltipProps extends Omit<TooltipProps, "children"> {
  withIcon?: boolean;
  children: React.ReactNode;
}

const TouchTooltip: React.FC<TouchTooltipProps> = ({
  withIcon,
  children,
  ...props
}) => (
  <Tooltip {...props} enterTouchDelay={50} leaveTouchDelay={5000}>
    <span>
      {children}
      {withIcon ? " " : null}
      {withIcon ? <HelpOutlineIcon fontSize="inherit" /> : null}
    </span>
  </Tooltip>
);

export default TouchTooltip;
