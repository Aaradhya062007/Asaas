from django import forms

class SeatSelectionForm(forms.Form):
    seat_ids = forms.CharField(widget=forms.HiddenInput())
