import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const PasswordStrengthMeter = ({ password, onScoreChange }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Basic password strength calculation
    let currentScore = 0;

    // Length check
    if (password.length >= 8) {
      currentScore += 1;
    }

    // Uppercase letters check
    if (/[A-Z]/.test(password)) {
      currentScore += 1;
    }

    // Lowercase letters check
    if (/[a-z]/.test(password)) {
      currentScore += 1;
    }

    // Numbers check
    if (/[0-9]/.test(password)) {
      currentScore += 1;
    }

    // Special characters check
    if (/[^A-Za-z0-9]/.test(password)) {
      currentScore += 1;
    }

    setScore(currentScore);

    // Notify parent component of score change
    if (onScoreChange) {
      onScoreChange(currentScore);
    }
  }, [password, onScoreChange]);

  // Get color and label based on score
  const getStrengthInfo = () => {
    if (password.length === 0) {
      return { color: "bg-gray-600", label: "", width: "0%" };
    }

    if (score < 2) {
      return { color: "bg-red-500", label: "Weak", width: "20%" };
    } else if (score < 3) {
      return { color: "bg-orange-500", label: "Fair", width: "40%" };
    } else if (score < 4) {
      return { color: "bg-yellow-500", label: "Good", width: "60%" };
    } else if (score < 5) {
      return { color: "bg-green-500", label: "Strong", width: "80%" };
    } else {
      return { color: "bg-primary-500", label: "Excellent", width: "100%" };
    }
  };

  const { color, label, width } = getStrengthInfo();

  return (
    <div className="mt-2">
      <div className="h-1 w-full bg-gray-700 rounded overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width }}
        ></div>
      </div>

      {password.length > 0 && (
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-400">Password strength</p>
          <p
            className={`text-xs font-medium ${
              score < 2
                ? "text-red-400"
                : score < 3
                  ? "text-orange-400"
                  : score < 4
                    ? "text-yellow-400"
                    : score < 5
                      ? "text-green-400"
                      : "text-primary-400"
            }`}
          >
            {label}
          </p>
        </div>
      )}
    </div>
  );
};

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string.isRequired,
  onScoreChange: PropTypes.func,
};

export default PasswordStrengthMeter;
