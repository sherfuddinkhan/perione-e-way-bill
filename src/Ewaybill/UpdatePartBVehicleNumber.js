import React, { useState } from "react";
import { Form, Input, Select, DatePicker, Button, Card, Alert, Typography, Spin } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

const UpdatePartBVehicleNumber = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (values) => {
    setLoading(true);
    setResponse(null);
    setErrorMsg("");

    const payload = {
      ewbNo: Number(values.ewbNo),
      vehicleNo: values.vehicleNo,
      fromPlace: values.fromPlace,
      fromState: Number(values.fromState),
      reasonCode: values.reasonCode,
      reasonRem: values.reasonRem,
      transDocNo: values.transDocNo,
      transDocDate: values.transDocDate ? values.transDocDate.format("DD/MM/YYYY") : "",
      transMode: values.transMode,
    };

    try {
      const res = await fetch("/api/ewaybill/update-vehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      setErrorMsg("Network error. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Card
        title={<Title level={3} style={{ margin: 0, color: "#1A73E8" }}>Update Part-B / Vehicle Number</Title>}
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
              rules={[{ required: true, message: "Please enter EWB Number" }]}
            >
              <Input placeholder="e.g. 171012148940" />
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