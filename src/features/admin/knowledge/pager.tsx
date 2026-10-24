"use client";

import { Pager as SharedPager } from "@/components/shared/pager";
import { PAGE_LIMIT } from "./constants";

interface PagerProps {
  page: number;
  total: number;
  disabled?: boolean;
  onChange: (page: number) => void;
}

export function Pager(props: PagerProps) {
  return <SharedPager {...props} limit={PAGE_LIMIT} />;
}
