'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Image from "next/image";
import img from "../../../../public/logo.png"
import { FaShoppingCart } from "react-icons/fa";
import { useCartQuantity } from '@/hooks/useCart';
import LoginPopup from '../auth/LoginPopup';
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from '@/hooks/useAuth';

export default function Navb() {
    const role = useAuth((state) => state.role);
    const loggedIn = useAuth((state) => state.loggedIn);
    const hasHydrated = useAuth((state) => state._hasHydrated);
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const { data } = useCartQuantity();
    const quantity = data?.totalQuantity ?? 0;
    const lastScrollY = useRef(0);
    const [showNavbar, setShowNavbar] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const current = hasHydrated ? window.scrollY : 120;
            setShowNavbar((current < 100 || current < lastScrollY.current) && hasHydrated);
            lastScrollY.current = current;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasHydrated]);

    const isActive = (path: string) => pathname === path;
    return (
        <>
            {role !== "admin" ?
                <Navbar
                    expand="lg"
                    expanded={expanded}
                    onToggle={(value) => setExpanded(value)}
                    className={`bg-background-dark fixed-top p-2 transition-all duration-300  
                ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
                >
                    <Container>
                        <Link
                            href="/"
                            className="fs-1 text-text p-0 fw-semibold link-underline link-underline-opacity-0 w-fit outline-none focus:outline-none focus:ring-0 "
                            onClick={() => setExpanded(false)}
                        >
                            <Image
                                src={img}
                                alt="Nasieچ Logo"
                                width={160}
                                height={70}
                                className="h-auto outline-none focus:outline-none focus:ring-0"
                                priority
                            />
                        </Link>

                        <div className='flex items-center'>
                            <Link
                                href="/cart"
                                className="d-lg-none me-2 "
                                onClick={() => setExpanded(false)}
                            >
                                <div className="relative">

                                    <small className='absolute -top-2 -right-2 rounded px-1 bg-background-light text-text'>{quantity}</small>
                                    <FaShoppingCart className='text-text text-3xl' />
                                </div>
                            </Link>

                            <Navbar.Toggle
                                aria-controls="basic-navbar-nav mt-2"
                                className="border-0 focus:outline-none shadow-none"
                                onClick={() => setExpanded(expanded ? false : true)}
                            />
                        </div>

                        <Navbar.Collapse id="basic-navbar-nav " className="">
                            <Nav className="ms-auto gap-4 my-3  flex  align-items-lg-center">
                                {[
                                    { href: "/", label: "Home" },
                                    { href: "/wishlist", label: "Wishlist" },
                                    { href: "/brand", label: "Brand" },
                                    { href: "/category", label: "Category" },
                                    { href: "/search", label: "Search" }
                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setExpanded(false)}
                                        className={`fw-semibold link-underline link-underline-opacity-0  text-text position-relative  w-fit
                                    ${isActive(item.href) ? 'text-text-secondary' : 'text-text'}
                                `}
                                    >
                                        {item.label}
                                        {isActive(item.href) && (
                                            <span
                                                className="position-absolute start-0 -bottom-1  animate-underline"
                                                style={{
                                                    width: '100%',
                                                    height: '2px',
                                                    backgroundColor: '#b48b65',
                                                    borderRadius: '1px',
                                                }}
                                            ></span>
                                        )}
                                    </Link>

                                ))}
                                {loggedIn ? (

                                    <Link
                                        onClick={() => setExpanded(false)}
                                        href="/profile"
                                        className=" text-text m-0 fw-bold cursor-pointer flex items-center gap-2"
                                    >
                                        <FaUserCircle className='text-text text-3xl' />
                                    </Link>
                                ) : (

                                    <p
                                        onClick={() => {
                                            setOpen(true)
                                            setExpanded(false)
                                        }}
                                        className=" text-text m-0 fw-bold cursor-pointer hover:text-secondary "
                                    >
                                        {hasHydrated ? "Login" : " "}
                                    </p>
                                )}

                            </Nav>
                        </Navbar.Collapse>

                        <Link
                            href="/cart"
                            className="d-none d-lg-block  mx-4"
                            onClick={() => setExpanded(false)}
                        >
                            <div className="relative">

                                <small className='absolute -top-2 -right-2 rounded px-1 bg-background-light text-text'>{quantity}</small>
                                <FaShoppingCart className='text-text text-3xl' />
                            </div>

                        </Link>
                    </Container>
                </Navbar>
                :
                <Navbar
                    expand="lg"
                    expanded={expanded}
                    onToggle={(value) => setExpanded(value)}
                    className={`bg-background-dark fixed-top p-2 transition-all duration-300  
                ${showNavbar ? "translate-y-0" : "-translate-y-full"}
            `}
                >
                    <Container>
                        <Link
                            href="/"
                            className="fs-1 text-text p-0 fw-semibold link-underline link-underline-opacity-0 w-fit "
                            onClick={() => setExpanded(false)}
                        >
                            <Image
                                src={img}
                                alt="Nasieچ Logo"
                                width={160}
                                height={160}
                                className="h-auto outline-none focus:outline-none focus:ring-0"
                                priority
                            />
                        </Link>

                        <div className='flex items-center'>


                            <Navbar.Toggle
                                aria-controls="basic-navbar-nav mt-2"
                                className="border-0 focus:outline-none shadow-none"
                                onClick={() => setExpanded(expanded ? false : true)}
                            />
                        </div>

                        <Navbar.Collapse id="basic-navbar-nav " className="">
                            <Nav className="ms-auto gap-4 my-3  flex  align-items-lg-center">
                                {[
                                    { href: "/", label: "Home" },
                                    { href: "/brand", label: "Brand" },
                                    { href: "/category", label: "Category" },
                                    { href: "/search", label: "Search" },
                                    { href: "/admin/orders", label: "Orders" },
                                ].map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setExpanded(false)}
                                        className={`fw-semibold link-underline link-underline-opacity-0  text-text position-relative  w-fit
                                    ${isActive(item.href) ? 'text-text-secondary' : 'text-text'}
                                `}
                                    >
                                        {item.label}
                                        {isActive(item.href) && (
                                            <span
                                                className="position-absolute start-0 -bottom-1  animate-underline"
                                                style={{
                                                    width: '100%',
                                                    height: '2px',
                                                    backgroundColor: '#b48b65',
                                                    borderRadius: '1px',
                                                }}
                                            ></span>
                                        )}
                                    </Link>

                                ))}
                                <Link
                                    onClick={() => setExpanded(false)}
                                    href="/profile"
                                    className=" text-text m-0 fw-bold cursor-pointer flex items-center gap-2"
                                >
                                    <FaUserCircle className='text-text text-3xl' />
                                </Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            }

            <LoginPopup open={open} onClose={() => setOpen(false)} />
        </>
    );
}
