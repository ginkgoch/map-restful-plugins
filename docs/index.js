const layers = ['lakespy2', 'twprgpy3', 'mcd90py2', 'ctybdpy2'];

function identify(baseURL, geoJSON) {
    return async function(evt) {
        geoJSON.clearLayers();
        let postData = postDataTemplate;
        postData.geometry.coordinates = [evt.latlng.lng, evt.latlng.lat];
        let zoom = evt.target.getZoom();
        for (let layer of layers) {
            let url = `${baseURL}/${layer}_3857/query?simplifyZoom=${zoom}&&outCRS=WGS84`;

            try {
                let res = await axios.post(url, postData);
                if (res.features.length > 0) {
                    geoJSON.addData(res).bindPopup(getPopupContent(res.features[0])).openPopup();
                    return;
                }
            }
            catch (ex) {
                console.error(ex);
            }
        }

        console.log('no features found');
    }
}

let postDataTemplate = {
    "relation": "intersection",
    "geometry": {
        "type": "Point",
        "coordinates": [
            -93.7985,
            47.5097
        ]
    },
    "geometryCRS": "WGS84",
    "fields": "all"
}

function getPopupContent(f) {
    let tableContent = '';
    tableContent += '<table cellspacing="0">';
    for (let key in f.properties) {
        tableContent += `<tr><th>${ key }</th><td>${ f.properties[key] }</td></tr>`;
    }
    tableContent += '</table>';
    return tableContent;
}