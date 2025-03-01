import { useState, useCallback } from 'react';

type ValidationRule<T> = {
  validate: (value: T, formValues: Record<string, any>) => boolean;
  message: string;
};

type FieldConfig<T> = {
  value: T;
  rules?: ValidationRule<T>[];
};

type FormConfig = Record<string, FieldConfig<any>>;

type FormState<T extends FormConfig> = {
  values: { [K in keyof T]: T[K]['value'] };
  errors: { [K in keyof T]?: string };
  touched: { [K in keyof T]: boolean };
  isValid: boolean;
  isDirty: boolean;
};

export function useForm<T extends FormConfig>(config: T) {
  const initialValues = Object.entries(config).reduce(
    (acc, [key, field]) => ({ ...acc, [key]: field.value }),
    {} as { [K in keyof T]: T[K]['value'] }
  );

  const initialTouched = Object.keys(config).reduce(
    (acc, key) => ({ ...acc, [key]: false }),
    {} as { [K in keyof T]: boolean }
  );

  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: initialTouched,
    isValid: false,
    isDirty: false,
  });

  const validateField = useCallback(
    (name: keyof T, value: any) => {
      const fieldConfig = config[name];
      if (!fieldConfig.rules || fieldConfig.rules.length === 0) {
        return '';
      }

      for (const rule of fieldConfig.rules) {
        if (!rule.validate(value, formState.values)) {
          return rule.message;
        }
      }

      return '';
    },
    [config, formState.values]
  );

  const validateForm = useCallback(() => {
    const errors: { [K in keyof T]?: string } = {};
    let isValid = true;

    Object.keys(config).forEach((key) => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, formState.values[fieldName]);
      
      if (error) {
        errors[fieldName] = error;
        isValid = false;
      }
    });

    return { errors, isValid };
  }, [config, formState.values, validateField]);

  const handleChange = useCallback(
    (name: keyof T, value: any) => {
      setFormState((prev) => {
        const error = validateField(name, value);
        const newValues = { ...prev.values, [name]: value };
        const newErrors = { ...prev.errors, [name]: error };
        const newTouched = { ...prev.touched, [name]: true };
        
        const { isValid } = validateForm();
        const isDirty = JSON.stringify(newValues) !== JSON.stringify(initialValues);

        return {
          values: newValues,
          errors: newErrors,
          touched: newTouched,
          isValid,
          isDirty,
        };
      });
    },
    [initialValues, validateField, validateForm]
  );

  const handleBlur = useCallback(
    (name: keyof T) => {
      setFormState((prev) => {
        if (prev.touched[name]) return prev;

        const newTouched = { ...prev.touched, [name]: true };
        const error = validateField(name, prev.values[name]);
        const newErrors = { ...prev.errors, [name]: error };

        return {
          ...prev,
          touched: newTouched,
          errors: newErrors,
        };
      });
    },
    [validateField]
  );

  const reset = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: initialTouched,
      isValid: false,
      isDirty: false,
    });
  }, [initialValues, initialTouched]);

  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: formState.values[name],
      onChangeText: (value: any) => handleChange(name, value),
      onBlur: () => handleBlur(name),
      error: formState.touched[name] ? formState.errors[name] : undefined,
    }),
    [formState, handleChange, handleBlur]
  );

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    handleChange,
    handleBlur,
    reset,
    getFieldProps,
    validateForm,
  };
}