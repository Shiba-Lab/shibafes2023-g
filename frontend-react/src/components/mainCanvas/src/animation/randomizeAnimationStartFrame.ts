import * as THREE from "three";

export const randomizeAnimationStartFrame = (clip: THREE.AnimationClip) => {
  const offset = Math.random() * clip.duration;

  const modifiedTracks = clip.tracks.map((track) => {
    const modifiedTimes = track.times.map((time) => time + offset);
    return new THREE.KeyframeTrack(track.name, modifiedTimes, track.values);
  });

  // 調整したトラックで新しいアニメーションクリップを作成
  return new THREE.AnimationClip(clip.name, clip.duration * 10, modifiedTracks);
};
