import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTheme, Box, ButtonBase, Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HaiIcon from '../../../../../src/assets/images/HAIIcon.png';
import { useWindowSize } from 'react-use'; // or your custom hook
import Confetti from 'react-confetti';
// import { getHaiCustomerDetails, getPartyLedgerPartyName, getHaiBranchCustomerDetails, getHaiInvCustomerDetails, getHaiCustomerRankDetails, getHaiProductSummary } from '../services/api';
import GaugeSpeedometer from './gaugeSpeedometer';
import SplitChart from './splitChart';
const getPowerEmoji = (index) => {
    const emojis = ["💫", "⚡", "🧠", "🔮", "💪", "🦅", "👻"];
    return emojis[index];
  };
const HaiSection = () => {
  const anchorRef = useRef(null);
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
    const powers = [
      {
        name: "Customer",
        description: "View and manage customer information",
        color: "#FF6B6B",
        type: "CUSTOMER",
      },
      {	
        name: "Vendor",
        description: "View and manage vendor information",
        color: "#4ECDC4",
        type: "VENDOR",
      },
      {
        name: "Product",
        description: "View and manage product information",
        color: "#45B7D1",
        type: "PRODUCT",
      },
      {
        name: "Employee",
        description: "View and manage employee information",
        color: "#96C93D",
        type: "EMPLOYEE",
      },
    ];
    const [currentPower, setCurrentPower] = useState(0);
    const [particles, setParticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [cusdata, setCusData] = useState([]);
    const [party, setParty] = useState("");
    const [ptype, setPtype] = useState("");
    const [partyNames, setPartyNames] = useState([]);
    const [showConfetti, setShowConfetti] = useState(true);
    const [selectedType, setSelectedType] = useState(powers[0].type);
    const [showDropdown, setShowDropdown] = useState(false);
    const [totalDue, setTotalDue] = useState(0); // Initialize with 0
    const [selectedParty, setSelectedParty] = useState(null); // Track the selected party
    const [filteredParties, setFilteredParties] = useState([]);
    const [invdata, setInvData] = useState([]);
    const [rankinvdata, setRankInvData] = useState([]);
    const [productData, setProductData] = useState([]);
    const { width, height } = useWindowSize(); // Automatically adjusts confetti to window size
    const buttonRef = useRef(null);
    const [status, setStatus] = useState("idle");
  
    const [rawData, setRawData] = useState([]);
    const [totDue, setTotDue] = useState(0);
    const [brcusdata, setBrCusData] = useState([]);
    const textRef = useRef(null);
    const iconRef = useRef(null);
    const hasCelebrated = useRef(false);
    const uniqueCusData =
      selectedType === "PRODUCT"
        ? [
            ...new Map(
              productData.map((item) => {
                const key = JSON.stringify({
                  jobs: item.jobs,
                  openJobs: item.openJobs,
                  closedJobs: item.closedJobs,
                  salesPersonName: item.salesPersonName ?? null,
                });
                return [key, item];
              })
            ).values(),
          ]
        : [
            ...new Map(
              cusdata.map((item) => {
                const key = JSON.stringify({
                  category: item.category,
                  creditDays: item.creditDays,
                  creditLimit: item.creditLimit,
                  ctrlOffice: item.ctrlOffice,
                  salesPersonName: item.salesPersonName,
                  onYear: item.onYear,
                });
                return [key, item];
              })
            ).values(),
          ];
    console.log("uniqueCusData", uniqueCusData);

    const multiGraphData = brcusdata
    .slice() // optional: to avoid mutating original array
    .sort((a, b) => b.totDue - a.totDue) // sort descending
    .map((item, index) => ({
      name: item.branchCode,
      percentage: Number((item.totDue / 100000).toFixed(0)) || 0,
      fill: colors[index % colors.length],
      due: item.totDue,
    }));

  console.log("multiGraphData", multiGraphData);
    const updatePower = (index) => {
        setCurrentPower(index);
      };
      const [data1, setData1] = useState({
        total: 0,
        wedges: [],
      });
    const colors = [
        "#0669AD",
        "#E62A39",
        "#FEDA3E",
        "#4CAF50",
        "#FF9800",
        "#FF66B2",
        "#FF6666",
        "#66FF66",
        "#66FFFF",
        "#FF9966",
        "#FF33FF",
        "#00FFFF",
        "#99CCFF",
        "#CC99FF",
        "#FFCC99",
      ];
    const backgroundColors = [
      "#2b92d8",
      "#2ab96a",
      "#e9c061",
      "#d95d6b",
      "#9173d8",
      "#9966FF",
      "#FF66B2",
      "#FF6666",
      "#66FF66",
      "#66FFFF",
      "#FF9966",
      "#FF33FF",
      "#00FFFF",
      "#99CCFF",
      "#CC99FF",
      "#FFCC99",
    ];
  
    const hoverBackgroundColors = [
      "#2b92d8",
      "#2ab96a",
      "#e9c061",
      "#d95d6b",
      "#9173d8",
      "#9966FF",
      "#FF66B2",
      "#FF6666",
      "#66FF66",
      "#66FFFF",
      "#FF9966",
      "#FF33FF",
      "#00FFFF",
      "#99CCFF",
      "#CC99FF",
      "#FFCC99",
    ];
    const topRankCustomer = rankinvdata.find((rank) => rank.r === 1);
    useEffect(() => {
      if (topRankCustomer) {
        setShowConfetti(true);
  
        const timer = setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
  
        return () => clearTimeout(timer);
      }
    }, [topRankCustomer]);
    const customerDetails = uniqueCusData.flatMap((item) => {
        const getAmount = (screen) => {
          const entry = invdata.find(
            (inv) => inv.screen === screen && inv.partyCode === item.partyCode
          );
          return entry
            ? (Number(entry.amt) / 100000).toFixed(0).toLocaleString("en-IN") + " L"
            : "0";
        };
    
        const rankEntry = rankinvdata.find(
          (rank) => rank.customer === item.partyName
        );
    
        // Only define product-related functions when needed
        let getProductCount;
        if (selectedType === "PRODUCT") {
          getProductCount = (label) => {
            if (!productData || !Array.isArray(productData)) {
              console.warn("Product data not available");
              return 0;
            }
            const entry = productData.find((prod) => prod.jobs === label);
            console.log(`Looking for ${label}, found:`, entry);
            return entry ? entry.count : 0;
          };
        }
    
        return [
          // About section - for CUSTOMER or VENDOR
          (selectedType === "CUSTOMER" || selectedType === "VENDOR") && {
            name: (
              <>
                <strong style={{ marginLeft: "100px" }}>About</strong>
                <br />
                On Board
                <br />
                Code
                <br />
                Credit Days
                <br />
                Limit
              </>
            ),
            description: (
              <>
                {}
                <br />
                {item.onYear} <br /> {item.partyCode || 0} <br /> {item.creditDays}{" "}
                <br />₹
                {(item.creditLimit / 100000).toFixed(2).toLocaleString("en-IN") +
                  " L"}
              </>
            ),
            color: "#4ECDC4",
            type: "VENDOR",
          },
    
          // Product Summary - only for PRODUCT type
          selectedType === "PRODUCT" && {
            name: (
              <>
                <strong style={{ marginLeft: "70px" }}>Summary</strong>
                <br />
                Total Jobs
                <br />
                Open Jobs
                <br />
                Closed Jobs
              </>
            ),
            description: (
              <>
                {}
                <br />
                {item.jobs} <br />
                {item.openJobs} <br />
                {item.closedJobs}
              </>
            ),
            color: "#FFA726",
            type: "PRODUCT",
          },
    
          // Recent section - CUSTOMER specific
          selectedType === "CUSTOMER" && {
            name: (
              <>
                <strong style={{ marginLeft: "100px" }}>Recent</strong>
                <br />
                Invoice
                <br />
                Credit Note
                <br />
                Collection
                <br />
                Service
              </>
            ),
            description: (
              <>
                {}
                <br />₹{getAmount("Invoice")} <br />₹{getAmount("Credit Note")}{" "}
                <br />₹{getAmount("Receipt")} <br />
                {getAmount("Service")}
              </>
            ),
            color: "#45B7D1",
            type: "PRODUCT",
          },
    
          // Recent section - VENDOR specific
          selectedType === "VENDOR" && {
            name: (
              <>
                <strong style={{ marginLeft: "100px" }}>Recent</strong>
                <br />
                Cost Invoice
                <br />
                Debit Note
                <br />
                Payment
                <br />
                Service
              </>
            ),
            description: (
              <>
                {}
                <br />₹{getAmount("Cost Invoice")} <br />₹{getAmount("Debit Note")}{" "}
                <br />₹{getAmount("Payment")} <br />
                {getAmount("Service")}
              </>
            ),
            color: "#45B7D1",
            type: "PRODUCT",
          },
    
          // Analytics section - CUSTOMER specific
          (selectedType === "CUSTOMER" || selectedType === "PRODUCT") && {
            name: (
              <>
                <strong style={{ marginLeft: "70px" }}>Last Month</strong>
                <br />
                Rank
                <br />
                Jobs
                <br />
                Income
                <br />
                {selectedType != "PRODUCT" && "Profit"}
              </>
            ),
            description: (
              <>
                {}
                <br />
                <span className={rankEntry?.r === 1 ? "highlight" : ""}>
                  {rankEntry?.r || 0}
                </span>{" "}
                {rankEntry?.r === 1 && showConfetti && (
                  <Confetti width={width} height={height} />
                )}
                <br />
                {rankEntry?.totJob} <br />₹
                {(rankEntry?.income / 100000)?.toFixed(0).toLocaleString("en-IN") ||
                  "0"}{" "}
                L <br />
                {selectedType !== "PRODUCT" && (
                  <>
                    ₹
                    {(rankEntry?.profit / 100000)
                      ?.toFixed(0)
                      .toLocaleString("en-IN") || "0"}{" "}
                    L
                  </>
                )}
              </>
            ),
            color: "#FF6B6B",
            type: "ANALYTICS",
          },
        ].filter(Boolean); // This removes any falsey values (including null/undefined)
      });
    
      console.log("customerDetails", customerDetails);
    
      const handleClearSelection = () => {
        setSelectedParty(null);
        setSearchTerm("");
        setShowDropdown(true);
      };
      // Debounce function to limit API calls
      const debounce = (func, delay) => {
        let timer;
        return function (...args) {
          clearTimeout(timer);
          timer = setTimeout(() => func.apply(this, args), delay);
        };
      };
    useEffect(() => {
      console.log("Current productData:", productData);
    }, [productData]);

  let currentAngle = 0;
  const graphData = multiGraphData.map((item) => {
    const angle = item.percentage * 1.8; // Each percentage = 1.8 deg (180 total)
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      startAngle,
      angle,
    };
  });
  return (
    <Box
      sx={{
        ml: 2,
        mr: 2,
        [theme.breakpoints.down('md')]: {
          mr: 2
        }
      }}
    >
      <ButtonBase
        ref={anchorRef}
        aria-haspopup="true"
        onClick={handleOpen}
        sx={{
          display: 'inline-flex',
          p: 0,
          m: 0,
          minWidth: 0,
          borderRadius: 0,
          background: 'transparent',
          '&:hover img': {
            filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))'
          }
        }}
      >
        <img
          src={HaiIcon}
          alt="HAI"
          style={{
            width: '27px',
            height: '27px',
            display: 'block'
          }}
        />
      </ButtonBase>

      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            background: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            overflow: "hidden",
            maxHeight: "100vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background:
              "linear-gradient(135deg, rgba(255,107,107,0.2) 0%, rgba(78,205,196,0.2) 100%)",
            color: "white",
            padding: "1.5rem 2rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            height: "100px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              background: "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              fontFamily: "'Playfair Display', serif",
              fontWeight: "bold",
            }}
          >
            HAI
          </Typography>
          <Box
            sx={{
              display: "flex",
              // justifyContent: "space-between",
              marginBottom: "2rem",
              gap: "0.7rem",
              flexWrap: "wrap",
              marginLeft: "-330px",
            }}
          >
            {powers.map((power, index) => (
              <Box
                key={index}
                onClick={() => {
                  updatePower(index);
                  setSelectedType(power.type); // Sets the selected type (e.g., "VENDOR")
                }}
                sx={{
                  flex: 1,
                  minWidth: "30px",
                  maxWidth: "60px",
                  minHeight: "30px",
                  maxHeight: "60px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  opacity: currentPower === index ? 1 : 0.6,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  padding: "0.7rem",
                  borderRadius: "12px",
                }}
              >
                <Typography sx={{ fontSize: "1.6rem" }}>
                  {getPowerEmoji(index)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.9rem",
                    textAlign: "center",
                    fontWeight: 500,
                    color: "white",
                  }}
                >
                  {power.name}
                </Typography>
              </Box>
            ))}
  
            {/* <div
              class="form__group field"
              style={{ marginRight: "-300px", marginTop: "20px" }}
            >
              <input
                type="input"
                class="form__field"
                placeholder="Search..."
                required=""
              />
              <label for="name" class="form__label">
                Search
              </label>
            </div>{" "} */}
            {/* } */}
            <div
              class="form__group field"
              // style={{ marginRight: "-300px", marginTop: "20px" }}
              style={{
                marginRight: "-300px",
                marginTop: "20px",
                position: "relative",
                width: "300px",
                backgroundColor: "transparent",
                color: "white",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  backgroundColor: "transparent",
                  color: "white",
                }}
              >
                {/* Search Input */}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true); // Show dropdown when typing
                  }}
                  placeholder={`Search ${powers[currentPower].name}...`}
                  style={{
                    width: "125%",
                    padding: "10px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    // backgroundColor: "white",
                    backgroundColor: "transparent",
                    color: "white",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
  
                {/* Dropdown List */}
                {showDropdown && searchTerm && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 5px)",
                      left: 0,
                      right: 0,
                      maxHeight: "100px",
                      overflowY: "auto",
                      width: "300px",
                      backgroundColor: "transparent",
                      border: "1px solid #e0e0e0000000",
                      borderRadius: "4px",
                      zIndex: 1000,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    {loading ? (
                      <div
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          color: "white",
                        }}
                      >
                        Loading...
                      </div>
                    ) : partyNames.length > 0 ? (
                      partyNames
                        .filter((party) => {
                          const partyName = (party.subledgerName || party)
                            .toString()
                            .toLowerCase();
                          return partyName.startsWith(searchTerm.toLowerCase());
                        })
                        .map((party, index) => (
                          <div
                            key={`party-${index}`}
                            style={{
                              padding: "12px 16px",
                              color: "#333",
                              cursor: "pointer",
                              borderBottom: "1px solid #f0f0f0",
                              transition: "background-color 0.2s ease",
                              backgroundColor:
                                selectedParty === party ? "#f5f5f5" : "white",
                              ":hover": {
                                backgroundColor: "#f5f5f5",
                              },
                            }}
                            onClick={() => {
                              const selectedValue = party.subledgerName || party;
                              setSearchTerm(selectedValue);
                              setSelectedParty(party);
                            //   fetchData(selectedValue, selectedType);
                            //   fetchData1(selectedValue, selectedType);
                            //   fetchData2(selectedValue, selectedType);
                            //   fetchData3(selectedValue, selectedType);
                            //   fetchData4(selectedValue);
                              setShowDropdown(false); // Close dropdown after selection
                            }}
                          >
                            {party.subledgerName || party}
                          </div>
                        ))
                    ) : (
                      <div
                        style={{
                          padding: "12px 16px",
                          color: "#666",
                          fontStyle: "italic",
                        }}
                      >
                        No results found for "{searchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Box>
  
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            padding: "2rem",
            background:
              "radial-gradient(circle at 20% 20%, rgba(255, 107, 107, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(69, 183, 209, 0.1) 0%, transparent 50%)",
          }}
        >
          <Box
            sx={{
              maxWidth: "800px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "white",
                opacity: 0.8,
                marginBottom: "2rem",
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 200,
              }}
            >
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "2rem",
                gap: "0.7rem",
                flexWrap: "wrap",
              }}
            >
              {customerDetails.map((power, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    minWidth: "90px",
                    // maxWidth: "400px",
                    maxWidth: "250px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.7rem",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    backdropFilter:
                      showDropdown || searchTerm ? "none" : "blur(5px)",
                    boxShadow: "0 8px 15px rgba(255, 255, 255, 0.1)",
                    opacity: 1,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      background: "rgba(255, 255, 255, 0.15)",
                    },
                  }}
                >
                  <Typography sx={{ fontSize: "1.6rem" }}>
                    {/* {getPowerEmoji(index)} */}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      textAlign: "center",
                      fontWeight: 500,
                      color: "white",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span style={{ textAlign: "left" }}>{power.name}</span>
                    <span style={{ textAlign: "right" }}>
                      {power.description}
                    </span>
                  </Typography>
                </Box>
              ))}
            </Box>
            {customerDetails.length > 0 && (
              <Box
                sx={{
                  padding: "1.5rem",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "15px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  backdropFilter:
                    showDropdown || searchTerm ? "none" : "blur(5px)",
                  height: "250px",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    marginBottom: "1rem",
                    background: "linear-gradient(135deg, #FF6B6B, #4ECDC4)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                </Typography>
                <Typography
                  sx={{
                    color: "white",
                    opacity: 0.9,
                    lineHeight: 1.6,
                  }}
                >
                  {/* {powers[currentPower].description} */}
                  {/* {multiGraphData[0].name && ( */}
                  {customerDetails.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "80px", // Increase this value as needed
                        marginTop: "1px",
                      }}
                    >
                      <GaugeSpeedometer
                        // value={(cusdata[0].totDue / 100000).toFixed(0)}
                        value={
                          data1.wedges.reduce(
                            (sum, wedge) => sum + wedge.value * 100000,
                            0
                          ) / 100000
                        }
                        // display={`L - Due`}
                        display={
                          selectedType === "CUSTOMER" || selectedType === "VENDOR"
                            ? "L - Due"
                            : "L - Profit"
                        }
                      /> 
                    </div>
                  )}
                  <SplitChart
                    multiGraphData={multiGraphData}
                    display={
                      selectedType === "CUSTOMER"
                        ? uniqueCusData[0]?.salesPersonName
                        : null
                    }
                    selectedType={selectedType}
                  />
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            padding: "1rem 2rem",
            background: "rgba(15, 23, 42, 0.7)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HaiSection;
