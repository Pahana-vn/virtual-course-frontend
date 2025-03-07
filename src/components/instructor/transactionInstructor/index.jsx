import React from "react";
import { InstructorHeader } from "../../instructor/header";
import Footer from "../../footer";
import { Link } from "react-router-dom";
import MenuInstructorDashboard from "../deposit/menuInstructorDashboard";
import { useGetAllInstructorTransactionsQuery } from "../../../redux/slices/instructor/instructorTransactionApiSlice";

export default function TransactionInstructor() {
  const { data, error, isLoading } = useGetAllInstructorTransactionsQuery();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching withdrawal history.</div>;
  }
  return (
    <div className="main-wrapper">
      <InstructorHeader />
      <MenuInstructorDashboard />

      <div className="page-content">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-md-12">
              <div className="settings-widget">
                <div className="settings-inner-blk p-0">
                  <div className="comman-space pb-0">
                    <div className="filter-grp ticket-grp d-flex align-items-center justify-content-between">
                      <h3>Latest Transactions</h3>
                    </div>
                    <div className="settings-tickets-blk table-responsive">
                      <table className="table table-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>Referred ID</th>
                            <th>Details</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Post Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data && data.length > 0 ? (
                            data.map((item) => (
                              <tr key={item.id}>
                                <td>
                                  <Link to="#">{item.id}</Link>
                                </td>
                                <td>{item.title}</td>
                                <td>
                                  <span
                                    className={
                                      item.transactionType === "DEPOSIT"
                                        ? "text-green"
                                        : "text-danger"
                                    }
                                  >
                                    {item.transactionType === "DEPOSIT"
                                      ? "+ "
                                      : "- "}
                                    {formatCurrency(item.amount)}
                                  </span>
                                </td>
                                <td>
                                  <span className="badge info-low">
                                    {item.statusTransaction}
                                  </span>
                                </td>
                                <td>{formatCurrency(item.walletBalance)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No transaction data available.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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
}
