"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage(){
    const {login} = useAuth();
    const router = useRouter();


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            await login(email, password);
            router.push("/posts");

        } catch(err){
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-6">
                    <legend className="fieldset-legend font-bold text-xl">Login</legend>

                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <label className="label mt-2">Email</label>
                    <input 
                        type="email"
                        placeholder="email@contoh.com"
                        className="input input-bordered w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label className="label mt-4">Password</label>
                    <input
                        type="password"
                        placeholder="Masukkan password"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="btn btn-primary mt-6 w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            "Login"
                        )}
                    </button>
                    
                    <p className="text-center mt-4 text-sm w-full">
                        Belum punya akun?{" "}
                        <Link href="/register" className="link link-primary">
                                Daftar di sini
                        </Link>
                    </p>
                </fieldset>
            </form>
        </div>
    )
}
