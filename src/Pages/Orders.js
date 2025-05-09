import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get('/orders/list/');
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, []);

    const toggleOrderDetail = async (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);  // Collapse if same clicked
            return;
        }
        setExpandedOrderId(orderId);
        setLoadingDetail(true);

        try {
            const response = await axiosInstance.get(`/orders/${orderId}/`);
            setOrderDetails(prev => ({
                ...prev,
                [orderId]: response.data
            }));
        } catch (error) {
            console.error('Error fetching order detail:', error);
        } finally {
            setLoadingDetail(false);
        }
    };

    if (loadingOrders) return <p>Loading orders...</p>;

    return (
        <div className="orders-page-container">
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="order-card">
                        <div className="order-summary">
                            <p><strong>Order ID:</strong> {order.id}</p>
                            <p><strong>Status:</strong> {order.order_status}</p>
                            <p><strong>Placed on:</strong> {new Date(order.created_at).toLocaleString()}</p>
                            <button onClick={() => toggleOrderDetail(order.id)}>
                                {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                            </button>
                        </div>

                        {expandedOrderId === order.id && (
                            <div className="order-details">
                                {loadingDetail ? (
                                    <p>Loading details...</p>
                                ) : (
                                    <ul>
                                        {orderDetails[order.id]?.items?.map(item => (
                                            <li key={item.id}>
                                                {item.product} — Quantity: {item.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default OrdersPage;
