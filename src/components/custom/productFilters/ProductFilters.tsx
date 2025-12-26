

"use client";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { Fragment, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<Category["categories"]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [sort, setSort] = useState<string>("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch(`/api/product/getAllCategories`, {
                    cache: "no-store",
                });
                const data: APIResponse<Category> = await res.json();
                if (data.msg === "success") {
                    setCategories(data.categories || []);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        }
        fetchCategories();
    }, []);

    // 🧭 Update URL Filters
    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const sortOptions = [
        { value: "", label: "Default" },
        { value: "price_asc", label: "Price: Low → High" },
        { value: "price_desc", label: "Price: High → Low" },
    ];

    const clearFilter = (key: "minPrice" | "maxPrice") => {
        if (key === "minPrice") setMinPrice("");
        else setMaxPrice("");
        updateFilter(key, "");
    };

    const handleReset = () => {
        setSelectedCategory("");
        setSort("");
        setMinPrice("");
        setMaxPrice("");

        router.push("?", { scroll: false });
    };

    const filterContent = () => (
        <div className="flex flex-col gap-6 p-4 w-full">

            {/* 🔸 Category Filter */}
            <div>
                <label className="block text-sm font-semibold mb-2 text-text">
                    Category
                </label>
                <Listbox
                    value={selectedCategory}
                    onChange={(val) => {
                        setSelectedCategory(val);
                        updateFilter("category", val);
                    }}
                >
                    <div className="relative">
                        <ListboxButton className="w-full text-text border rounded-lg px-3 py-2 text-sm
                             flex justify-between items-center bg-background-light shadow-sm
                             outline-none focus:outline-none focus:ring-0 focus:border-gray-400">
                            {selectedCategory || "All"}
                            <ChevronDown size={16} />
                        </ListboxButton>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <ListboxOptions modal={false} className="absolute mt-1 w-full bg-background-light border rounded-lg shadow-lg overflow-hidden z-10 max-h-60 overflow-y-auto
                                outline-none focus:outline-none focus:ring-0 focus:border-gray-400">
                                <ListboxOption
                                    value=""
                                    className="px-3 py-2 text-sm text-text cursor-pointer hover:bg-gray-100"
                                >
                                    All
                                </ListboxOption>
                                {categories.map((cat) => (
                                    <ListboxOption
                                        key={cat.category}
                                        value={cat.category}
                                        className={({ active }) =>
                                            `px-3 py-2 text-sm cursor-pointer text-text ${active ? "bg-gray-100" : ""
                                            }`
                                        }
                                    >
                                        {cat.category} ({cat.count})
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Transition>
                    </div>
                </Listbox>
            </div>

            {/* 🔸 Sort Filter */}
            <div>
                <label className="block text-sm font-semibold mb-2 text-text">
                    Sort by
                </label>
                <Listbox
                    value={sort}
                    onChange={(val) => {
                        setSort(val);
                        updateFilter("sort", val);
                    }}
                >
                    <div className="relative">
                        <ListboxButton className="w-full border text-text rounded-lg px-3 py-2 text-sm flex justify-between items-center bg-background-light shadow-sm
                            outline-none focus:outline-none focus:ring-0 focus:border-gray-400">
                            {sortOptions.find((s) => s.value === sort)?.label || "Default"}
                            <ChevronDown size={16} />
                        </ListboxButton>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <ListboxOptions modal={false} className="absolute mt-1 w-full bg-background-light border rounded-lg shadow-lg z-10 overflow-hidden
                                outline-none focus:outline-none focus:ring-0 focus:border-gray-400">
                                {sortOptions.map((opt) => (
                                    <ListboxOption
                                        key={opt.value}
                                        value={opt.value}
                                        className={({ active }) =>
                                            `px-3 py-2 text-sm cursor-pointer text-text ${active ? "bg-gray-100" : ""
                                            }`
                                        }
                                    >
                                        {opt.label}
                                    </ListboxOption>
                                ))}
                            </ListboxOptions>
                        </Transition>
                    </div>
                </Listbox>
            </div>

            {/* 🔸 Price Range */}
            <div>
                <label className="block text-sm font-semibold mb-2 text-text">
                    Price Range
                </label>

                <div className="flex items-center gap-2">
                    {/* 🔹 From Input */}
                    <div className="relative w-1/2">
                        <input
                            type="number"
                            placeholder="From"
                            value={minPrice}
                            onChange={(e) => {
                                const val = e.target.value;
                                setMinPrice(val);
                                updateFilter("minPrice", val);
                            }}
                            className="w-full bg-background-light border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400
              [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        {minPrice && (
                            <button
                                aria-label="Clear minimum price"
                                type="button"
                                onClick={() => clearFilter("minPrice")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* 🔹 To Input */}
                    <div className="relative w-1/2">
                        <input
                            type="number"
                            placeholder="To"
                            value={maxPrice}
                            onChange={(e) => {
                                const val = e.target.value;
                                setMaxPrice(val);
                                updateFilter("maxPrice", val);
                            }}
                            className="w-full border bg-background-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400
              [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        {maxPrice && (
                            <button
                                aria-label="Clear maximum price"
                                type="button"
                                onClick={() => clearFilter("maxPrice")}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-right mb-0  text-lg fw-semibold hover:text-text-secondary hover:underline cursor-pointer"
                onClick={handleReset}

            >reset</p>
        </div>
    );

    useEffect(() => {

        const categoryParam = searchParams.get("category") || "";
        const sortParam = searchParams.get("sort") || "";
        const minPriceParam = searchParams.get("minPrice") || "";
        const maxPriceParam = searchParams.get("maxPrice") || "";

        setSelectedCategory(categoryParam);
        setSort(sortParam);
        setMinPrice(minPriceParam);
        setMaxPrice(maxPriceParam);
    }, [searchParams]);


    return (
        <aside className="border rounded-2xl  bg-background-light shadow-sm w-full ">
            {/* 🔹 Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full lg:hidden text-base font-medium p-3"
            >
                <span className="flex items-center gap-2">
                    <SlidersHorizontal size={18} /> Filters
                </span>
                <span className="text-sm text-gray-500">{isOpen ? "Close" : "Open"}</span>
            </button>


            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="lg:hidden"
                    >
                        {filterContent()}
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="hidden lg:block">
                {filterContent()}

            </div>
        </aside>
    );
}
