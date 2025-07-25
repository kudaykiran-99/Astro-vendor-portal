// import React, { useEffect, useState } from "react";
// import { Form, Input, Button, Row, Col, message } from "antd";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";

// const Form2 = () => {
//   const { vendorId } = useParams();
//   const auth = useSelector((state) => state.auth);
//   const actionPerformer = auth.userId;
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);

//   // 1) Fetch approved-vendor data on mount
//   useEffect(() => {
//     const fetchVendorDetails = async () => {
//       try {
//         const res = await fetch(
//           `http://103.181.158.220:8081/astro-service/api/vendor-master/approvedVendorData/${vendorId}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${auth.token}`,
//             },
//           }
//         );
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.responseStatus?.message || res.statusText);
        
//         // assume the API returns an array of DTOs, take the first
//         const dto = Array.isArray(data.responseData) ? data.responseData[0] : data.responseData;

//         // 2) Populate the form fields
//         form.setFieldsValue({
//           tenderNumber:         dto.tenderNumber,
//           purchaseOrder:        dto.purchaseOrderNumber,
//           deliveryAndAcceptanceStatus: dto.deliveryAndAcceptanceStatus,
//           paymentStatus:        dto.paymentStatus,
//           paymentUTRNumber:     dto.paymentUtrNumber,
//           date:                 dto.paymentDate,
//         });
//       } catch (err) {
//         console.error("Fetch error:", err);
//         message.error("Could not load approved-vendor details: " + err.message);
//       } finally {
//         setFetching(false);
//       }
//     };

//     fetchVendorDetails();
//   }, [vendorId, auth.token, form]);

//   // 3) Submit handler (if you still need to submit something)
//   const handleSubmit = async (values) => {
//     setLoading(true);
//     try {
//       // … your existing POST logic …
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetching) {
//     return <div>Loading approved vendor details…</div>;
//   }

//   return (
//     <div className="form-container">
//       <h2>Approved Vendor Details</h2>
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={handleSubmit}
//         onFinishFailed={() => message.error("Please fill all required fields")}
//       >
//         <Form.Item label="Tender Number" name="tenderNumber">
//           <Input disabled />
//         </Form.Item>

//         <Form.Item label="Purchase Order (PO) Number" name="purchaseOrder">
//           <Input disabled />
//         </Form.Item>

//         <Form.Item
//           label="Delivery/Acceptance Status"
//           name="deliveryAndAcceptanceStatus"
//         >
//           <Input disabled />
//         </Form.Item>

//         <Form.Item label="Payment Status" name="paymentStatus">
//           <Input disabled />
//         </Form.Item>

//         <Form.Item label="Payment UTR Number" name="paymentUTRNumber">
//           <Input disabled />
//         </Form.Item>

//         <Form.Item label="Payment Date" name="date">
//           <Input disabled />
//         </Form.Item>

//         <Form.Item>
//           <Row justify="space-between">
//             <Col>
//               <Button type="default" htmlType="reset" onClick={() => form.resetFields()}>
//                 Reset
//               </Button>
//             </Col>
//             <Col>
//               <Button type="primary" htmlType="submit" loading={loading}>
//                 Submit
//               </Button>
//             </Col>
//           </Row>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default Form2;

import React, { useEffect, useState } from "react";
import { Card, Row, Col, message, Spin } from "antd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TenderEvaluator from "../../../components/Tender_Evaluator"; // Adjust this import path if needed
import PurchaseOrderDetails from "../../../components/Purchaseorder_details";
import axios from "axios";

const Form2 = () => {
  const { vendorId } = useParams();
  const auth = useSelector((state) => state.auth);
  const [tenderIds, setTenderIds] = useState([]);
  const [selectedTenderId, setSelectedTenderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEvaluator, setShowEvaluator] = useState(false);
  const [existingVendor, setExistingVendor] = useState(null);


  useEffect(() => {
    const fetchTenderIds = async () => {
      try {
        const res = await axios.get(
          `/api/vendor-master/approvedtenderIDs/${vendorId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
       // const data = await res.json();
       // if (!res.ok) throw new Error(data.responseStatus?.message || res.statusText);

       // setTenderIds(data.responseData || []);
        setTenderIds(res.data.responseData || []);
      } catch (err) {
        console.error("Failed to fetch tender IDs:", err);
        message.error("Could not fetch tender IDs: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTenderIds();
  }, [vendorId, auth.token]);

  if (loading) return <Spin tip="Loading Tender IDs..." />;


  return (
    <div style={{ padding: "20px" }}>
      <h2 className="font-bold mb-2">Approved Tender IDs</h2>
      <Row gutter={[16, 16]}>
        {tenderIds.map((tenderId) => (
          <Col key={tenderId} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{
                textAlign: "center",
                cursor: "pointer",
                border: selectedTenderId === tenderId ? "2px solid #1890ff" : undefined,
              }}
             // onClick={() => setSelectedTenderId(tenderId)}
           onClick={async () => {
            setSelectedTenderId(tenderId);
            try {
              const res = await axios.get(
                `/api/tender-requests/vendor/${tenderId}/${vendorId}`, // <-- Updated API with vendorId
              {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
              },
            }
        );

        const responseData = res.data.responseData;

      /*  if (responseData.qualified) {
          setShowEvaluator(false);
          setExistingVendor(vendorId); // qualified vendor
        } else {
          if (responseData.remarks) {
            // Rejected with remarks
           setShowEvaluator(false);
            setExistingVendor("REJECTED_REMARKS:" + responseData.remarks);
          } else {
            // New vendor, no quotation yet
            setShowEvaluator(true);
            setExistingVendor(null);
          }*/
         if (responseData.qualified && responseData.changeRequest) {
  setShowEvaluator(true);  // Allow re-upload in case of change request
  setExistingVendor(null);
} else if(responseData.qualified && !responseData.changeRequest){
          setShowEvaluator(false);
          setExistingVendor(vendorId); 
}else {
  if (responseData.remarks) {
    setShowEvaluator(false);
    setExistingVendor("REJECTED_REMARKS:" + responseData.remarks);
  } else {
    setShowEvaluator(true);
    setExistingVendor(vendorId); // fully rejected or invalid
  }

        }
        } catch (err) {
          console.error("Vendor check failed:", err);
          message.error("Failed to check vendor: " + err.message);
        }
      }}

            >
              <a>{tenderId}</a>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Render TenderEvaluator below the cards */}
      {/*{selectedTenderId && (
        <div style={{ marginTop: "40px" }}>
          {/* <TenderEvaluator tenderId={selectedTenderId} bidType={bidType} /> */}
        {/*}  <TenderEvaluator tenderId={selectedTenderId} />
        </div>
      )}*/}
      {selectedTenderId && showEvaluator && (
  <div style={{ marginTop: "40px" }}>
    <TenderEvaluator key={selectedTenderId} tenderId={selectedTenderId} />
  </div>
)}

 {selectedTenderId && !showEvaluator && existingVendor && (
        <div style={{ marginTop: "40px" }}>
          {/*existingVendor === auth.vendorId ? (
            <PurchaseOrderDetails key={selectedTenderId} tenderId={selectedTenderId} />
          ) : (
            <div style={{ padding: 24, background: "#fff3f0", border: "1px solidrgb(218, 200, 199)", borderRadius: 4 }}>
              <strong>Vendor quotation is not qualified for Tender ID {selectedTenderId}.</strong>
            </div>
          )*/}
          {existingVendor === vendorId ? (
            <PurchaseOrderDetails key={selectedTenderId} tenderId={selectedTenderId} />
            ) : existingVendor?.startsWith("REJECTED_REMARKS:") ? (
            <div style={{ padding: 24, background: "#fff3f0", border: "1px solid rgb(218, 200, 199)", borderRadius: 4 }}>
            <strong>Vendor quotation is not qualified for Tender ID {selectedTenderId}.</strong>
            <br />
            <span><strong>Reason for rejection:</strong> {existingVendor.replace("REJECTED_REMARKS:", "")}</span>
          </div>
          ) : null}

        </div>
      )}

    </div>
  );
};

export default Form2;

