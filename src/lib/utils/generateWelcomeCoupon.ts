export function generateWelcomeCoupon() {
  return "WELCOME10-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const generateWelcomeCouponEmail = ({
  couponCode,
  discountValue,
  expiresAt,
}: {
  couponCode: string;
  discountValue: number;
  expiresAt: Date;
}) => {

  const expiryDate = expiresAt.toLocaleDateString("en-GB");

  return `
  <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    
    <!-- Header -->
    <div style="background:#fafafa;padding:20px;text-align:center;">
      <h2 style="margin:0;color:#333;">🎉 Welcome to Nasieچ</h2>
      <p style="margin:5px 0;color:#777;">
        We’re happy to have you! Enjoy a special discount on your first order.
      </p>
    </div>

    <!-- Coupon Section -->
    <div style="padding:25px;text-align:center;">
      <h3 style="margin-top:0;color:#333;">Your Welcome Gift 🎁</h3>

      <div style="
        margin:20px auto;
        padding:20px;
        max-width:320px;
        border:2px dashed #E91E63;
        border-radius:8px;
        background:#fff5f8;
      ">
        <p style="margin:0;font-size:14px;color:#777;">Use this code at checkout</p>
        <h1 style="margin:10px 0;color:#E91E63;letter-spacing:2px;">
          ${couponCode}
        </h1>
        <p style="margin:0;font-size:14px;color:#555;">
          Get <strong>${discountValue}% OFF</strong> on your order
        </p>
      </div>

      <p style="margin-top:15px;font-size:13px;color:#777;">
        Valid until <strong>${expiryDate}</strong>
      </p>
    </div>

    <!-- Info -->
    <div style="padding:20px;background:#fafafa;">
      <ul style="margin:0;padding-left:18px;color:#555;font-size:14px;">
        <li>Valid for one-time use only</li>
        <li>Applicable on all products</li>
        <li>Cannot be combined with other offers</li>
      </ul>
    </div>
  
    <!-- Footer -->
    <div style="padding:20px;text-align:center;font-size:13px;color:#888;">
      If you have any questions, contact us at <strong>01034569996</strong><br/>
      We can’t wait to see what you choose 💖
      <a href="https://nasiej.com"
   style="display:inline-block;margin-top:20px;padding:12px 25px;
   background:#E91E63;color:#fff;text-decoration:none;border-radius:5px;">
   Shop Now
</a>

    </div>


  </div>
  `;
};
