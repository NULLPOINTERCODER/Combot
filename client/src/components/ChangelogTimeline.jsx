import ChangelogCard from "./ChangelogCard.jsx";
import EmptyState from "./EmptyState.jsx";

export default function ChangelogTimeline({ changelogs, onToast }) {
  if (!changelogs.length) {
    return <EmptyState title="No updates yet" description="Check back soon for new releases." />;
  }
  return (
    <div className="flex flex-col gap-6">
      {changelogs.map((c) => (
        <ChangelogCard key={c._id} changelog={c} onToast={onToast} />
      ))}
    </div>
  );
}
