import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchInvoiceDetails } from "../../../services/studentService";
import Footer from "../../footer";
import { logo } from "../../imagepath";
import StudentHeader from "../header";

const ViewInvoice = () => {
  const { orderId } = useParams(); // Lấy orderId từ URL
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        console.log(`📌 Fetching invoice for orderId: ${orderId}`);
        const data = await fetchInvoiceDetails(orderId);
        console.log("✅ Invoice Data:", data);
        setInvoice(data);
      } catch (error) {
        console.error("❌ Lỗi khi tải hóa đơn:", error);
        setError("Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    };
    loadInvoice();
  }, [orderId]);

  if (loading) return <p>Loading invoice...</p>;
  if (error) return <p>{error}</p>;
  if (!invoice) return <p>No invoice data found.</p>;

  return (
    <div className="main-wrapper">
      <StudentHeader />
      <div className="page-content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-9 col-md-8">
              <div className="settings-widget profile-details">
                <div className="settings-menu invoice-list-blk p-0">
                  <div className="card pro-post border-0 mb-0">
                    <div className="card-body">
                      <div className="invoice-item">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="invoice-logo">
                              <img src={logo} alt="logo" />
                            </div>
                          </div>
                          <div className="col-md-6 text-end">
                            <p className="invoice-details">
                              <strong>Order:</strong> #{invoice.id} <br />
                              <strong>Issued:</strong> {new Date(invoice.paymentDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="invoice-item invoice-table-wrap">
                        <div className="table-responsive">
                          <table className="invoice-table table table-bordered">
                            <thead>
                              <tr>
                                <th>Course</th>
                                <th>Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoice.courses.map((course) => (
                                <tr key={course.id}>
                                  <td>{course.titleCourse}</td>
                                  <td>{course.basePrice.toLocaleString()} VND</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <h5 className="text-end">
                        Total Amount: {invoice.amount.toLocaleString()} VND
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewInvoice;
