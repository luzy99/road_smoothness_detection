# road_detect_server

1. 安装依赖
    ```
       pip install -r requirements.txt
    ```
2. 启动服务
    ```
       python ./manage.py runserver
    ```
3. 目录结构
   ```
       ├─magic_tag_server
       │  └─项目入口，settings.py
       └─my_server
           │─wx 微信小程序后端
           │  ├─service
           │  │  └─ 业务代码
           │  │  urls.py	路由(api/...)
           │  └  views.py	api入口
           │ 
           └  models.py	公用model (from my_server.models import ...)
   ```

- 数据库迁移
  ```python
  python manage.py makemigrations
  python manage.py migrate my_server
  ```

