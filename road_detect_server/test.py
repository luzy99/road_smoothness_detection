import json
import requests
import pymysql
from geopy import distance

# 橘园 31.882610,118.814515
# 梅园 31.883430,118.828446
# 梅园食堂 31.884819,118.826821
# 梅园操场 31.883432,118.828484     199
# 南门中间 31.881435,118.825411
# 南门 31.881269,118.820132
# 中央大道 31.882345,118.820024

# add: 230 


def getRoadLine(params):
    url = 'https://apis.map.qq.com/ws/direction/v1/walking/'

    res = requests.get(url, params).json()
    print(res)
    coors = []
    for rt in res['result']['routes']:
        coors += rt['polyline']

    for i in range(2, len(coors)):
        coors[i] = coors[i - 2] + coors[i] / 1000000

    print(coors)
    print(len(coors))

    val = []
    for i in range(0, len(coors)-4, 2):
        t = (coors[i+1], coors[i], coors[i+3], coors[i+2],
            distance.distance((coors[i], coors[i+1]), (coors[i+2], coors[i+3])).meters, -1)
        if t[-2] == 0:
            continue
        val.append(t)
    return val


# ############################
def insertIntoDB(val):
    # 打开数据库连接
    db = pymysql.connect(host='***',
                        port=3306,
                        user='road_detect',
                        password='888',
                        db='road_detect',
                        charset='utf8')

    # 使用cursor()方法获取操作游标
    cursor = db.cursor()

    # SQL 插入语句
    sql = """INSERT INTO roadmap(lon_start,
            lat_start, lon_end, lat_end, road_length, level)
            VALUES (%s,%s,%s,%s,%s,%s)"""

    try:

        # 执行sql语句
        cursor.executemany(sql, val)
        # 提交到数据库执行
        db.commit()
    except:
        # 如果发生错误则回滚
        db.rollback()

    # 关闭数据库连接
    db.close()


def calRecord(lat_start, lon_start, lat_end, lon_end):
    return (lon_start, lat_start, lon_end, lat_end,
            distance.distance((lat_start, lon_start), (lat_end, lon_end)).meters, -1)

if __name__ == '__main__':
    params = {
        'from': '31.884819,118.826821',
        'to': '31.883432,118.828484',
        'key': '***'
    }
    # val = getRoadLine(params)
    val = []
    s1=118.828493
    s2=31.883432
    e1= 118.82856299999999
    e2=31.881552
    r = calRecord(31.881467999999998, 118.82634499999999,31.881434,118.825411)
    val.append(r)
    insertIntoDB(val)
