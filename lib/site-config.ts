export const siteConfig = {
  name: "Lucide//Motion",
  description:
    "Animated, editable React components for all 1,711 Lucide icons. Drop-in replacement for lucide-react.",
  url: "https://lucide-react-motion.dev",
  github: {
    owner: "aadil-alli",
    repo: "lucide-react-motion",
    branch: "main",
  },
} as const;

export function docsGithubUrl(pagePath: string): string {
  const { owner, repo, branch } = siteConfig.github;
  return `https://github.com/${owner}/${repo}/blob/${branch}/content/docs/${pagePath}`;
}
