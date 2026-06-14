import type { ApiSss } from "@/lib/services/public.service";

const PAGE_LABELS: Record<string, string> = {
  GENEL: "Genel",
  TESTLER: "Testler",
  PAKETLER: "Paketler",
  RANDEVU: "Randevu",
  ODEME: "Ödeme",
  UZMAN: "Uzman Seçimi",
  GIZLILIK: "Gizlilik ve Güvenlik",
};

type Group = { page: string; label: string; items: ApiSss[] };

function groupByCategory(sortedItems: ApiSss[]): Group[] {
  const order: string[] = [];
  const map = new Map<string, ApiSss[]>();
  for (const item of sortedItems) {
    if (!map.has(item.page)) {
      order.push(item.page);
      map.set(item.page, []);
    }
    map.get(item.page)!.push(item);
  }
  return order.map((page) => ({
    page,
    label: PAGE_LABELS[page] ?? page,
    items: map.get(page)!,
  }));
}

type Props = { items: ApiSss[] };

export function SssFullList({ items }: Props) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Henüz soru-cevap eklenmemiş.
      </p>
    );
  }

  const groups = groupByCategory(items);

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.page} aria-labelledby={`cat-${group.page}`}>
          <div className="mb-6 flex items-center gap-3">
            <span
              id={`cat-${group.page}`}
              className="inline-flex shrink-0 items-center rounded-full bg-[#e6f0ee] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#014a3e]"
            >
              {group.label}
            </span>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <div className="divide-y divide-border/40">
            {group.items.map((item) => (
              <div key={item.id} className="py-5 first:pt-0">
                <p className="font-semibold leading-6 text-[#014a3e]">
                  {item.question}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground whitespace-pre-line">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
