from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'wx_test$', views.wx_test, ),
    url(r'login$', views.login, ),
    url(r'uploaddata$', views.uploaddata, ),
    url(r'getroadmap$', views.getroadmap, ),
]
