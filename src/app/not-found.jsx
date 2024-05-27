"use client"
import Link from "next/link"

const NotFound = () => {
    return(
        <div className="text-color-accent container flex mx-auto max-w-xl justify-center items-center min-h-screen">
            <div className="flex flex-col md:text-2xl justify-center items-center">
                <h1>This Page is Still in Development</h1>
                <Link href="/dashboard">
                    <p className="text-color-primary text-sm py-5">Kembali</p>
                </Link>
            </div>
        </div>
    )
}

export default NotFound