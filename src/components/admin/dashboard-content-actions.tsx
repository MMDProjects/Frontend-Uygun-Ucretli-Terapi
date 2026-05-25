"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContentPublishDialog } from "@/components/admin/content-publish-dialog";

export function DashboardContentActions() {
  const [publishOpen, setPublishOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setPublishOpen(true)}
      >
        İçerik yayınla
      </Button>
      <ContentPublishDialog open={publishOpen} onOpenChange={setPublishOpen} />
    </>
  );
}
