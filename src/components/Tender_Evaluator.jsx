import React, { useState, useEffect} from 'react';
import axios from 'axios';
//import { message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FileUpload from './DKG_FileUpload';
import FormContainer from './DKG_FormContainer';
import Heading from './DKG_Heading';
import Btn from './DKG_Btn';
import { Form, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import QueueModal from "./QueueModal";
import { Modal } from "antd";


const TenderEvaluator = ({ tenderId }) => {
  //const { userId } = useSelector(state => state.auth);
  const vendorId = useSelector((state) => state.auth.vendorId);
  console.log("Vendor ID from Redux:", vendorId);
  
  const navigate = useNavigate();

  const [quotationFile, setQuotationFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [closingDate, setClosingDate] = useState(null);
  const [isAfterClosing, setIsAfterClosing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailsData, setDetailsData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);




  // ─── NEW EFFECT: FETCH AND COMPARE CLOSING DATE ──────────────────────────────
 useEffect(() => {
  axios
    .get(`/api/tender-requests/data/${tenderId}`)
    .then(res => {
      const cdString = res.data.responseData.closingDate; // e.g., "10/05/2025"
      if (!cdString) return;

      // Parse "dd/MM/yyyy"
      const [day, month, year] = cdString.split('/').map(Number);
      const closingDate = new Date(year, month - 1, day, 23, 59, 59, 999); // end of day

      const now = new Date();

      setClosingDate(closingDate);
      setIsAfterClosing(now > closingDate); // true = too late
    })
    .catch(err => {
      console.error('Failed to fetch closing date:', err);
    });
}, [tenderId]);



  const handleFileChange = (docName, fileData) => {
    if (fileData === null) {
      setQuotationFile(null);
    } else {
      setQuotationFile({
        file: fileData.file.originFileObj,
        originalName: fileData.file.name
      });
    }
  };

  const handleSubmit = async () => {
    if (!quotationFile) {
      message.warning('Please upload a quotation file');
      return;
    }

    setIsUploading(true);

    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', quotationFile.file);

      const fileUploadResponse = await axios.post(
        '/file/upload?fileType=Tender',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        }
      );

      const serverFileName = fileUploadResponse.data.responseData.fileName;

      // Now call the API to submit quotation details
      const quotationBody = {
        tenderId: tenderId,
        vendorId: vendorId,  // assuming vendorId = userId or you can try with V1001
        quotationFileName: serverFileName,
        fileType: "Tender",
        createdBy: null
      };

      const response = await axios.post(
        '/api/vendor-quotation',
        quotationBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const { responseStatus, responseData } = response.data;

      if (responseStatus.statusCode === 0) {
        message.success('Quotation submitted successfully');
      //  navigate('/purchaseOrder');
      /* setTimeout(() => {
         // setSuccessMessage('');
          navigate('/');
        }, 1000);*/
        setSuccessMessage("Vendor quotation submitted successfully.");
        setQuotationFile(null);   
        setShowPopup(true);   
      } else {
        throw new Error('Failed to submit quotation');
      }

    } catch (error) {
      console.error('Submission error:', error);
      message.error('An error occurred while submitting your quotation');
    } finally {
      setIsUploading(false);
    }
  };

/*
  return (
    <FormContainer>
      <Heading title={`Upload Quotation for Tender ID: ${tenderId}`} />

      <FileUpload
        documentName="Upload Quotation for Evaluation"
        fileType="document"
        onChange={(fileData) => handleFileChange("quotationUpload", fileData)}
        fileName={quotationFile ? quotationFile.originalName : "No file selected"}
        value={quotationFile ? { file: { ...quotationFile } } : null}
      />
       
      <div className="custom-btn" style={{ display: 'flex', gap: '10px' }}>
        <Btn onClick={handleSubmit} loading={isUploading}>
          Send Quotation for Evaluation
        </Btn>
      </div>
    </FormContainer>
  );*/
  

  return (
    <FormContainer>
       <Modal
      title="Success"
      open={showPopup}
      onOk={() => setShowPopup(false)}
      onCancel={() => setShowPopup(false)}
      okText="OK"
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <p>Vendor quotation submitted successfully.</p>
    </Modal>
      <Heading title={`Upload Quotation for Tender ID: ${tenderId}`} />

        <p style={{ fontWeight: "bold" }}>
  Please click on Tender ID to see tender details:{" "}
  <span
    style={{
      color: "#1890ff",
      cursor: "pointer",
      textDecoration: "underline",
    }}
    onClick={async () => {
      setModalVisible(true);           // Open modal first
      setDetailsData(null);           // Reset previous data to show loader
      setSelectedRecord({ requestId: tenderId, workflowId: 4 });

      try {
        const response = await axios.get(`/api/tender-requests/${tenderId}`);
        setDetailsData(response.data.responseData); // Populate details once loaded
      } catch (err) {
        console.error("Failed to fetch tender details:", err);
        message.error("Could not load tender details");
        setModalVisible(false); // Close if fetch fails
      }
    }}
  >
    {tenderId}
  </span>
</p>



      {/* Display the closing date */}
     {closingDate && (
  <p style={{ fontWeight: 'bold' }}>
    Closing Date: {closingDate.toLocaleDateString()}
  </p>
)}

{isAfterClosing ? (
  <p style={{ color: 'red', fontWeight: 'bold' }}>
    Tender closing date is completed. Not allowed to upload Quotation document.
  </p>
) : (
  <>
    <FileUpload
      documentName="Upload Quotation for Evaluation"
      fileType="document"
      onChange={fileData => handleFileChange('quotationUpload', fileData)}
      fileName={quotationFile ? quotationFile.originalName : 'No file selected'}
      value={quotationFile ? { file: { ...quotationFile } } : null}
    />

    <div className="custom-btn" style={{ display: 'flex', gap: '10px' }}>
      <Btn onClick={handleSubmit} loading={isUploading}>
        Send Quotation for Evaluation
      </Btn>
      

    </div>
  </>
)}
   <QueueModal
  modalVisible={modalVisible}
  setModalVisible={setModalVisible}
  selectedRecord={selectedRecord}
  detailsData={detailsData}
/>


    </FormContainer>
  );
};

export default TenderEvaluator;