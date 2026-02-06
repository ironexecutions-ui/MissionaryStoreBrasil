import React, { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import "./stripecard.css";

const stripePromise = loadStripe(
    import.meta.env.VITE_STRIPE_PUBLIC_KEY || ""
);

// ===============================
// FORMULÁRIO DO CARTÃO
// ===============================
function FormCartao({ onCartaoValido }) {
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if (!stripe || !elements) {
            onCartaoValido(false);
        }
    }, [stripe, elements]);

    function handleChange(event) {
        // event.complete = true quando o cartão está todo preenchido
        onCartaoValido(event.complete);
    }

    if (!stripe || !elements) {
        return null;
    }

    return (
        <div className="stripe-card-container">
            <CardElement onChange={handleChange} />
        </div>
    );
}

// ===============================
// COMPONENTE PRINCIPAL
// ===============================
export default function StripeCard({ onCartaoValido }) {
    return (
        <Elements stripe={stripePromise}>
            <FormCartao onCartaoValido={onCartaoValido} />
        </Elements>
    );
}
