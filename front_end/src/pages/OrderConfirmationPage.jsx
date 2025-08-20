import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Download,
  CheckCircle,
  ArrowLeft,
  Home,
  FileText,
  Printer,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Section from "../components/Section";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const [orderCleared, setOrderCleared] = useState(false);

  const orderData = location.state?.orderData;
  const orderId = location.state?.orderId;

  // Handle different data structures (backend response vs frontend orderData)
  const customerInfo = {
    first_name:
      orderData?.customer_info?.first_name ||
      orderData?.billing_address?.first_name ||
      orderData?.user?.first_name ||
      "Customer",
    last_name:
      orderData?.customer_info?.last_name ||
      orderData?.billing_address?.last_name ||
      orderData?.user?.last_name ||
      "",
    email:
      orderData?.customer_info?.email ||
      orderData?.billing_address?.email ||
      orderData?.user?.email ||
      "",
    phone:
      orderData?.customer_info?.phone ||
      orderData?.billing_address?.phone ||
      orderData?.user?.phone ||
      "",
  };

  const billingAddress = orderData?.billing_address || {};
  const shippingAddress =
    orderData?.shipping_address || orderData?.billing_address || {};
  const items = orderData?.items || [];
  const subtotal = orderData?.subtotal || 0;
  const shippingCost = orderData?.shipping_cost || 0;
  const tax = orderData?.tax_amount || orderData?.tax || 0;
  const total = orderData?.total_amount || orderData?.total || 0;
  const paymentMethod = orderData?.payment_method || "cod";
  const orderNotes = orderData?.order_notes || "";
  const paymentDetails = orderData?.payment_details || {};

  useEffect(() => {
    // If no order data, redirect to home
    if (!orderData || !orderId) {
      navigate("/");
      return;
    }

    // Clear the cart after successful order
    if (!orderCleared) {
      clearCart();
      setOrderCleared(true);
    }
  }, [orderData, orderId, navigate, clearCart, orderCleared]);

  if (!orderData || !orderId) {
    return null;
  }

  const formatPrice = (price, currency = "TZS") => {
    return new Intl.NumberFormat("sw-TZ", {
      style: "currency",
      currency: currency === "TZS" ? "TZS" : "USD",
    }).format(price);
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "mpesa":
        return "M-Pesa Mobile Payment";
      case "bank":
        return "Bank Transfer";
      case "cod":
        return "Cash on Delivery";
      default:
        return method;
    }
  };

  const handlePrintOrder = () => {
    const printContent = document.getElementById("order-receipt");
    if (printContent) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Order Receipt - ${orderId}</title>
            <style>
              body { 
                font-family: 'Arial', sans-serif; 
                margin: 40px; 
                color: #333; 
                line-height: 1.6;
                background: white;
              }
              .header { 
                text-align: center; 
                margin-bottom: 40px; 
                border-bottom: 3px solid #2563eb; 
                padding-bottom: 20px; 
              }
              .company-name { 
                font-size: 28px; 
                font-weight: bold; 
                color: #2563eb; 
                margin-bottom: 5px; 
              }
              .company-tagline { 
                font-size: 14px; 
                color: #666; 
                margin-bottom: 20px; 
              }
              .order-title { 
                font-size: 24px; 
                font-weight: bold; 
                margin-bottom: 10px; 
              }
              .order-id { 
                font-size: 16px; 
                color: #666; 
                background: #f8f9fa; 
                padding: 8px 16px; 
                border-radius: 4px; 
                display: inline-block; 
              }
              .section { 
                margin-bottom: 30px; 
                background: #f8f9fa; 
                padding: 20px; 
                border-radius: 8px; 
              }
              .section h3 { 
                color: #2563eb; 
                border-bottom: 2px solid #e5e7eb; 
                padding-bottom: 8px; 
                margin-bottom: 15px; 
                font-size: 18px; 
              }
              .info-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 20px; 
                margin-bottom: 20px; 
              }
              .info-item { 
                background: white; 
                padding: 15px; 
                border-radius: 6px; 
                border-left: 4px solid #2563eb; 
              }
              .info-label { 
                font-weight: bold; 
                color: #374151; 
                margin-bottom: 5px; 
              }
              .info-value { 
                color: #6b7280; 
              }
              .items-table { 
                width: 100%; 
                border-collapse: collapse; 
                background: white; 
                border-radius: 8px; 
                overflow: hidden; 
              }
              .items-table th { 
                background: #2563eb; 
                color: white; 
                padding: 12px; 
                text-align: left; 
                font-weight: bold; 
              }
              .items-table td { 
                padding: 12px; 
                border-bottom: 1px solid #e5e7eb; 
              }
              .items-table tr:last-child td { 
                border-bottom: none; 
              }
              .totals-section { 
                background: white; 
                padding: 20px; 
                border-radius: 8px; 
                border: 2px solid #2563eb; 
              }
              .total-row { 
                display: flex; 
                justify-content: space-between; 
                padding: 8px 0; 
                border-bottom: 1px solid #e5e7eb; 
              }
              .total-row:last-child { 
                font-weight: bold; 
                font-size: 18px; 
                border-top: 2px solid #2563eb; 
                border-bottom: none; 
                padding-top: 15px; 
                color: #2563eb; 
              }
              .contact { 
                text-align: center; 
                margin-top: 40px; 
                padding-top: 20px; 
                border-top: 2px solid #e5e7eb; 
                font-size: 12px; 
                color: #666; 
              }
              .footer-note { 
                background: #f3f4f6; 
                padding: 15px; 
                border-radius: 6px; 
                margin-top: 20px; 
                font-size: 12px; 
                color: #374151; 
              }
              @media print {
                body { margin: 20px; }
                .section { break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownloadPDF = () => {
    handlePrintOrder();
  };

  return (
    <>
      <Header />
      <Section className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden min-h-screen bg-n-8">
        <div className="container mx-auto px-4 py-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-color-1/20 mb-4">
              <CheckCircle className="h-8 w-8 text-color-1" />
            </div>
            <h1 className="text-3xl font-bold text-n-1 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-n-3">
              Thank you for your order. We will send you a confirmation email
              shortly.
            </p>
            <p className="text-sm text-n-4 mt-2">
              Order ID:{" "}
              <span className="font-mono text-color-1">{orderId}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-color-1 hover:bg-color-1/90 text-n-8 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </button>
            <button
              onClick={handlePrintOrder}
              className="flex items-center gap-2 bg-n-6 hover:bg-n-5 text-n-1 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Printer className="h-4 w-4" />
              Print Order
            </button>
            <button
              onClick={() => navigate("/viormart")}
              className="flex items-center gap-2 bg-n-7 hover:bg-n-6 text-n-1 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-n-7 hover:bg-n-6 text-n-1 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </button>
          </div>

          {/* Order Receipt - Hidden for Print */}
          <div id="order-receipt" style={{ display: "none" }}>
            <div className="header">
              <div className="company-name">PRITECH VIOR</div>
              <div className="company-tagline">
                IT Innovation & Solutions Tanzania
              </div>
              <div className="order-title">Order Confirmation</div>
              <div className="order-id">Order ID: {orderId}</div>
              <div
                style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}
              >
                Date: {new Date().toLocaleDateString("en-GB")}
              </div>
            </div>

            <div className="section">
              <h3>Order Items</h3>
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product_name || item.product?.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.price || item.product?.price)}</td>
                      <td>
                        {formatPrice(
                          parseFloat(item.price || item.product?.price) *
                            item.quantity
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="section">
              <h3>Order Summary</h3>
              <div className="totals-section">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping:</span>
                  <span>
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="total-row">
                  <span>Tax (18% VAT):</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="total-row">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="info-grid">
              <div className="section">
                <h3>Customer Information</h3>
                <div className="info-item">
                  <div className="info-label">Name:</div>
                  <div className="info-value">
                    {customerInfo.first_name} {customerInfo.last_name}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Email:</div>
                  <div className="info-value">{customerInfo.email}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Phone:</div>
                  <div className="info-value">{customerInfo.phone}</div>
                </div>
              </div>

              <div className="section">
                <h3>Payment Information</h3>
                <div className="info-item">
                  <div className="info-label">Payment Method:</div>
                  <div className="info-value">
                    {getPaymentMethodText(paymentMethod)}
                  </div>
                </div>
                {paymentDetails.mpesa_number && (
                  <div className="info-item">
                    <div className="info-label">M-Pesa Number:</div>
                    <div className="info-value">
                      {paymentDetails.mpesa_number}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="info-grid">
              <div className="section">
                <h3>Billing Address</h3>
                <div className="info-item">
                  <div className="info-value">
                    {billingAddress.address}
                    <br />
                    {billingAddress.city}, {billingAddress.region}
                    <br />
                    {billingAddress.country}
                    <br />
                    {billingAddress.postal_code &&
                      `Postal Code: ${billingAddress.postal_code}`}
                  </div>
                </div>
              </div>

              <div className="section">
                <h3>Shipping Address</h3>
                <div className="info-item">
                  <div className="info-value">
                    {shippingAddress.address}
                    <br />
                    {shippingAddress.city}, {shippingAddress.region}
                    <br />
                    {shippingAddress.country}
                    <br />
                    {shippingAddress.postal_code &&
                      `Postal Code: ${shippingAddress.postal_code}`}
                  </div>
                </div>
              </div>
            </div>

            {orderNotes && (
              <div className="section">
                <h3>Order Notes</h3>
                <div className="info-item">
                  <div className="info-value">{orderNotes}</div>
                </div>
              </div>
            )}

            <div className="contact">
              <div>
                <strong>PRITECH VIOR</strong> - IT Innovation & Solutions
                Tanzania
              </div>
              <div>
                Email: support@pritechvior.com | Phone: +255 123 456 789
              </div>
              <div className="footer-note">
                Thank you for choosing PRITECH VIOR. We appreciate your business
                and look forward to serving you again.
              </div>
            </div>
          </div>

          {/* Main Order Display */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-n-7 rounded-2xl border border-n-6 p-8 mb-8">
              {/* Order Summary */}
              <div className="border-b border-n-6 pb-6 mb-6">
                <h2 className="text-2xl font-bold text-n-1 mb-4">
                  Order Details
                </h2>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start bg-n-6 p-4 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-n-1 mb-1">
                          {item.product_name || item.product?.name}
                        </h3>
                        <p className="text-sm text-n-3">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-n-3">
                          Unit Price:{" "}
                          {formatPrice(item.price || item.product?.price)}
                        </p>
                      </div>
                      <span className="font-semibold text-n-1">
                        {formatPrice(
                          parseFloat(item.price || item.product?.price) *
                            item.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-6 bg-n-6 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between text-n-3">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-n-3">
                      <span>Shipping</span>
                      <span>
                        {shippingCost === 0
                          ? "Free"
                          : formatPrice(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-n-3">
                      <span>Tax (18% VAT)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t border-n-5 pt-2 flex justify-between text-lg font-bold text-color-1">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer & Address Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-n-6 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-n-1 mb-3">
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-n-3">
                    <p>
                      <span className="text-n-2">Name:</span>{" "}
                      {customerInfo.first_name} {customerInfo.last_name}
                    </p>
                    <p>
                      <span className="text-n-2">Email:</span>{" "}
                      {customerInfo.email}
                    </p>
                    <p>
                      <span className="text-n-2">Phone:</span>{" "}
                      {customerInfo.phone}
                    </p>
                  </div>
                </div>

                <div className="bg-n-6 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-n-1 mb-3">
                    Payment Information
                  </h3>
                  <div className="space-y-2 text-n-3">
                    <p>
                      <span className="text-n-2">Method:</span>{" "}
                      {getPaymentMethodText(paymentMethod)}
                    </p>
                    {paymentDetails.mpesa_number && (
                      <p>
                        <span className="text-n-2">M-Pesa Number:</span>{" "}
                        {paymentDetails.mpesa_number}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-n-6 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-n-1 mb-3">
                    Billing Address
                  </h3>
                  <div className="text-n-3">
                    <p>{billingAddress.address}</p>
                    <p>
                      {billingAddress.city}, {billingAddress.region}
                    </p>
                    <p>{billingAddress.country}</p>
                    {billingAddress.postal_code && (
                      <p>Postal Code: {billingAddress.postal_code}</p>
                    )}
                  </div>
                </div>

                <div className="bg-n-6 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-n-1 mb-3">
                    Shipping Address
                  </h3>
                  <div className="text-n-3">
                    <p>{shippingAddress.address}</p>
                    <p>
                      {shippingAddress.city}, {shippingAddress.region}
                    </p>
                    <p>{shippingAddress.country}</p>
                    {shippingAddress.postal_code && (
                      <p>Postal Code: {shippingAddress.postal_code}</p>
                    )}
                  </div>
                </div>
              </div>

              {orderNotes && (
                <div className="mt-6 bg-n-6 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-n-1 mb-3">
                    Order Notes
                  </h3>
                  <p className="text-n-3">{orderNotes}</p>
                </div>
              )}
            </div>

            {/* What's Next Section */}
            <div className="bg-n-7 rounded-2xl border border-n-6 p-8">
              <h2 className="text-2xl font-bold text-n-1 mb-6">
                What happens next?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-color-1/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-color-1" />
                  </div>
                  <h3 className="text-lg font-semibold text-n-1 mb-2">
                    Order Processing
                  </h3>
                  <p className="text-n-3 text-sm">
                    We will review and process your order within 1-2 business
                    days.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-color-1/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-color-1">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-n-1 mb-2">
                    Preparation & Shipping
                  </h3>
                  <p className="text-n-3 text-sm">
                    Your order will be prepared and shipped within 3-5 business
                    days.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-color-1/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-color-1">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-n-1 mb-2">
                    Delivery
                  </h3>
                  <p className="text-n-3 text-sm">
                    You will receive your order at the provided shipping
                    address.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="mt-8 text-center bg-n-7 rounded-2xl border border-n-6 p-6">
              <h3 className="text-lg font-semibold text-n-1 mb-2">
                Need Help?
              </h3>
              <p className="text-n-3 mb-4">
                If you have any questions about your order, please do not
                hesitate to contact us.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-n-3">
                <span>Email: support@pritechvior.com</span>
                <span>Phone: +255 123 456 789</span>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Footer />
    </>
  );
};

export default OrderConfirmationPage;
