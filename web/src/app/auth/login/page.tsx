"use client";
import { Input } from "@/components/atoms/inputs/Input";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm, loginSchema } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthFormLayout } from "@/components/templates/AuthFormLayout";

export default function LoginPage() {
  const { signin, isSigningIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const onSubmit = (data: LoginForm) => {
    signin(data);
  };

  return (
    <AuthFormLayout
      title="Zaloguj się"
      submitLabel="Zaloguj się"
      loading={isSigningIn}
      onSubmit={handleSubmit(onSubmit)}
      secondaryLink={{
        href: "/auth/forgot-password",
        label: "Zapomniałeś hasła?",
      }}
    >
      <Input
        label="Email"
        showLabel
        type="email"
        placeholder="Email"
        error={errors.email}
        fullWidth
        {...register("email")}
      />
      <Input
        label="Hasło"
        showLabel
        type="password"
        placeholder="Hasło"
        error={errors.password}
        fullWidth
        {...register("password")}
      />
    </AuthFormLayout>
  );
}
