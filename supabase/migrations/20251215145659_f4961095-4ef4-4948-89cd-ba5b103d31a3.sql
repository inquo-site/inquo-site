-- Create payment_requests table for manual UPI payments
CREATE TABLE public.payment_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  billing_cycle TEXT NOT NULL, -- 'monthly' or 'yearly'
  utr_number TEXT,
  screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment requests
CREATE POLICY "Users can view their own payments"
ON public.payment_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own payment requests
CREATE POLICY "Users can create payment requests"
ON public.payment_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending payment requests (add UTR/screenshot)
CREATE POLICY "Users can update their pending payments"
ON public.payment_requests
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all payment requests
CREATE POLICY "Admins can view all payments"
ON public.payment_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all payment requests (verify/reject)
CREATE POLICY "Admins can update all payments"
ON public.payment_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete payment requests
CREATE POLICY "Admins can delete payments"
ON public.payment_requests
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create index for faster lookups
CREATE INDEX idx_payment_requests_user_id ON public.payment_requests(user_id);
CREATE INDEX idx_payment_requests_status ON public.payment_requests(status);