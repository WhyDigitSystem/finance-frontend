import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { FormControl, TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip
} from '@mui/material';

import apiCalls from 'apicall';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { showToast } from 'utils/toast-component';

const Sendemail = () => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.68.119:8053';

  const [loading, setLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [formData, setFormData] = useState({ bccEmail: '' });
  const [formDataErrors, setFormDataErrors] = useState({});

  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchText, setSearchText] = useState('');

  const allSelected = selected.length === rows.length && rows.length > 0;
  const someSelected = selected.length > 0 && !allSelected;

  useEffect(() => {
    const getAllData = async () => {
      try {
        const res = await apiCalls('get', '/mail');
        const rowsWithId = (Array.isArray(res) ? res : []).map((row, idx) => ({
          ...row,
          id: row.id ?? `row-${idx}`
        }));
        setRows(rowsWithId);
      } catch (error) {
        console.error('Error fetching data:', error);
        setRows([]);
        showToast('Error fetching mail data');
      }
    };
    getAllData();
  }, []);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(rows.map((row) => row.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((rowId) => rowId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const filteredRows = rows.filter(
    (row) =>
      row.employeeCode?.toLowerCase().includes(searchText.toLowerCase()) || row.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'bccEmail') {
      if (!/^[a-z0-9._%+-]+@gmail\.com$/i.test(value)) {
        setFormDataErrors({
          ...formDataErrors,
          bccEmail: 'Invalid Gmail format'
        });
      } else {
        setFormDataErrors({
          ...formDataErrors,
          bccEmail: ''
        });
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const getPDF = (pdfFileName) => {
    if (!pdfFileName) {
      showToast('PDF filename is missing');
      return;
    }
    window.open(`${API_URL}/api/mail/download/${pdfFileName}`, '_blank');
  };

  const getView = async (filename) => {
    if (!filename) {
      showToast('Filename missing for preview');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/mail/content/${filename}`);
      setPreviewContent(response.data);
      setPreviewFile(filename);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error previewing file:', error);
      showToast('Failed to load document content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex">
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                placeholder="Search by employee code or email"
                size="small"
                value={searchText}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>
          </div>
          <div className="col-md-3 mb-3">
            <FormControl fullWidth variant="filled">
              <TextField
                id="bccEmail"
                label="BCC Email Address"
                size="small"
                name="bccEmail"
                placeholder="(example: user@gmail.com)"
                value={formData.bccEmail}
                onChange={handleInputChange}
                error={!!formDataErrors.bccEmail}
                helperText={formDataErrors.bccEmail}
              />
            </FormControl>
          </div>
        </div>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 400,
            overflow: 'auto'
          }}
        >
          <Table>
            <TableHead stickyHeader>
              <TableRow sx={{ backgroundColor: '#673AB7' }}>
                <TableCell padding="checkbox">
                  <Checkbox indeterminate={someSelected} checked={allSelected} onChange={handleSelectAll} sx={{ color: 'white' }} />
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>#</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Emp Code</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelectOne(row.id)} />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.employeeCode}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <Tooltip title="View Details" arrow>
                      <IconButton
                        sx={{
                          '&:hover': { backgroundColor: 'black' },
                          color: '#673AB7',
                          fontSize: 25,
                          '&:hover': { color: 'black' },
                          transform: 'scale(1.2)',
                          transition: 'transform 0.2s ease-in-out'
                        }}
                        onClick={() => getView(row.textFileName)}
                      >
                        <RemoveRedEyeOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download PDF" arrow>
                      <IconButton
                        sx={{
                          '&:hover': { backgroundColor: 'black' },
                          color: '#673AB7',
                          fontSize: 25,
                          '&:hover': { color: 'black' },
                          transform: 'scale(1.2)',
                          transition: 'transform 0.2s ease-in-out'
                        }}
                        onClick={() => getPDF(row.pdfFileName)}
                      >
                        <PictureAsPdfOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={isModalVisible} onClose={() => setIsModalVisible(false)} maxWidth="md" fullWidth>
          <DialogTitle>Preview{previewFile}</DialogTitle>
          <DialogContent dividers style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', maxHeight: 400, overflowY: 'auto' }}>
            {loading ? 'Loading...' : previewContent || 'No content to display'}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalVisible(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Sendemail;
