"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/lib/AuthContext";
import { fetchAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function EditPostPage({params}){
    const {id} = use(params);
    const {user, isReady} = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isReady && !user) {
            router.push("/login");
        }
    }, [isReady, user, router]);

    useEffect(() => {
        if (!user) return;

        let cancelled = false;

        async function fetchPost(){
            try {
                const res = await fetchAPI(`/posts/${id}`);
                if(!res.ok){
                    router.push("/posts");
                    return;
                }
                const data = await res.json();

                if (data.user_id !== user.id){
                    router.push("/posts");
                    return;
                }

                if(!cancelled) {
                    setTitle(data.title);
                    setBody(data.body);
                    setLoading(false);
                }
            } catch (err){
                console.error("Gagal memuat post:", err);
                if(!cancelled) setLoading(false);
            }
        }
        fetchPost();
        return () => { cancelled = true; };
    }, [id, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try{
            const res = await fetchAPI(`/posts/${id}`, {
                method: "PUT",
                body: JSON.stringify({title, body}),
            });

            if (!res.ok){
                const data = await res.json();
                throw new Error(data.message || "Gagal mengupdate post");
            }
            router.push(`/posts/${id}`);
        }catch (err) {
            setError(err.message);
        }finally{
            setSubmitting(false);
        }
    };

    if(!isReady || !user){
        return (
            <div className="flex justify-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (loading){
        return (
            <div className="flex justify-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }
    
    return (
        <div className="max-w-2xl mx-auto py-8">
            {error && (
                <div className="alert alert-error mb-4">
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-6">
                    <legend className="fieldset-legend font-bold text-xl">Edit Post</legend>

                    <label className="label mt-2">Judul</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    
                    <label className="label mt-4">Isi Post</label>
                    <textarea
                        className="textarea textarea-bordered h-40 w-full"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                    ></textarea>
                    
                    <div className="flex gap-2 mt-6">
                        <button type="submit" className="btn btn-primary" disabled={submitting}> 
                            {submitting ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                "Update Post"
                            )}
                        </button>
                        <button type="button" className="btn btn-ghost" onClick={() => router.back()}>
                            Batal
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );

}