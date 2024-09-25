import { ChangeEvent } from "react";
import "./inputField.css";

interface inputFieldParams {
  type: "text" | "number" | "email" | "password";
  label: string;
  value: string | number;
  name: string;
  placeholder: string;
  error: boolean;
  errorMsg: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}

const InputField = ({
  type,
  label,
  value,
  name,
  placeholder,
  error,
  disabled,
  errorMsg,
  onChange,
  icon,
}: inputFieldParams) => {
  return (
    <div className="input-wrapper">
      <label htmlFor={label}>{label}</label>
      <div className="input-with-icon">
        {icon && <span className="input-icon">{icon}</span>}{" "}
        {/* Render the icon if provided */}
        <input
          type={type}
          id={label}
          value={value}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          className={error ? "input-error" : ""}
        />
      </div>
      {error && <p className="error">{errorMsg}</p>}
    </div>
  );
};

export default InputField;
