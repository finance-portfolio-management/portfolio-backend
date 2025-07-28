import { getMarketTopGainersLosers } from "../services/marketService.js";

export const getTopGainersLosers = async(req, res) => {
    try {
       

        const result = await getMarketTopGainersLosers();

        res.json({
            success: true,
            data:{
                topGainers:result.topGainers,
                topLosers:result.topLosers,
                
            }
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            error:error.message
        });
    }
};