import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Checkbox,
  Row,
  Col,
  message,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
dayjs.extend(customParseFormat);

const { Option } = Select;

const Form1 = () => {
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  // const handleSubmit = async (values) => {
  //   setLoading(true);
  //   try {
  //     const payload = {
  //       vendorName: values.vendorName,
  //       vendorType: values.vendorType,
  //       contactNumber: values.contactNo,
  //       emailAddress: values.emailAddress,
  //       registeredPlatform: !!values.registeredPlatform,
  //       pfmsVendorCode: values.pfmsVendorCode,
  //       primaryBusiness: values.primaryBusiness,
  //       address: values.address,
  //       landlineNumber: values.landline,
  //       mobileNumber: values.mobileNo,
  //       faxNumber: values.fax,
  //       panNumber: values.panNo,
  //       gstNumber: values.gstNo,
  //       bankName: values.bankName,
  //       accountNumber: values.accountNo,
  //       ifscCode: values.ifscCode,
  //       purchaseHistory: values.purchaseHistory,
  //       createdBy: actionPerformer,
  //       updatedBy: actionPerformer,
  //     };

  //     const response = await fetch(
  //       "http://103.181.158.220:8081/astro-service/api/vendor-master-util/register",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${auth.token}`,
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     const data = await response.json();
  //     if (response.ok && data.responseStatus.statusCode === 0) {
  //       setSuccessMessage("You have registered successfully. Check your email for the credentials and Sign-in again using those credentials for further interactions!");
  //       setTimeout(() => {
  //         setSuccessMessage('');
  //       }, 10000);        
  //       form.resetFields();
  //       setTimeout(() => {
  //         navigate('/');
  //       }, 10000);
  //     } else {
  //       throw new Error(data.responseStatus?.message || "Registration failed");
  //     }
  //   } catch (err) {
  //     console.error("Registration error:", err);
  //     message.error(`Failed to register vendor: ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        vendorName: values.vendorName,
        vendorType: values.vendorType,
        contactNumber: values.contactNo,
        emailAddress: values.emailAddress,
        registeredPlatform: !!values.registeredPlatform,
        pfmsVendorCode: values.pfmsVendorCode,
        primaryBusiness: values.primaryBusiness,
        address: values.address,
        landlineNumber: values.landline,
        mobileNumber: values.mobileNo,
        faxNumber: values.fax,
        panNumber: values.panNo,
        gstNumber: values.gstNo,
        bankName: values.bankName,
        accountNumber: values.accountNo,
        ifscCode: values.ifscCode,
        purchaseHistory: values.purchaseHistory,
        createdBy: actionPerformer,
        updatedBy: actionPerformer,
      };
  
      const response = await fetch(
        "/api/vendor-master-util/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(payload),
        }
      );
  
      const data = await response.json();
      if (response.ok && data.responseStatus.statusCode === 0) {
        setSuccessMessage(
          "You have registered successfully. Check your email for the credentials and Sign-in again using those credentials for further interactions!"
        );
        form.resetFields();
  
        // Now Call VendorStatus API
        const vendorId = data.responseData?.vendorId;
        if (vendorId) {
          try {
            const statusResponse = await fetch(
              `/api/vendor-quotation/VendorStatus/${vendorId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${auth.token}`,
                },
              }
            );
            const statusData = await statusResponse.json();
            if (statusResponse.ok && statusData.responseStatus.statusCode === 0) {
              const emailStatus = statusData.responseData.emailStatus;
              if (emailStatus) {
                alert("Email for credentials has been sent successfully.");
              } else {
                alert("Email not sent properly.");
              }
            } else {
              console.error("Failed to fetch vendor status:", statusData.responseStatus.message);
            }
          } catch (statusError) {
            console.error("Vendor Status API Error:", statusError);
          }
        } else {
          console.error("Vendor ID not available for status check.");
        }
  
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/');
        }, 10000);
      } else {
        throw new Error(data.responseStatus?.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      message.error(`Failed to register vendor: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };  

  // useEffect(() => {
  //   form.setFieldsValue({
  //     indentorEmail: email,
  //     indentorMobileNo: mobileNumber,
  //     indentorName: userName,
  //   });
  // }, []);

  return (
    <>
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "12px 20px",
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: "16px",
              borderRadius: "8px",
              position: "sticky",
              top: "0",
              zIndex: 1000,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span style={{ flex: 1 }}>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage('')}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#155724",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="form-container">
        <h2>Vendor Registration</h2>
        <Row justify="end">
          <Col>
            <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
              {/* <Form.Item
                label="Indent ID"
                name="indentId"
              //   rules={[{ required: true, message: "Indentor ID is required" }]}
              >
                <Space>
                  <Input placeholder="Enter Indent ID" disabled />
                  <Button type="primary" onClick={handleSearch}>
                    <SearchOutlined />
                  </Button>
                </Space>
              </Form.Item> */}
            </Form>
          </Col>
        </Row>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onFinishFailed={(errorInfo) => {
            console.error("Validation Failed:", errorInfo);
            message.error("Please fill all required fields");
          }}
          // initialValues={{
          //   lineItems: [{}],
          //   preBidMeetingRequired: false,
          //   rateContractIndent: false,
          //   consigneeLocation: "Bangalore", // Default value that matches one of the options
          // }}
        >
          <div className="form-section">
            <Form.Item
              label="Vendor Name"
              name="vendorName"
              rules={[{ required: true, message: "Vendor name is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Vendor Type"
              name="vendorType"
              rules={[{ required: true, message: "Vendor Type is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Vendor Mobile No."
              name="contactNo"
              rules={[
                { required: true, message: "Vendor mobile number is required" },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="form-section">
            <Form.Item
              label="Vendor Email"
              name="emailAddress"
              rules={[{ required: true, message: "Vendor email is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="registeredPlatform"
              label="Registered Platform"
              rules={[
                { required: false, message: "Check is required" },
              ]}
            >
              <Checkbox>Yes</Checkbox>
              <Checkbox>No</Checkbox>
            </Form.Item>

            <Form.Item
              label="PFMS Vendor Code"
              name="pfmsVendorCode"
              rules={[
                { required: true, message: "Vendor Code is required" },
              ]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="form-section">
            <Form.Item
              label="Primary Business"
              name="primaryBusiness"
              rules={[{ required: true, message: "Primary Business is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Full Address is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Landline Number"
              name="landline"
              rules={[{ required: true, message: "Landline Number is required" }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="form-section">
            <Form.Item
              label="Mobile Number"
              name="mobileNo"
              rules={[{ required: true, message: "Mobile Number is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Fax Number"
              name="fax"
              rules={[{ required: true, message: "Fax Number is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="PAN Number"
              name="panNo"
              rules={[{ required: true, message: "PAN Number is required" }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="form-section">
            <Form.Item
              label="GST Number"
              name="gstNo"
              rules={[{ required: true, message: "GST Number is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Bank Name"
              name="bankName"
              rules={[{ required: true, message: "Bank Name is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Account Number"
              name="accountNo"
              rules={[{ required: true, message: "Account Number is required" }]}
            >
              <Input />
            </Form.Item>
          </div>

          <div className="form-section">
            <Form.Item
              label="IFSC Code"
              name="ifscCode"
              rules={[{ required: true, message: "IFSC Code is required" }]}
            >
              <Input />
            </Form.Item>

            {/* <Form.Item
              label="Purchase History"
              name="purchaseHistory"
              rules={[{ required: true, message: "Purchase History is required" }]}
            >
              <Input />
            </Form.Item> */}
          </div>

          <Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button type="default" htmlType="reset">
                Reset
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Form1;