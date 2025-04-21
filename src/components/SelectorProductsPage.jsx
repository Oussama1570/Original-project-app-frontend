import React, { useState, useEffect } from "react";
import FadeInSection from "../Animations/FadeInSection.jsx";
import { useTranslation } from "react-i18next";

const SelectorsPageProducts = ({ options = [], onSelect, label }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(["All"]);

  useEffect(() => {
    onSelect(selected);
  }, [selected, onSelect]);

  const handleChange = (value) => {
    let updated = [];

    if (value === "All") {
      updated = ["All"];
    } else {
      if (selected.includes(value)) {
        updated = selected.filter((item) => item !== value);
      } else {
        updated = [...selected.filter((item) => item !== "All"), value];
      }

      // If none are selected, fallback to "All"
      if (updated.length === 0) {
        updated = ["All"];
      }
    }

    setSelected(updated);
  };

  return (
    <FadeInSection delay={0.1}>
      <div className="flex flex-col items-center mb-6">
      <label className="text-lg font-medium text-[#5a382d] mb-3">
  {t(label)}
</label>

        <div className="flex flex-wrap gap-4 justify-center">
          {options.map((option, index) => (
            <label
              key={index}
              className="flex items-center space-x-2 rtl:space-x-reverse gap-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                value={option}
                checked={selected.includes(option)}
                onChange={() => handleChange(option)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 text-base">
                {t(`product_filters.${option.toLowerCase()}`)}
              </span>
            </label>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
};

export default SelectorsPageProducts;
