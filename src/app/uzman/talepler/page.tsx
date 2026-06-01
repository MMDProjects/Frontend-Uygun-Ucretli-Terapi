import Link from "next/link";
import { Clock } from "lucide-react";

export default function UzmanTaleplerPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
        <Clock className="size-8 text-primary" />
      </div>
      <h1 className="text-xl font-bold text-foreground">Yakında</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Danışan talepleri özelliği Faz 2&apos;de aktif olacak. Şu an görüşme talepleri
        iletişim formu üzerinden alınmaktadır.
      </p>
      <Link
        href="/uzman/dashboard"
        className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
      >
        Panele Dön
      </Link>
    </div>
  );
}
