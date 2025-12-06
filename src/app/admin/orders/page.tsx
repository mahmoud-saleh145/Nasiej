import OrdersClient from "@/components/adminComponents/orderFilters/orderFilters";
// import { messaging } from "@/firebase/firebase";
// import { getToken, onMessage } from "firebase/messaging";


export default async function AdminOrdersPage() {
  //  async function requestNotificationPermission() {
  //   const permission = await Notification.requestPermission();
  //   if (permission === "granted") {
  //     const token = await getToken(messaging, {
  //       vapidKey: "YOUR_VAPID_PUBLIC_KEY"
  //     });
  //     console.log("TOKEN:", token);

  //     await fetch("/api/save-fcm-token", {
  //       method: "POST",
  //       body: JSON.stringify({ token }),
  //     });
  //   }
  // }
  // const data =await AdminOrdersPage()
  return (
    <div className="container mx-auto my-4 text-text">
      <OrdersClient />
    </div>
  );
}
