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
}: inputFieldParams) => {
  return (
    <div className="input-wrapper">
      <label htmlFor={label}>{label}</label>
      <input
        type={type}
        id={label}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <p className="error">{errorMsg}</p>}
    </div>
  );
};

export default InputField;
