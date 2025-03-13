import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBitcoin, FaEthereum, FaArrowUp, FaArrowDown, FaChartLine, FaSpinner } from 'react-icons/fa';
import { SiLitecoin, SiRipple, SiDogecoin } from 'react-icons/si';
import axios from 'axios';

const MarketOverview = () => {
    const [marketData, setMarketData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getIconForCoin = (id) => {
        switch (id) {
            case 'bitcoin': return <FaBitcoin />;
            case 'ethereum': return <FaEthereum />;
            case 'litecoin': return <SiLitecoin />;
            case 'ripple':
            case 'xrp': return <SiRipple />;
            case 'dogecoin': return <SiDogecoin />;
            default: return <FaChartLine />;
        }
    };

    const getColorForCoin = (id) => {
        switch (id) {
            case 'bitcoin': return '#f7931a';
            case 'ethereum': return '#627eea';
            case 'litecoin': return '#345d9d';
            case 'ripple':
            case 'xrp': return '#0091e6';
            case 'dogecoin': return '#c2a633';
            default: return '#333333';
        }
    };

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch main market data
                const marketResponse = await axios.get(
                    'https://api.coingecko.com/api/v3/coins/markets', {
                        params: {
                            vs_currency: 'usd',
                            ids: 'bitcoin,ethereum,litecoin,ripple,dogecoin',
                            order: 'market_cap_desc',
                            per_page: 5,
                            page: 1,
                            sparkline: false,
                            price_change_percentage: '24h'
                        }
                    }
                );

                // Process each coin to get its chart data
                const coinsWithChartData = await Promise.all(
                    marketResponse.data.map(async (coin) => {
                        try {
                            // Get 7 day chart data
                            const chartResponse = await axios.get(
                                `https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart`, {
                                    params: {
                                        vs_currency: 'usd',
                                        days: 7,
                                        interval: 'daily'
                                    }
                                }
                            );
                            
                            // Extract just the prices for our chart
                            const chartData = chartResponse.data.prices.map(price => price[1]);
                            
                            return {
                                id: coin.id,
                                name: coin.name,
                                symbol: coin.symbol.toUpperCase(),
                                icon: getIconForCoin(coin.id),
                                price: coin.current_price,
                                change: coin.price_change_percentage_24h,
                                chartData: chartData,
                                color: getColorForCoin(coin.id)
                            };
                        } catch (err) {
                            console.error(`Error fetching chart data for ${coin.id}:`, err);
                            return null;
                        }
                    })
                );

                // Filter out any failed requests
                const validData = coinsWithChartData.filter(coin => coin !== null);
                setMarketData(validData);
            } catch (err) {
                console.error('Error fetching market data:', err);
                setError('Failed to load market data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMarketData();
    }, []);

    // The rest of your component remains the same...
    
    // Mini chart rendering function
    const renderMiniChart = (data, color, isPositive) => {
        if (!data || data.length < 2) return null;
        
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;
        
        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((value - min) / range) * 100;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                    d={`M0,${100 - ((data[0] - min) / range) * 100} L${points} L100,${100 - ((data[data.length - 1] - min) / range) * 100} L100,100 L0,100 Z`}
                    fill={`${color}20`}
                />
                <path
                    d={`M0,${100 - ((data[0] - min) / range) * 100} L${points}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                />
            </svg>
        );
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (isLoading) {
        return (
            <div className="market-overview loading-state">
                <motion.div 
                    className="loading-indicator"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <FaSpinner size={30} />
                </motion.div>
                <p>Loading market data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="market-overview error-state">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="market-overview">
            <motion.h2 
                className="section-title"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <FaChartLine /> Market Overview
            </motion.h2>
            
            <motion.div 
                className="market-cards"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {marketData.map((coin) => (
                    <motion.div 
                        key={coin.id}
                        className="market-card"
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                    >
                        <div className="market-card-header">
                            <div className="market-card-icon" style={{ backgroundColor: `${coin.color}20`, color: coin.color }}>
                                {coin.icon}
                            </div>
                            <div>
                                <h3>{coin.name}</h3>
                                <span className="market-card-symbol">{coin.symbol}</span>
                            </div>
                        </div>
                        
                        <div className="market-card-price">
                            ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                        </div>
                        
                        <div className={`market-card-change ${coin.change >= 0 ? 'positive' : 'negative'}`}>
                            {coin.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                            {Math.abs(coin.change).toFixed(2)}%
                        </div>
                        
                        <div className={`market-chart ${coin.change >= 0 ? 'up' : 'down'}`}>
                            {renderMiniChart(coin.chartData, coin.color, coin.change >= 0)}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default MarketOverview;
