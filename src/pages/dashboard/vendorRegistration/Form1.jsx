import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { Country, State, City } from "country-state-city";
dayjs.extend(customParseFormat);

const { Option } = Select;

const Form1 = () => {
  const auth = useSelector((state) => state.auth);
  const actionPerformer = auth.userId;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [vendorType, setVendorType] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');



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
        alternateEmailOrPhoneNumber: values.alternateEmailOrPhoneNumber,
        mobileNumber: values.mobileNo,
        //faxNumber: values.fax,
        panNumber: values.panNo,
        gstNumber: values.gstNo,
        bankName: values.bankName,
        accountNumber: values.accountNo,
        ifscCode: values.ifscCode,
        purchaseHistory: values.purchaseHistory,
        swiftCode: values.swiftCode,
        bicCode: values.bicCode,
        ibanAbaNumber: values.ibanAbaNumber,
        sortCode: values.sortCode,
        bankRoutingNumber: values.bankRoutingNumber,
        bankAddress: values.bankAddress,
        country: values.country,     
        state: values.state,         
        place: values.city, 
        createdBy: actionPerformer,
        updatedBy: actionPerformer,
      };
  
     /* const response = await axios.get(
        "/api/vendor-master-util/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(payload),
        }
      );*/
      const response = await axios.post(
        "/api/vendor-master-util/register",
        payload, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      const data = response.data;
     // if (response.ok && data.responseStatus.statusCode === 0) {
     if (data.responseStatus.statusCode === 0){
        setSuccessMessage(
          "You have registered successfully. Check your email for the credentials and Sign-in again using those credentials for further interactions!"
        );
        form.resetFields();
  
        // Now Call VendorStatus API
        const vendorId = data.responseData?.vendorId;
        if (vendorId) {
          try {
            const statusResponse = await axios.get(
              `/api/vendor-quotation/VendorStatus/${vendorId}`,
                {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${auth.token}`,
                    },
                }
              );
            const statusData = statusResponse.data;

            if (data.responseStatus.statusCode === 0) {
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
  useEffect(() => {
  const countries = Country.getAllCountries();
  setCountryList(countries);
}, []);

const handleCountryChange = (value) => {
  setSelectedCountry(value);
  const states = State.getStatesOfCountry(value);
  setStateList(states);
  setCityList([]);
  form.setFieldsValue({ state: undefined, city: undefined });
};

const handleStateChange = (value) => {
  setSelectedState(value);
  const cities = City.getCitiesOfState(selectedCountry, value);
  setCityList(cities);
  form.setFieldsValue({ city: undefined });
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
              <Select onChange={(value) => setVendorType(value)}>
                <Option value="Domestic">Domestic</Option>
                <Option value="International">International</Option>
              </Select>
              {/*<Input />*/}
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
              //rules={[{ required: true, message: "Vendor email is required" }]}
              rules={[
                { required: true, message: "Vendor email is required" },
               {
                validator: async (_, value) => {
                  if (vendorType === 'International' && value && value.endsWith(".com")) {
                   const response = await axios.get(`/api/vendor-master-util/check-email/${value}`);
                  if (response.data.responseData.exists) {
                    return Promise.reject("Email already exists!");
                  }
                  }
                return Promise.resolve();
                }
              }
            ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="registeredPlatform"
              label="Registered in GeM/ CPP Portal"
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
             /* rules={[
                { required: true, message: "Vendor Code is required" },
              ]}*/
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
              <Select placeholder="Select Primary Business">
                <Option value="Chemicals">Chemicals</Option>
                <Option value="Computers & Peripherals">Computers & Peripherals</Option>
                <Option value="Electricals">Electricals</Option>
                <Option value="Electronics">Electronics</Option>
                <Option value="Optics">Optics</Option>
                <Option value="Fabrication">Fabrication</Option>
                <Option value="Furniture">Furniture</Option>
                <Option value="Hardware">Hardware</Option>
                <Option value="Instrument/ Equipment & Machinery">Instrument/ Equipment & Machinery</Option>
                <Option value="Software">Software</Option>
                <Option value="Vehicles">Vehicles</Option>
                <Option value="Stationary">Stationary</Option>
                <Option value="Miscellaneous">Miscellaneous</Option>
                <Option value="Services">Services</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Alternate Email/Phone Number"
              name="alternateEmailOrPhoneNumber"
              rules={[{ required: true, message: "Landline Number is required" }]}
            >
              <Input />
            </Form.Item>
              <Form.Item
              label="PAN Number"
              name="panNo"
             // rules={[{ required: vendorType === 'Domestic', message: "PAN Number is required" }]}
             rules={[
                { required: vendorType === 'Domestic', message: "PAN Number is required" },
                { min: 10, max: 10, message: "PAN Number must be 10 characters" },
                 {
                    validator: async (_, value) => {
                    if (vendorType === 'Domestic') {
                    if (!value || value.length < 10) {
                      return Promise.resolve(); 
                  }

                  if (value.length === 10) {
                      const response = await axios.get(`/api/vendor-master-util/check-panNumber/${value}`);
                  if (response.data.responseData.exists) {
                      return Promise.reject("PAN number already exists");
                  } 
                  }
                }
                  return Promise.resolve();
                }
              }

              ]}
            >
              <Input disabled={vendorType === 'International'} />     
            </Form.Item>
          </div>

          <div className="form-section">
          { /* <Form.Item
              label="Mobile Number"
              name="mobileNo"
              rules={[{ required: true, message: "Mobile Number is required" }]}
            >
              <Input />
            </Form.Item>*/}

           { /*<Form.Item
              label="Fax Number"
              name="fax"
              rules={[{ required: true, message: "Fax Number is required" }]}
            >
              <Input />
            </Form.Item>*/}

          
          </div>

          <div className="form-section">
            <Form.Item
              label="GST Number"
              name="gstNo"
              rules={[{ required: vendorType === 'Domestic', message: "GST Number is required" }]}
            >
              <Input disabled={vendorType === 'International'}/>
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
            {vendorType === 'International' && (
          <>
            <Form.Item
              label="SWIFT Code"
              name="swiftCode"
              rules={[{ required: true, message: "SWIFT Code is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="BIC Code"
              name="bicCode"
              rules={[{ required: true, message: "BIC Code is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="IBAN/ABA Number"
              name="ibanAbaNumber"
              rules={[{ required: true, message: "IBAN/ABA Number is required" }]}
            >
            <Input />
            </Form.Item>

   
          </>
        )}

          </div>
          <div className="form-section">
              {vendorType === 'International' && (
               <>
                 <Form.Item
                    label="Sort Code"
                    name="sortCode"
                    rules={[{ required: true, message: "Sort Code is required" }]}
                  >
                  <Input />
                  </Form.Item>

                <Form.Item
                  label="Bank Routing Number"
                  name="bankRoutingNumber"
                  rules={[{ required: true, message: "Bank Routing Number is required" }]}
                >
                  <Input />
                </Form.Item>

               <Form.Item
                  label="Bank Address"
                  name="bankAddress"
                  rules={[{ required: true, message: "Bank Address is required" }]}
                >
                  <Input />
                </Form.Item>
               </>
              )}

          </div>

          <div className="form-section">
            <Form.Item
              label="IFSC Code"
              name="ifscCode"
              rules={[{ required: vendorType === 'Domestic', message: "IFSC Code is required" }]}
            >
              <Input disabled={vendorType === 'International'} />
            </Form.Item>

            {/* <Form.Item
              label="Purchase History"
              name="purchaseHistory"
              rules={[{ required: true, message: "Purchase History is required" }]}
            >
              <Input />
            </Form.Item> */}
          </div>
          <div className="form-section">
             <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Full Address is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Country" name="country" rules={[{ required: true, message: 'Country is required' }]}>
              <Select placeholder="Select Country" onChange={handleCountryChange}>
                {countryList.map((country) => (
                  <Option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </Option>
                  ))}
                </Select>
            </Form.Item>

            <Form.Item label="State" name="state" rules={[{ required: true, message: 'State is required' }]}>
              <Select placeholder="Select State" onChange={handleStateChange}>
              {stateList.map((state) => (
              <Option key={state.isoCode} value={state.isoCode}>
                {state.name}
              </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="City" name="city" rules={[{ required: true, message: 'City is required' }]}>
            <Select placeholder="Select City">
              {cityList.map((city, index) => (
               <Option key={index} value={city.name}>
                {city.name}
              </Option>
            ))}
            </Select>
          </Form.Item>

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