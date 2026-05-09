import { redirect } from "next/navigation";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function LegacyCvPercobaanEditorRedirect({ searchParams }: Props) {
  const q = new URLSearchParams();
  for (const [key, val] of Object.entries(searchParams)) {
    if (val == null) continue;
    if (Array.isArray(val)) val.forEach((v) => q.append(key, v));
    else q.set(key, val);
  }
  const suffix = q.toString() ? `?${q}` : "";
  redirect(`/cv/editor${suffix}`);
}
