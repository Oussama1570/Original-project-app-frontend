import React from "react";
import { useTranslation } from "react-i18next";


const Selector = ({ onSelect, label = "", options = [] }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  return (
    <div className="selector-container" dir={i18n.dir()}>
      {label && (
        <label className="selector-label">{t(label)}</label>
      )}
      <select
        defaultValue=""
        onChange={(e) => onSelect(e.target.value)}
        className="selector-dropdown"
        style={{
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <option value="" disabled>
          {t("select_category")}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {t(`categories.${option.toLowerCase()}`) || option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selector;
