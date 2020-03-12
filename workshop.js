const path = require('path');
const { 
    MapEngine, Srs, ShapefileFeatureSource, Projection, FeatureLayer, 
    FillStyle, LineStyle, PointStyle, ValueStyle, SymbolTextStyle, IconStyle, TextStyle, Image
} = require('ginkgoch-map').default.all;

const rootPath = path.resolve(__dirname, './workshop');
const CRS_GOOGLE = 'EPSG:900913';
const FONT = '10px ARIAL';

module.exports = {
    getMap() {
        let mapEngine = new MapEngine(256, 256);
        mapEngine.name = 'workshop';
        mapEngine.srs = new Srs(CRS_GOOGLE);

        _addFeatureLayerV2(mapEngine, 'ctybdpy2', { type: 'fill', fillStyle: 'rgba(128,128,128,0.6)', strokeStyle: '#e1e1b9', lineWidth: 1 });
        _addFeatureLayerV2(mapEngine, 'mcd90py2', { type: 'fill', fillStyle: '#ffe15a', strokeStyle: '#ffe15a', lineWidth: 0 });
        _addFeatureLayerV2(mapEngine, 'twprgpy3', { type: 'fill', fillStyle: 'transparent', strokeStyle: '#b5b591', lineWidth: 1 });
        _addFeatureLayerV2(mapEngine, 'lakespy2', { type: 'fill', fillStyle: '#3175b9', strokeStyle: '#b5b591', lineWidth: 1 });
        _addFeatureLayerV2(mapEngine, 'dlgstln2', { type: 'line', strokeStyle: '#3175b9', lineWidth: 1 });
        _addFeatureLayerV2(mapEngine, 'ctyrdln3', { type: 'line', strokeStyle: 'black', lineWidth: 1, maximumScale: 300000 });
        _addFeatureLayerV2(mapEngine, 'majrdln3', { type: 'line', strokeStyle: 'black', lineWidth: 1, maximumScale: 600000 });
        _addFeatureLayerV2(mapEngine, 'airports', { type: 'icon', image: 'symbols/airport.png', maximumScale: 600000 });
        _addFeatureLayerV2(mapEngine, 'majrdln3', { type: 'values', field: 'ROAD_CLASS', maximumScale: 600000, items: [
            {
                value: '3',
                style: {
                    type: 'symbol-text',
                    field: 'ROAD_NUM',
                    fillStyle: 'black',
                    font: FONT,
                    symbol: {
                        type: 'point',
                        fillStyle: 'white',
                        strokeStyle: 'black',
                        lineWidth: 1,
                        symbol: 'square',
                        radius: 18
                    }
                }
            }, {
                value: '2',
                style: {
                    type: 'symbol-text',
                    field: 'ROAD_NUM',
                    fillStyle: 'black',
                    font: FONT,
                    symbol: {
                        type: 'icon',
                        image: 'symbols/ushwy.png'
                    }
                }
            }, {
                value: '1',
                style: {
                    type: 'symbol-text',
                    field: 'ROAD_NUM',
                    fillStyle: 'black',
                    font: FONT,
                    symbol: {
                        type: 'icon',
                        image: 'symbols/interstate.png'
                    }
                }
            }
        ] });

        _addFeatureLayerV2(mapEngine, 'mcd90py2', { type: 'text', content: '[CITY_NAME]', fillStyle: 'black', strokeStyle: 'white', lineWidth: 2 });

        return mapEngine;
    },
}

function _addFeatureLayerV2(mapEngine, name, styleOptions) {
    let sourcePath = path.resolve(rootPath, 'data', `${name}_3857.shp`);
    let source = new ShapefileFeatureSource(sourcePath);
    source.projection = new Projection(CRS_GOOGLE, CRS_GOOGLE);
    let layer = new FeatureLayer(source);

    let style = _parseStyleV2(styleOptions);
    if (style !== undefined) {
        layer.styles.push(style);
    } else {
        console.log(`style for ${name} is not recognized`);
    }

    mapEngine.pushLayer(layer);
}

function _parseStyleV2(styleOptions) {
    let style = undefined;

    switch(styleOptions.type) {
        case 'fill': style = new FillStyle(); break;
        case 'line': style =  new LineStyle(); break;
        case 'point': style =  new PointStyle(); break;
        case 'text': style =  new TextStyle(); break;
        case 'icon': return _parseIconStyleV2(styleOptions);
        case 'values': return _parseValueStyleV2(styleOptions);
        case 'symbol-text': return _parseSymbolTextStyleV2(styleOptions);
        default: return undefined;
    }

    delete styleOptions.type;
    Object.assign(style, { ...styleOptions });

    return style;
}

function _parseValueStyleV2(styleOptions) {
    let style = new ValueStyle(`${styleOptions.field}`);

    _setGeneralOptions(style, styleOptions);

    styleOptions.items.forEach(i => {
        let value = i.value;
        let subStyle = _parseStyleV2(i.style);
        style.items.push({ value, style: subStyle });
    });

    return style;
}

function _parseSymbolTextStyleV2(styleOptions) {
    let style = new SymbolTextStyle(`[${styleOptions.field}]`, styleOptions.fillStyle);
    _setGeneralOptions(style, styleOptions);

    style.symbol = _parseStyleV2(styleOptions.symbol);
    return style;
}

function _parseIconStyleV2(styleOptions) {
    let imageFilePath = path.resolve(rootPath, styleOptions.image);
    let style = new IconStyle(new Image(imageFilePath));
    _setGeneralOptions(style, styleOptions);
    return style;
}

function _setGeneralOptions(style, options) {
    let keys = ['maximumScale', 'minimumScale', 'font'];
    keys.forEach(k => { if (options[k] !== undefined) {
        style[k] = options[k]
    }});
}