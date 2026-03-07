export type BlogCategory =
  | "Security"
  | "Technology"
  | "Government Services"
  | "Career"
  | "SaaS"
  | "General";

export function getBlogCategory(post: {
  title: string;
  excerpt: string;
  content: string;
}): BlogCategory {
  const text = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase();
  if (
    /security|certif|csa|css|csi|csm|csd|corp international|police verif|risk|sop|event security/.test(
      text,
    )
  )
    return "Security";
  if (
    /saas|subscription|automation|system management|service management|software/.test(
      text,
    )
  )
    return "SaaS";
  if (/umang|government|pension|pf|aadhaar|digilocker|scheme|gov/.test(text))
    return "Government Services";
  if (/resume|career|interview|job|hire|hiring/.test(text)) return "Career";
  if (
    /web|website|digital|tech|code|develop|react|app|mobile|ai|content creation/.test(
      text,
    )
  )
    return "Technology";
  return "General";
}

export const categoryColors: Record<BlogCategory, string> = {
  Security: "bg-red-100 text-red-700 border-red-200",
  Technology: "bg-blue-100 text-blue-700 border-blue-200",
  "Government Services": "bg-orange-100 text-orange-700 border-orange-200",
  Career: "bg-purple-100 text-purple-700 border-purple-200",
  SaaS: "bg-green-100 text-green-700 border-green-200",
  General: "bg-gray-100 text-gray-700 border-gray-200",
};

export const ALL_CATEGORIES: BlogCategory[] = [
  "Security",
  "Technology",
  "Government Services",
  "Career",
  "SaaS",
  "General",
];
