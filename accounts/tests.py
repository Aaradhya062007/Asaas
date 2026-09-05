from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from django.core import mail

class PasswordResetAndUsernameTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="oldpassword123"
        )

    def test_password_reset_page_loads(self):
        response = self.client.get(reverse('accounts:password_reset'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'accounts/password_reset_form.html')

    def test_password_reset_post_sends_email(self):
        response = self.client.post(reverse('accounts:password_reset'), {
            'email': 'testuser@example.com'
        })
        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Password reset', mail.outbox[0].subject)

    def test_forgot_username_page_loads(self):
        response = self.client.get(reverse('accounts:forgot_username'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'accounts/forgot_username.html')

    def test_forgot_username_post_sends_email(self):
        response = self.client.post(reverse('accounts:forgot_username'), {
            'email': 'testuser@example.com'
        })
        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Username Reminder', mail.outbox[0].subject)
        self.assertIn('testuser', mail.outbox[0].body)

