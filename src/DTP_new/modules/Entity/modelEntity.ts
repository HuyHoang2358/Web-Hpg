import { useGlobalStore } from '@/stores/globalStore';
import { Cartesian3, HeadingPitchRoll, Transforms, Math } from 'cesium';
function prepare_position(
  long: number,
  lat: number,
  height: number,
  heading: number,
  pitch: number,
  roll: number,
) {
  // heading, pitch, roll is degrees
  const position = Cartesian3.fromDegrees(long, lat, height);
  const orientation = Transforms.headingPitchRollQuaternion(
    position,
    new HeadingPitchRoll(Math.toRadians(heading), Math.toRadians(pitch), Math.toRadians(roll)),
  );
  return { position: position, orientation: orientation };
}

export function visualizeModelEntity(model: any) {
  const globalStore = useGlobalStore();
  const viewer = globalStore.viewer;
  if (!viewer) return;

  const position_info = prepare_position(
    model.longitude,
    model.latitude,
    model.height,
    model.heading,
    model.pitch,
    model.roll,
  );

  return viewer.entities.add({
    name: model.model_id,
    description: 'building',
    position: position_info.position,
    orientation: position_info.orientation,
    model: {
      uri: '/data3D/glb_texture/' + model.model_id + '.glb',
      scale: model.scale,
    },
  });
}
