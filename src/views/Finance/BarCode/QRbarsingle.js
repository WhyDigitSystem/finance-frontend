import React, { useState, useEffect } from 'react';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { RiAiGenerate } from 'react-icons/ri';
import apiCalls from 'apicall';
import { showToast } from 'utils/toast-component';
import { ToastContainer } from 'react-toastify';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import { jsPDF } from 'jspdf';
import 'svg2pdf.js';
import { QRCodeSVG } from 'qrcode.react';
import JsBarcode from 'jsbarcode';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl } from '@mui/material';
import Slide from '@mui/material/Slide';
const Transition = React.forwardRef(function Transition(props, ref) {
  return (
    <Slide
      direction="down"
      ref={ref}
      {...props}
      timeout={{
        appear: 1000,
        enter: 1000,
        exit: 1000
      }}
    />
  );
});
const QRBarSingle = () => {
  const [orgId] = useState(localStorage.getItem('orgId'));
  const [formData, setFormData] = useState({ barCode: '', count: '' });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({});
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [modalTableData, setModalTableData] = useState([]);

  const handleView = () => setListView(!listView);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError((prev) => ({ ...prev, [name]: '' }));
  };

  const handleClear = () => {
    setFormData({ barCode: '', count: '' });
    setError({});
  };

  const listViewColumns = [
    { accessorKey: 'qrBarCodeValue', header: 'Qr/BarCodeGenerator', size: 140 },
    { accessorKey: 'count', header: 'Count', size: 140 }
  ];

  const getAllQrBarCode = async () => {
    try {
      const response = await apiCalls('get', `/qrbarcode/getAllSingleQrBarCode`);
      setListViewData(response.data.paramObjectsMap.SingleQrBarCodeVO.reverse());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getAllQrBarCode();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    let errors = {};
    if (!formData.barCode) errors.barCode = 'BarCode is required';
    if (!formData.count) errors.count = 'Count is required';
    setError(errors);
    if (Object.keys(errors).length > 0) return;

    const sendData = {
      ...(editId && { id: editId }),
      qrBarCodeValue: formData.barCode,
      count: formData.count
    };

    try {
      const result = await apiCalls('put', '/qrbarcode/createUpdateSingleQrBarCode', sendData);
      if (result.status) {
        showToast('success', editId ? 'Updated Successfully' : 'Created Successfully');
        handleClear();
      } else {
        showToast('error', result.paramObjectsMap?.errorMessage || 'Creation failed');
      }
    } catch {
      showToast('error', 'API call failed');
    }
  };

  const getCountryById = async (row) => {
    setEditId(row.original.id);
    setListView(false);
    try {
      const response = await apiCalls('get', `/api/qrbarcode/getSingleQrBarCodeById?id=${row.original.id}`);
      if (response.status === true) {
        const item = response.data.paramObjectsMap.SingleQrBarCodeVO;
        setFormData({ barCode: item.qrBarCodeValue, count: item.count });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleGenerate = () => {
    const { barCode, count } = formData;
    if (!barCode || !count) {
      showToast('error', 'Please enter both BarCode and Count');
      return;
    }
    const data = Array.from({ length: Number(count) }, (_, i) => ({
      id: i,
      qrcodevalue: barCode,
      barcodevalue: barCode
    }));
    setModalTableData(data);
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        modalTableData.forEach((row, index) => {
          JsBarcode(`#barcode-${index}`, row.barcodevalue, {
            format: 'CODE128',
            width: 2,
            height: 40,
            displayValue: true
          });
        });
      }, 0);
    }
  }, [modalTableData, open]);

  const handleGenerateClose = () => setOpen(false);

  const svgToPng = async (svgElement, scale = 4) => {
    return new Promise((resolve) => {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale; // Higher DPI
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png', 1.0)); // Max quality
      };
      img.src = url;
    });
  };

  const handlePrint = async () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);

    // Title with background (centered)
    const pageWidth = pdf.internal.pageSize.getWidth();
    const title = 'Generated Codes';
    const textWidth = pdf.getTextWidth(title);
    const titleX = (pageWidth - textWidth) / 2;
    const titleY = 15;

    // Simulate rounded rect for background
    pdf.setFillColor(103, 58, 183); // Purple background
    const radius = 2;
    pdf.roundedRect(titleX - 4, titleY - 7, textWidth + 8, 10, radius, radius, 'F');

    pdf.setTextColor(255, 255, 255); // White text
    pdf.text(title, pageWidth / 2, titleY, { align: 'center' });

    // Loop table rows
    for (let index = 0; index < modalTableData.length; index++) {
      const qrElement = document.querySelector(`#dialog-content tbody tr:nth-child(${index + 1}) td:first-child svg`);
      const barcodeElement = document.querySelector(`#barcode-${index}`);

      if (qrElement) {
        const qrPng = await svgToPng(qrElement, 4); // High DPI
        pdf.addImage(qrPng, 'PNG', 10, 25 + index * 50, 30, 30);
      }
      if (barcodeElement) {
        const bcPng = await svgToPng(barcodeElement, 4);
        pdf.addImage(bcPng, 'PNG', 50, 30 + index * 50, 100, 20);
      }
    }

    pdf.save('generated_codes.pdf');
    setOpen(false);
  };

  return (
    <>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
          <div className="d-flex flex-wrap justify-content-end mb-2" style={{ marginBottom: '20px' }}>
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
            <ActionButton title="Generate" icon={RiAiGenerate} onClick={handleGenerate} />
          </div>
        </div>

        {listView ? (
          <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getCountryById} />
        ) : (
          <div className="row d-flex">
            <div className="col-md-3 mb-3">
              <FormControl fullWidth>
                <TextField
                  id="qrcode"
                  label="Qr/Bar Code Generator"
                  size="small"
                  name="barCode"
                  value={formData.barCode}
                  onChange={handleInputChange}
                  error={!!error.barCode}
                  helperText={error.barCode}
                />
              </FormControl>
            </div>
            <div className="col-md-3 mb-3">
              <FormControl fullWidth>
                <TextField
                  id="count"
                  label="Count"
                  size="small"
                  name="count"
                  value={formData.count}
                  onChange={handleInputChange}
                  type="number"
                  error={!!error.count}
                  helperText={error.count}
                />
              </FormControl>
            </div>
          </div>
        )}

        {open && (
          <Dialog open={open} maxWidth="md" fullWidth onClose={handleGenerateClose} TransitionComponent={Transition}>
            <DialogTitle>Generated Codes</DialogTitle>
            <DialogContent>
              <div id="dialog-content">
                <table className="table table-bordered">
                  <thead>
                    <tr style={{ backgroundColor: '#673AB7', color: '#fff' }}>
                      <th style={{ textAlign: 'center' }}>QrCode Value</th>
                      <th style={{ textAlign: 'center' }}>BarCode Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalTableData.map((row, index) => (
                      <tr key={row.id}>
                        <td className="text-center">
                          <QRCodeSVG value={row.qrcodevalue} size={64} />
                        </td>
                        <td className="text-center">
                          <svg id={`barcode-${index}`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleGenerateClose} sx={{ color: '#673AB7' }}>
                Close
              </Button>
              <Button onClick={handlePrint} variant="contained" sx={{ backgroundColor: '#673AB7' }}>
                Print
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default QRBarSingle;
