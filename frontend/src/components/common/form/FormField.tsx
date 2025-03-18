import { FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  error?: FieldError;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, required = false, children }: Readonly<FormFieldProps>) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label} {required && '*'}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
