import React, { useRef, useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactToPrint } from "react-to-print";
import { IoMdPrint } from "react-icons/io";

const PrintContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const componentRef = useRef(null);
  const printButtonRef = useRef(null); // Reference to the print button
  const [isPrinted, setIsPrinted] = useState(false);

  const {
    selectedMonth,
    selectedDate,
    paymentAmount,
    paidBy,
    status,
    selectedStudent,
  } = location.state;

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        printButtonRef.current.click(); // Simulate click on the print button
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isPrinted) {
      navigate("/finances"); // Navigate to the Finance page
    }
  }, [isPrinted, navigate]);

  return (
    <Layout>
      <div className="printPageContainer">
        <div className="printBtn">
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginRight: "1rem" }}
            onClick={handleBack}
          >
            Back
          </button>
        </div>

        <div className="printContainer" ref={componentRef}>
          <div className="printWidth">
            <div className="logoContainer">
              <img src="/bglogo.png" alt="" />
            </div>

            <p className="printAddress">Taungzalat, Kalaymyo</p>
            <p className="reciptText">RECEIPT / VOUCHER</p>
            <p className="printAddress">
              09457373234, 09959053881, 09793322469
            </p>

            <div className="dateContainer">
              <p>{selectedStudent.grade.name}</p>
              <p className="">
                <strong>Date:</strong>{" "}
                {selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
              </p>
            </div>

            <div className="InfoPrint">
              <div className="dataRow">
                <p>Name:</p>
                <p>{selectedStudent.engName}</p>
              </div>

              <div className="dataRow">
                <p>Payment Amount:</p>
                <p>{paymentAmount}</p>
              </div>

              <div className="dataRow">
                <p>Month:</p>
                <p>{selectedMonth}</p>
              </div>

              <div className="PaidTotal">
                <p>{status}</p>
              </div>

              <div className="dataRow">
                <p>Paid By:</p>
                <p>{paidBy}</p>
              </div>

              <div>
                <p> --- Thank You --- </p>
                <p>သွင်းပြီးငွေ ပြန်မအမ်းပါ</p>
              </div>
            </div>
          </div>
        </div>

        <div className="printBtnContainer">
          <ReactToPrint
            trigger={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    ref={printButtonRef} // Attach ref to the print button
                  >
                    Print <IoMdPrint />
                  </button>
                </div>
              );
            }}
            content={() => componentRef.current}
            documentTitle={"Documents"}
            pageStyle="print"
            onAfterPrint={() => {
              setIsPrinted(true); // Update state to indicate print is finished
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PrintContent;
