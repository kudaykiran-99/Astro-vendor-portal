import React from "react";
import {
  Modal,
  Typography,
  Row,
  Col,
  Spin,
  Collapse,
  Table,
  Tag,
  Divider,
  Empty,
} from "antd";
import {
  AuditOutlined,
  FilePdfOutlined,
  ProjectOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { baseURL } from "../App";

const QueueModal = ({ modalVisible, setModalVisible, detailsData }) => {
  return (
    <Modal
      title="Tender Details"
      open={modalVisible}
      onCancel={() => setModalVisible(false)}
      footer={null}
      width={1000}
      className="custom-modal"
      bodyStyle={{ padding: "24px 24px 8px" }}
    >
      {detailsData ? (
        <>
          <style>{`
            .custom-modal .ant-modal-title { font-size: 18px; font-weight: 600; }
            .detail-section { margin-bottom: 24px; padding: 16px; border: 1px solid #f0f0f0; border-radius: 8px; }
            .detail-item { margin-bottom: 12px; font-size: 14px; }
            .detail-item strong { display: inline-block; width: 220px; color: rgba(0, 0, 0, 0.85); }
            .section-title { margin: 16px 0; font-size: 16px; font-weight: 500; }
            .amount { font-weight: 500; color: #1890ff; }
          `}</style>

          {/* Tender Overview */}
          <div className="detail-section">
            <Typography.Title level={5} className="section-title">
              <AuditOutlined /> Tender Overview
            </Typography.Title>
            <Row gutter={24}>
              <Col span={12}>
                <div className="detail-item"><strong>Tender ID:</strong> {detailsData.tenderId || "N/A"}</div>
                <div className="detail-item"><strong>Title:</strong> {detailsData.titleOfTender || "N/A"}</div>
                <div className="detail-item"><strong>Bid Type:</strong> {detailsData.bidType || "N/A"}</div>
              </Col>
              <Col span={12}>
                <div className="detail-item"><strong>Opening Date:</strong> {detailsData.openingDate || "N/A"}</div>
                <div className="detail-item"><strong>Closing Date:</strong> {detailsData.closingDate || "N/A"}</div>
                <div className="detail-item">
                  <strong>Total Value:</strong>
                  <span className="amount">
                    {detailsData.totalTenderValue ? `₹${detailsData.totalTenderValue.toFixed(2)}` : "N/A"}
                  </span>
                </div>
              </Col>
            </Row>
          </div>

          {/* Document Details */}
          <div className="detail-section">
            <Typography.Title level={5} className="section-title">
              <FilePdfOutlined /> Document Details
            </Typography.Title>
            <Row gutter={24}>
              {["uploadTenderDocuments", "uploadSpecificTermsAndConditions", "uploadGeneralTermsAndConditions"].map((key, idx) => (
                <Col span={8} key={idx}>
                  <div className="detail-item">
                    <strong>{key.replace("upload", "").replace(/([A-Z])/g, " $1")}:</strong>
                    {detailsData[key]
                      ? detailsData[key].split(",").map((fileName, index) => (
                          <div key={index}>
                            <a
                              href={`${baseURL}/file/view/Tender/${fileName.trim()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {fileName.trim()} (View)
                            </a>
                          </div>
                        ))
                      : "N/A"}
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* Commercial Terms & Payment */}
          <div className="detail-section">
            <Row gutter={24}>
              <Col span={12}>
                <Typography.Title level={5} className="section-title">
                  <AuditOutlined /> Commercial Terms
                </Typography.Title>
                <div className="detail-item"><strong>Inco Terms:</strong> {detailsData.incoTerms || "N/A"}</div>
                <div className="detail-item"><strong>Consignee Address:</strong> {detailsData.consignes || "N/A"}</div>
                <div className="detail-item"><strong>Billing Address:</strong> {detailsData.billinngAddress || "N/A"}</div>
              </Col>
              <Col span={12}>
                <Typography.Title level={5} className="section-title">
                  <AuditOutlined /> Payment & Performance
                </Typography.Title>
                <div className="detail-item"><strong>Payment Terms:</strong> {detailsData.paymentTerms || "N/A"}</div>
                <div className="detail-item"><strong>LD Clause:</strong> {detailsData.ldClause || "N/A"}</div>
              </Col>
            </Row>
          </div>

          {/* Bid Security */}
          {detailsData.bidSecurityDeclaration && (
            <div className="detail-section">
              <Typography.Title level={5} className="section-title">
                <ProjectOutlined /> Bid Security
              </Typography.Title>
              <Row gutter={24}>
                <Col span={12}>
                  <div className="detail-item"><strong>Bid Security Declaration:</strong> {String(detailsData.bidSecurityDeclaration)}</div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Declaration File:</strong>
                    {detailsData.bidSecurityDeclarationFileName
                      ? detailsData.bidSecurityDeclarationFileName.split(",").map((fileName, index) => (
                          <div key={index}>
                            <a
                              href={`${baseURL}/file/view/Tender/${fileName.trim()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {fileName.trim()} (View)
                            </a>
                          </div>
                        ))
                      : "N/A"}
                  </div>
                </Col>
              </Row>
            </div>
          )}

          {/* MLL Status */}
          {detailsData.mllStatusDeclaration && (
            <div className="detail-section">
              <Typography.Title level={5} className="section-title">
                <ProjectOutlined /> Mll Status
              </Typography.Title>
              <Row gutter={24}>
                <Col span={12}>
                  <div className="detail-item"><strong>Mll Status Declaration:</strong> {String(detailsData.mllStatusDeclaration)}</div>
                </Col>
                <Col span={12}>
                  <div className="detail-item">
                    <strong>Declaration File:</strong>
                    {detailsData.mllStatusDeclarationFileName
                      ? detailsData.mllStatusDeclarationFileName.split(",").map((fileName, index) => (
                          <div key={index}>
                            <a
                              href={`${baseURL}/file/view/Tender/${fileName.trim()}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {fileName.trim()} (View)
                            </a>
                          </div>
                        ))
                      : "N/A"}
                  </div>
                </Col>
              </Row>
            </div>
          )}

          {/* Associated Indents */}
          {detailsData.indentResponseDTO && detailsData.indentResponseDTO.length > 0 && (
            <div className="detail-section">
              <Typography.Title level={5} className="section-title">
                <SolutionOutlined /> Associated Indents ({detailsData.indentResponseDTO.length})
              </Typography.Title>

              <div style={{ marginBottom: 16 }}>
                <strong>Indent IDs: </strong>
                {detailsData.indentResponseDTO.map((indent, index) => (
                  <Tag color="blue" key={indent.indentId} style={{ margin: "4px 4px" }}>
                    {indent.indentId || `Indent ${index + 1}`}
                  </Tag>
                ))}
              </div>

              <Collapse accordion defaultActiveKey={["0"]}>
                {detailsData.indentResponseDTO.map((indent, index) => (
                  <Collapse.Panel
                    key={index}
                    header={`Indent ${index + 1} - ${indent.indentId || "N/A"}`}
                    extra={<Tag color={indent.statusColor || "processing"}>{indent.status || "Pending"}</Tag>}
                  >
                    <div style={{ padding: "16px 0" }}>
                      <Row gutter={24}>
                        <Col span={12}>
                          <div className="detail-item"><strong>Project Name:</strong> {indent.projectName || "N/A"}</div>
                          <div className="detail-item"><strong>Indentor:</strong> {indent.indentorName || "N/A"}</div>
                          <div className="detail-item"><strong>Contact:</strong> {indent.indentorMobileNo || "N/A"}</div>
                        </Col>
                        <Col span={12}>
                          <div className="detail-item"><strong>Email:</strong> {indent.indentorEmailAddress || "N/A"}</div>
                          <div className="detail-item"><strong>Location:</strong> {indent.consignesLocation || "N/A"}</div>
                          <div className="detail-item"><strong>Total Value:</strong> ₹{indent.totalPriceOfAllMaterials?.toFixed(2) || "N/A"}</div>
                        </Col>
                      </Row>

                      {indent.isPreBidMeetingRequired && (
                        <div style={{ marginTop: 16 }}>
                          <Divider orientation="left" plain>Pre-Bid Meeting Details</Divider>
                          <Row gutter={24}>
                            <Col span={12}>
                              <div className="detail-item"><strong>Date:</strong> {indent.preBidMeetingDate || "N/A"}</div>
                            </Col>
                            <Col span={12}>
                              <div className="detail-item"><strong>Venue:</strong> {indent.preBidMeetingVenue || "N/A"}</div>
                            </Col>
                          </Row>
                        </div>
                      )}

                      <Divider orientation="left" plain>Material Requirements</Divider>

                      {indent.materialDetails?.length > 0 ? (
                        <Table
                          dataSource={indent.materialDetails}
                          pagination={false}
                          bordered
                          size="small"
                          rowKey="materialCode"
                          columns={[
                            { title: "Material Code", dataIndex: "materialCode", width: 120 },
                            { title: "Description", dataIndex: "materialDescription", ellipsis: true },
                            { title: "Quantity", dataIndex: "quantity", align: "right" },
                            { title: "Unit Price", dataIndex: "unitPrice", align: "right", render: text => `₹${text?.toFixed(2)}` },
                            { title: "Total Price", dataIndex: "totalPrice", align: "right", render: text => <strong>₹{text?.toFixed(2)}</strong> },
                            { title: "UOM", dataIndex: "uom", width: 100 },
                            { title: "Budget Code", dataIndex: "budgetCode", width: 120 },
                          ]}
                        />
                      ) : (
                        <div style={{ textAlign: "center", padding: 16 }}>
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No material details found" />
                        </div>
                      )}
                    </div>
                  </Collapse.Panel>
                ))}
              </Collapse>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin tip="Loading details..." size="large" />
        </div>
      )}
    </Modal>
  );
};

export default QueueModal;
