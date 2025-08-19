import React from "react";
import Tooltip from "./Tooltip";
import { interpretValue, unitMeanings } from "../utils";

function StatWithTooltip({ type, value, unit }) {
  const interpretation = interpretValue(type, value);
  const fullUnit = unitMeanings[unit] || unit;

  return (
    <Tooltip text={`${interpretation} • ${unit} = ${fullUnit}`}>
      <div className="stat-value">
        {value}{unit}
      </div>
    </Tooltip>
  );
}

export default StatWithTooltip;
