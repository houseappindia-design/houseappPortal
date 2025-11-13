import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Rating,
  Divider,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Paper
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getAgentDetail } from "../../data/slices/agentSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const AgentDetails = () => {
  const { agentDetail } = useSelector((state) => state.agents);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(getAgentDetail(id));
  }, [dispatch, id]);

  // Auto slider
  useEffect(() => {
    if (!agentDetail?.images?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === agentDetail.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [agentDetail?.images]);

  return (
    <Box sx={{ width: "100%", p: 3, bgcolor: "#f9fafc" }}>
      <Grid container spacing={4}>
        {/* LEFT SIDE BIG IMAGE SLIDER */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: "14px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
              overflow: "hidden",
            }}
          >
            <CardMedia
              component="img"
              image={`${BASE_IMAGE_URL}${agentDetail?.images?.[currentIndex]}`}
              alt="agent"
              sx={{ height: "420px", objectFit: "cover",width:"100%" }}
            />

            {/* THUMBNAILS */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                p: 1,
                overflowX: "auto",
                bgcolor: "#fff",
                borderTop: "1px solid #eee",
              }}
            >
              {agentDetail?.images?.map((img, i) => (
                <img
                  key={i}
                  src={`${BASE_IMAGE_URL}${img}`}
                  onClick={() => setCurrentIndex(i)}
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "10px",
                    border:
                      currentIndex === i
                        ? "3px solid #1976d2"
                        : "2px solid #ddd",
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                />
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* RIGHT SIDE DETAILS */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: "14px",
              p: 3,
              bgcolor: "#fff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              {/* NAME + VERIFIED */}
              <Typography variant="h4" fontWeight={700} sx={{ display: "flex", alignItems: "center" }}>
                {agentDetail?.name}
                {agentDetail?.verified === 1 && (
                  <VerifiedIcon sx={{ ml: 1, color: "#1e88e5" }} />
                )}
              </Typography>

              {/* AGENCY NAME */}
              <Typography variant="h6" sx={{ color: "#475569", mt: 1 }}>
                {agentDetail?.agency_name}
              </Typography>

              {/* ADDRESS */}
              <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                <LocationOnIcon color="error" />
                <Typography>{agentDetail?.office_address}</Typography>
              </Stack>

              {/* ⭐⭐⭐⭐⭐ Rating */}
              <Stack direction="row" spacing={1} mt={2}>
                <Rating
                  value={parseFloat(agentDetail?.rating)}
                  precision={0.5}
                  readOnly
                />
                <Typography>({agentDetail?.rating || "0.0"})</Typography>
              </Stack>

              {/* -------- SINGLE ROW CONTACT PANEL -------- */}
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: "14px",
                  mt: 3,
                  bgcolor: "#ffffff",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                }}
              >
                <Grid container spacing={2}>
                  {/* PHONE */}
                  <Grid item xs={6} sm={3}>
                    <Stack alignItems="center" spacing={1}>
                      <PhoneIcon sx={{ fontSize: 30, color: "#0284c7" }} />
                      <Typography fontWeight={600}>
                        {agentDetail?.phone}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#555" }}>
                        Clicks:{" "}
                        <strong style={{ color: "#0284c7" }}>
                          {agentDetail?.phone_clicks || 0}
                        </strong>
                      </Typography>
                    </Stack>
                  </Grid>

                  {/* WHATSAPP */}
                  <Grid item xs={6} sm={3}>
                    <Stack alignItems="center" spacing={1}>
                      <WhatsAppIcon sx={{ fontSize: 30, color: "#16a34a" }} />
                      <Typography fontWeight={600}>
                        +{agentDetail?.whatsapp_number}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#555" }}>
                        Clicks:{" "}
                        <strong style={{ color: "#16a34a" }}>
                          {agentDetail?.whatsapp_clicks || 0}
                        </strong>
                      </Typography>
                    </Stack>
                  </Grid>

                  {/* EMAIL */}
                  <Grid item xs={6} sm={3}>
                    <Stack alignItems="center" spacing={1}>
                      <EmailIcon sx={{ fontSize: 30, color: "#f59e0b" }} />
                      <Typography fontWeight={600}>
                        {agentDetail?.email}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#555" }}>
                        Clicks:{" "}
                        <strong style={{ color: "#b45309" }}>
                          {agentDetail?.email_clicks || 0}
                        </strong>
                      </Typography>
                    </Stack>
                  </Grid>

                  {/* GOOGLE MAPS */}
                  <Grid item xs={6} sm={3}>
                    <Stack alignItems="center" spacing={1}>
                      <LocationOnIcon sx={{ fontSize: 30, color: "#dc2626" }} />
                      <Typography fontWeight={600}>Maps</Typography>
                      <Typography sx={{ fontSize: 12, color: "#555" }}>
                        Clicks:{" "}
                        <strong style={{ color: "#dc2626" }}>
                          {agentDetail?.google_clicks || 0}
                        </strong>
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              {/* DESCRIPTION */}
              <Typography mt={3} lineHeight={1.7}>
                {agentDetail?.description?.replace(/"/g, "")}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography>
                <strong>Experience:</strong> {agentDetail?.experience_years} years
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Languages:</strong> {agentDetail?.languages_spoken}
              </Typography>

              {/* TOTAL VIEWS */}
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: "#e0f7fa",
                  borderRadius: "12px",
                  justifyContent: "center",
                }}
              >
                <VisibilityIcon sx={{ fontSize: 30, color: "#0288d1" }} />
                <Typography variant="h6" fontWeight={700} color="#01579b">
                  {agentDetail?.total_views || 0} Total Views
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentDetails;
