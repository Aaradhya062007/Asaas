from movies.views import _filter_movies_queryset

def filter_movies(request):
    """Filters Movie queryset based on request GET parameters."""
    return _filter_movies_queryset(request)
