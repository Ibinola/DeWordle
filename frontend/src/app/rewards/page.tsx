"use client";

import { FEATURE_FLAGS } from "@/lib/feature-flags";
import { ComingSoon } from "@/components/ComingSoon";
import { RewardsClaimPanel } from "@/components/RewardsClaimPanel";

export default function RewardsPage() {
  if (!FEATURE_FLAGS.rewards) return <ComingSoon feature="Rewards" />;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-10">
      <RewardsClaimPanel rewards={[]} />
    </section>
  );
}
