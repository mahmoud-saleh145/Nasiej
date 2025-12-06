'use client'

import Link from "next/link"

export default function Error({
    error, reset
}: {
    error: Error & { digest?: string },
    reset: () => void
}) {

    return (
        <html>
            <body>
                <main>
                    Error {error.message}
                    <button onClick={reset}>Reset</button>
                    <span>or go to </span>
                    <Link href={'/'}> home page</Link>
                </main>
            </body>
        </html>
    )
}