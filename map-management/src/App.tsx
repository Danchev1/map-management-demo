import React, {useState} from 'react';
import DeckGL from '@deck.gl/react/typed';
import {Tile3DLayer} from "@deck.gl/geo-layers/typed";
import {CesiumIonLoader} from '@loaders.gl/3d-tiles';
import {OrbitView} from "deck.gl/typed";


const ION_ASSET_ID = 2158311;
const ION_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiOTA5Mjg5My1jNjljLTQyOWItYWM5Zi00MmQwMTJhZWU2NTYiLCJpZCI6MTYwNTQyLCJpYXQiOjE2OTIwOTU3NDR9.2sPCQMctdB_z2dnckvtN76-gAxdtwKM3iQSxTJXVB0A';
const TILESET_URL = `https://assets.ion.cesium.com/${ION_ASSET_ID}/tileset.json`;
const TILESET_URL_Local = `http://localhost:3000/pointCloudDemoLargoLAS/tileset.json`;

const INITIAL_VIEW_STATE = {
    latitude: 40,
    longitude: -75,
    pitch: 45,
    maxPitch: 60,
    bearing: 0,
    zoom: 17
};

export const App = ({
                        mapStyle = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
                        updateAttributions
                    }: any) => {
    const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE);


    const layer = new Tile3DLayer({
        id: 'tile-3d-layer',
        // tileset json file url
        data: TILESET_URL,
        loader: CesiumIonLoader,
        // https://cesium.com/docs/rest-api/
        pointSize: 2,
        loadOptions: {
            'cesium-ion': {accessToken: ION_TOKEN}
        },
        onTilesetLoad: (tileset: any) => {
            // Recenter view to cover the new tileset
            const {cartographicCenter, zoom} = tileset;
            setInitialViewState({
                ...INITIAL_VIEW_STATE,
                longitude: cartographicCenter[0],
                latitude: cartographicCenter[1],
                zoom
            });

            if (updateAttributions) {
                updateAttributions(tileset.credits && tileset.credits.attributions);
            }
        }
    });

    console.log(layer);

    {/*@ts-ignore*/
    }
    return (<DeckGL layers={[layer]} initialViewState={initialViewState} controller={true} onClick={(e) => console.log('deck.gl -', e)}>
    </DeckGL>);
}
