import React, { useState,useEffect } from 'react';
import { useAuth } from "../../AuthContext";
import axios from 'axios';
const ExtendValidityEwayBill = () => {
  const {
    authData,
    connectionType,
  } = useAuth();

const [formData, setFormData] = useState({
  ewbNo: "",
  vehicleNo: "",
  fromPlace: "",
  fromState: "",
  remainingDistance: "",
  transDocNo: "",
  transDocDate: "",
  transMode: "",
  transitType: "",
  extnRsnCode: "1",
  extnRemarks: "",
  fromPincode: "",
  consignmentStatus: "1",
});

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);


 useEffect(() => {
  try {
    const savedRaw = localStorage.getItem("ewayBillData");

    if (!savedRaw) return;

    const savedEwb = JSON.parse(savedRaw);

    setFormData((prev) => {

      const transMode =
        Number(
          savedEwb.transMode ||
          prev.transMode
        );

      return {
        ...prev,

        ewbNo: String(
          savedEwb.eWayBillNumber ||
          savedEwb.ewayBillNo ||
          prev.ewbNo
        ),

        vehicleNo:
          savedEwb.vehicleNo ||
          prev.vehicleNo,


        fromPlace:
          savedEwb.fromPlace ||
          prev.fromPlace,


        fromState: String(
          savedEwb.fromState ||
          prev.fromState
        ),


        remainingDistance: String(
          savedEwb.remainingDistance ||
          prev.remainingDistance
        ),


        transDocNo:
          savedEwb.transDocNo ||
          prev.transDocNo,


        transDocDate:
          savedEwb.transDocDate ||
          prev.transDocDate,


        transMode: String(
          transMode ||
          ""
        ),


        // Extend Validity Reason
        extnRsnCode: String(
          savedEwb.extnRsnCode ||
          prev.extnRsnCode ||
          "1"
        ),


        extnRemarks:
          savedEwb.extnRemarks ||
          prev.extnRemarks,



        // Transit Type only for In Transit (5)
        transitType:
          transMode === 5
            ? (
                savedEwb.transitType ||
                prev.transitType ||
                "R"
              )
            : "",



        fromPincode: String(
          savedEwb.fromPincode ||
          prev.fromPincode
        ),



        // M = Movement, T = Transit
        consignmentStatus:
          transMode === 5
            ? "T"
            : "M",

      };

    });


  } catch (error) {

    console.error(
      "Error reading ewayBillData:",
      error
    );

  }

}, []);



  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };



  const toNumber = (value, defaultValue = 0) => {

    if (
      value === "" ||
      value === null ||
      value === undefined
    ) {
      return defaultValue;
    }

    return Number(value);
  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setResponse(null);


    try {

const payload = {

  ewbNo: Number(formData.ewbNo),

  vehicleNo: formData.vehicleNo,

  fromPlace: formData.fromPlace,

  fromState: Number(formData.fromState),

  remainingDistance: Number(formData.remainingDistance),

  transDocNo: formData.transDocNo,

  transDocDate: formData.transDocDate,

  transMode: Number(formData.transMode),

  extnRsnCode: Number(formData.extnRsnCode),

  extnRemarks: formData.extnRemarks,

  fromPincode: Number(formData.fromPincode),


  // Dynamic based on transport mode
  consignmentStatus:
    Number(formData.transMode) === 5
      ? "T"
      : "M",


  transitType:
    Number(formData.transMode) === 5
      ? formData.transitType
      : "",

};

      console.log(
        "Payload Sent:",
        JSON.stringify(payload, null, 2)
      );



      const res = await axios.post(

        "https://einvoice.fcssoftwares.com/api/perione/extend-validity",

        payload,

        {

          params: {
            email: authData.email,
          },


          headers: {

            "Content-Type":
              "application/json",

            gstin:
              authData.gstin,

            client_id:
              authData.client_id,

            client_secret:
              authData.client_secret,

            ip_address:
              authData.ip_address,

            env:
              authData.env,

            ConnectionType:
              connectionType,
          },
        }

      );


      setResponse(res.data);


    } catch (error) {

      console.error(
        "Extend Validity Error:",
        error
      );


      setResponse(
        error.response?.data ||
        {
          error:
            error.message
        }
      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <div style={styles.container}>

      {/* Header */}

      <div style={styles.header}>

        <span style={styles.badge}>
          E-Way Bill
        </span>

        <h1 style={styles.title}>
          Extend Validity
        </h1>

        <p style={styles.subtitle}>
          Submit the form to extend the validity of an E-Way Bill
        </p>

      </div>



      {/* Form */}

      <form
        style={styles.form}
        onSubmit={handleSubmit}
      >

        {Object.keys(formData).map((key)=>(

          <div
            key={key}
            style={styles.fieldGroup}
          >

            <label style={styles.label}>
              {key}
            </label>


            <input

              type="text"

              name={key}

              value={formData[key]}

              onChange={handleChange}

              style={styles.input}

              required

            />

          </div>

        ))}



        <button

          type="submit"

          disabled={loading}

          style={{
            ...styles.button,

            ...(loading && {

              backgroundColor:"#94a3b8",

              cursor:"not-allowed"

            })

          }}

        >

          {
            loading
            ? "Submitting..."
            : "Extend Validity"
          }

        </button>


      </form>



      {/* Response */}

      {
        response && (

          <div style={styles.responseCard}>

            <div style={styles.responseHeader}>

              <span style={styles.statusBadge}>
                RESPONSE
              </span>


              <span style={styles.responseDesc}>
                API Response
              </span>


            </div>



            <pre style={styles.jsonViewer}>

              {
                JSON.stringify(
                  response,
                  null,
                  2
                )
              }

            </pre>


          </div>

        )
      }


    </div>

  );

};
const styles = {

  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px 25px",
    width: "100%",
  },


  fieldGroup: {
    display: "flex",
    flexDirection: "column",
  },


  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "6px",
  },


  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
  },


  button: {
    gridColumn: "1 / -1",
    width: "350px",
    justifySelf: "center",
    marginTop: "10px",
    padding: "14px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },


};
export default ExtendValidityEwayBill;