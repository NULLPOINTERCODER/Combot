import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import ChangelogTable from "../../components/ChangelogTable.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import Pagination from "../../components/Pagination.jsx";
import { changelogService } from "../../services/changelogService.js";
import { Plus, Sparkles } from "lucide-react";

export default function ChangelogListPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await changelogService.adminList({ page });
    setItems(res.data.data);
    setPagination(res.data.pagination);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePublish = async (id) => {
    await changelogService.adminPublish(id);
    load();
  };
  const handleUnpublish = async (id) => {
    await changelogService.adminUnpublish(id);
    load();
  };
  const handleDeleteConfirmed = async () => {
    await changelogService.adminDelete(deleteId);
    setDeleteId(null);
    load();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Manage Changelogs</h1>
          <p className="text-xs text-slate-500 mt-0.5">Publish, edit, draft, or delete product releases</p>
        </div>
        <Link
          to="/admin/changelogs/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-brand-500/25 hover:bg-brand-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Changelog</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20"><LoadingSpinner /></div>
      ) : items.length === 0 ? (
        <EmptyState title="No changelogs yet" description="Create your first release to get started." />
      ) : (
        <div className="space-y-6">
          <ChangelogTable
            items={items}
            onDelete={setDeleteId}
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
          />
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this changelog?"
        description="This action cannot be undone. It will remove the changelog and all its reactions."
        confirmLabel="Delete permanently"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

