import React, { useState, useEffect } from "react";
import { Form, Input, Select, DatePicker, Button, Alert, Card, Typography } from "antd";
import dayjs from "dayjs";
import { useAuth } from "../../AuthContext";
const { Title } = Typography;
const { Option } = Select;

const UpdatePartBVehicleNumber = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-populate fields from localStorage safely
 useEffect(() => {
    try {
      const savedRaw = localStorage.getItem("ewayBillData");
      if (!savedRaw) return;

      const savedEwb = JSON.parse(savedRaw);

      // Check if ewaybill data exists in localStorage
      if (savedEwb.eWayBillNumber || savedEwb.ewayBillNo) {
        const formData = {
          ewbNo: savedEwb.eWayBillNumber || savedEwb.ewayBillNo || "",
          vehicleNo: savedEwb.vehicleNo || "",
          fromPlace: savedEwb.fromPlace || "",
          fromState: Number(savedEwb.fromState || 36),
          reasonCode: String(savedEwb.reasonCode || "1"),
          reasonRem: savedEwb.reasonRem || "First Time Update",
          transDocNo: savedEwb.transDocNo || "",
          transDocDate: savedEwb.transDocDate ? dayjs(savedEwb.transDocDate, "DD/MM/YYYY") : null,
          transMode: String(savedEwb.transMode || "1"),
        };

        // Use setFieldsValue followed by resetFields to ensure AntD updates inputs
        form.setFieldsValue(formData);
      }
    } catch (err) {
      console.error("Error reading from localStorage:", err);
    }
  }, [form]);
  const handleSubmit = async (values) => {
    setLoading(true);
    setResponse(null);
    setErrorMsg("");

    const payload = {
      ewbNo: String(values.ewbNo).trim(), // Retain string to avoid precision/leading-zero issues
      vehicleNo: values.vehicleNo?.trim(),
      fromPlace: values.fromPlace?.trim(),
      fromState: Number(values.fromState),
      reasonCode: values.reasonCode,
      reasonRem: values.reasonRem?.trim(),
      transDocNo: values.transDocNo?.trim(),
      transDocDate: values.transDocDate ? values.transDocDate.format("DD/MM/YYYY") : "",
      transMode: values.transMode,
    };

    try {
      const res = await fetch("http://localhost:5000/api/ewaybill/update-vehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           ConnectionType: connectionType,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status_cd === "1") {
        setResponse(data);
      } else {
        setErrorMsg(data.status_desc || "Failed to update vehicle information.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
      <Card
        title={
          <Title level={3} style={{ margin: 0, color: "#1A73E8" }}>
            Update Part-B / Vehicle Number
          </Title>
        }
        bordered={false}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)", borderRadius: 8 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            reasonCode: "1",
            transMode: "1",
            fromState: 36,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Form.Item
              label="E-Way Bill Number"
              name="ewbNo"
              rules={[
                { required: true, message: "Please enter EWB Number" },
                { pattern: /^\d{12}$/, message: "EWB Number must be 12 digits" },
              ]}
            >
              <Input placeholder="e.g. 171012148940" maxLength={12} />
            </Form.Item>

            <Form.Item
              label="Vehicle Number"
              name="vehicleNo"
              rules={[{ required: true, message: "Please enter Vehicle Number" }]}
            >
              <Input placeholder="e.g. TS09AB1231" />
            </Form.Item>

            <Form.Item
              label="From Place"
              name="fromPlace"
              rules={[{ required: true, message: "Please enter From Place" }]}
            >
              <Input placeholder="e.g. FRAZER TOWN" />
            </Form.Item>

            <Form.Item
              label="From State Code"
              name="fromState"
              rules={[{ required: true, message: "Please select State Code" }]}
            >
              <Select placeholder="Select State Code">
                <Option value={36}>36 - Telangana</Option>
                <Option value={27}>27 - Maharashtra</Option>
                <Option value={29}>29 - Karnataka</Option>
                <Option value={33}>33 - Tamil Nadu</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Reason Code"
              name="reasonCode"
              rules={[{ required: true, message: "Please select Reason Code" }]}
            >
              <Select>
                <Option value="1">1 - Vehicle Break Down</Option>
                <Option value="2">2 - Transporter Change</Option>
                <Option value="3">3 - First Time Update</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Reason Remark"
              name="reasonRem"
              rules={[{ required: true, message: "Please enter Reason Remark" }]}
            >
              <Input placeholder="e.g. Vehicle Break Down" />
            </Form.Item>

            <Form.Item
              label="Transport Document No."
              name="transDocNo"
              rules={[{ required: true, message: "Please enter Document Number" }]}
            >
              <Input placeholder="e.g. 12" />
            </Form.Item>

            <Form.Item
              label="Transport Document Date"
              name="transDocDate"
              rules={[{ required: true, message: "Please select Document Date" }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Transport Mode"
              name="transMode"
              rules={[{ required: true, message: "Please select Transport Mode" }]}
            >
              <Select>
                <Option value="1">1 - Road</Option>
                <Option value="2">2 - Rail</Option>
                <Option value="3">3 - Air</Option>
                <Option value="4">4 - Ship</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item style={{ marginTop: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              Update Vehicle Details
            </Button>
          </Form.Item>
        </Form>

        {errorMsg && (
          <Alert message="Error" description={errorMsg} type="error" showIcon style={{ marginTop: 16 }} />
        )}

        {response && (
          <Alert
            message="Vehicle Updated Successfully"
            description={
              <div>
                <p><strong>Status Code:</strong> {response.status_cd}</p>
                <p><strong>Status Description:</strong> {response.status_desc}</p>
                {response.data && (
                  <>
                    <p><strong>Vehicle Update Date:</strong> {response.data.vehUpdDate}</p>
                    <p><strong>Valid Upto:</strong> {response.data.validUpto}</p>
                  </>
                )}
              </div>
            }
            type="success"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </Card>
    </div>
  );
};

export default UpdatePartBVehicleNumber;