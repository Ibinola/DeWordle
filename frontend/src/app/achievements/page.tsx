import { FEATURE_FLAGS } from "@/lib/feature-flags";
import { ComingSoon } from "@/components/ComingSoon";
import { AchievementsView } from "@/components/AchievementsView";

export default function AchievementsPage() {
  if (!FEATURE_FLAGS.achievements) return <ComingSoon feature="Achievements" />;
  return <AchievementsView />;
}
