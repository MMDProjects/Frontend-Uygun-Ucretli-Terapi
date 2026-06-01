import { ExpertCard } from "./expert-card";
import type { ApiExpertSummary } from "@/lib/services/public.service";

type Props = {
  expert: ApiExpertSummary;
  className?: string;
  showPhoto?: boolean;
  centerCta?: boolean;
  expandContentDesktop?: boolean;
  standardPrice?: number;
  discountedPrice?: number;
};

export function ExpertCardApi({ expert, ...rest }: Props) {
  return (
    <ExpertCard
      expert={{
        slug: expert.id,
        name: `${expert.user.firstName} ${expert.user.lastName}`.trim(),
        title: expert.title,
        bio: expert.bio,
        rating: expert.rating,
        tags: expert.tags.map((t) => t.name),
        photoUrl: expert.avatarUrl || undefined,
        standardPrice: expert.standardPrice ? Number(expert.standardPrice) : null,
        discountedPrice: expert.discountedPrice ? Number(expert.discountedPrice) : null,
      }}
      {...rest}
    />
  );
}
