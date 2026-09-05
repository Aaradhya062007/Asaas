from django import forms
from movies.models import Review, Movie

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['rating', 'review_text']
        widgets = {
            'rating': forms.Select(choices=[(i, f"{i} Stars") for i in range(1, 6)]),
            'review_text': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Write your review...'}),
        }

class MovieFilterForm(forms.Form):
    q = forms.CharField(required=False)
    genre = forms.CharField(required=False)
    language = forms.CharField(required=False)
    rating = forms.FloatField(required=False)
