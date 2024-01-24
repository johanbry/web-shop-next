import { notifications } from "@mantine/notifications";

export const showNotification = (
  title: string,
  message: string,
  type?: string | undefined
) => {
  let color: string | undefined = undefined;
  if (type === "success") color = "var(--mantine-color-success)";
  if (type === "error") color = "var(--mantine-color-error)";

  notifications.show({
    color: "var(--mantine-color-error)",
    withBorder: true,
    title,
    message,
  });
};
