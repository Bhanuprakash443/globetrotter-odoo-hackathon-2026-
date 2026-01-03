/**
 * Reusable input field component with validation
 */
import { useState } from "react";
import { AlertCircle } from "lucide-react";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  icon: Icon,
  className = "",
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const showError = touched && error;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          className={`
            w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border rounded-lg 
            transition-all duration-200
            ${showError 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {showError && (
        <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default InputField;

