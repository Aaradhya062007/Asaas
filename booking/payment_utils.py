import stripe
from django.conf import settings

stripe.api_key = getattr(settings, 'STRIPE_SECRET_KEY', '')

def create_stripe_payment_intent(amount, currency='usd', metadata=None):
    """Creates a Stripe PaymentIntent for online payments."""
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),
            currency=currency,
            metadata=metadata or {}
        )
        return intent
    except Exception as e:
        return None
