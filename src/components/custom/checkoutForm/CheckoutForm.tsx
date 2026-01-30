"use client";
import { useEffect, useState } from "react";
import * as yup from 'yup';
import { useFormik } from "formik";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDown } from "lucide-react";
import { useCart, useEmptyCart, useRemoveProduct } from "@/hooks/useCart";
import LoadingPage from "@/components/common/LoadingPage";
import { JSON_HEADER } from "@/lib/constants/api.constants";
import { useRouter } from 'next/navigation';
import LoginPopup from "../auth/LoginPopup";
import { FaRegTrashCan } from "react-icons/fa6";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import Invoice from "../invoice/Invoice";


const shippingRates = {
    Cairo: 100,
    Giza: 100,
    Alexandria: 100,
    Dakahlia: 100,
    Sharqia: 100,
    Gharbia: 100,
    Qalyubia: 100,
    Ismailia: 100,
    Suez: 100,
    "Port Said": 100,
    "North Sinai": 150,
    "South Sinai": 150,
    Minya: 100,
    Asyut: 100,
    Beheira: 100,
    Fayoum: 100,
    "Beni Suef": 100,
    Sohag: 100,
    Qena: 150,
    Luxor: 150,
    Aswan: 150,
    "Red Sea": 150,
    Matrouh: 100,
    "New Valley": 150,
};

export default function CheckoutForm() {
    const loggedIn = useAuth((state) => state.loggedIn);
    const router = useRouter();
    const governorates = Object.keys(shippingRates) as (keyof typeof shippingRates)[];
    const [shippingCost, setShippingCost] = useState(0);
    const [showItems, setShowItems] = useState(false);
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [orderDone, setOrderDone] = useState(false);
    const [order, setOrder] = useState<CompleteOrder>();
    const [open, setOpen] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);

    const { data: cart, isLoading, isError } = useCart();
    const emptyCart = useEmptyCart();
    const removeProduct = useRemoveProduct();


    // useEffect(() => {
    //     if (!orderDone && cart && cart.totalQuantity === 0) {
    //         router.push('/', { scroll: false });
    //     }
    // }, [cart, orderDone, router]);




    const validationSchema = yup.object({
        email: yup.string().email().required().matches(/^[A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]+\.(com)$/),
        firstName: yup.string().required().min(3).max(20),
        lastName: yup.string().required().min(3).max(20),
        address: yup.string().required().min(5).max(100),
        city: yup.string().required().min(3).max(50),
        governorate: yup.string().required().oneOf(Object.keys(shippingRates)),
        phone: yup.string().required().matches(/^(010|011|012|015)[0-9]{8}$/),
    });

    const applyCoupon = async () => {
        if (!couponCode) return;

        try {
            setCouponLoading(true);
            setCouponError("");

            const res = await fetch("/api/coupon/validate", {
                method: "POST",
                headers: JSON_HEADER,
                body: JSON.stringify({
                    couponCode,
                    email: formik.values.email,
                    subtotal: cart?.subtotal,
                }),
            });

            const data = await res.json();
            console.log(data)
            if (data.msg !== "success") {
                setDiscount(0);
                setCouponError("Invalid or expired coupon");
                return;
            }

            setDiscount(data.discount);
        } catch {
            setCouponError("Something went wrong");
        } finally {
            setCouponLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            governorate: "" as keyof typeof shippingRates | "",
            phone: "",
        },
        validationSchema,

        onSubmit: async function (values) {
            setLoading(true);
            const res = await fetch(`/api/order/createOrder`, {
                method: "POST",
                headers: { ...JSON_HEADER },
                credentials: "include",
                body: JSON.stringify({
                    ...values,
                    couponCode,
                }),
            })
            const data: APIResponse<OrderResponse> = await res.json();
            if (data.msg == 'error') {
                setErr(data.err);
            } else if (data.msg === "success") {
                emptyCart.mutate();
                setErr("");
                setOrder(data);
                setOrderDone(true);

                if (typeof window !== "undefined" && window.fbq) {
                    window.fbq?.("track", "Purchase", {
                        value: (cart?.subtotal ?? 0 + shippingCost - discount).toString(),
                        currency: "EGP",
                    });
                }
            }
            setLoading(false);
        }
    });

    useEffect(() => {
        if (formik.values.governorate) {
            setShippingCost(shippingRates[formik.values.governorate]);
        }
    }, [formik.values.governorate]);

    useEffect(() => {
        if (!loggedIn) return
        const getUser = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/user/getUserInfo`, { cache: "no-store" });
                const data: APIResponse<LoginResponse> = await res.json();

                if (data.msg === "success" && data.user) {

                    formik.setValues({
                        email: data.user.email || "",
                        firstName: data.user.firstName || "",
                        lastName: data.user.lastName || "",
                        address: data.user.address || "",
                        city: data.user.city || "",
                        governorate: data.user.governorate as keyof typeof shippingRates,
                        phone: data.user.phone || "",
                    });
                    if (typeof window !== "undefined" && window.fbq) {
                        window.fbq?.("track", "CompleteRegistration")
                    }
                }
                setLoading(false)
            } catch (err) {
                console.error(err);

            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [loggedIn]);

    useEffect(() => {
        formik.setTouched({});
    }, [cart]);


    if (isLoading) return <LoadingPage />;
    if (isError) return <p>Something went wrong fetching your cart.</p>;

    return (
        <div>
            {!orderDone && !loading ?
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <div className="flex justify-between items-center mb-4 ">
                            <h2 className="text-xl font-semibold  text-text">Shipping information</h2>
                            {loggedIn ? "" :

                                <p
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setOpen(true);
                                    }}
                                    className=" text-text m-0 fw-bold cursor-pointer hover:text-secondary "
                                >
                                    Login
                                </p>
                            }
                            <LoginPopup open={open} onClose={() => setOpen(false)} />
                        </div>
                        <form onSubmit={formik.handleSubmit} id="checkoutForm">
                            <div className="space-y-8 ">

                                <div className="position-relative ">
                                    <input autoComplete="on"
                                        onChange={formik.handleChange}
                                        value={formik.values.email}
                                        onFocus={() => formik.setFieldTouched("email", false)}
                                        onBlur={formik.handleBlur} type="email" name='email' className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-400  ${formik.touched.email && formik.values.email == '' ? "border-danger" : ""}`} placeholder='Email' ></input>
                                    {formik.errors.email && formik.touched.email && (<div className="alert alert-danger   py-0 position-absolute ">{formik.errors.email}</div>)}
                                </div>
                                <div className="grid grid-cols-2 gap-3">

                                    <div className="position-relative ">
                                        <input autoComplete="on"
                                            onChange={formik.handleChange}
                                            value={formik.values.firstName}
                                            onFocus={() => formik.setFieldTouched("firstName", false)}
                                            onBlur={formik.handleBlur} type="text" name='firstName' className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-400  ${formik.touched.firstName && formik.values.firstName == '' ? "border-danger" : ""}`} placeholder='firstName' ></input>
                                        {formik.errors.firstName && formik.touched.firstName && (<div className="alert alert-danger   py-0 position-absolute ">{formik.errors.firstName}</div>)}
                                    </div>

                                    <div className="position-relative ">
                                        <input autoComplete="on"
                                            onChange={formik.handleChange}
                                            value={formik.values.lastName}
                                            onFocus={() => formik.setFieldTouched("lastName", false)}
                                            onBlur={formik.handleBlur} type="text" name='lastName' className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-400  ${formik.touched.lastName && formik.values.lastName == '' ? "border-danger" : ""}`} placeholder='lastName' ></input>
                                        {formik.errors.lastName && formik.touched.lastName && (<div className="alert alert-danger   py-0 position-absolute ">{formik.errors.lastName}</div>)}
                                    </div>
                                </div>
                                <div className="position-relative ">
                                    <input autoComplete="on"
                                        onChange={formik.handleChange}
                                        value={formik.values.address}
                                        onFocus={() => formik.setFieldTouched("address", false)}
                                        onBlur={formik.handleBlur} type="text" name='address' className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-400  ${formik.touched.address && formik.values.address == '' ? "border-danger" : ""}`} placeholder='address' ></input>
                                    {formik.errors.address && formik.touched.address && (<div className="alert alert-danger   py-0 position-absolute ">{formik.errors.address}</div>)}
                                </div>
                                <div className="position-relative ">
                                    <input autoComplete="on"
                                        onChange={formik.handleChange}
                                        value={formik.values.phone}
                                        onFocus={() => formik.setFieldTouched("phone", false)}
                                        onBlur={formik.handleBlur} type="text" name='phone' className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-400  ${formik.touched.phone && formik.values.phone == '' ? "border-danger" : ""}`} placeholder='phone' ></input>
                                    {formik.errors.phone && formik.touched.phone && (<div className="alert alert-danger   py-0 position-absolute ">{formik.errors.phone}</div>)}
                                </div>
                                <div className="position-relative ">
                                    <input autoComplete="on"
                                        onChange={formik.handleChange}
                                        value={formik.values.city}
                                        onFocus={() => formik.setFieldTouched("city", false)}
                                        onBlur={formik.handleBlur} type="text" name='city' className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-gray-400  ${formik.touched.city && formik.values.city == '' ? "border-danger" : ""}`} placeholder='city' ></input>
                                    {formik.errors.city && formik.touched.city && (<div className="alert alert-danger   py-0 position-absolute ">{formik.errors.city}</div>)}
                                </div>
                                <div className="position-relative ">
                                    <Listbox
                                        value={formik.values.governorate}
                                        onChange={(val) => formik.setFieldValue("governorate", val)}
                                    >
                                        <div className="relative">
                                            {/* --------- Button ---------- */}
                                            <ListboxButton className="w-full border rounded-lg px-3 py-2 text-sm flex justify-between items-center bg-white 
                                outline-none focus:outline-none focus:ring-0 focus:border-gray-400">
                                                {formik.values.governorate || "Choose governorate"}
                                                <ChevronDown size={16} />
                                            </ListboxButton>

                                            {/* --------- Dropdown ---------- */}
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <ListboxOptions modal={false} className="absolute mt-1 w-full z-10 outline-none focus:outline-none focus:ring-0 focus:border-gray-400  bg-white rounded-lg shadow-lg  max-h-60 overflow-y-auto">



                                                    {/* Governorates Loop */}
                                                    {governorates.map((gov) => (
                                                        <ListboxOption
                                                            key={gov}
                                                            value={gov}
                                                            className={({ active }) =>
                                                                `px-3 py-2 text-sm cursor-pointer ${active ? "bg-gray-100 " : ""
                                                                }`
                                                            }
                                                        >
                                                            {gov}
                                                        </ListboxOption>
                                                    ))}
                                                </ListboxOptions>
                                            </Transition>
                                        </div>
                                    </Listbox>
                                    {formik.errors.governorate && formik.touched.governorate && (<div className="alert alert-danger   py-0 position-absolute ">{formik.errors.governorate}</div>)}
                                </div>

                                <div className="p-3 border rounded-xl flex items-center justify-between cursor-default">
                                    <span className="text-sm font-medium">Cash on Delivery</span>

                                    {/* Radio styled circle */}
                                    <span
                                        className="w-5 h-5 rounded-full border border-black flex items-center justify-center"
                                    >
                                        <span className="w-3 h-3 bg-black rounded-full"></span>
                                    </span>
                                </div>

                            </div>
                        </form>
                    </div>


                    <div className="">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit mb-6">

                            {/* ----- Title + Show/Hide Button ----- */}
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-text">Order summary</h2>

                                <button
                                    aria-label="Show or hide order items"
                                    type="button"
                                    onClick={() => setShowItems(!showItems)}
                                    className="text-gray-600 text-sm underline"
                                >
                                    {showItems ? "Hide" : "Show"}
                                </button>
                            </div>

                            {/* ----- Items list with animation ----- */}
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${showItems ? "max-h-[1000px] opacity-100 mb-4" : "max-h-0 opacity-0 mb-0"}`}>
                                <div className="space-y-4 pb-4 border-b">
                                    {cart?.cart.items.map((item: CartItem, index: number) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="relative p-2 w-20 h-20">
                                                <Image
                                                    src={
                                                        item.productId.variants.find(v => v.color === item.color)?.images?.[0]?.url
                                                        || item.productId.variants[0]?.images?.[0]?.url
                                                    }
                                                    fill
                                                    alt={item.productId.name}
                                                    className="object-cover rounded-lg select-none"
                                                    sizes="100vw"
                                                />
                                                <h6 className="m-0 text-white rounded  absolute top-0 right-0 bg-black p-1 ">{item.quantity}</h6>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-text m-0">
                                                    Name: {item.productId.name}
                                                </p>
                                                <p className="font-medium text-text m-0 text-small">
                                                    Color: {item.color}
                                                </p>

                                            </div>
                                            <div className="flex flex-column align-items-center gap-2">
                                                <span className="fw-bold text-base text-text">

                                                    {item.productId.discount && item.productId.discount > item.productId.raise ?

                                                        <small className="text-text-secondary me-1 "><del>{item.productId.price}</del></small>
                                                        :
                                                        item.productId.discount && item.productId.discount < item.productId.raise ?
                                                            <small className="text-text-secondary me-1 "><del>{item.productId.price + (item.productId.price * item.productId.raise) / 100}</del></small>
                                                            : ''
                                                    }

                                                    {item.productId.finalPrice ?? item.productId.price} LE

                                                </span>
                                                <button aria-label="Remove item" className="text-danger text-lg border-0 bg-transparent ms-auto"
                                                    disabled={removeProduct.isPending}
                                                    onClick={() => removeProduct.mutate({ productId: item.productId._id, color: item.color })}>
                                                    <FaRegTrashCan />
                                                </button>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className="space-y-2 mb-3">
                                <label className="text-sm font-medium">Discount code</label>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Enter coupon"
                                        className="flex-1 border rounded-lg p-2"
                                    />

                                    <button
                                        type="button"
                                        disabled={couponLoading}
                                        onClick={applyCoupon}
                                        className="px-4 rounded-lg bg-buttons hover:bg-buttons-hover text-text"
                                    >
                                        Apply
                                    </button>
                                </div>

                                {couponError && <p className="text-red-500 text-sm">{couponError}</p>}

                                {discount > 0 && (
                                    <p className="text-green-600 text-sm">
                                        🎉 Discount applied: -{discount} LE
                                    </p>
                                )}
                            </div>



                            {/* ----- Subtotal ----- */}
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">
                                    subtotal / <small>{cart?.totalQuantity} items</small>
                                </span>
                                <span className="font-medium">{cart?.subtotal} LE</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between py-2 text-green-600 border-b">
                                    <span>Discount</span>
                                    <span>-{discount} LE</span>
                                </div>
                            )}

                            {/* ----- Shipping ----- */}
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Shipping fee</span>
                                <span className="font-medium">
                                    {shippingCost ? `${shippingCost} LE` : "Choose governorate"}
                                </span>
                            </div>

                            {/* ----- Total ----- */}
                            <div className="flex justify-between py-3 text-lg font-semibold">
                                <span>Total</span>
                                {(cart?.subtotal ?? 0) + shippingCost - discount} LE
                            </div>
                        </div>
                        {err && <div className="alert alert-danger mt-3">{err}</div>}

                        <button
                            form="checkoutForm"
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-lg bg-buttons cursor-pointer text-text rounded-xl font-semibold hover:bg-buttons-hover transition">
                            {loading ? "...loading" : "place order"}
                        </button>
                    </div>
                </div>
                :
                <Invoice order={order!} discount={discount} />
            }
        </div>
    );
}


