import React, {useEffect, useState} from 'react';
import DeckGL from '@deck.gl/react/typed';
import {PointCloudLayer} from '@deck.gl/layers/typed';
import {COORDINATE_SYSTEM, OrbitView, LinearInterpolator} from '@deck.gl/core/typed';
import {LASWorkerLoader} from '@loaders.gl/las';

const LAZ_SAMPLE = 'http://localhost:9090/download-laz';
const LAZ_SAMPLE2 = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/point-cloud-laz/indoor.0.1.laz';
const LAZ_SAMPLE3 = 'https://storage.googleapis.com/xp-lidar-1/20230607_013618_vMS3D_Velodyne_HDL32E.laz';

const INITIAL_VIEW_STATE = {
    target: [0, 0, 0],
    rotationX: 0,
    rotationOrbit: 0,
    orbitAxis: 'Y',
    fov: 50,
    minZoom: 0,
    maxZoom: 10,
    zoom: 1
};

const transitionInterpolator = new LinearInterpolator(['rotationOrbit']);

export const App = ({onLoad}: any) => {
    const [viewState, updateViewState] = useState(INITIAL_VIEW_STATE);
    const [isLoaded, setIsLoaded] = useState(false);
    const [layers, setLayers] = useState<Array<any>>([]);
    const [blobData, setBlobData] = useState<any>(null);

    const getLaz = () => {
        fetch(LAZ_SAMPLE3).then((response) => response.arrayBuffer()).then((blob) => {
            console.log(blob);
            let objectURL = URL.createObjectURL(new Blob([blob], {type: 'application/octet-stream'}));
            setBlobData(objectURL);
        });

        URL.revokeObjectURL('http://localhost:9090/download-laz');
    };

    useEffect(() => {
        if (!isLoaded) {
            return;
        }
        const rotateCamera = () => {
            updateViewState(v => ({
                ...v,
                rotationOrbit: v.rotationOrbit + 120,
                transitionDuration: 2400,
                transitionInterpolator,
                onTransitionEnd: rotateCamera
            }));
        };
        rotateCamera();
    }, [isLoaded]);

    const onDataLoad = ({header}: any) => {
        if (header.boundingBox) {
            const [mins, maxs] = header.boundingBox;
            // File contains bounding box info
            updateViewState({
                ...INITIAL_VIEW_STATE,
                target: [(mins[0] + maxs[0]) / 2, (mins[1] + maxs[1]) / 2, (mins[2] + maxs[2]) / 2],
                /* global window */
                zoom: Math.log2(window.innerWidth / (maxs[0] - mins[0])) - 1
            });
            setIsLoaded(true);
        }

        if (onLoad) {
            onLoad({count: header.vertexCount, progress: 1});
        }
    };

    useEffect(() => {
        getLaz();
    }, [])

    useEffect(() => {
        blobData && setLayers([
            new PointCloudLayer({
                id: 'laz-point-cloud-layer',
                data: blobData,
                onDataLoad,
                coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
                getNormal: [0, 1, 0],
                getColor: [255, 255, 255],
                opacity: 0.5,
                pointSize: 0.5,
                loaders: [LASWorkerLoader]
            })])
    }, [blobData])

    {/*@ts-ignore*/}
    return (layers.length ?
            <DeckGL
                views={new OrbitView({orbitAxis: 'Y', fovy: 50})}
                viewState={viewState}
                controller={true}
                onClick={(e) => console.log(e)}
                onViewStateChange={(v: any) => updateViewState(v.viewState)}
                layers={layers}
                parameters={{
                    clearColor: [0.93, 0.86, 0.81, 1]
                }}
            /> : <></>
    )
        ;
}
