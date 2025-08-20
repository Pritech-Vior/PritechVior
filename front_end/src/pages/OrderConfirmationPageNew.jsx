import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Download, CheckCircle, ArrowLeft, Home, Printer } from "lucide-react";
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
              line-height: 1.3; 
              color: #333; 
              max-width: 210mm; 
              margin: 0 auto; 
              padding: 8mm; 
              font-size: 10px; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 12px; 
              border-bottom: 2px solid #2563eb; 
              padding-bottom: 8px; 
            }
            .company-name { 
              font-size: 18px; 
              font-weight: bold; 
              color: #2563eb; 
              margin-bottom: 2px; 
            }
            .company-tagline { 
              font-size: 10px; 
              color: #666; 
              margin-bottom: 8px; 
            }
            .invoice-title { 
              font-size: 16px; 
              font-weight: bold; 
              margin-bottom: 4px; 
            }
            .order-meta { 
              font-size: 10px; 
              color: #666; 
            }
            .main-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 10px; 
            }
            .main-table td { 
              padding: 4px 6px; 
              border: 1px solid #ddd; 
              vertical-align: top; 
              font-size: 9px; 
            }
            .main-table th { 
              background: #f8f9fa; 
              padding: 4px 6px; 
              border: 1px solid #ddd; 
              font-weight: bold; 
              font-size: 9px; 
              text-align: left; 
            }
            .items-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 8px; 
            }
            .items-table th { 
              background: #2563eb; 
              color: white; 
              padding: 6px 4px; 
              text-align: left; 
              font-weight: bold; 
              font-size: 9px; 
              border: 1px solid #2563eb; 
            }
            .items-table td { 
              padding: 5px 4px; 
              border: 1px solid #ddd; 
              font-size: 9px; 
            }
            .totals-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 8px; 
            }
            .totals-table td { 
              padding: 3px 6px; 
              border: 1px solid #ddd; 
              font-size: 9px; 
            }
            .total-row { 
              background: #f8f9fa; 
              font-weight: bold; 
            }
            .footer { 
              text-align: center; 
              margin-top: 8px; 
              padding-top: 6px; 
              border-top: 1px solid #ddd; 
              font-size: 8px; 
              color: #666; 
            }
            .section-title { 
              background: #e5e7eb; 
              font-weight: bold; 
              text-align: center; 
              color: #2563eb; 
            }
            @media print {
              body { 
                margin: 0; 
                padding: 5mm; 
                font-size: 9px; 
              }
              .main-table { 
                page-break-inside: avoid; 
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">PRITECH VIOR</div>
            <div class="company-tagline">IT Innovation & Solutions Tanzania</div>
            <div class="invoice-title">Order Confirmation</div>
            <div class="order-meta">
              Order ID: ${orderId} | Date: ${new Date().toLocaleDateString(
      "en-GB"
    )}
            </div>
          </div>

          <table class="main-table">
            <tr>
              <td colspan="4" class="section-title">ORDER ITEMS</td>
            </tr>
            <tr>
              <th style="background: #2563eb; color: white;">Item</th>
              <th style="background: #2563eb; color: white;">Quantity</th>
              <th style="background: #2563eb; color: white;">Unit Price</th>
              <th style="background: #2563eb; color: white;">Total</th>
            </tr>
            ${items
              .map(
                (item) => `
              <tr>
                <td>${item.product_name || item.product?.name}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">${formatPrice(
                  item.price || item.product?.price
                )}</td>
                <td style="text-align: right;">${formatPrice(
                  parseFloat(item.price || item.product?.price) * item.quantity
                )}</td>
              </tr>
            `
              )
              .join("")}
            <tr>
              <td colspan="4" class="section-title">ORDER SUMMARY</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right; font-weight: bold;">Subtotal:</td>
              <td style="text-align: right;">${formatPrice(subtotal)}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right; font-weight: bold;">Shipping:</td>
              <td style="text-align: right;">${
                shippingCost === 0 ? "Free" : formatPrice(shippingCost)
              }</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right; font-weight: bold;">Tax (18% VAT):</td>
              <td style="text-align: right;">${formatPrice(tax)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3" style="text-align: right; font-weight: bold; color: #2563eb;">Total:</td>
              <td style="text-align: right; font-weight: bold; color: #2563eb;">${formatPrice(
                total
              )}</td>
            </tr>
          </table>

          <table class="main-table">
            <tr>
              <td colspan="4" class="section-title">CUSTOMER & PAYMENT INFORMATION</td>
            </tr>
            <tr>
              <th style="width: 20%;">Customer Name:</th>
              <td style="width: 30%;">${customerInfo.first_name} ${
      customerInfo.last_name
    }</td>
              <th style="width: 20%;">Payment Method:</th>
              <td style="width: 30%;">${getPaymentMethodText(
                paymentMethod
              )}</td>
            </tr>
            <tr>
              <th>Email:</th>
              <td>${customerInfo.email}</td>
              <th>Phone:</th>
              <td>${customerInfo.phone}</td>
            </tr>
            ${
              paymentDetails.mpesa_number
                ? `
            <tr>
              <th>M-Pesa Number:</th>
              <td colspan="3">${paymentDetails.mpesa_number}</td>
            </tr>
            `
                : ""
            }
          </table>

          <table class="main-table">
            <tr>
              <td colspan="4" class="section-title">BILLING & SHIPPING ADDRESSES</td>
            </tr>
            <tr>
              <th style="width: 20%;">Billing Address:</th>
              <td style="width: 30%;">
                ${billingAddress.street_address || ""}<br>
                ${billingAddress.city || ""}, ${billingAddress.state || ""}<br>
                ${billingAddress.country || ""}<br>
                Postal Code: ${billingAddress.postal_code || ""}
              </td>
              <th style="width: 20%;">Shipping Address:</th>
              <td style="width: 30%;">
                ${shippingAddress.street_address || ""}<br>
                ${shippingAddress.city || ""}, ${
      shippingAddress.state || ""
    }<br>
                ${shippingAddress.country || ""}<br>
                Postal Code: ${shippingAddress.postal_code || ""}
              </td>
            </tr>
          </table>

          <div class="footer">
            <strong>PRITECH VIOR - IT Innovation & Solutions Tanzania</strong><br>
            Email: support@pritechvior.com | Phone: +255 123 456 789<br>
            <em>Thank you for choosing PRITECH VIOR. We appreciate your business and look forward to serving you again.</em>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadPDF = () => {
    // Create a new window for PDF generation
    const pdfWindow = window.open("", "_blank");
    pdfWindow.document.write(`
      <html>
        <head>
          <title>Order Receipt - ${orderId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Arial', sans-serif; 
              line-height: 1.3; 
              color: #333; 
              max-width: 210mm; 
              margin: 0 auto; 
              padding: 8mm; 
              font-size: 10px; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 12px; 
              border-bottom: 2px solid #2563eb; 
              padding-bottom: 8px; 
            }
            .company-name { 
              font-size: 18px; 
              font-weight: bold; 
              color: #2563eb; 
              margin-bottom: 2px; 
            }
            .company-tagline { 
              font-size: 10px; 
              color: #666; 
              margin-bottom: 8px; 
            }
            .invoice-title { 
              font-size: 16px; 
              font-weight: bold; 
              margin-bottom: 4px; 
            }
            .order-meta { 
              font-size: 10px; 
              color: #666; 
            }
            .main-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 10px; 
            }
            .main-table td { 
              padding: 4px 6px; 
              border: 1px solid #ddd; 
              vertical-align: top; 
              font-size: 9px; 
            }
            .main-table th { 
              background: #f8f9fa; 
              padding: 4px 6px; 
              border: 1px solid #ddd; 
              font-weight: bold; 
              font-size: 9px; 
              text-align: left; 
            }
            .totals-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 8px; 
            }
            .totals-table td { 
              padding: 3px 6px; 
              border: 1px solid #ddd; 
              font-size: 9px; 
            }
            .total-row { 
              background: #f8f9fa; 
              font-weight: bold; 
            }
            .footer { 
              text-align: center; 
              margin-top: 8px; 
              padding-top: 6px; 
              border-top: 1px solid #ddd; 
              font-size: 8px; 
              color: #666; 
            }
            .section-title { 
              background: #e5e7eb; 
              font-weight: bold; 
              text-align: center; 
              color: #2563eb; 
            }
            @media print {
              body { 
                margin: 0; 
                padding: 5mm; 
                font-size: 9px; 
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">PRITECH VIOR</div>
            <div class="company-tagline">IT Innovation & Solutions Tanzania</div>
            <div class="invoice-title">Order Confirmation</div>
            <div class="order-meta">
              Order ID: ${orderId} | Date: ${new Date().toLocaleDateString(
      "en-GB"
    )}
            </div>
          </div>

          <table class="main-table">
            <tr>
              <td colspan="4" class="section-title">ORDER ITEMS</td>
            </tr>
            <tr>
              <th style="background: #2563eb; color: white;">Item</th>
              <th style="background: #2563eb; color: white;">Quantity</th>
              <th style="background: #2563eb; color: white;">Unit Price</th>
              <th style="background: #2563eb; color: white;">Total</th>
            </tr>
            ${items
              .map(
                (item) => `
              <tr>
                <td>${item.product_name || item.product?.name}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">${formatPrice(
                  item.price || item.product?.price
                )}</td>
                <td style="text-align: right;">${formatPrice(
                  parseFloat(item.price || item.product?.price) * item.quantity
                )}</td>
              </tr>
            `
              )
              .join("")}
            <tr>
              <td colspan="4" class="section-title">ORDER SUMMARY</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right; font-weight: bold;">Subtotal:</td>
              <td style="text-align: right;">${formatPrice(subtotal)}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right; font-weight: bold;">Shipping:</td>
              <td style="text-align: right;">${
                shippingCost === 0 ? "Free" : formatPrice(shippingCost)
              }</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right; font-weight: bold;">Tax (18% VAT):</td>
              <td style="text-align: right;">${formatPrice(tax)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3" style="text-align: right; font-weight: bold; color: #2563eb;">Total:</td>
              <td style="text-align: right; font-weight: bold; color: #2563eb;">${formatPrice(
                total
              )}</td>
            </tr>
          </table>

          <table class="main-table">
            <tr>
              <td colspan="4" class="section-title">CUSTOMER & PAYMENT INFORMATION</td>
            </tr>
            <tr>
              <th style="width: 20%;">Customer Name:</th>
              <td style="width: 30%;">${customerInfo.first_name} ${
      customerInfo.last_name
    }</td>
              <th style="width: 20%;">Payment Method:</th>
              <td style="width: 30%;">${getPaymentMethodText(
                paymentMethod
              )}</td>
            </tr>
            <tr>
              <th>Email:</th>
              <td>${customerInfo.email}</td>
              <th>Phone:</th>
              <td>${customerInfo.phone}</td>
            </tr>
            ${
              paymentDetails.mpesa_number
                ? `
            <tr>
              <th>M-Pesa Number:</th>
              <td colspan="3">${paymentDetails.mpesa_number}</td>
            </tr>
            `
                : ""
            }
          </table>

          <table class="main-table">
            <tr>
              <td colspan="4" class="section-title">BILLING & SHIPPING ADDRESSES</td>
            </tr>
            <tr>
              <th style="width: 20%;">Billing Address:</th>
              <td style="width: 30%;">
                ${billingAddress.street_address || ""}<br>
                ${billingAddress.city || ""}, ${billingAddress.state || ""}<br>
                ${billingAddress.country || ""}<br>
                Postal Code: ${billingAddress.postal_code || ""}
              </td>
              <th style="width: 20%;">Shipping Address:</th>
              <td style="width: 30%;">
                ${shippingAddress.street_address || ""}<br>
                ${shippingAddress.city || ""}, ${
      shippingAddress.state || ""
    }<br>
                ${shippingAddress.country || ""}<br>
                Postal Code: ${shippingAddress.postal_code || ""}
              </td>
            </tr>
          </table>

          <div class="footer">
            <strong>PRITECH VIOR - IT Innovation & Solutions Tanzania</strong><br>
            Email: support@pritechvior.com | Phone: +255 123 456 789<br>
            <em>Thank you for choosing PRITECH VIOR. We appreciate your business and look forward to serving you again.</em>
          </div>
        </body>
      </html>
    `);
    pdfWindow.document.close();

    // Automatically trigger print dialog which allows saving as PDF
    setTimeout(() => {
      pdfWindow.print();
    }, 500);
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
              Thank you for your order. We&apos;ll process it shortly and send
              you updates.
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
