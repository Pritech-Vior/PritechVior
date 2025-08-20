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
  const customerInfo = orderData?.customer_info || {
    first_name: orderData?.billing_address?.first_name || "Customer",
    last_name: orderData?.billing_address?.last_name || "",
    email: orderData?.billing_address?.email || "",
    phone: orderData?.billing_address?.phone || "",
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

    // Clear cart only once when component mounts
    if (!orderCleared) {
      clearCart()
        .then(() => {
          setOrderCleared(true);
          console.log("Cart cleared successfully after order confirmation");
        })
        .catch((error) => {
          console.error("Error clearing cart:", error);
        });
    }
  }, [orderData, orderId, navigate, clearCart, orderCleared]);

  const formatPrice = (price) => {
    if (!price) return "TSh 0.00";
    const numPrice = parseFloat(price);
    return `TSh ${numPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "cod":
        return "Cash on Delivery";
      case "mpesa":
        return "M-Pesa";
      case "card":
        return "Credit/Debit Card";
      case "bank_transfer":
        return "Bank Transfer";
      default:
        return "Cash on Delivery";
    }
  };

  const handlePrintOrder = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Receipt - ${orderId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Arial', sans-serif; 
              line-height: 1.4; 
              color: #333; 
              max-width: 210mm; 
              margin: 0 auto; 
              padding: 15mm; 
              font-size: 12px; 
            }
            .invoice-header { 
              text-align: center; 
              margin-bottom: 20px; 
              border-bottom: 3px solid #2563eb; 
              padding-bottom: 15px; 
            }
            .company-name { 
              font-size: 24px; 
              font-weight: bold; 
              color: #2563eb; 
              margin-bottom: 3px; 
            }
            .company-tagline { 
              font-size: 12px; 
              color: #666; 
              margin-bottom: 15px; 
            }
            .invoice-title { 
              font-size: 20px; 
              font-weight: bold; 
              margin-bottom: 8px; 
            }
            .order-meta { 
              font-size: 12px; 
              color: #666; 
              display: flex; 
              justify-content: center; 
              gap: 20px; 
            }
            .order-meta span { 
              background: #f8f9fa; 
              padding: 4px 12px; 
              border-radius: 4px; 
            }
            .invoice-body { 
              display: grid; 
              grid-template-columns: 1fr; 
              gap: 15px; 
            }
            .section { 
              background: #f8f9fa; 
              padding: 12px; 
              border-radius: 6px; 
              border-left: 4px solid #2563eb; 
            }
            .section h3 { 
              color: #2563eb; 
              font-size: 14px; 
              margin-bottom: 8px; 
              border-bottom: 1px solid #e5e7eb; 
              padding-bottom: 4px; 
            }
            .info-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 15px; 
              margin-bottom: 15px; 
            }
            .info-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 3px 0; 
              border-bottom: 1px dotted #ddd; 
            }
            .info-row:last-child { 
              border-bottom: none; 
            }
            .label { 
              font-weight: bold; 
              color: #374151; 
            }
            .value { 
              color: #6b7280; 
              text-align: right; 
            }
            .items-table { 
              width: 100%; 
              border-collapse: collapse; 
              background: white; 
              border-radius: 6px; 
              overflow: hidden; 
              margin-bottom: 15px; 
            }
            .items-table th { 
              background: #2563eb; 
              color: white; 
              padding: 8px; 
              text-align: left; 
              font-weight: bold; 
              font-size: 11px; 
            }
            .items-table td { 
              padding: 8px; 
              border-bottom: 1px solid #e5e7eb; 
              font-size: 11px; 
            }
            .items-table tr:last-child td { 
              border-bottom: none; 
            }
            .totals-section { 
              background: white; 
              padding: 12px; 
              border-radius: 6px; 
              border: 2px solid #2563eb; 
              margin-bottom: 15px; 
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 4px 0; 
              border-bottom: 1px solid #e5e7eb; 
              font-size: 12px; 
            }
            .total-row:last-child { 
              font-weight: bold; 
              font-size: 14px; 
              border-top: 2px solid #2563eb; 
              border-bottom: none; 
              padding-top: 8px; 
              color: #2563eb; 
              margin-top: 5px; 
            }
            .address-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 15px; 
              margin-bottom: 15px; 
            }
            .invoice-footer { 
              text-align: center; 
              margin-top: 20px; 
              padding-top: 15px; 
              border-top: 2px solid #e5e7eb; 
              font-size: 10px; 
              color: #666; 
            }
            .contact-info { 
              margin-bottom: 8px; 
            }
            .thank-you { 
              background: #f3f4f6; 
              padding: 10px; 
              border-radius: 6px; 
              font-size: 11px; 
              color: #374151; 
              font-style: italic; 
            }
            @media print {
              body { 
                margin: 0; 
                padding: 10mm; 
                font-size: 11px; 
              }
              .section { 
                break-inside: avoid; 
                page-break-inside: avoid; 
              }
              .items-table { 
                page-break-inside: avoid; 
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div class="company-name">PRITECH VIOR</div>
            <div class="company-tagline">IT Innovation & Solutions Tanzania</div>
            <div class="invoice-title">Order Confirmation</div>
            <div class="order-meta">
              <span>Order ID: ${orderId}</span>
              <span>Date: ${new Date().toLocaleDateString("en-GB")}</span>
            </div>
          </div>

          <div class="invoice-body">
            <div class="section">
              <h3>Order Items</h3>
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${items
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.product_name || item.product?.name}</td>
                      <td>${item.quantity}</td>
                      <td>${formatPrice(item.price || item.product?.price)}</td>
                      <td>${formatPrice(
                        parseFloat(item.price || item.product?.price) *
                          item.quantity
                      )}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>

              <div class="totals-section">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>${formatPrice(subtotal)}</span>
                </div>
                <div class="total-row">
                  <span>Shipping:</span>
                  <span>${
                    shippingCost === 0 ? "Free" : formatPrice(shippingCost)
                  }</span>
                </div>
                <div class="total-row">
                  <span>Tax (18% VAT):</span>
                  <span>${formatPrice(tax)}</span>
                </div>
                <div class="total-row">
                  <span>Total:</span>
                  <span>${formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div class="info-grid">
              <div class="section">
                <h3>Customer Information</h3>
                <div class="info-row">
                  <span class="label">Name:</span>
                  <span class="value">${customerInfo.first_name} ${
      customerInfo.last_name
    }</span>
                </div>
                <div class="info-row">
                  <span class="label">Email:</span>
                  <span class="value">${customerInfo.email}</span>
                </div>
                <div class="info-row">
                  <span class="label">Phone:</span>
                  <span class="value">${customerInfo.phone}</span>
                </div>
              </div>

              <div class="section">
                <h3>Payment Information</h3>
                <div class="info-row">
                  <span class="label">Payment Method:</span>
                  <span class="value">${getPaymentMethodText(
                    paymentMethod
                  )}</span>
                </div>
                ${
                  paymentDetails.mpesa_number
                    ? `
                <div class="info-row">
                  <span class="label">M-Pesa Number:</span>
                  <span class="value">${paymentDetails.mpesa_number}</span>
                </div>
                `
                    : ""
                }
              </div>
            </div>

            <div class="address-grid">
              <div class="section">
                <h3>Billing Address</h3>
                <div class="info-row">
                  <span class="value">
                    ${billingAddress.street_address || ""}
                  </span>
                </div>
                <div class="info-row">
                  <span class="value">
                    ${billingAddress.city || ""}, ${billingAddress.state || ""}
                  </span>
                </div>
                <div class="info-row">
                  <span class="value">
                    ${billingAddress.country || ""}
                  </span>
                </div>
                <div class="info-row">
                  <span class="label">Postal Code:</span>
                  <span class="value">${billingAddress.postal_code || ""}</span>
                </div>
              </div>

              <div class="section">
                <h3>Shipping Address</h3>
                <div class="info-row">
                  <span class="value">
                    ${shippingAddress.street_address || ""}
                  </span>
                </div>
                <div class="info-row">
                  <span class="value">
                    ${shippingAddress.city || ""}, ${
      shippingAddress.state || ""
    }
                  </span>
                </div>
                <div class="info-row">
                  <span class="value">
                    ${shippingAddress.country || ""}
                  </span>
                </div>
                <div class="info-row">
                  <span class="label">Postal Code:</span>
                  <span class="value">${
                    shippingAddress.postal_code || ""
                  }</span>
                </div>
              </div>
            </div>
          </div>

          <div class="invoice-footer">
            <div class="contact-info">
              <strong>PRITECH VIOR - IT Innovation & Solutions Tanzania</strong><br>
              Email: support@pritechvior.com | Phone: +255 123 456 789
            </div>
            <div class="thank-you">
              Thank you for choosing PRITECH VIOR. We appreciate your business and look forward to serving you again.
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
            <p className="text-n-3 mb-6">
              Thank you for your order. We'll process it shortly and send you
              updates.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={handlePrintOrder}
                className="flex items-center gap-2 bg-color-1 hover:bg-color-1/90 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Printer className="h-5 w-5" />
                Print Receipt
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 bg-n-6 hover:bg-n-5 text-n-1 px-6 py-3 rounded-lg transition-colors"
              >
                <Download className="h-5 w-5" />
                Download PDF
              </button>
              <button
                onClick={() => navigate("/viormart")}
                className="flex items-center gap-2 bg-n-7 hover:bg-n-6 text-n-1 px-6 py-3 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Continue Shopping
              </button>
            </div>
          </div>

          {/* Order Receipt - Optimized for Single Page */}
          <div
            id="order-receipt"
            className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 text-gray-800"
          >
            {/* Invoice Header */}
            <div className="text-center mb-8 border-b-4 border-blue-600 pb-6">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">
                PRITECH VIOR
              </h1>
              <p className="text-sm text-gray-600 mb-4">
                IT Innovation & Solutions Tanzania
              </p>
              <h2 className="text-2xl font-bold mb-3">Order Confirmation</h2>
              <div className="flex justify-center gap-6 text-sm text-gray-600">
                <span className="bg-gray-100 px-4 py-2 rounded">
                  Order ID: {orderId}
                </span>
                <span className="bg-gray-100 px-4 py-2 rounded">
                  Date: {new Date().toLocaleDateString("en-GB")}
                </span>
              </div>
            </div>

            {/* Order Items & Summary */}
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b border-gray-200 pb-2">
                  Order Items
                </h3>

                {/* Items Table */}
                <div className="bg-white rounded-lg overflow-hidden mb-4">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="text-left p-3 text-sm font-semibold">
                          Item
                        </th>
                        <th className="text-left p-3 text-sm font-semibold">
                          Quantity
                        </th>
                        <th className="text-left p-3 text-sm font-semibold">
                          Unit Price
                        </th>
                        <th className="text-left p-3 text-sm font-semibold">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="p-3 text-sm">
                            {item.product_name || item.product?.name}
                          </td>
                          <td className="p-3 text-sm">{item.quantity}</td>
                          <td className="p-3 text-sm">
                            {formatPrice(item.price || item.product?.price)}
                          </td>
                          <td className="p-3 text-sm">
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

                {/* Order Summary */}
                <div className="bg-white p-4 rounded-lg border-2 border-blue-600">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                      <span>Shipping:</span>
                      <span>
                        {shippingCost === 0
                          ? "Free"
                          : formatPrice(shippingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                      <span>Tax (18% VAT):</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-blue-600 border-t-2 border-blue-600 pt-3 mt-3">
                      <span>Total:</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Payment Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b border-gray-200 pb-2">
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-gray-300 pb-1">
                    <span className="font-medium">Name:</span>
                    <span className="text-right">
                      {customerInfo.first_name} {customerInfo.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-300 pb-1">
                    <span className="font-medium">Email:</span>
                    <span className="text-right">{customerInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Phone:</span>
                    <span className="text-right">{customerInfo.phone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b border-gray-200 pb-2">
                  Payment Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-gray-300 pb-1">
                    <span className="font-medium">Payment Method:</span>
                    <span className="text-right">
                      {getPaymentMethodText(paymentMethod)}
                    </span>
                  </div>
                  {paymentDetails.mpesa_number && (
                    <div className="flex justify-between">
                      <span className="font-medium">M-Pesa Number:</span>
                      <span className="text-right">
                        {paymentDetails.mpesa_number}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b border-gray-200 pb-2">
                  Billing Address
                </h3>
                <div className="space-y-1 text-sm">
                  <div>{billingAddress.street_address || ""}</div>
                  <div>
                    {billingAddress.city || ""}, {billingAddress.state || ""}
                  </div>
                  <div>{billingAddress.country || ""}</div>
                  <div className="flex justify-between border-t border-gray-300 pt-1">
                    <span className="font-medium">Postal Code:</span>
                    <span>{billingAddress.postal_code || ""}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b border-gray-200 pb-2">
                  Shipping Address
                </h3>
                <div className="space-y-1 text-sm">
                  <div>{shippingAddress.street_address || ""}</div>
                  <div>
                    {shippingAddress.city || ""}, {shippingAddress.state || ""}
                  </div>
                  <div>{shippingAddress.country || ""}</div>
                  <div className="flex justify-between border-t border-gray-300 pt-1">
                    <span className="font-medium">Postal Code:</span>
                    <span>{shippingAddress.postal_code || ""}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center border-t-2 border-gray-200 pt-6">
              <div className="text-sm text-gray-600 mb-3">
                <strong>
                  PRITECH VIOR - IT Innovation & Solutions Tanzania
                </strong>
                <br />
                Email: support@pritechvior.com | Phone: +255 123 456 789
              </div>
              <div className="bg-gray-100 p-3 rounded-lg text-xs text-gray-700 italic">
                Thank you for choosing PRITECH VIOR. We appreciate your business
                and look forward to serving you again.
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 mx-auto bg-n-6 hover:bg-n-5 text-n-1 px-6 py-3 rounded-lg transition-colors"
            >
              <Home className="h-5 w-5" />
              Return to Home
            </button>
          </div>
        </div>
      </Section>
      <Footer />
    </>
  );
};

export default OrderConfirmationPage;
