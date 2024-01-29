"use client";

import { createUser } from "@/actions";
import {
  CreateUserInput,
  CreateUserValidationSchema,
} from "@/interfaces/interfaces";
import { showNotification } from "@/utils/showNotifications";
import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { signIn } from "next-auth/react";
import { useTransition } from "react";

const CreateAccountForm = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validate: zodResolver(CreateUserValidationSchema),
  });

  const handleFormSubmit = async (values: CreateUserInput) => {
    try {
      const response = await createUser(values);
      if (response.error) {
        showNotification("Konto kunde inte skapas", response.error, "error");
        return;
      }
      if (response.fieldErrors) {
        form.setErrors(response.fieldErrors);
        return;
      }
      // successful registration, log in user
      if (response.user) {
        startTransition(async () => {
          await signIn("credentials", {
            email: response.user?.email,
            password: values.password,
            redirect: true,
            callbackUrl: "/minasidor",
          });
        });
      }
    } catch (error) {
      showNotification(
        "Konto kunde inte skapas",
        (error as Error).message,
        "error"
      );
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleFormSubmit(values))}>
      <Stack gap="sm">
        <TextInput
          withAsterisk
          label="Namn"
          placeholder="Exempel: Johan Johansson"
          {...form.getInputProps("name")}
        />
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
        <PasswordInput
          withAsterisk
          label="Upprepa lösenord"
          placeholder="...samma lösenord"
          {...form.getInputProps("passwordConfirmation")}
        />
        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isPending}
          aria-disabled={isPending}
        >
          Skapa konto
        </Button>
      </Stack>
    </form>
  );
};

export default CreateAccountForm;
