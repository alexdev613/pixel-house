import React, { type InputHTMLAttributes, forwardRef } from 'react';

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  className?: string;
  containerClassName?: string;
}

// Função que cria o componente CustomInput
function CustomInput(
  { error, className, containerClassName, ...props }: CustomInputProps,
  ref: React.Ref<HTMLInputElement>
) {
  return (
    <div className={`relative mt-1 mb-4 ${containerClassName}`}>
      <input
        ref={ref}
        {...props}
        className={`w-full border-2 h-10 px-2 rounded ${className} ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && (
        <p className='absolute text-red-500 text-sm'>{error}</p>
      )}
    </div>
  );
}

// Envolve a função com forwardRef e define o displayName
const ForwardedCustomInput = forwardRef(CustomInput);
ForwardedCustomInput.displayName = 'CustomInput';

export { ForwardedCustomInput as CustomInput };
