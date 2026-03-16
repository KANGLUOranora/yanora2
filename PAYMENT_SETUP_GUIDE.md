# Payment Integration Setup Guide

This guide explains how to configure the payment system for your application.

## Payment Methods Supported

1. **Stripe** - Credit/Debit Card payments
2. **PayPal** - PayPal account payments

## Required Environment Variables

### Frontend (.env file)

Add these to your `.env` file:

```bash
# Stripe Publishable Key (starts with pk_)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# PayPal Client ID
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here
```

### Backend (Supabase Edge Function Secrets)

The following secrets need to be configured in Supabase:

```bash
# Stripe Secret Key (starts with sk_)
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# PayPal Client ID
PAYPAL_CLIENT_ID=your_paypal_client_id_here

# PayPal Client Secret
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
```

## How to Get API Keys

### Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up or log in
3. Navigate to **Developers > API keys**
4. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
5. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
6. Add publishable key to `.env` as `VITE_STRIPE_PUBLISHABLE_KEY`
7. Add secret key to Supabase as `STRIPE_SECRET_KEY`

**Important:** Use test keys for development and live keys for production.

### PayPal Setup

1. Go to [PayPal Developer](https://developer.paypal.com)
2. Log in with your PayPal account
3. Navigate to **Dashboard > My Apps & Credentials**
4. Create a new app or select an existing one
5. Copy your **Client ID**
6. Copy your **Secret** (you may need to show it)
7. Add Client ID to both `.env` and Supabase secrets
8. Add Secret to Supabase as `PAYPAL_CLIENT_SECRET`

**Important:** Use Sandbox credentials for testing and Live credentials for production.

## Setting Secrets in Supabase

You have two options to set secrets:

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Edge Functions** in the sidebar
3. Click on **Manage secrets**
4. Add each secret with its name and value

### Option 2: Using Supabase CLI (if available)

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set PAYPAL_CLIENT_ID=your_client_id
supabase secrets set PAYPAL_CLIENT_SECRET=your_client_secret
```

## Edge Functions Deployed

The following Edge Functions handle payments:

1. **create-stripe-payment** - Creates a Stripe payment intent
2. **create-paypal-order** - Creates a PayPal order
3. **capture-paypal-order** - Captures/completes a PayPal order

## Testing Payments

### Stripe Test Cards

Use these test card numbers in development:

- **Success:** 4242 4242 4242 4242
- **Requires authentication:** 4000 0025 0000 3155
- **Declined:** 4000 0000 0000 9995

Use any future expiry date, any 3-digit CVC, and any postal code.

### PayPal Sandbox

1. Create a PayPal Sandbox account at [PayPal Developer](https://developer.paypal.com)
2. Use the test buyer account credentials provided in your sandbox
3. Complete test payments without real money

## Payment Flow

1. User submits booking form
2. User is redirected to payment page
3. User selects services to purchase
4. User chooses payment method (Stripe or PayPal)
5. Payment is processed through the respective Edge Function
6. On success:
   - Booking status updated to "confirmed"
   - Payment status updated to "paid"
   - Payment record created in database
   - Confirmation email sent
7. User redirected to success page

## Troubleshooting

### "Stripe/PayPal not configured" message

This means the environment variables are missing. Check that:
- Frontend variables are in `.env` file
- You've restarted the dev server after adding variables
- Backend secrets are set in Supabase

### Payment fails silently

Check the browser console and Supabase Edge Function logs for errors.

### CORS errors

The Edge Functions include proper CORS headers. If you still see CORS errors:
- Verify the functions are deployed correctly
- Check that `verify_jwt` is set to `false` for payment functions

## Security Notes

1. **Never** commit secret keys to version control
2. Use `.env.example` to document required variables
3. Use test/sandbox credentials in development
4. Rotate keys if they're accidentally exposed
5. Only switch to live keys when ready for production

## Production Checklist

Before going live:

- [ ] Replace all test keys with live keys
- [ ] Test payments with real cards (small amounts)
- [ ] Verify webhook endpoints (if using)
- [ ] Enable 3D Secure for Stripe (recommended)
- [ ] Review PayPal payment settings
- [ ] Test refund functionality
- [ ] Set up proper error monitoring
- [ ] Review payment confirmation emails

## Support

- Stripe Documentation: https://stripe.com/docs
- PayPal Documentation: https://developer.paypal.com/docs
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
