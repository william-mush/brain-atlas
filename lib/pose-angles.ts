// Per-pose joint angle presets for the rigged skeleton at /skeleton.
//
// Each entry is a mapping from slider key (`${boneId}__${axis}`) to degrees.
// The slider keys match what SkeletonExplorer.tsx uses.
//
// Sign conventions (verified by inspection):
//   Spine flex/extend X axis: NEGATIVE = backbend (extension), POSITIVE = forward fold (flexion).
//   Shoulder flex X axis: POSITIVE = arm flexion (raise forward & overhead).
//   Hip flex X axis: POSITIVE = hip flexion (bring thigh toward chest).
//   Knee X axis: NEGATIVE = knee flexion (bend the knee).
//
// Notes on what's intentionally omitted:
//   - The rig has no IK constraint, so poses like Down Dog or Wheel where
//     hands and feet are on the floor look "floating" — the body's overall
//     position relative to the ground isn't constrained. That's a known
//     limitation of this Option-B authoring approach.
//   - Joint angles for ASYMMETRIC poses (Warrior I/II) reflect a right-side
//     lead (front leg = right, back leg = left). A "mirror" toggle could
//     swap them in a future session.

export interface PoseAngles {
  id: string;          // matches the pose id in lib/poses.ts
  english: string;
  sanskrit: string;
  /** Slider key (`${boneId}__${axis}`) → degrees. Missing keys default to 0. */
  angles: Record<string, number>;
  /**
   * Optional rotation of the entire scene root, in degrees, applied as
   * Euler [x, y, z]. Use to tip the body into the correct world-space
   * orientation for poses that aren't vertical-standing — Down Dog
   * (~90° forward pitch around X), inversions, prone poses, etc.
   *
   * This is a substitute for proper inverse kinematics (which would
   * keep the hands/feet on the floor automatically). With root rotation
   * we get the gross orientation right; the hands and feet still float
   * relative to a real ground plane.
   */
  rootRotation?: [number, number, number];
  /**
   * Optional translation of the root, in scene units. Use with
   * rootRotation to lift the body so feet still appear "on the floor"
   * after rotation. Almost always paired with rootRotation.
   */
  rootTranslation?: [number, number, number];
}

export const POSE_ANGLES: PoseAngles[] = [
  // ============================================================
  // 1. TADASANA — Mountain Pose
  // Everything at neutral. The reference pose.
  // ============================================================
  {
    id: 'tadasana',
    english: 'Mountain Pose',
    sanskrit: 'Tadasana',
    angles: {
      // All joints at 0° — this is the rest pose.
    },
  },

  // ============================================================
  // 2. UTTANASANA — Standing Forward Fold
  // Hips fold forward; spine drapes; head heavy; arms hang.
  //
  // SAME RIG LIMITATION as Down Dog: the rig's root is the pelvis,
  // so we can't tilt the pelvis at the hip. We approximate by
  // bending the entire spine deeply forward.
  // ============================================================
  {
    id: 'uttanasana',
    english: 'Standing Forward Fold',
    sanskrit: 'Uttanasana',
    angles: {
      // Major lumbar + thoracic flexion replaces the hip-hinge
      'region:lumbar__x': 60,
      'region:thoracic__x': 35,
      // Head drops forward
      'region:cervical__x': 50,
      // Arms hang relaxed forward
      'UpperArm_r__x': 30,
      'UpperArm_l__x': 30,
    },
  },

  // ============================================================
  // 3. ADHO MUKHA SVANASANA — Downward-Facing Dog
  // Inverted V. Hands and feet on floor, hips lifted high.
  //
  // RIGGING NOTE: Down Dog's body shape comes from a deep pelvic tilt
  // — in real anatomy the pelvis rotates forward (anteversion ~90°)
  // while the legs stay near-vertical. Our rig has the Pelvis as the
  // root bone, so we can't pivot the pelvis at the hip joint. Instead
  // we approximate by deeply flexing the lumbar + thoracic spine
  // forward (~90° total). This puts the torso roughly horizontal,
  // which is the visual goal. Arms reach overhead from there.
  // ============================================================
  {
    id: 'down-dog',
    english: 'Downward-Facing Dog',
    sanskrit: 'Adho Mukha Svanasana',
    // Pitch the whole body forward so the trunk reaches toward the
    // floor — the visual inverted-V. The joint angles below are stated
    // in the body's own frame, so once the trunk is horizontal the
    // shoulder-flex carries the arms toward the ground (which is what
    // happens in real Down Dog: arms reach away from the hips, and
    // because the hips are stacked over the heels, the arms point at
    // the floor in front of the body).
    rootRotation: [-45, 0, 0],
    rootTranslation: [0, 0.2, 0],
    angles: {
      // Approximate the hip hinge by folding the spine forward at the
      // lumbar (most of the angle) and thoracic (a bit more)
      'region:lumbar__x': 50,
      'region:thoracic__x': 30,
      // Head looks down between the arms (extra cervical flexion)
      'region:cervical__x': 30,
      // Shoulders flex overhead (180° from upright trunk = arms reach
      // continued past horizontal once the trunk is horizontal — so
      // effective shoulder angle from arms-down rest is ~170°)
      'UpperArm_r__x': 170,
      'UpperArm_l__x': 170,
      // External rotation — biceps face forward (Down Dog cue)
      'UpperArm_r__y': 30,
      'UpperArm_l__y': -30,
      // Wrists extend so palms can rest flat
      'Hand_r__x': 60,
      'Hand_l__x': 60,
      // Legs stay roughly vertical — no hip flexion since spine carries it
    },
  },

  // ============================================================
  // 4. VIRABHADRASANA I — Warrior I
  // Right (front) leg bent ~90°, left (back) leg straight with
  // foot turned out. Both arms reach overhead. Hips face forward.
  // ============================================================
  {
    id: 'warrior-1',
    english: 'Warrior I',
    sanskrit: 'Virabhadrasana I',
    angles: {
      // FRONT leg (right): hip flexion + 90° knee bend
      'Thigh_r__x': 70,
      'Shin_r__x': -90,
      // BACK leg (left): hip extension + knee straight + slight
      // hip rotation to honor the foot-turnout
      'Thigh_l__x': -15,
      'Shin_l__x': 0,
      'Thigh_l__y': -25,
      // Arms overhead, slight external rotation
      'UpperArm_r__x': 175,
      'UpperArm_l__x': 175,
      'UpperArm_r__y': 20,
      'UpperArm_l__y': -20,
      // Slight thoracic extension (backbend feel of the chest reach)
      'region:thoracic__x': -10,
      // Gaze slightly up
      'region:cervical__x': -10,
      // Lumbar stays neutral with a tiny extension from the front-body lift
      'region:lumbar__x': -5,
    },
  },

  // ============================================================
  // 5. VIRABHADRASANA II — Warrior II
  // Wide stance. Right knee bent 90°. Hips OPEN (face long side
  // of mat, NOT forward like Warrior I). Arms in a T.
  // ============================================================
  {
    id: 'warrior-2',
    english: 'Warrior II',
    sanskrit: 'Virabhadrasana II',
    angles: {
      // FRONT (right) leg — bent at the knee, hip abducted and slightly flexed
      'Thigh_r__x': 25,
      'Thigh_r__z': -45,  // abducted out to side
      'Thigh_r__y': 30,   // externally rotated to face front
      'Shin_r__x': -90,
      // BACK (left) leg — straight, abducted to the side
      'Thigh_l__x': 0,
      'Thigh_l__z': 45,   // abducted out to the other side
      'Shin_l__x': 0,
      // ARMS in a T — shoulders abducted 90°
      'UpperArm_r__z': -90,
      'UpperArm_l__z': 90,
      // Spine stays vertical
      // Gaze over front (right) hand — head turns right
      'Neck_C2_Axis__y': 30,
    },
  },

  // ============================================================
  // 6. PLANK — Phalakasana
  // Body horizontal, hands under shoulders, head/spine/heels in
  // one long line. The rig has no IK so the body floats — but the
  // joint configuration is correct.
  // ============================================================
  {
    id: 'plank',
    english: 'Plank',
    sanskrit: 'Phalakasana',
    // Tip the body forward 90° so it's horizontal (face down).
    rootRotation: [-90, 0, 0],
    rootTranslation: [0, -0.5, 0],
    angles: {
      // Shoulders flexed 90° forward (the body is the lever, arms reach
      // down to floor — equivalent to flexing the shoulder so the arm
      // is perpendicular to the spine).
      'UpperArm_r__x': 90,
      'UpperArm_l__x': 90,
      // Wrists extend so palms can be flat on floor
      'Hand_r__x': 70,
      'Hand_l__x': 70,
      // Body straight: zero spinal flexion
    },
  },

  // ============================================================
  // 7. CHATURANGA DANDASANA
  // Like plank but elbows bent 90°, body hovering just above floor.
  // ============================================================
  {
    id: 'chaturanga',
    english: 'Four-Limbed Staff',
    sanskrit: 'Chaturanga Dandasana',
    // Same horizontal orientation as plank.
    rootRotation: [-90, 0, 0],
    rootTranslation: [0, -0.5, 0],
    angles: {
      'UpperArm_r__x': 90,
      'UpperArm_l__x': 90,
      // Elbows bent 90°
      'Forearm_r__x': -90,
      'Forearm_l__x': -90,
      'Hand_r__x': 70,
      'Hand_l__x': 70,
    },
  },

  // ============================================================
  // 8. URDHVA MUKHA SVANASANA — Upward-Facing Dog
  // Strong front-body opener. Spine extends; arms straight under
  // shoulders; thighs lifted off floor.
  // ============================================================
  {
    id: 'up-dog',
    english: 'Upward-Facing Dog',
    sanskrit: 'Urdhva Mukha Svanasana',
    // Horizontal orientation with the chest open and arms straight under
    // shoulders — similar plane to plank but with backbend.
    rootRotation: [-90, 0, 0],
    rootTranslation: [0, -0.5, 0],
    angles: {
      // Spine in deep extension across all regions
      'region:lumbar__x': -25,
      'region:thoracic__x': -25,
      'region:cervical__x': -40,
      // Hip extension (legs reach back behind the pelvis)
      'Thigh_r__x': -15,
      'Thigh_l__x': -15,
      // Arms reach down to floor (shoulder flex 90)
      'UpperArm_r__x': 90,
      'UpperArm_l__x': 90,
      // Wrists extend
      'Hand_r__x': 70,
      'Hand_l__x': 70,
    },
  },

  // ============================================================
  // 9. URDHVA DHANURASANA — Wheel Pose (the user's specific ask)
  // The full backbend. Hands and feet on floor, body arched upward.
  // ============================================================
  {
    id: 'wheel',
    english: 'Wheel Pose',
    sanskrit: 'Urdhva Dhanurasana',
    angles: {
      // FULL spinal extension — the biggest backbend
      'region:lumbar__x': -40,
      'region:thoracic__x': -28,
      'region:cervical__x': -60,
      // Hip extension to lift the pelvis
      'Thigh_r__x': -20,
      'Thigh_l__x': -20,
      // Knees bent 60° so feet stay on floor
      'Shin_r__x': -60,
      'Shin_l__x': -60,
      // Shoulders flexed past 180° — arms reach back to land hands on floor
      'UpperArm_r__x': 200,
      'UpperArm_l__x': 200,
      // External rotation so elbows track properly
      'UpperArm_r__y': 30,
      'UpperArm_l__y': -30,
      // Wrists fully extended for flat palms
      'Hand_r__x': 80,
      'Hand_l__x': 80,
    },
  },
];

export function getPoseAngles(id: string): PoseAngles | undefined {
  return POSE_ANGLES.find((p) => p.id === id);
}
