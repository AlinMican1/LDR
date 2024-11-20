import { useState } from "react";
import "./pickDate.css";

interface PickDateProps {
  name: "Year" | "Month" | "Day";
  array: (number | string)[]; // Year or Month array
  value: string | number;
  onChange: (value: string | number) => void; // Function to update parent state
}

const PickDate: React.FC<PickDateProps> = ({
  name,
  array,
  value,
  onChange,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | number | null>(
    null
  ); // State to track selected item

  const handleClick = (item: string | number) => {
    setSelectedItem(item); // Set the selected item
    onChange(item); // Call the onChange function with the selected value
  };
  const containerClass = name === "Day" ? "dateContainerDay" : "dateContainer";
  return (
    <div>
      <h1 className={`${"selectDateTitle"} ${"roboto-font"}`}>
        Select {name} To Meet
      </h1>
      <div className={containerClass}>
        {array.map((item, index) => (
          <button
            key={index}
            className={`dateButton ${
              selectedItem === item ? "active" : ""
            } ${"inter-font"}`} // Apply active class if selected
            type="button" // Ensure the button type is set
            onClick={() => handleClick(item)} // Handle button click
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PickDate;
