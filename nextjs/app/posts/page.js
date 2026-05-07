"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { fetchAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PostsPage() {
  const { user, isReady } = useAuth();
  const router = useRouter();

  const [pageData, setPageData] = useState({
    posts: [],
    currentPage: 1,
    lastPage: 1,
    loading: true,
  });

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isReady && !user) {
      router.push("/login");
    }
  }, [isReady, user, router]);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function fetchPosts() {
      try {
        const res = await fetchAPI(`/posts?page=${currentPage}`);
        const data = await res.json();

        if (!cancelled) {
          setPageData({
            posts: data.data,
            currentPage: data.current_page,
            lastPage: data.last_page,
            loading: false,
          });
        }
      } catch (err) {
        console.error("Gagal memuat posts:", err);
        if (!cancelled) {
          setPageData((prev) => ({ ...prev, loading: false }));
        }
      }
    }

    fetchPosts();

    return () => {
      cancelled = true;
    };
  }, [currentPage, user]);

  if (!isReady || !user) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const renderPagination = () => {
    if (pageData.lastPage <= 1) return null;

    const buttons = [];
    for (let i = 1; i <= pageData.lastPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`join-item btn btn-sm ${i === pageData.currentPage ? "btn-active" : ""}`}
          onClick={() => setCurrentPage(i)}>
          {i}
        </button>,
      );
    }

    return <div className="join mt-6 flex justify-center">{buttons}</div>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Semua Post</h1>
        <Link href="/posts/create" className="btn btn-primary btn-sm">
          + Buat Post Baru
        </Link>
      </div>

      {pageData.loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="card bg-base-100 shadow-sm border p-6 flex flex-col gap-4">
              <div className="skeleton h-6 w-3/4"></div>
              <div className="skeleton h-4 w-1/2 mb-2"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-4/5"></div>
              <div className="skeleton h-8 w-28 mt-4 self-end"></div>
            </div>
          ))}
        </div>
      ) : pageData.posts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-base-200/50 rounded-2xl border-2 border-dashed border-base-300">
          <h3 className="text-xl font-semibold mb-2">Belum Ada Postingan</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Silahkan input postingan terlebih dahulu
          </p>
          <Link href="/posts/create" className="btn btn-primary">
            + Buat Post
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageData.posts.map((post) => (
              <div key={post.id} className="card bg-base-100 shadow-sm border">
                <div className="card-body">
                  <h2 className="card-title line-clamp-1">{post.title}</h2>
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-6">
                        <span className="text-xs">
                          {post.user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm">
                      Oleh: {post.user?.name} | {" "}
                      &bull; {new Date(post.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <p className="line-clamp-3 text-base-content/80 text-sm">
                    {post.body}
                  </p>
                  <div className="card-actions justify-end">
                    <Link
                      href={`/posts/${post.id}`}
                      className="btn btn-primary btn-sm">
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {renderPagination()}
        </>
      )}
    </div>
  );
}
