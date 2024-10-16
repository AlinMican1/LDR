import { useState } from "react";
import "./pickDate.css";

interface PickDateProps {
  name: "year" | "month" | "day";
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
  return (
    <div className="dateContainer">
      {/* <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select {name}</option>
        {array.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select> */}

      {array.map((item, index) => (
        <button
          key={index}
          className={`dateButton ${selectedItem === item ? "active" : ""}`} // Apply active class if selected
          type="button" // Ensure the button type is set
          onClick={() => handleClick(item)} // Handle button click
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default PickDate;
