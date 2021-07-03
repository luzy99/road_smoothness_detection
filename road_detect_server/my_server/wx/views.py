from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.http import HttpResponse
from .service.login import Login
from .service.report import uploadData
from .service.getdata import getRoadMap

import json

# Create your views here.



@require_http_methods(["GET", "POST"])
def wx_test(request):
    response = {}
    try:
        # json_result = json.loads(request.body)
        # print(request.body)
        # process.decode_json(json_result)
        response['ok'] = 1

    except Exception as e:
        response['msg'] = str(e)
        response['ok'] = 0
    return JsonResponse(response)

# 登录函数
@require_http_methods(["GET"])
def login(request):
    response = {}
    try:
        code = request.GET.get('code')
        # print(code)
        response = Login(code)
    except Exception as e:
        response['msg'] = str(e)
        response['ok'] = 0
    return JsonResponse(response)

# 上传数据函数
@require_http_methods(["POST"])
def uploaddata(request):
    response = {}
    try:
        json_result = json.loads(request.body)
        response = uploadData(json_result['data'])
    except Exception as e:
        response['msg'] = str(e)
        response['ok'] = 0
    return JsonResponse(response)

# 获取路线图函数
@require_http_methods(["GET"])
def getroadmap(request):
    response = {}
    try:
        response = getRoadMap()
    except Exception as e:
        response['msg'] = str(e)
        response['ok'] = 0
    return JsonResponse(response)