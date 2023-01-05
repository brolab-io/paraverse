export const templates = [
  [],
  [
    {
      id: 'building',
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
      scale: {
        x: 1,
        y: 1,
        z: 1,
      },
      components: {
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
        scale: {
          x: 1,
          y: 1,
          z: 1,
        },
        'gltf-model': 'https://metabuilder.brolab.io/uploads/solana-room-YoFzJFHL.glb',
      },
    },
  ],
];

const previewImages = [
  'https://via.placeholder.com/800x400',
  'https://metabuilder.brolab.io/uploads/screenshot-3TB3ubui.jpg',
];

export const getTemplate = (index: number) => {
  return {
    entities: templates[index] || [],
    previewImage: previewImages[index] || '',
  };
};
