import { getPasswordCriteria } from '../../utils/passwordStrength';

interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const criteria = getPasswordCriteria(password);

  const items = [
    { label: '1 number', met: criteria.hasNumber },
    { label: '1 uppercase letter', met: criteria.hasUppercase },
    { label: '1 lowercase letter', met: criteria.hasLowercase },
    { label: '1 special character', met: criteria.hasSpecialChar },
  ];

  return (
    <ul className="password-strength" aria-label="Password strength requirements">
      {items.map((item) => (
        <li
          key={item.label}
          className={item.met ? 'password-strength-met' : 'password-strength-unmet'}
        >
          {item.met ? '✓' : '○'} {item.label}
        </li>
      ))}
    </ul>
  );
}
