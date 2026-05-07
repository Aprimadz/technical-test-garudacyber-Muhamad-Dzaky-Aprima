"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/lib/AuthContext";
import { fetchAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PostDetailPage({ params }) {
  const { id } = use(params);
  const { user, isReady } = useAuth();
  const router = useRouter();

  const [pageData, setPageData] = useState({
    post: null,
    loading: true,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isReady && !user) {
      router.push("/login");
    }
  }, [isReady, user, router]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function fetchPost() {
      try {
        const res = await fetchAPI(`/posts/${id}`);
        if (!res.ok) {
          if (!cancelled) setPageData({ post: null, loading: false });
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setPageData({ post: data, loading: false });
        }
      } catch (err) {
        console.error("Gagal memuat post:", err);
        if (!cancelled) setPageData({ post: null, loading: false });
      }
    }

    fetchPost();
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus post ini?")) return;

    setDeleting(true);
    try {
      const res = await fetchAPI(`/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/posts");
      }
    } catch (err) {
      console.error("Gagal menghapus post:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (!isReady || !user) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (pageData.loading) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!pageData.post) {
    return <p className="text-center py-10">Post tidak ditemukan.</p>;
  }

  const post = pageData.post;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card bg-base-100 shadow-sm border">
        <div className="card-body">
          <h1 className="card-title text-3xl">{post.title}</h1>
          <p className="text-gray-500 text-sm">
            Oleh: {post.user?.name} |{" "}
            {new Date(post.created_at).toLocaleDateString("id-ID")}
          </p>
          <div className="divider"></div>
          <p className="whitespace-pre-wrap">{post.body}</p>

          {user && post.user_id === user.id && (
            <div className="card-actions justify-end mt-4">
              <Link
                href={`/posts/${post.id}/edit`}
                className="btn btn-warning btn-sm">
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-error btn-sm"
                disabled={deleting}>
                {deleting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Hapus"
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Link href="/posts" className="btn btn-ghost btn-sm">
          ← Kembali ke daftar post
        </Link>
      </div>
    </div>
  );
}
