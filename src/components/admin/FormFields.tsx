import type { FieldPath, FieldValues, UseFormRegister } from "react-hook-form";
import { Field, Input, Select, Textarea } from "@/components/ui/field";

type FieldErrorLike = {
  message?: string;
};

export function FormInput<TFieldValues extends FieldValues>({
  label,
  name,
  register,
  error,
  type = "text",
}: {
  label: string;
  name: FieldPath<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  error?: FieldErrorLike;
  type?: React.HTMLInputTypeAttribute;
}) {
  return (
    <Field label={label} error={error?.message}>
      <Input type={type} {...register(name)} />
    </Field>
  );
}

export function FormTextarea<TFieldValues extends FieldValues>({
  label,
  name,
  register,
  error,
}: {
  label: string;
  name: FieldPath<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  error?: FieldErrorLike;
}) {
  return (
    <Field label={label} error={error?.message}>
      <Textarea {...register(name)} />
    </Field>
  );
}

export function FormSelect<TFieldValues extends FieldValues>({
  label,
  name,
  register,
  error,
  children,
}: {
  label: string;
  name: FieldPath<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  error?: FieldErrorLike;
  children: React.ReactNode;
}) {
  return (
    <Field label={label} error={error?.message}>
      <Select {...register(name)}>{children}</Select>
    </Field>
  );
}