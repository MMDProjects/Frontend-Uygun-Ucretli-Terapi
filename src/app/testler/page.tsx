"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { TestCard } from "@/features/tests";
import { TestsHeroSection } from "@/features/tests";
import { TestHistorySection } from "@/features/tests/components/test-history-section";
import { getTests, type ApiTest } from "@/lib/services/public.service";

export default function TestsPage() {
  const { isAuthenticated } = useAuthStore();
  const [tests, setTests] = useState<ApiTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTests()
      .then(setTests)
      .catch(() => setTests([]))
      .finally(() => setLoading(false));
  }, []);

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
                Uzmanlarımız test sonuçlarınızı değerlendirerek size özel bir yol haritası
                çıkarabilir.
              </p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-[2rem] bg-muted"
                />
              ))}
            </div>
          ) : tests.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Şu anda aktif test bulunmamaktadır.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {tests.map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
