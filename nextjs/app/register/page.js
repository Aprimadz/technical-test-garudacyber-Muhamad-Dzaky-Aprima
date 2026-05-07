"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage(){
    const {register} = useAuth();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
          await register(name, email, password, passwordConfirmation);
          router.push("/posts");
        } catch (err) {
          setError(err.msg);
        } finally {
          setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-6">
                    <legend className="fieldset-legend font-bold text-xl">Register</legend>

                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <label className="label mt-2">Nama</label>
                    <input
                        type="text"
                        placeholder="Nama lengkap"
                        className="input input-bordered w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label className="label mt-4">Email</label>
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
                        placeholder="minimal 8 karakter"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <label className="label mt-4">Konfirmasi Password</label>
                    <input
                        type="password"
                        placeholder="Ketik ulang password"
                        className="input input-bordered w-full"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
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
                            "Daftar"
                        )}
                    </button>

                    <p className="text-center mt-4 text-sm w-full">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="link link-primary">
                            Login di sini
                        </Link>
                    </p>
                </fieldset>
            </form>
        </div>
    );
}