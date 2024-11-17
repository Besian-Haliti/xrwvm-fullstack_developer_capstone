from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'

urlpatterns = [
    # Path for registration
    path('register', views.register, name='register'),

    # Path for login
    path('login', views.login_user, name='login'),

    path('logout', views.logout_request, name='logout'),

    # Path for dealer reviews view
    path('get_dealers/', views.get_dealerships, name='get_dealers'),
    path('get_dealers/<str:state>', views.get_dealerships, name='get_dealers_by_state'),
    path('dealer/<int:dealer_id>', views.get_dealer_details, name='dealer_details'),
    path('get_cars', views.get_cars, name='getcars'),

    # Path for add a review view
    path('reviews/dealer/<int:dealer_id>'
