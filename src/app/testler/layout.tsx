import { getSss } from "@/lib/services/public.service";
import { SssSection } from "@/components/common/sss-section";

export default async function TestlerLayout({ children }: { children: React.ReactNode }) {
  let sssItems: Awaited<ReturnType<typeof getSss>> = [];
  try {
    sssItems = await getSss("TESTLER");
  } catch {
    sssItems = [];
  }

  return (
    <>
      {children}
      <SssSection items={sssItems} title="Testler Hakkında Sıkça Sorulan Sorular" />
    </>
  );
}
