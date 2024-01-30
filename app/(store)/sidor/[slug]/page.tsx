import { Title, Text, Container, Box } from "@mantine/core";
import { Metadata } from "next";
import { getPageBySlug } from "@/lib/page";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const page = await getPageBySlug(slug);

  return {
    title: page?.title,
  };
}

export default async function Page({ params }: Props) {
  const slug = params.slug; // The slug of the page
  const page = await getPageBySlug(slug);

  if (!page) notFound();

  return (
    <Container size="lg" px={0}>
      <Title>{page.title}</Title>
      {page.content && (
        <Box dangerouslySetInnerHTML={{ __html: page.content }} /> //Allows for HTML in the content
      )}
    </Container>
  );
}
