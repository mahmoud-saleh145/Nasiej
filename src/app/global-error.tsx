'use client'

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
                </main>
            </body>
        </html>
    )
}