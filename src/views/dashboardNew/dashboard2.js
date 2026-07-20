import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const Dashboard2 = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background:
                    "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0f2fe 100%)",
                p: 3,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: 700,
                    p: 6,
                    borderRadius: 6,
                    textAlign: "center",
                    mb: 20,
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.4)",
                    boxShadow: "0 25px 60px rgba(15,23,42,0.12)",
                }}
            >
                {/* Welcome */}
                <Box textAlign="center" mb={5}>
                    <Typography
                        sx={{
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            color: "#6366f1",
                            textTransform: "uppercase",
                            letterSpacing: "6px",
                            mb: 1,
                        }}
                    >
                        Welcome To
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: { xs: "2rem", md: "1.5rem" },
                            fontWeight: 800,
                            color: "#1e293b",
                            lineHeight: 1.2,
                        }}
                    >
                        📚 EFIT Ebook
                    </Typography>

                    <Box
                        sx={{
                            width: 80,
                            height: 4,
                            borderRadius: 5,
                            background: "linear-gradient(90deg,#4f46e5,#06b6d4)",
                            mx: "auto",
                            mt: 2,
                        }}
                    />
                </Box>

                {/* Status Badge */}
                <Box
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 4,
                        py: 1.5,
                        borderRadius: "999px",
                        bgcolor: "#fff7ed",
                        border: "1px solid #fdba74",
                        mb: 4,
                    }}
                >
                    <Box
                        sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: "#f97316",
                            animation: "pulse 1.5s infinite",
                            "@keyframes pulse": {
                                "0%": { opacity: 1, transform: "scale(1)" },
                                "50%": { opacity: 0.5, transform: "scale(1.4)" },
                                "100%": { opacity: 1, transform: "scale(1)" },
                            },
                        }}
                    />

                    <Typography
                        sx={{
                            fontWeight: 700,
                            color: "#c2410c",
                            fontSize: "1.1rem",
                        }}
                    >
                        Dashboard Under Development
                    </Typography>
                </Box>

                {/* Description */}
                {/* <Typography
          variant="h6"
          sx={{
            color: "#64748b",
            maxWidth: 500,
            mx: "auto",
            lineHeight: 1.8,
            fontWeight: 400,
          }}
        >
          We're building a faster, smarter, and more intuitive dashboard to
          enhance your Ebook experience. Stay tuned for exciting updates.
        </Typography> */}
            </Paper>
        </Box>
    );
};

export default Dashboard2;