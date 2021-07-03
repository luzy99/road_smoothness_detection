import requests
import json
from my_server.models import User, Record

def uploadData(data):
    response = {}
    users = User.objects.filter(user_id=data['userid'])
    if len(users) == 0:
        response['ok'] = 0
        response['msg'] = 'userid为空'
        return response
    record = Record(user=users[0], latitude=data['latitude'], longitude=data['longitude'],
        speed=data['speed'], acc_x=data['acc_x'], acc_y=data['acc_y'], acc_z=data['acc_z'])
    record.save()
    response['ok'] = 1
    return response
