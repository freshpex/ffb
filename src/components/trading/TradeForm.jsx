import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  InputGroup,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import tradingService from "../../services/tradingService";
import api from "../../services/api";
import { formatCurrency } from "../../utils/formatters";

const TradeForm = ({ symbol, initialSide = "buy" }) => {
  const navigate = useNavigate();
  const [side, setSide] = useState(initialSide);
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [stopPrice, setStopPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);
  const [orderPreview, setOrderPreview] = useState({
    subtotal: 0,
    fees: 0,
    total: 0,
  });
  const [priceRefreshTimer, setPriceRefreshTimer] = useState(30);

  // Fetch current price and user balance
  useEffect(() => {
    const fetchPrice = async () => {
      if (!symbol) return;

      try {
        setLoading(true);
        const { data } = await api.get(`/api/market/price`, {
          params: { symbol },
        });

        setCurrentPrice(data.price);
        setPrice(data.price);
        setError(null);
      } catch (err) {
        console.error("Error fetching price:", err);
        setError("Could not load price information.");
      } finally {
        setLoading(false);
      }
    };

    const fetchBalance = async () => {
      try {
        const { data } = await api.get("/api/users/profile");
        setBalance(data.balance || 0);
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    };

    fetchPrice();
    fetchBalance();

    // Set up price refresh timer
    const timer = setInterval(() => {
      setPriceRefreshTimer((prev) => {
        if (prev <= 1) {
          fetchPrice();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [symbol]);

  // Calculate order preview whenever parameters change
  useEffect(() => {
    if (!quantity || !price) {
      setOrderPreview({ subtotal: 0, fees: 0, total: 0 });
      return;
    }

    const numericQuantity = parseFloat(quantity);
    const numericPrice = parseFloat(price);

    if (isNaN(numericQuantity) || isNaN(numericPrice)) {
      setOrderPreview({ subtotal: 0, fees: 0, total: 0 });
      return;
    }

    const subtotal = numericQuantity * numericPrice;
    const fees = subtotal * 0.001; // Assuming 0.1% trading fee
    const total = subtotal + (side === "buy" ? fees : 0);

    setOrderPreview({ subtotal, fees, total });
  }, [quantity, price, side]);

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quantity || parseFloat(quantity) <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    if (orderType !== "market" && (!price || parseFloat(price) <= 0)) {
      setError("Please enter a valid price.");
      return;
    }

    if (
      ["stop", "stop_limit"].includes(orderType) &&
      (!stopPrice || parseFloat(stopPrice) <= 0)
    ) {
      setError("Please enter a valid stop price.");
      return;
    }

    const orderData = {
      symbol,
      side,
      type: orderType,
      quantity: parseFloat(quantity),
    };

    if (orderType !== "market") {
      orderData.price = parseFloat(price);
    }

    if (["stop", "stop_limit"].includes(orderType)) {
      orderData.stopPrice = parseFloat(stopPrice);
    }

    try {
      setPlacing(true);
      setError(null);

      const response = await tradingService.placeOrder(orderData);

      // Show success and redirect to orders page
      alert(`Order placed successfully! Order ID: ${response.order._id}`);
      navigate("/trading/orders");
    } catch (error) {
      console.error("Error placing order:", error);
      setError(
        error.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setPlacing(false);
    }
  };

  // Reset form on symbol change
  useEffect(() => {
    setQuantity("");
    setPrice("");
    setStopPrice("");
    setOrderPreview({ subtotal: 0, fees: 0, total: 0 });
  }, [symbol]);

  if (!symbol) {
    return (
      <Alert variant="warning">
        Please select a trading instrument to continue.
      </Alert>
    );
  }

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Place {side === "buy" ? "Buy" : "Sell"} Order</h5>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <small className="text-muted">Current Price</small>
            <h5 className="mb-0">
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : currentPrice ? (
                formatCurrency(currentPrice)
              ) : (
                "-"
              )}
              <small className="text-muted ms-2">
                (Refreshes in {priceRefreshTimer}s)
              </small>
            </h5>
          </div>
          <div className="text-end">
            <small className="text-muted">Your Balance</small>
            <h5 className="mb-0">{formatCurrency(balance)}</h5>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <div className="d-flex border rounded">
                <Button
                  variant={side === "buy" ? "success" : "outline-success"}
                  className="flex-grow-1 rounded-0 rounded-start"
                  onClick={() => setSide("buy")}
                  type="button"
                >
                  BUY
                </Button>
                <Button
                  variant={side === "sell" ? "danger" : "outline-danger"}
                  className="flex-grow-1 rounded-0 rounded-end"
                  onClick={() => setSide("sell")}
                  type="button"
                >
                  SELL
                </Button>
              </div>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Order Type</Form.Label>
            <Form.Select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              disabled={placing}
            >
              <option value="market">Market</option>
              <option value="limit">Limit</option>
              <option value="stop">Stop</option>
              <option value="stop_limit">Stop Limit</option>
            </Form.Select>
          </Form.Group>

          {orderType !== "market" && (
            <Form.Group className="mb-3">
              <Form.Label>
                Price ({orderType === "stop" ? "Triggered at" : "Limit"})
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  step="0.0001"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={placing}
                  placeholder="Enter price"
                />
              </InputGroup>
            </Form.Group>
          )}

          {["stop", "stop_limit"].includes(orderType) && (
            <Form.Group className="mb-3">
              <Form.Label>Stop Price</Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  step="0.0001"
                  min="0"
                  value={stopPrice}
                  onChange={(e) => setStopPrice(e.target.value)}
                  disabled={placing}
                  placeholder="Enter stop price"
                />
              </InputGroup>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              step="0.0001"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={placing}
              placeholder={`Amount of ${symbol}`}
            />
          </Form.Group>

          {side === "buy" && (
            <div className="order-preview mb-3 p-3 bg-light rounded">
              <h6>Order Preview</h6>
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(orderPreview.subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Estimated Fee (0.1%):</span>
                <span>{formatCurrency(orderPreview.fees)}</span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span
                  className={orderPreview.total > balance ? "text-danger" : ""}
                >
                  {formatCurrency(orderPreview.total)}
                </span>
              </div>
              {orderPreview.total > balance && (
                <Alert variant="danger" className="mt-2 p-2 mb-0">
                  Insufficient balance for this order.
                </Alert>
              )}
            </div>
          )}

          <div className="d-grid gap-2">
            <Button
              variant={side === "buy" ? "success" : "danger"}
              type="submit"
              disabled={
                placing ||
                !quantity ||
                (orderType !== "market" && !price) ||
                (side === "buy" && orderPreview.total > balance) ||
                (["stop", "stop_limit"].includes(orderType) && !stopPrice)
              }
            >
              {placing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                `Place ${side.toUpperCase()} Order`
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TradeForm;
