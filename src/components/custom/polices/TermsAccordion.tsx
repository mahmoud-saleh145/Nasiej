import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiArrowSortedDown } from "react-icons/ti";
interface AccordionItemProps {
    title: string;
    children: ReactNode;
}
const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="border-b text-text mt-4">
            <div
                className="cursor-pointer fw-bold text-lg flex items-center gap-2 select-none pb-1"
                dir="rtl"
                onClick={() => setOpen(!open)}
            >
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <TiArrowSortedDown size={30} />
                </motion.span>
                {title}
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        layout
                        className="mt-2 text-md text-gray-600 select-none overflow-hidden pb-1 space-y-2"
                        dir="rtl"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function TermsAccordion() {
    return (
        <div>
            <AccordionItem title="سياسة التوصيل">
                <ul className="list-disc list-inside">
                    <li>التوصيل متاح لجميع المحافظات، عادة <strong>بين 7 إلى 14 يوم</strong> عمل حسب المحافظة.</li>
                    <li>للطلبات بقيمة أكثر من 3000 جنيه، يتم دفع ديبوزيت لتأكيد الطلب.</li>
                    <li>متاح المعاينة أثناء وجود المندوب.</li>

                </ul>
            </AccordionItem>
            <AccordionItem title=" الاستبدال والاسترجاع والإلغاء">
                <ul className="list-disc list-inside">
                    <li>متاح الاستبدال أو الاسترجاع خلال 3 أيام من تاريخ الاستلام.</li>
                    <li>يتحمل العميل مصاريف الشحن في حالة الاستبدال أو الاسترجاع.</li>
                    <li>يشترط أن تكون المنتجات بحالتها الأصلية دون استخدام.</li>
                </ul>
            </AccordionItem>

        </div>
    );
}
