#!/bin/bash

# 部署PayPal Edge Functions

echo "正在部署 create-paypal-order..."
npx supabase functions deploy create-paypal-order --project-ref k93259640

echo "正在部署 capture-paypal-order..."
npx supabase functions deploy capture-paypal-order --project-ref k93259640

echo "部署完成！"

