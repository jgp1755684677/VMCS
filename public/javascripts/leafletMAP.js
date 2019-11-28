//定义全局变量map
var map;

/* 初始化加载底图函数 */
function init() {
    /* 添加底图(底图切换) */
    // 设置底图的容器、底图中心、缩放级别
    map = L.map('mapDiv').setView([30.580,114.327],16);

    /* 切换底图的选项 */
    // 设置--默认底图(openStreetMap)--的样式、最小最大缩放级别--并添加到地图中
    var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {minZoom: 16, maxZoom: 19,}).addTo(map);

    // MapboxStreetMap
    var MaxboxStreetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
        {minZoom: 16, maxZoom: 19, id: 'mapbox.streets', accessToken: 'pk.eyJ1IjoiamdwMTc1NTY4NDY3NyIsImEiOiJjazJhaDM5dXowbTNlM25vMTYzZjJlemJ4In0.UofA543eDF8oTh4Sq3wscA'});

    // 天地图底图
    var TianDiTuNormalMap = L.tileLayer.chinaProvider('TianDiTu.Normal.Map',
        {minZoom: 16, maxZoom: 19});

    // 天地图标注
    var TianDiTuNormalAnnotion = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion',
        {minZoom: 16, maxZoom: 19});

    // 天地图
    var TianDiTuNormal = L.layerGroup([TianDiTuNormalMap, TianDiTuNormalAnnotion]);

    //天地图影像图底图
    var TianDiTuSatelliteMap = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map',
        {minZoom: 16, maxZoom: 19});

    // 天地图影像图标注
    var TianDiTuSatelliteAnnotion = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion',
        {minZoom: 16, maxZoom: 19});

    // 天地图影像图
    var TianDiTuSatellite = L.layerGroup([TianDiTuSatelliteMap, TianDiTuSatelliteAnnotion]);

    /* 缩放等级达不到使用要求
    // 天地图地形图底图
    var TianDiTuTerrainMap = L.tileLayer.chinaProvider('TianDiTu.Terrain.Map',
        {minZoom: 2, maxZoom: 19});

    // 天地图地形图标注
    var TianDiTuTerrainAnnotion = L.tileLayer.chinaProvider('TianDiTu.Terrain.Annotion',
        {minZoom: 2, maxZoom: 19});

    // 天地图地形图
    var TianDiTuTerrain = L.layerGroup([TianDiTuTerrainMap, TianDiTuTerrainAnnotion]);
     */

    // 添加底图切换选项
    var baseMaps = {
        "OpenStreetMap": openStreetMap,
        "MapboxStreetMap": MaxboxStreetMap,
        "天地图": TianDiTuNormal,
        "天地图影像图": TianDiTuSatellite
    };

    /* 添加自定义底图 */
    // 自定义图层服务发布地址
    var schoolUrl = 'http://134.175.72.35:2333/geoserver/VMCS/wms';
    // 构建自定义图层
    var schoolLayer = L.tileLayer.wms(schoolUrl,{
        // 添加的图层名称
        layers: ['VMCS:SchoolArea', 'VMCS:SchoolRoad'],
        // 设置图层最小缩放等级
        minZoom: 16,
        // 设置图层最大缩放等级
        maxZoom: 19,
        // 图层格式
        format: "image/png",
        // 投影类型
        crs: L.CRS.EPSG4326,
        // 设置自定义图层的透明度
        opacity: 1,
        // 设置自定义图层允许透明
        transparent: true
    }).addTo(map);

    /* 自定义图层切换选项 */
    var overlayMaps = {
        "湖北大学地图": schoolLayer
    };

    /* 将底图切换选项控件添加到地图中 */
    L.control.layers(baseMaps, overlayMaps).addTo(map);
}