import {
  AccountBalance,
  AccountBalanceWallet,
  AddCircleOutline as AddCircleOutlineIcon,
  ChevronRight,
  Circle as CircleIcon,
  ExpandMore
} from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  Box,
  CircularProgress,
  Collapse,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import apiCalls from 'apicall';
import { jsPDF } from 'jspdf';
import { useEffect, useState } from 'react';
import ActionButton from 'utils/ActionButton';
import NoDataAvailable from 'utils/NoData';

const CoaTreeView = ({ toEdit, onAddGroup }) => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandAll, setExpandAll] = useState(false);
  const [orgId] = useState(localStorage.getItem('orgId'));

  useEffect(() => {
    getMapData();
  }, []);

  useEffect(() => {
    setExpandAll(true);
  }, [searchTerm]);

  const getMapData = async () => {
    try {
      const result = await apiCalls('get', `/master/getGroupLedgerexcelDetails?orgId=${orgId}`);
      if (result?.paramObjectsMap?.groupLedgerVO) {
        const transformedData = transformCOAData(result.paramObjectsMap.groupLedgerVO);
        setTreeData(transformedData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const transformCOAData = (coaData) => {
    const transformNode = (node) => ({
      id: node.mainGroupCode || node.subGroupCode || node.accountCode,
      name: node.mainGroupName || node.subGroupName || node.accountName,
      code: node.mainGroupCode || node.subGroupCode || node.accountCode,
      icon: node.mainGroupName ? (
        <AccountBalance />
      ) : node.subGroupName ? (
        <AccountBalanceWallet />
      ) : (
        <CircleIcon sx={{ fontSize: '11px' }} />
      ),
      children: node.subGroups ? node.subGroups.map(transformNode) : node.accounts ? node.accounts.map(transformNode) : null
    });

    return coaData.map(transformNode);
  };
  const filterTree = (nodes, term) => {
    if (!term) return nodes;

    return nodes
      .map((node) => {
        const nodeName = node.name ? node.name.toLowerCase() : '';
        const nodeCode = node.code ? node.code.toLowerCase() : '';

        if (nodeName.includes(term.toLowerCase()) || nodeCode.includes(term.toLowerCase())) {
          return node;
        }

        if (node.children) {
          const filteredChildren = filterTree(node.children, term);
          if (filteredChildren.length) {
            return { ...node, children: filteredChildren };
          }
        }

        return null;
      })
      .filter(Boolean);
  };

  const handleToggleExpandAll = () => {
    setExpandAll((prev) => !prev);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    let yOffset = 10;
    const pageHeight = doc.internal.pageSize.height - 10;

    const generatePdfContent = (nodes, level = 0) => {
      nodes.forEach((node) => {
        // Skip node if code or name is null or undefined
        if (!node.code || !node.name) return;

        const indent = ' '.repeat(level * 4);
        const text = `${indent}${node.code} - ${node.name}`;

        if (yOffset >= pageHeight) {
          doc.addPage();
          yOffset = 10;
        }

        doc.text(text, 10, yOffset);
        yOffset += 10;

        if (node.children && Array.isArray(node.children)) {
          generatePdfContent(node.children, level + 1);
        }
      });
    };

    doc.setFontSize(12);
    doc.text('COA Ledger Data', 10, yOffset);
    yOffset += 10;

    generatePdfContent(treeData || []);
    doc.save('COA_ledger_data.pdf');
  };

  const handleAddNode = (node) => {
    console.log('Add button clicked for:', node);
    onAddGroup(node);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setExpandAll(false);
  };

  const filteredData = filterTree(treeData, searchTerm);

  return (
    <Box sx={{ maxWidth: 550, backgroundColor: '#ffffff', borderRadius: 2, borderColor: '#90caf975' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={() => clearSearch()}>
                  <ClearIcon color="error" />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ flexGrow: 1, mr: 2 }}
        />

        <Box display="flex" alignItems="center">
          <Typography variant="body2" mr={1}>
            {expandAll ? 'Collapse All' : 'Expand All'}
          </Typography>
          <Switch checked={expandAll} onChange={handleToggleExpandAll} />
          <Tooltip title="Download PDF">
            <ActionButton icon={DownloadIcon} title="download" onClick={handleDownloadPdf} />
          </Tooltip>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (
        <TreeView data={filteredData} expandAll={expandAll} toEdit={toEdit} onAdd={handleAddNode} />
      )}
    </Box>
  );
};

const TreeView = ({ data, expandAll, toEdit, onAdd }) => {
  if (!data.length) {
    return <NoDataAvailable />;
  }

  return (
    <List>
      {data.map((node) => (
        <TreeItem key={node.id} node={node} expandAll={expandAll} toEdit={toEdit} onAdd={onAdd} />
      ))}
    </List>
  );
};

const TreeItem = ({ node, level = 0, expandAll, toEdit, onAdd }) => {
  const [expanded, setExpanded] = useState(expandAll);

  useEffect(() => {
    setExpanded(expandAll);
  }, [expandAll]);

  const toggleExpand = () => setExpanded(!expanded);

  const handleItemClick = (event) => {
    event.stopPropagation(); // Prevents accidental toggle when clicking the text
    if (toEdit) {
      toEdit(node.id);
    }
  };

  return (
    <>
      <ListItem button onClick={toggleExpand} sx={{ pl: level * 3 }}>
        <ListItemIcon>{node.icon}</ListItemIcon>
        <ListItemText
          primary={
            <Typography>
              <span style={{ cursor: 'pointer', color: 'blue', fontWeight: 'bold' }} onClick={handleItemClick}>
                {node.code}
              </span>
              {' - '}
              {node.name}
            </Typography>
          }
        />

        {node.children && (
          <Box display="flex" alignItems="center">
            <IconButton size="small" onClick={() => onAdd(node)}>
              <AddCircleOutlineIcon color="primary" />
            </IconButton>
            <IconButton size="small">{expanded ? <ExpandMore /> : <ChevronRight />}</IconButton>
          </Box>
        )}
      </ListItem>
      {node.children && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List disablePadding>
            {node.children.map((child) => (
              <TreeItem key={child.id} node={child} level={level + 1} expandAll={expandAll} toEdit={toEdit} onAdd={onAdd} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default CoaTreeView;
