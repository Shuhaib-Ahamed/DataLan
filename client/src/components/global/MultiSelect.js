import React from "react";
import MultiSelect from "react-select";

const ReactMultiSelect = ({
  isLoading,
  data,
  name,
  isDisabled,
  setSelected,
  selected,
}) => {
  return (
    <MultiSelect
      options={data}
      value={selected}
      isLoading={isLoading}
      isSearchable={true}
      name={name}
      onChange={setSelected}
      isDisabled={isDisabled}
      labelledBy={"Select"}
      isCreatable={true}
    />
  );
};

export default ReactMultiSelect;
