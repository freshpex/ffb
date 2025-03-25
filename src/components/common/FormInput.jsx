import PropTypes from 'prop-types';

const FormInput = ({ 
  label, 
  type = 'text', 
  value = '', 
  onChange, 
  placeholder = '', 
  disabled = false,
  required = false,
  hint,
  className = '',
  name
}) => {
  return (
    <div className="mb-6">
      {label && (
        <label className="block text-sm font-medium text-gray-200 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-100 ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        } ${className}`}
      />
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  hint: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string
};

export default FormInput;
