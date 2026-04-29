"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { homeTests } from "../data/home-data";

export function TestsCtaSection() {
  return (
    <section className="bg-white py-20">
      <div className="page-shell">
        <div className="overflow-hidden rounded-[1.75rem] border border-border bg-primary p-8 sm:p-12 lg:flex lg:items-center lg:justify-between lg:gap-16">
          {/* Left content */}
          <div className="flex-1 space-y-6 text-white">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Psikolojik Testler
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-3xl">
                Kendinizi Tanıyın
              </h2>
            </div>

            <p className="max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              Bilimsel tabanlı kısa testlerle zihinsel sağlık durumunuzu
              değerlendirin. Tamamen ücretsiz, anonim.
            </p>

            {/* Test chips */}
            <div className="flex flex-wrap gap-2">
              {homeTests.map((test) => (
                <button
                  key={test.name}
                  className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/18"
                >
                  <div className="font-semibold">{test.name}</div>
                  <div className="text-xs text-secondary">{test.time}</div>
                </button>
              ))}
            </div>

            <div>
              <Button asChild variant="secondary">
                <Link href="/testler">Teste Başla →</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Checkmark icon */}
          <div className="mt-8 flex justify-center lg:mt-0">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-secondary">
              <svg
                width="56"
                height="56"
                viewBox="0 0 48 48"
                fill="none"
                className="text-white"
              >
                <path
                  d="M24 8C15.16 8 8 15.16 8 24s7.16 16 16 16 16-7.16 16-16S32.84 8 24 8zm-2 24l-6-6 2.83-2.83L22 26.34l9.17-9.17L34 20l-12 12z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
