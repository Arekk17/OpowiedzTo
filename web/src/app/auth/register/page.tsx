"use client";
import { Input } from "@/components/atoms/inputs/Input";
import { RadioField } from "@/components/molecules/forms/RadioField";
import { AuthFormLayout } from "@/components/templates/AuthFormLayout";
import { useAuth } from "@/hooks/useAuth";
import { generateNickname } from "@/services/auth.service";
import { RegisterForm, RegisterApiData, registerSchema } from "@/types/auth";
import { CubeIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const { signup, isSigningUp } = useAuth();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
  });
  const handleGenerateNickname = async () => {
    const nickname = await generateNickname();
    console.log(nickname);
    setValue("nickname", nickname.nickname);
  };

  const onSubmit = (data: RegisterForm) => {
    const apiData: RegisterApiData = {
      email: data.email,
      password: data.password,
      nickname: data.nickname,
      gender: data.gender,
    };
    signup(apiData);
  };

  return (
    <AuthFormLayout
      title="Zarejestruj się"
      submitLabel="Zarejestruj się"
      loading={isSigningUp}
      onSubmit={handleSubmit(onSubmit)}
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
      <Input
        label="Potwierdź hasło"
        showLabel
        type="password"
        placeholder="Potwierdź hasło"
        error={errors.confirmPassword}
        fullWidth
        {...register("confirmPassword")}
      />
      <Input
        label="Nickname"
        showLabel
        type="text"
        placeholder="Nickname"
        error={errors.nickname}
        fullWidth
        rightIcon={<CubeIcon />}
        rightIconClickable
        onRightIconClick={handleGenerateNickname}
        {...register("nickname")}
      />
      <div className="flex flex-col gap-2">
        <label className="text-sm font-jakarta text-content-primary">
          Płeć
        </label>
        <div className="flex items-center gap-2">
          <RadioField name="gender" value="male" label="Mężczyzna" />
          <RadioField name="gender" value="female" label="Kobieta" />
          <RadioField name="gender" value="other" label="Inne" />
        </div>
      </div>
    </AuthFormLayout>
  );
}
