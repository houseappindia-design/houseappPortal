import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Rating,
    Divider,
    Stack,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { getAgentDetail } from "../../data/slices/agentSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
const BASE_IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const AgentDetails = () => {
     const { agentDetail,error,loading} = useSelector(state => state.agents);
    const {id}=useParams()
    const dispatch =useDispatch()

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(()=>{
       dispatch(getAgentDetail(id))
    },[])
  


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === agentDetail?.images?.length.length - 1 ? 0 : prevIndex + 1
            );
        }, 4500);
        return () => clearInterval(interval);
    }, [agentDetail?.images?.length]);

    return (
        <Box sx={{ width: "100%", p: 3, bgcolor: "#f5f5f5" }}>
            {/* Full-width Image */}
            <Box>
                <img
                    src={`${BASE_IMAGE_URL}${agentDetail?.images[currentIndex]}`}
                    alt={`Agent-${currentIndex}`}
                    style={{
                        width: "100%",
                        height: "450px",
                        borderRadius: "12px",
                        objectFit: "cover",
                        transition: "opacity 0.8s ease-in-out",
                    }}
                />
            </Box>

            {/* Agent Info Below */}
            <Box mt={4}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {agentDetail?.name}
                    <Box
                        component="span"
                        sx={{
                            ml: 1,
                            backgroundColor: "#e0f7fa",
                            color: "#00796b",
                            px: 1.5,
                            py: 0.3,
                            fontSize: "14px",
                            borderRadius: "10px",
                            fontWeight: 600,
                        }}
                    >
                        {agentDetail?.experience_years}+ Experience
                    </Box>
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                        <LocationOnIcon color="error" />  <Typography variant="body2">{agentDetail?.office_address?agentDetail?.office_address:"Kalyani Nagar, Pune"}</Typography>
                    </Stack>
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2} mt={1}>
                    <PhoneIcon color="primary" />
                    <Typography variant="body2">{agentDetail?.phone}</Typography>
                    <WhatsAppIcon color="success" />
                    <Typography variant="body2">+{agentDetail?.whatsapp_number}</Typography>

                    <EmailIcon color="action" />
                    <Typography variant="body2">{agentDetail?.email?agentDetail?.email:"app@househunt.com"}</Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                    <Rating value={agentDetail?.rating} precision={0.5} readOnly />
                    <Typography variant="body2">({agentDetail?.rating})</Typography>
                </Stack>

                <Typography mt={2} variant="body2" lineHeight={1.7}>
                    {agentDetail?.description}
                </Typography>

                <Divider sx={{ my: 2 }} />
                <Divider sx={{ my: 2 }} />

                {/* <Typography variant="body2">
          <strong>Experience:</strong> {agent.experience_years}
        </Typography>
        <Typography variant="body2">
          <strong>Languages:</strong> {agent.languages_spoken}
        </Typography> */}
            </Box>
        </Box>
    );
};

export default AgentDetails;
