import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ActionButton from 'utils/ActionButton';
import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import { RiAiGenerate } from 'react-icons/ri';
import { showToast } from 'utils/toast-component';
import { ToastContainer } from 'react-toastify';
import { FormControl, TextField, FormControlLabel, Checkbox } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const QRbargroup = () => {
  const defaultValues = {
    docNo: '',
    docDate: dayjs(),
    entryNo: '',
    count: ''
  };
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    defaultValues
  });
  const [selectedOption, setSelectedOption] = useState('bar');
  const handleCheckboxChange = (option) => {
    setSelectedOption(option);
  };
  const handleClear = () => {
    reset();
    setSelectedOption('bar');
  };
  return (
    <>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
          <div className="d-flex flex-wrap justify-content-end mb-2" style={{ marginBottom: '20px' }}>
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="Save" icon={SaveIcon} />
            <ActionButton title="Generate" icon={RiAiGenerate} />
          </div>
        </div>
        {/*  */}
        <div className="row d-flex">
          <div className="col-md-3 mb-3">
            <FormControl fullWidth>
              <TextField
                id="docNo"
                label="Doc No"
                size="small"
                name="docNo"
                {...register('docNo', {
                  required: 'Doc No is required'
                })}
                error={!!errors.docNo}
                helperText={errors.docNo?.message}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="docDate"
                  control={control}
                  rules={{ required: 'Doc Date is required' }}
                  render={({ field }) => (
                    <DatePicker
                      label="Doc Date"
                      value={field.value}
                      onChange={(newValue) => field.onChange(newValue)}
                      inputFormat="DD-MM-YYYY"
                      renderInput={(params) => (
                        <TextField {...params} size="small" error={!!errors.docDate} helperText={errors.docDate?.message} />
                      )}
                    />
                  )}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth>
              <TextField
                id="entryNo"
                label="Entry No"
                size="small"
                name="entryNo"
                {...register('entryNo', {
                  required: 'Entry No is required',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Entry No must be a number'
                  }
                })}
                error={!!errors.entryNo}
                helperText={errors.entryNo?.message}
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
                {...register('count', {
                  required: 'Count is required',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Entry No must be a number'
                  }
                })}
                error={!!errors.count}
                helperText={errors.count?.message}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControlLabel
              control={<Checkbox checked={selectedOption === 'bar'} onChange={() => handleCheckboxChange('bar')} color="secondary" />}
              label="Generate Bar Code"
            />
          </div>
          <div className="col-md-3 mb-3">
            <FormControlLabel
              control={<Checkbox checked={selectedOption === 'qr'} onChange={() => handleCheckboxChange('qr')} color="secondary" />}
              label="Generate QR Code"
            />
          </div>
          <div className="col-md-3 mb-3">
            <FormControlLabel
              control={<Checkbox checked={selectedOption === 'both'} onChange={() => handleCheckboxChange('both')} color="secondary" />}
              label="Generate QR & Bar Code"
            />
          </div>
        </div>
        {/*  */}
      </div>
    </>
  );
};
export default QRbargroup;

// import React, { useState } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import ActionButton from 'utils/ActionButton';
// import ClearIcon from '@mui/icons-material/Clear';
// import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
// import SaveIcon from '@mui/icons-material/Save';
// import { RiAiGenerate } from 'react-icons/ri';
// import { showToast } from 'utils/toast-component';
// import { ToastContainer } from 'react-toastify';
// import { FormControl, TextField, FormControlLabel, Checkbox } from '@mui/material';
// import dayjs from 'dayjs';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// // QR & Barcode Libraries
// import QRCode from 'qrcode.react';
// import Barcode from 'react-barcode';

// const QRbargroup = () => {
//   const defaultValues = {
//     docNo: '',
//     docDate: dayjs(),
//     entryNo: '',
//     count: ''
//   };
//   const {
//     register,
//     reset,
//     control,
//     formState: { errors }
//   } = useForm({
//     mode: 'onChange',
//     defaultValues
//   });

//   const [selectedOption, setSelectedOption] = useState('bar');
//   const [generatedCodes, setGeneratedCodes] = useState([]);

//   const handleCheckboxChange = (option) => {
//     setSelectedOption(option);
//   };

//   const handleClear = () => {
//     reset();
//     setSelectedOption('bar');
//     setGeneratedCodes([]);
//   };

//   const handleGenerate = () => {
//     const formValues = control._formValues; // react-hook-form values
//     const codes = [];
//     for (let i = 1; i <= Number(formValues.count || 1); i++) {
//       const value = `${formValues.docNo}-${formValues.entryNo}-${i}`;
//       codes.push(value);
//     }
//     setGeneratedCodes(codes);
//     showToast('success', 'Codes generated successfully!');
//   };

//   return (
//     <>
//       <ToastContainer />
//       <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
//         <div className="row d-flex ml" style={{ marginBottom: '20px' }}>
//           <div className="d-flex flex-wrap justify-content-end mb-2" style={{ marginBottom: '20px' }}>
//             <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} />
//             <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
//             <ActionButton title="Save" icon={SaveIcon} />
//             <ActionButton title="Generate" icon={RiAiGenerate} onClick={handleGenerate} />
//           </div>
//         </div>

//         {/* Form Fields */}
//         <div className="row d-flex">
//           <div className="col-md-3 mb-3">
//             <FormControl fullWidth>
//               <TextField
//                 id="docNo"
//                 label="Doc No"
//                 size="small"
//                 {...register('docNo', { required: 'Doc No is required' })}
//                 error={!!errors.docNo}
//                 helperText={errors.docNo?.message}
//               />
//             </FormControl>
//           </div>
//           <div className="col-md-3 mb-3">
//             <FormControl fullWidth>
//               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <Controller
//                   name="docDate"
//                   control={control}
//                   rules={{ required: 'Doc Date is required' }}
//                   render={({ field }) => (
//                     <DatePicker
//                       label="Doc Date"
//                       value={field.value}
//                       onChange={(newValue) => field.onChange(newValue)}
//                       renderInput={(params) => (
//                         <TextField {...params} size="small" error={!!errors.docDate} helperText={errors.docDate?.message} />
//                       )}
//                     />
//                   )}
//                 />
//               </LocalizationProvider>
//             </FormControl>
//           </div>
//           <div className="col-md-3 mb-3">
//             <FormControl fullWidth>
//               <TextField
//                 id="entryNo"
//                 label="Entry No"
//                 size="small"
//                 {...register('entryNo', {
//                   required: 'Entry No is required',
//                   pattern: { value: /^[0-9]+$/, message: 'Entry No must be a number' }
//                 })}
//                 error={!!errors.entryNo}
//                 helperText={errors.entryNo?.message}
//               />
//             </FormControl>
//           </div>
//           <div className="col-md-3 mb-3">
//             <FormControl fullWidth>
//               <TextField
//                 id="count"
//                 label="Count"
//                 size="small"
//                 {...register('count', {
//                   required: 'Count is required',
//                   pattern: { value: /^[0-9]+$/, message: 'Count must be a number' }
//                 })}
//                 error={!!errors.count}
//                 helperText={errors.count?.message}
//               />
//             </FormControl>
//           </div>

//           {/* Checkbox Options */}
//           <div className="col-md-3 mb-3">
//             <FormControlLabel
//               control={<Checkbox checked={selectedOption === 'bar'} onChange={() => handleCheckboxChange('bar')} color="secondary" />}
//               label="Generate Bar Code"
//             />
//           </div>
//           <div className="col-md-3 mb-3">
//             <FormControlLabel
//               control={<Checkbox checked={selectedOption === 'qr'} onChange={() => handleCheckboxChange('qr')} color="secondary" />}
//               label="Generate QR Code"
//             />
//           </div>
//           <div className="col-md-3 mb-3">
//             <FormControlLabel
//               control={<Checkbox checked={selectedOption === 'both'} onChange={() => handleCheckboxChange('both')} color="secondary" />}
//               label="Generate QR & Bar Code"
//             />
//           </div>
//         </div>

//         {/* Generated Codes Display */}
//         <div className="row mt-4">
//           {generatedCodes.map((code, index) => (
//             <div key={index} className="col-md-2 text-center mb-4">
//               {selectedOption === 'bar' && <Barcode value={code} width={1} height={60} displayValue />}
//               {selectedOption === 'qr' && <QRCode value={code} size={100} />}
//               {selectedOption === 'both' && (
//                 <>
//                   <QRCode value={code} size={100} />
//                   <Barcode value={code} width={1} height={60} displayValue />
//                 </>
//               )}
//               <div>{code}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default QRbargroup;
