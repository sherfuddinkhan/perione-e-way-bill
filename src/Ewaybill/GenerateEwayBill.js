import React, { useState } from 'react';

// --- Pure Helper / Presentation Components ---

const FormField = ({ label, name, value, onChange, type = "text", placeholder = "", uppercase = false }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={`w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none ${uppercase ? 'uppercase font-mono' : ''}`}
    />
  </div>
);

const AddressGroup = ({ title, prefix, data, onChange }) => (
  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
    <h3 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wide">{title}</h3>
    <div className="space-y-3">
      <FormField label="GSTIN" name={`${prefix}Gstin`} value={data[`${prefix}Gstin`]} onChange={onChange} />
      <FormField label="Trade Name" name={`${prefix}TrdName`} value={data[`${prefix}TrdName`]} onChange={onChange} />
      <FormField label="Address Line 1" name={`${prefix}Addr1`} value={data[`${prefix}Addr1`]} onChange={onChange} />
      <div className="grid grid-cols-2 gap-2">
        <FormField label="Place" name={`${prefix}Place`} value={data[`${prefix}Place`]} onChange={onChange} />
        <FormField label="Pincode" name={`${prefix}Pincode`} value={data[`${prefix}Pincode`]} onChange={onChange} type="number" />
      </div>
    </div>
  </div>
);

const SuccessModal = ({ result }) => {
  const { ewayBillNo, ewayBillDate, validUpto } = result.data;
  return (
    <div className="border-t border-emerald-200 bg-emerald-50/50 p-8">
      <div className="bg-white border border-emerald-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 text-emerald-600 mb-4">
          <span className="text-2xl">🎉</span>
          <h3 className="text-lg font-bold">E-Way Bill Generated Successfully!</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-lg border">
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold block">E-Way Bill No</span>
            <span className="text-lg font-mono font-bold text-slate-800">{ewayBillNo}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold block">Generated Date</span>
            <span className="text-sm font-medium text-slate-700">{ewayBillDate}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold block">Valid Until</span>
            <span className="text-sm font-medium text-emerald-700">{validUpto}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Initial Form State ---

const DEFAULT_PAYLOAD = {
  supplyType: "O",
  subSupplyType: "1",
  subSupplyDesc: "",
  docType: "INV",
  docNo: "Perione-1",
  docDate: "05/06/2026",
  fromGstin: "36AARFB4347G037",
  fromTrdName: "Welton",
  fromAddr1: "2ND CROSS NO 59 19 A",
  fromAddr2: "GROUND FLOOR OSBORNE ROAD",
  fromPlace: "Hyderabad",
  fromPincode: 500081,
  actFromStateCode: 36,
  fromStateCode: 36,
  toGstin: "36AAACR5055K1Z8",
  toTrdName: "Perione",
  toAddr1: "Madhapur",
  toAddr2: "HITEC City",
  toPlace: "Hyderabad",
  toPincode: 500081,
  actToStateCode: 36,
  toStateCode: 36,
  transactionType: 4,
  shipToGSTIN: "urp",
  shipToTradeName: "Perione",
  otherValue: 0,
  totalValue: 100,
  cgstValue: 2.5,
  sgstValue: 2.5,
  igstValue: 0,
  cessValue: 0,
  cessNonAdvolValue: 0,
  totInvValue: 105,
  mainHsnCode: 100610,
  transporterId: "36AARFB4347G037",
  transporterName: "Welton Logistics",
  transDocNo: "LR123456",
  transMode: "1",
  transDistance: "25",
  transDocDate: "05/06/2026",
  vehicleNo: "TS09AB1234",
  vehicleType: "R",
  itemList: [
    {
      productName: "Rice",
      productDesc: "Rice",
      hsnCode: 100610,
      quantity: 1,
      qtyUnit: "KGS",
      cgstRate: 2.5,
      sgstRate: 2.5,
      igstRate: 0,
      cessRate: 0,
      cessNonadvol: 0,
      taxableAmount: 100
    }
  ]
};

// --- Main Arrow Function Component ---

const GenerateEwayBill = () => {
  const [formData, setFormData] = useState(DEFAULT_PAYLOAD);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // State Change Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(value) || value === '' ? value : Number(value)
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.itemList];
    updatedItems[index][field] = isNaN(value) || value === '' ? value : Number(value);
    setFormData((prev) => ({ ...prev, itemList: updatedItems }));
  };

  // Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('http://localhost:5000/api/generate-ewaybill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok && result.status_cd === "1") {
        setResponse(result);
      } else {
        setError(result.status_desc || result.message || 'E-Way Bill Generation Failed');
      }
    } catch (err) {
      setError('Server unreachable. Make sure the Node backend is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <header className="bg-slate-900 text-white px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Generate E-Way Bill</h1>
            <p className="text-slate-400 text-sm mt-1">Perione Portal Integration</p>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold uppercase">
            Sandbox Environment
          </span>
        </header>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Document Section */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Document Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField label="Doc Type" name="docType" value={formData.docType} onChange={handleInputChange} />
              <FormField label="Doc No" name="docNo" value={formData.docNo} onChange={handleInputChange} />
              <FormField label="Doc Date" name="docDate" value={formData.docDate} onChange={handleInputChange} />
              <FormField label="Transaction Type" name="transactionType" value={formData.transactionType} onChange={handleInputChange} type="number" />
            </div>
          </section>

          {/* Supplier & Recipient Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AddressGroup title="From (Supplier)" prefix="from" data={formData} onChange={handleInputChange} />
            <AddressGroup title="To (Recipient)" prefix="to" data={formData} onChange={handleInputChange} />
          </div>

          {/* Items Section */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Item Details</h2>
            {formData.itemList.map((item, idx) => (
              <div key={idx} className="grid grid-cols-2 md:grid-cols-6 gap-3 bg-slate-50 p-4 rounded-xl border mb-2">
                <div className="col-span-2">
                  <FormField label="Product" name="productName" value={item.productName} onChange={(e) => handleItemChange(idx, 'productName', e.target.value)} />
                </div>
                <FormField label="HSN Code" name="hsnCode" value={item.hsnCode} onChange={(e) => handleItemChange(idx, 'hsnCode', e.target.value)} type="number" />
                <FormField label="Qty" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)} type="number" />
                <FormField label="CGST Rate" name="cgstRate" value={item.cgstRate} onChange={(e) => handleItemChange(idx, 'cgstRate', e.target.value)} type="number" />
                <FormField label="Taxable Amt" name="taxableAmount" value={item.taxableAmount} onChange={(e) => handleItemChange(idx, 'taxableAmount', e.target.value)} type="number" />
              </div>
            ))}
          </section>

          {/* Logistics Section */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Transportation Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField label="Transporter Name" name="transporterName" value={formData.transporterName} onChange={handleInputChange} />
              <FormField label="Vehicle No" name="vehicleNo" value={formData.vehicleNo} onChange={handleInputChange} uppercase />
              <FormField label="Distance (KM)" name="transDistance" value={formData.transDistance} onChange={handleInputChange} />
              <FormField label="Trans Doc No" name="transDocNo" value={formData.transDocNo} onChange={handleInputChange} />
            </div>
          </section>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Submitting Request...' : 'Generate E-Way Bill'}
            </button>
          </div>
        </form>

        {/* Display Success Response */}
        {response && <SuccessModal result={response} />}

      </div>
    </div>
  );
};

export default GenerateEwayBill;