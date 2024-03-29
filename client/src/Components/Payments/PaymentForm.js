import React, { useEffect, useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import axios from "axios";
import { Error, Success } from "../Messages/messages";

export default function CheckoutForm(props) {
    const [email, setEmail] = useState('');
    const [user, setUser] = useState({});
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getUserByEmail = async () => {
        await axios.get(`/api/users/user/${email}`).then(res => {
            if (res.status === 200) {
                setUser(res.data);
            }
            else {
                Error(res.data.errorMessage);
            }
        }).catch(err => {
            console.log(err)
        })
    };

    useEffect(() => {
        getUserByEmail();
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(process.env.REACT_APP_STRIPE_CLIENT_SECRET);

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const addOrder = async () => {
        await axios.post(`/api/orders/purchase`, { email, qty: props.qty, buyFrom: props.username }).then(res => {
            console.log(res.data);
            if (res.status === 200) {
                Success(res.data.successMessage)
            }
            else {
                Error(res.data.errorMessage);
            }
        }).catch(err => {
            console.log(err)
        })
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        addOrder();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: user?.email ? process.env.REACT_APP_STRIPE_REDIRECT_URL : `${process.env.REACT_APP_STRIPE_REDIRECT_URL}/signup/${email}`,
            },
        });

        console.log(error);

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
            />
            {/* <input
                id="description"
                type="text"
                value={`${props.qty} images for ${props.qty === "3" ? "Free" : props.qty === "10" ? "$2.99" : props.qty === "20" && "$9.99"}`}
                disabled
                placeholder="Enter description"
            /> */}
            <PaymentElement id="payment-element" />
            <button disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}