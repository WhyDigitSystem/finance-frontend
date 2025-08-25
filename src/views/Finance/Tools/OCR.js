import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
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
  ImageSearch as ImageSearchIcon,
  Settings as SettingsIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateRight as RotateIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const OCR = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // image or PDF
  const [ocrResult, setOcrResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [language, setLanguage] = useState('eng');
  const [showSettings, setShowSettings] = useState(false);
  const [enhanceMode, setEnhanceMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef(null);

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

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setSelectedFile(file);
      setOcrResult('');
      setZoom(1);
      setRotation(0);
    } else {
      showNotification('Please upload a valid image or PDF file!', 'error');
    }
  };

  const handleClearResult = () => {
    setOcrResult('');
    setSelectedFile(null);
    window.speechSynthesis.cancel();
    if (fileInputRef.current) fileInputRef.current.value = '';
    setProgress(0);
    setStatus('');
    setZoom(1);
    setRotation(0);
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

  // const handleSpeakText = () => {
  //   if (!ocrResult) {
  //     showNotification('No text available to read', 'error');
  //     return;
  //   }

  //   // If already speaking → stop it
  //   if (window.speechSynthesis.speaking) {
  //     window.speechSynthesis.cancel();
  //     setIsSpeaking(false);
  //     showNotification('Stopped', 'info');
  //     return;
  //   }

  //   // Otherwise → start speaking
  //   const speech = new SpeechSynthesisUtterance(ocrResult);
  //   speech.lang = 'en-US'; // use "ta-IN" for Tamil
  //   speech.onend = () => setIsSpeaking(false);
  //   window.speechSynthesis.speak(speech);
  //   setIsSpeaking(true);
  //   showNotification('Reading Text', 'success');
  // };

  // handleSpeakText
  // Map OCR language codes to SpeechSynthesis language codes
  const speechLangMap = {
    eng: 'en-US', // English
    fra: 'fr-FR', // French
    spa: 'es-ES', // Spanish
    deu: 'de-DE', // German
    ita: 'it-IT', // Italian
    por: 'pt-PT', // Portuguese
    rus: 'ru-RU', // Russian
    chi_sim: 'zh-CN', // Chinese Simplified
    jpn: 'ja-JP', // Japanese
    kor: 'ko-KR' // Korean
  };

  const handleSpeakText = () => {
    if (!ocrResult) {
      showNotification('No text available to read', 'error');
      return;
    }

    // Stop ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      showNotification('Stopped', 'info');
      return;
    }

    const speechLang = speechLangMap[language] || 'en-US';
    const speech = new SpeechSynthesisUtterance(ocrResult);
    speech.lang = speechLang;
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    // ✅ Find a voice that matches the language
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang === speechLang);

    if (matchedVoice) {
      speech.voice = matchedVoice;
    } else {
      showNotification(`No voice found for ${speechLang}. Using default.`, 'warning');
    }

    speech.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
    showNotification(`Reading text in ${speechLang}`, 'success');
  };

  //

  const handleExtractText = async () => {
    if (!selectedFile) {
      showNotification('Please upload a file first!', 'warning');
      return;
    }

    setLoading(true);
    setProgress(0);
    setStatus('Initializing OCR...');
    let extractedText = '';

    try {
      if (selectedFile.type.startsWith('image/')) {
        // Image OCR
        const reader = new FileReader();
        reader.onload = async () => {
          const {
            data: { text }
          } = await Tesseract.recognize(reader.result, language, {
            logger: (m) => {
              if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100));
              setStatus(m.status);
            },
            ...(enhanceMode && { tessedit_pageseg_mode: 6, tessedit_ocr_engine_mode: 1, preserve_interword_spaces: 1 })
          });
          setOcrResult(text.trim());
          showNotification('Text extracted successfully!', 'success');
          setLoading(false);
        };
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type === 'application/pdf') {
        // PDF OCR
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;

          const imgData = canvas.toDataURL('image/png');
          const {
            data: { text }
          } = await Tesseract.recognize(imgData, language, {
            logger: (m) => {
              if (m.status === 'recognizing text') {
                const pageProgress = Math.round((m.progress / pdf.numPages + (i - 1) / pdf.numPages) * 100);
                setProgress(pageProgress);
              }
              setStatus(`Page ${i}/${pdf.numPages}: ${m.status}`);
            },
            ...(enhanceMode && { tessedit_pageseg_mode: 6, tessedit_ocr_engine_mode: 1, preserve_interword_spaces: 1 })
          });
          extractedText += text + '\n\n';
        }
        setOcrResult(extractedText.trim());
        showNotification('Text extracted from PDF successfully!', 'success');
        setLoading(false);
        setProgress(100);
        setStatus('Completed');
      }
    } catch (error) {
      console.error(error);
      showNotification('Error extracting text. Please try again.', 'error');
      setLoading(false);
    }
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    if (selectedFile.type === 'application/pdf') {
      return (
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <PdfIcon sx={{ fontSize: 48, color: 'error.main' }} />
          <Typography variant="h6" sx={{ mt: 1 }}>
            {selectedFile.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            PDF Document
          </Typography>
        </Box>
      );
    } else if (selectedFile.type.startsWith('image/')) {
      return (
        <>
          <Box
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
              src={URL.createObjectURL(selectedFile)}
              alt="Uploaded"
              style={{
                maxWidth: '100%',
                maxHeight: '250px',
                objectFit: 'contain',
                cursor: 'zoom-in'
              }}
              onClick={() => window.open(URL.createObjectURL(selectedFile), '_blank')}
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
      );
    }
  };

  return (
    <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
      <Card sx={{ width: '100%', maxWidth: '1200px', borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
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
            <ImageSearchIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'white' }} /> OCR Text Extractor
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
                  <Select value={language} label="Language" onChange={(e) => setLanguage(e.target.value)}>
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
                />
              </Grid>
            </Grid>
          </Paper>
        )}

        <CardContent>
          <Grid container spacing={3}>
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
                {selectedFile ? (
                  renderFilePreview()
                ) : (
                  <>
                    <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography color="textSecondary" align="center" gutterBottom>
                      Drag & drop an image or PDF here, or click to browse
                    </Typography>
                    <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                      Select File
                      <input type="file" hidden onChange={handleFileChange} ref={fileInputRef} accept="image/*,application/pdf" />
                    </Button>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                      Supports JPG, PNG, PDF
                    </Typography>
                  </>
                )}
              </Box>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleExtractText}
                  disabled={loading || !selectedFile}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  sx={{ flex: 1 }}
                >
                  {loading ? 'Extracting...' : 'Extract Text'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClearResult}
                  disabled={!selectedFile && !ocrResult}
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
                      <Tooltip title="Voice">
                        <IconButton size="small" color="inherit" onClick={handleSpeakText}>
                          <VolumeUpIcon fontSize="small" style={{ color: isSpeaking ? 'red' : 'white' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    p: 2,
                    flex: 1,
                    overflow: 'auto'
                  }}
                >
                  {ocrResult ? (
                    <TextField
                      multiline
                      fullWidth
                      value={ocrResult}
                      variant="outlined"
                      InputProps={{ readOnly: true, style: { fontFamily: "'Roboto Mono', monospace", fontSize: '0.875rem' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          alignItems: 'flex-start',
                          overflow: 'auto',
                          '& fieldset': {
                            border: 'none' // remove the actual outline
                          }
                        },
                        height: '400px',
                        overflow: 'auto'
                      }}
                      // minRows={10}
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
                        {selectedFile ? "Click 'Extract Text' to process the file" : 'Upload a file to extract text'}
                      </Typography>
                      {selectedFile?.type === 'image' && (
                        <Chip
                          icon={<LanguageIcon />}
                          label={`Selected Language: ${languages.find((l) => l.code === language)?.name || language}`}
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                      )}
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
    </div>
  );
};

export default OCR;
