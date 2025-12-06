import CheckoutForm from '@/components/custom/checkoutForm/CheckoutForm';
export default async function CheckoutPage() {
    return (
        <div className="container my-4 pb-3 flex justify-center ">
            <div className="w-full max-w-6xl">
                <CheckoutForm />
            </div>
        </div>
    );
}
