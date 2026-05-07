"use client";

import {useState, useEffect} from "react";
import { useAuth } from "@/lib/AuthContext";
import { fetchAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreatePostPage(){
    const {user, isReady} = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isReady && !user) {
            router.push("/login");
        }
    }, [isReady, user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetchAPI("/posts" , {
                method: "POST", 
                body: JSON.stringify({title, body}),
            });
            
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Gagal membuat post");
            }
            router.push("/posts");
        } catch(err){
            setError(err.message);
        }finally {
            setLoading(false);
        }
    };

    if(!isReady || !user) {
        return (
            <div className="flex justify-center py-10">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return(
        <div className="max-w-2xl mx-auto py-8">
            {error &&(
                <div className="alert alert-error mb-4">
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-6">
                    <legend className="fieldset-legend font-bold text-xl">Buat Post Baru</legend>

                    <label className="label mt-2">Judul</label>
                    <input
                        type="text"
                        placeholder="Judul post"
                        className="input input-bordered w-full"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label className="label mt-4">Isi Post</label>
                    <textarea
                        placeholder="Tulis isi post di sini..."
                        className="textarea textarea-bordered h-40 w-full"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                    ></textarea>

                    <div className="flex gap-2 mt-6">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                                "Simpan Post"
                            )}
                        </button>
                        <button type="button" className="btn btn-ghost" onClick={() => router.back()}>
                            Batal
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    )
}