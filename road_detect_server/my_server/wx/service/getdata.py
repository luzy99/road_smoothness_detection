import requests
import json
from my_server.models import Record, RoadMap, User

# 将道路的稳定性level映射到5个等级
# [5：相当不平，4：有些不平，3：正常，2：平稳 1：相当平稳] (-1:未测量到)
colorMap = [
    '#6495ED',   # 0 蓝色
    '#00CD00',   # 1 绿色
    '#00EE76',  # 2 青绿
    '#B3EE3A',  # 3 橄榄绿
    '#FFD700',  # 4 黄色
    '#EE2C2C',  # 5 红色
    # '#6495ED'   # -1 蓝色
]


def getRoadMap():
    response = {}
    roads = RoadMap.objects.filter()

    polyline = []
    for road in roads:
        line = {'points': [], 'color': colorMap[-road.level], 'width': 8}
        if road.level == -1:
            line['color'] = colorMap[0]
        line['points'].append(
            {'latitude': road.lat_start, 'longitude': road.lon_start})
        line['points'].append(
            {'latitude': road.lat_end, 'longitude': road.lon_end})
        polyline.append(line)
    response['polyline'] = polyline
    response['ok'] = 1
    return response

def getUserRecordNum(openid):
    response = {}
    users = User.objects.filter(user_id=openid)
    if len(users) == 0:
        response['ok'] = 0
        response['msg'] = 'userid错误'
        return response
    
    records = Record.objects.filter(user=users[0])
    response['num'] = len(records)

    response['ok'] = 1
    return response
