'use client'
import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { getSession, signIn } from 'next-auth/react';
import { FcGoogle } from "react-icons/fc";
import { JSON_HEADER } from '@/lib/constants/api.constants';
import LoadingPage from '@/components/common/LoadingPage';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function LoginPopup({ open, onClose }: { open: boolean, onClose: () => void }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [error, setError] = useState('')
    const [loading, isLoading] = useState(false)
    const { setLoggedIn } = useAuth();
    const { setRole } = useAuth();

    useEffect(() => {

        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };

    }, [open]);

    const validationSchema = yup.object({
        email: yup.string().email().required().matches(/^[A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]+\.(com)$/),
    });


    const submit = useCallback(async (values: { email: string }) => {
        isLoading(true)

        const user = await fetch(`/api/auth/login`, {
            body: JSON.stringify({ ...values }),
            headers: { ...JSON_HEADER },
            credentials: "include",
            method: 'POST',
            cache: 'no-cache',
        });

        const data: APIResponse<LoginUser> = await user.json();
        if (data.msg === "success") {
            setLoggedIn(true);
            setRole(data.user.role);
            queryClient.invalidateQueries({ queryKey: ["cartQuantity"] });
            router.refresh()
            onClose();
            isLoading(false)
        } else {
            setError(data.err)
        }
        isLoading(false)
    }, [queryClient, setRole])

    const formik = useFormik({
        initialValues: { email: '' },
        validationSchema,
        onSubmit: submit
    });



    const handleGoogleLogin = async () => {
        await signIn("google", {
            redirect: false
        });
    }

    const [loggedInWithGoogle, setLoggedInWithGoogle] = useState(false);
    useEffect(() => {
        if (loggedInWithGoogle) {
            return
        } else {
            async function loginAfterGoogle() {
                const session = await getSession();
                if (session?.user?.email) {
                    await submit({ email: session.user.email });
                }
                setLoggedInWithGoogle(true);
            }
            loginAfterGoogle();
        }

    }, [submit, loggedInWithGoogle]);
    if (!open) return null;
    return (
        <>

            <div
                className="fixed inset-0 min-h-screen bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
                onClick={() => !loading && onClose()}
            >

                <div
                    className="w-full max-w-md  rounded-2xl shadow-2xl bg-background-light border border-indigo-100 relative animate-scaleIn p-8"
                    onClick={(e) => e.stopPropagation()}
                >

                    {loading && (
                        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50 rounded-2xl">
                            <LoadingPage />
                        </div>
                    )}
                    {/* Close Button */}
                    <button onClick={() => !loading && onClose()} disabled={loading}
                        className="absolute top-4 right-5 text-text text-3xl hover:text-red-500 ">
                        ✕
                    </button>

                    <h2 className="text-text text-xl font-bold mb-6">Sign In for the first time and get 10% discount🎉.</h2>
                    <form onSubmit={formik.handleSubmit}>

                        <div className="mb-5">
                            <input
                                autoComplete="on"
                                type="email"
                                name="email"
                                placeholder="Enter Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                onFocus={() => formik.setFieldTouched("email", false)}
                                className={`w-full p-3 rounded-xl border bg-white text-text shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition
                          ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"}`}
                            />
                            {formik.errors.email && formik.touched.email && (
                                <p className="text-red-500 text-sm mt-1 mb-0">{formik.errors.email}</p>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-100 text-red-600 p-2 rounded-lg text-sm mb-4">
                                {error}
                            </div>
                        )}

                        <button type="submit"
                            aria-label="Sign in"
                            disabled={loading}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full py-2 rounded-2xl bg-buttons text-text font-semibold hover:bg-buttons-hover shadow-xl">
                            {loading ? "Loading..." : "Sign In"}
                        </button>
                    </form>

                    <div className="flex justify-center my-3">
                        <p className="text-text-secondary m-0">Or Continue With</p>
                    </div>

                    <div className="flex justify-center text-4xl cursor-pointer">
                        <div
                            onClick={handleGoogleLogin}
                            className="hover:scale-110 transition "
                        >
                            <FcGoogle />
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
}
