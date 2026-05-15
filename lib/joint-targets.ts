// Shared joint-target definitions used by both the interactive rig
// (SkeletonExplorer) and the pose-driven rig (PosedSkeletonCanvas).
//
// Each entry maps a slider key (`${boneId}__${axis}`) to either a
// single bone (the joint is one bone rotating one axis) or a
// distributed set of bones (e.g. a spinal region's angle spread
// across all its vertebrae with weights).
//
// Defining these here means new joint capabilities can be added
// in one place and both renderers pick them up automatically.

export type Axis = 'x' | 'y' | 'z';

export interface JointTarget {
  /** Either the slider key itself (for non-distributed) or a region
   *  identifier (for distributed sliders, prefixed with `region:`). */
  boneId: string;
  axis: Axis;
  /** When set, the slider's value is split across these bones using
   *  the listed weights. Used for spinal regions and the hip hinge. */
  distribute?: { boneId: string; weight: number }[];
}

export const JOINT_TARGETS: Record<string, JointTarget> = {
  // ============================================================
  // LIMBS — direct single-bone single-axis rotations
  // ============================================================
  'UpperArm_r__x': { boneId: 'UpperArm_r', axis: 'x' },
  'UpperArm_l__x': { boneId: 'UpperArm_l', axis: 'x' },
  'UpperArm_r__y': { boneId: 'UpperArm_r', axis: 'y' },
  'UpperArm_l__y': { boneId: 'UpperArm_l', axis: 'y' },
  'UpperArm_r__z': { boneId: 'UpperArm_r', axis: 'z' },
  'UpperArm_l__z': { boneId: 'UpperArm_l', axis: 'z' },
  'Forearm_r__x': { boneId: 'Forearm_r', axis: 'x' },
  'Forearm_l__x': { boneId: 'Forearm_l', axis: 'x' },
  'Hand_r__x': { boneId: 'Hand_r', axis: 'x' },
  'Hand_l__x': { boneId: 'Hand_l', axis: 'x' },
  'Thigh_r__x': { boneId: 'Thigh_r', axis: 'x' },
  'Thigh_l__x': { boneId: 'Thigh_l', axis: 'x' },
  'Thigh_r__y': { boneId: 'Thigh_r', axis: 'y' },
  'Thigh_l__y': { boneId: 'Thigh_l', axis: 'y' },
  'Thigh_r__z': { boneId: 'Thigh_r', axis: 'z' },
  'Thigh_l__z': { boneId: 'Thigh_l', axis: 'z' },
  'Shin_r__x': { boneId: 'Shin_r', axis: 'x' },
  'Shin_l__x': { boneId: 'Shin_l', axis: 'x' },

  // ============================================================
  // HEAD — direct rotations on the head bone
  // ============================================================
  'Head__x': { boneId: 'Head', axis: 'x' },
  'Head__y': { boneId: 'Head', axis: 'y' },
  'Head__z': { boneId: 'Head', axis: 'z' },
  'Neck_C1_Atlas__x': { boneId: 'Neck_C1_Atlas', axis: 'x' },
  'Neck_C2_Axis__y': { boneId: 'Neck_C2_Axis', axis: 'y' },

  // ============================================================
  // SPINE — flexion/extension (X axis in bone-frame)
  // Positive = forward fold; negative = backbend.
  // ============================================================
  'region:lumbar__x': {
    boneId: 'region:lumbar',
    axis: 'x',
    distribute: [
      { boneId: 'Spine_L1', weight: 0.15 },
      { boneId: 'Spine_L2', weight: 0.18 },
      { boneId: 'Spine_L3', weight: 0.20 },
      { boneId: 'Spine_L4', weight: 0.23 },
      { boneId: 'Spine_L5', weight: 0.24 },
    ],
  },
  'region:thoracic__x': {
    boneId: 'region:thoracic',
    axis: 'x',
    distribute: [
      { boneId: 'Spine_T1', weight: 0.04 },
      { boneId: 'Spine_T2', weight: 0.05 },
      { boneId: 'Spine_T3', weight: 0.05 },
      { boneId: 'Spine_T4', weight: 0.06 },
      { boneId: 'Spine_T5', weight: 0.07 },
      { boneId: 'Spine_T6', weight: 0.08 },
      { boneId: 'Spine_T7', weight: 0.09 },
      { boneId: 'Spine_T8', weight: 0.10 },
      { boneId: 'Spine_T9', weight: 0.10 },
      { boneId: 'Spine_T10', weight: 0.11 },
      { boneId: 'Spine_T11', weight: 0.12 },
      { boneId: 'Spine_T12', weight: 0.13 },
    ],
  },
  'region:cervical__x': {
    boneId: 'region:cervical',
    axis: 'x',
    distribute: [
      { boneId: 'Neck_C3', weight: 0.20 },
      { boneId: 'Neck_C4', weight: 0.22 },
      { boneId: 'Neck_C5', weight: 0.22 },
      { boneId: 'Neck_C6', weight: 0.20 },
      { boneId: 'Neck_C7', weight: 0.16 },
    ],
  },

  // ============================================================
  // SPINE — lateral flexion (Z axis in bone-frame)
  // Positive = side-bend right (right ear toward right shoulder).
  // Critical for Trikonasana, Parsvakonasana, half-moon, side bends.
  // ============================================================
  'region:lumbar-side__z': {
    boneId: 'region:lumbar-side',
    axis: 'z',
    distribute: [
      { boneId: 'Spine_L1', weight: 0.18 },
      { boneId: 'Spine_L2', weight: 0.20 },
      { boneId: 'Spine_L3', weight: 0.22 },
      { boneId: 'Spine_L4', weight: 0.20 },
      { boneId: 'Spine_L5', weight: 0.20 },
    ],
  },
  'region:thoracic-side__z': {
    boneId: 'region:thoracic-side',
    axis: 'z',
    distribute: [
      { boneId: 'Spine_T1', weight: 0.05 },
      { boneId: 'Spine_T2', weight: 0.06 },
      { boneId: 'Spine_T3', weight: 0.07 },
      { boneId: 'Spine_T4', weight: 0.07 },
      { boneId: 'Spine_T5', weight: 0.08 },
      { boneId: 'Spine_T6', weight: 0.09 },
      { boneId: 'Spine_T7', weight: 0.09 },
      { boneId: 'Spine_T8', weight: 0.10 },
      { boneId: 'Spine_T9', weight: 0.10 },
      { boneId: 'Spine_T10', weight: 0.10 },
      { boneId: 'Spine_T11', weight: 0.10 },
      { boneId: 'Spine_T12', weight: 0.09 },
    ],
  },
  'region:cervical-side__z': {
    boneId: 'region:cervical-side',
    axis: 'z',
    distribute: [
      { boneId: 'Neck_C3', weight: 0.20 },
      { boneId: 'Neck_C4', weight: 0.22 },
      { boneId: 'Neck_C5', weight: 0.22 },
      { boneId: 'Neck_C6', weight: 0.20 },
      { boneId: 'Neck_C7', weight: 0.16 },
    ],
  },

  // ============================================================
  // SPINE — rotation / twist (Y axis in bone-frame)
  // Positive = rotation to the right.
  // Critical for Marichyasana, Parivrtta Trikonasana, twists.
  // Note: lumbar twist range is small (5-13°) by design — the spine
  // isn't built to twist there; most "lumbar twist" sensation is
  // thoracic in practice.
  // ============================================================
  'region:lumbar-twist__y': {
    boneId: 'region:lumbar-twist',
    axis: 'y',
    distribute: [
      { boneId: 'Spine_L1', weight: 0.22 },
      { boneId: 'Spine_L2', weight: 0.22 },
      { boneId: 'Spine_L3', weight: 0.20 },
      { boneId: 'Spine_L4', weight: 0.18 },
      { boneId: 'Spine_L5', weight: 0.18 },
    ],
  },
  'region:thoracic-twist__y': {
    boneId: 'region:thoracic-twist',
    axis: 'y',
    distribute: [
      { boneId: 'Spine_T1', weight: 0.10 },
      { boneId: 'Spine_T2', weight: 0.10 },
      { boneId: 'Spine_T3', weight: 0.10 },
      { boneId: 'Spine_T4', weight: 0.09 },
      { boneId: 'Spine_T5', weight: 0.09 },
      { boneId: 'Spine_T6', weight: 0.08 },
      { boneId: 'Spine_T7', weight: 0.08 },
      { boneId: 'Spine_T8', weight: 0.07 },
      { boneId: 'Spine_T9', weight: 0.07 },
      { boneId: 'Spine_T10', weight: 0.06 },
      { boneId: 'Spine_T11', weight: 0.05 },
      { boneId: 'Spine_T12', weight: 0.05 },
    ],
  },
  'region:cervical-twist__y': {
    boneId: 'region:cervical-twist',
    axis: 'y',
    distribute: [
      { boneId: 'Neck_C3', weight: 0.18 },
      { boneId: 'Neck_C4', weight: 0.20 },
      { boneId: 'Neck_C5', weight: 0.22 },
      { boneId: 'Neck_C6', weight: 0.20 },
      { boneId: 'Neck_C7', weight: 0.20 },
    ],
  },

  // ============================================================
  // HIP HINGE (compound: pelvis tilts + thighs counter-rotate)
  // Real biomechanical hip hinge: pelvis tilts forward at the hip,
  // legs stay vertical in world space. In rig terms: tip the pelvis
  // bone forward AND counter-rotate both thighs by the same amount.
  // Net effect: trunk folds forward, legs remain vertical.
  // ============================================================
  'region:hip-hinge__x': {
    boneId: 'region:hip-hinge',
    axis: 'x',
    distribute: [
      { boneId: 'Pelvis', weight: 1.0 },
      { boneId: 'Thigh_l', weight: -1.0 },
      { boneId: 'Thigh_r', weight: -1.0 },
    ],
  },
};
