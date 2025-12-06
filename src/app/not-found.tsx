import Link from "next/link";


export default function Notfound() {
    return (
        <html>
            <body>
                <main className="text-center d d-flex flex-column justify-content-center align-items-center vh-100">
                    <p className="fs-1">404 - Not Found</p>
                    <Link href={'/'} className='main-color  fw-bolder link-underline link-underline-opacity-0'>go back to home page</Link>
                </main>
            </body>
        </html>
    )
}
