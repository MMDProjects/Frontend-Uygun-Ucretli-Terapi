"use client";

import { useAuthStore } from "@/lib/stores/auth-store";
import { TestCard } from "@/features/tests";
import { TestsHeroSection } from "@/features/tests";
import { TestHistorySection } from "@/features/tests/components/test-history-section";
import { testsPreview } from "@/features/shared/data/mock-content";

export default function TestsPage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <TestsHeroSection />

      {isAuthenticated && <TestHistorySection />}

      <section className="bg-[#e6f0ee] py-12">
        <div className="page-shell">
          {isAuthenticated && (
            <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
              <p className="text-sm font-semibold text-primary">
                Test Yaptırmak İster misiniz?
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Uzmanlarımız test sonuçlarınızı değerlendirerek size özel bir yol haritası çıkarabilir.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {testsPreview.map((test) => (
              <TestCard key={test.slug} test={test} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
