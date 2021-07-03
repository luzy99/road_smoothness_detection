from django.db import models

# Create your models here.


class User(models.Model):
    user_id = models.CharField(max_length=30, primary_key=True)
    user_name = models.CharField(max_length=255, blank=True, null=True)
    user_session = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'user'


class Record(models.Model):
    record_id = models.AutoField(primary_key=True)

    longitude = models.FloatField(blank=False, null=True)
    latitude = models.FloatField(blank=False, null=True)
    acc_x = models.FloatField(blank=False, null=True)
    acc_y = models.FloatField(blank=False, null=True)
    acc_z = models.FloatField(blank=False, null=True)
    speed = models.FloatField(blank=False, null=True)

    report_time = models.DateTimeField(
        blank=True, null=True, auto_now_add=True)
    user = models.ForeignKey(User, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'record'


class RoadMap(models.Model):
    road_id = models.AutoField(primary_key=True)

    lon_start = models.FloatField(blank=False, null=True)   # 起始点经度
    lat_start = models.FloatField(blank=False, null=True)   # 起始点纬度

    lon_end = models.FloatField(blank=False, null=True)
    lat_end = models.FloatField(blank=False, null=True)

    road_length = models.FloatField(blank=False, null=True)
    level = models.IntegerField(blank=False, null=True, default=-1)   # 平整度等级
    update_time = models.DateTimeField(
        blank=True, null=True, auto_now_add=True)

    class Meta:
        db_table = 'roadmap'
