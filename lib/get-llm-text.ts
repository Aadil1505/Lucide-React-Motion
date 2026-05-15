import type { source } from "@/lib/source";

type Page = (typeof source)["$inferPage"];

export async function getLLMText(page: Page): Promise<string> {
  const processed = await page.data.getText("processed");
  return `# ${page.data.title} (${page.url})\n\n${processed}`;
}
