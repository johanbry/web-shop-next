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
  Divider,
  PasswordInput,
  Stack,
  TextInput,
  Text,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconBrandGoogle,
  IconBrandGoogleFilled,
  IconInfoCircle,
} from "@tabler/icons-react";
import { zodResolver } from "mantine-form-zod-resolver";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Props = {
  isAdmin?: boolean;
};

const LoginForm = ({ isAdmin }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const redirectUrl = isAdmin ? "/admin" : "/minasidor";

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
          callbackUrl: redirectUrl,
        });

        if (!response) {
          setErrorMessage("Någonting gick fel");
          return;
        }
        if (response?.error) {
          setErrorMessage(response.error);
          return;
        }
        if (response.ok) router.replace(response.url || redirectUrl);
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
        <Button
          variant="outline"
          fullWidth
          size="lg"
          leftSection={<IconBrandGoogleFilled />}
          onClick={() => signIn("google", { callbackUrl: redirectUrl })}
        >
          Logga in med Google
        </Button>
        <Divider label="eller" size="sm" my="xs" />
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
          Logga in med e-post/lösen
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;
