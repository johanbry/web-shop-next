import { IPage } from "@/interfaces/interfaces";
import Page from "@/models/Page";

/**
 * Retrieves a page by its slug.
 * @param slug - The slug of the page to retrieve.
 * @returns The page object as a JSON string.
 */
export const getPageBySlug = async (slug: string) => {
  let page: IPage | null = null;
  try {
    page = await Page.findOne({ slug });
  } catch (error) {
    console.log((error as Error).message);
  }
  return JSON.parse(JSON.stringify(page)) as IPage;
};

/**
 * Retrieves all pages.
 * @returns An array of pages.
 */
export const getAllPages = async () => {
  let pages: IPage[] = [];
  try {
    pages = await Page.find();
  } catch (error) {
    console.log((error as Error).message);
  }
  return JSON.parse(JSON.stringify(pages)) as IPage[];
};
