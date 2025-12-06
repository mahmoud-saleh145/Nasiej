'use client'
import { useEffect } from 'react';
import { TailSpin } from 'react-loader-spinner'
export default function LoadingPage() {
    useEffect(() => {

        document.body.style.overflow = "hidden";

        return () => {

            document.body.style.overflow = "auto";
        };
    }, []);
    return (
        <div className="position-fixed min-h-screen top-0 bottom-0 end-0 start-0 d-flex align-items-center justify-content-center bg-black opacity-25 pointer-events-all z-[1020]">

            <TailSpin
                visible={true}
                height="80"
                width="80"
                color="#3a2f25"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    )
}
