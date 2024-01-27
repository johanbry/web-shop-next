"use client";

import { createUser } from "@/actions";
import {
  LoginUserInput,
  LoginUserValidationSchema,
} from "@/interfaces/interfaces";
import { showNotification } from "@/utils/showNotifications";
import {
  Alert,
  Button,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons-react";
import { zodResolver } from "mantine-form-zod-resolver";
import { set } from "mongoose";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(LoginUserValidationSchema),
  });

  const handleFormSubmit = async (values: LoginUserInput) => {
    try {
      startTransition(async () => {
        const response = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
          callbackUrl: "/minasidor",
        });

        if (!response) {
          setErrorMessage("Någonting gick fel");
          return;
        }
        if (response?.error) {
          setErrorMessage(response.error);
          //showNotification("Kunde inte logga in", response.error, "error");
          return;
        }
        if (response.ok) router.replace(response.url || "/minasidor");
      });
    } catch (error) {
      showNotification(
        "Kunde inte logga in",
        (error as Error).message,
        "error"
      );
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleFormSubmit(values))}>
      <Stack gap="sm">
        <Title order={4}>Logga in med e-post/lösenord</Title>
        <TextInput
          withAsterisk
          label="E-post"
          placeholder="e-post@e-post.se"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          withAsterisk
          label="Lösenord"
          placeholder="Lösenord"
          {...form.getInputProps("password")}
        />
        {errorMessage && (
          <Alert
            onClose={() => setErrorMessage(null)}
            variant="light"
            color="red"
            withCloseButton
            title="Kunde inte logga in"
            icon={<IconInfoCircle />}
          >
            {errorMessage}
          </Alert>
        )}
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isPending}
          aria-disabled={isPending}
        >
          Logga in
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
