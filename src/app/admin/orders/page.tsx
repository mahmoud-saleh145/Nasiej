import OrdersClient from "@/components/adminComponents/orderFilters/orderFilters";

export default async function AdminOrdersPage() {

  return (
    <div className="container mx-auto my-4 text-text">
      <OrdersClient />
    </div>
  );
}
