import { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Paper
} from '@mui/material';
import {
  Clear as ClearIcon,
  Upload as UploadIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Language as LanguageIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateRight as RotateIcon,
  Settings as SettingsIcon,
  ImageSearch as ImageSearchIcon
} from '@mui/icons-material';

const OCR = () => {
  const [open, setOpen] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [language, setLanguage] = useState('eng');
  const [showSettings, setShowSettings] = useState(false);
  const [enhanceMode, setEnhanceMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleClose = () => setOpen(false);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const resultRef = useRef(null);

  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'fra', name: 'French' },
    { code: 'spa', name: 'Spanish' },
    { code: 'deu', name: 'German' },
    { code: 'ita', name: 'Italian' },
    { code: 'por', name: 'Portuguese' },
    { code: 'rus', name: 'Russian' },
    { code: 'chi_sim', name: 'Chinese (Simplified)' },
    { code: 'jpn', name: 'Japanese' },
    { code: 'kor', name: 'Korean' }
  ];

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setOcrResult('');
      setZoom(1);
      setRotation(0);
    } else {
      showNotification('Please upload a valid image file!', 'error');
    }
  };

  const handleExtractText = () => {
    if (!selectedImage) {
      showNotification('Please upload an image first!', 'warning');
      return;
    }

    setLoading(true);
    setProgress(0);
    setStatus('Initializing OCR...');

    const reader = new FileReader();
    reader.onload = () => {
      Tesseract.recognize(reader.result, language, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
          setStatus(m.status);
        },
        // Add more options for enhanced mode
        ...(enhanceMode && {
          tessedit_pageseg_mode: 6, // Assume a single uniform block of text
          tessedit_ocr_engine_mode: 1, // LSTM only
          preserve_interword_spaces: 1 // Preserve spaces
        })
      })
        .then(({ data: { text } }) => {
          setOcrResult(text.trim());
          showNotification('Text extracted successfully!', 'success');
        })
        .catch((err) => {
          console.error(err);
          showNotification('Error processing the image. Please try again.', 'error');
        })
        .finally(() => {
          setLoading(false);
          setProgress(0);
          setStatus('');
        });
    };
    reader.readAsDataURL(selectedImage);
  };

  const handleClearResult = () => {
    setOcrResult('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setZoom(1);
    setRotation(0);
  };

  const handleCopyText = () => {
    navigator.clipboard
      .writeText(ocrResult)
      .then(() => showNotification('Text copied to clipboard!', 'success'))
      .catch(() => showNotification('Failed to copy text', 'error'));
  };

  const handleDownloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([ocrResult], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'extracted-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    // <Box
    //   sx={{
    //     minHeight: '100vh',
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: 'background.default',
    //     p: 2,
    //     background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    //   }}
    // >
    // <Dialog open={open} onClose={handleClose}>
    <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
      <Card
        sx={{
          width: '100%',
          maxWidth: '1200px',
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            backgroundColor: '#673ab7',
            color: 'primary.contrastText',
            pl: 2,
            pt: 0.5,
            pb: 0.5,
            pr: 1.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h5" component="h1" color="white">
            <ImageSearchIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'white' }} />
            OCR Text Extractor
          </Typography>
          <Tooltip title="Settings">
            <IconButton color="inherit" onClick={() => setShowSettings(!showSettings)}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {showSettings && (
          <Paper sx={{ p: 2, m: 2, backgroundColor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              OCR Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={language}
                    label="Language"
                    onChange={(e) => setLanguage(e.target.value)}
                    startAdornment={<LanguageIcon sx={{ mr: 1 }} />}
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Switch checked={enhanceMode} onChange={(e) => setEnhanceMode(e.target.checked)} color="primary" />}
                  label="Enhanced Mode"
                  sx={{ mt: 1 }}
                />
                <Tooltip title="Enhances accuracy for clear documents but may be slower">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <Typography variant="caption">?</Typography>
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Paper>
        )}

        <CardContent>
          <Grid container spacing={3}>
            {/* Image Upload Section */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  minHeight: '300px',
                  backgroundColor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 2,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {selectedImage ? (
                  <>
                    <Box
                      ref={imageRef}
                      sx={{
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        transition: 'transform 0.3s ease',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Uploaded"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '250px',
                          objectFit: 'contain',
                          cursor: 'zoom-in'
                        }}
                        onClick={() => window.open(URL.createObjectURL(selectedImage), '_blank')}
                      />
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        display: 'flex',
                        gap: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRadius: 2,
                        p: 1
                      }}
                    >
                      <Tooltip title="Zoom In">
                        <IconButton onClick={handleZoomIn} color="inherit" size="small">
                          <ZoomInIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Zoom Out">
                        <IconButton onClick={handleZoomOut} color="inherit" size="small">
                          <ZoomOutIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rotate">
                        <IconButton onClick={handleRotate} color="inherit" size="small">
                          <RotateIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </>
                ) : (
                  <>
                    <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography color="textSecondary" align="center" gutterBottom>
                      Drag & drop an image here, or click to browse
                    </Typography>
                    <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                      Select Image
                      <input type="file" hidden onChange={handleImageChange} accept="image/*" ref={fileInputRef} />
                    </Button>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                      Supports JPG, PNG, BMP, TIFF
                    </Typography>
                  </>
                )}
              </Box>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleExtractText}
                  disabled={loading || !selectedImage}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{ flex: 1 }}
                >
                  {loading ? 'Extracting...' : 'Extract Text'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClearResult}
                  disabled={!selectedImage && !ocrResult}
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
              </Box>

              {loading && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Status: {status}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress variant="determinate" value={progress} />
                    <Typography variant="body2" color="text.secondary">
                      {progress}% complete
                    </Typography>
                  </Box>
                </Box>
              )}
            </Grid>

            {/* OCR Results Section */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  minHeight: '300px',
                  backgroundColor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 0,
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    backgroundColor: '#673ab7',
                    color: 'primary.contrastText',
                    p: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant="subtitle1" color="white">
                    Extracted Text
                  </Typography>
                  {ocrResult && (
                    <Box>
                      <Tooltip title="Copy Text">
                        <IconButton size="small" color="inherit" onClick={handleCopyText}>
                          <CopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Text">
                        <IconButton size="small" color="inherit" onClick={handleDownloadText}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                <Box sx={{ p: 2, flex: 1, overflow: 'auto' }} ref={resultRef}>
                  {ocrResult ? (
                    <TextField
                      multiline
                      fullWidth
                      value={ocrResult}
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                        style: {
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: '0.875rem'
                        }
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '100%',
                          alignItems: 'flex-start'
                        },
                        height: '100%'
                      }}
                      minRows={10}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      <Typography variant="body1" gutterBottom>
                        {selectedImage ? "Click 'Extract Text' to process the image" : 'Upload an image to extract text'}
                      </Typography>
                      <Chip
                        icon={<LanguageIcon />}
                        label={`Selected Language: ${languages.find((l) => l.code === language)?.name || language}`}
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ my: 1 }} />

        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Powered by Tesseract.js v{Tesseract.version}
          </Typography>
        </CardActions>
      </Card>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
      {/* </Box> */}
    </div>
  );
};

export default OCR;
