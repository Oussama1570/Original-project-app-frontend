import React from "react";
import { useTranslation } from "react-i18next";

const SearchInput = ({ setSearchTerm }) => {
  const { t } = useTranslation();

  return (
    <div className="search-input-container">
      <input
        type="text"
        placeholder={t("search_input.placeholder")}
        className="search-input"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;

