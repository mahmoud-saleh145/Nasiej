import Link from "next/link";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-background-dark  py-6 mt-auto">
            <div className="container mx-auto px-4 flex flex-col justify-between items-center gap-3">



                {/* Logo / Name */}
                <div className="text-text text-2xl font-semibold tracking-wide">
                    Nasieچ<span className="text-plus">.</span>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-6 text-xl">
                    <Link href="https://www.facebook.com/profile.php?id=61583537445754&mibextid=wwXIfr&rdid=2EwFSxXYvK6uArcr&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1EttH6ZEUe%2F%3Fmibextid%3DwwXIfr#" target="_blank" className="hover:text-plus transition-colors text-text" aria-label="Facebook">
                        <FaFacebook />
                    </Link>
                    <Link href="https://www.instagram.com/nasiej_eg/" target="_blank" className="hover:text-plus transition-colors text-text" aria-label="Instagram">
                        <FaInstagram />
                    </Link>
                    {/* <Link href="https://www.tiktok.com/" target="_blank" className="hover:text-plus transition-colors text-text" aria-label="TikTok">
                        <FaTiktok />
                    </Link> */}
                    <Link
                        href="https://wa.me/201034569996"
                        target="_blank"
                        className="hover:text-plus transition-colors text-text"
                        aria-label="WhatsApp"
                    >
                        <FaWhatsapp />
                    </Link>

                </div>

                {/* Contact Info */}
                <div className="text-center text-sm text-text">
                    If you have any questions or issues, please contact us on WhatsApp.

                </div>

                {/* Copyright */}
                <div className="text-xs text-text text-center md:text-right">
                    © {new Date().getFullYear()} Nasieچ. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
