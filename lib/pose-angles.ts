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
      // HIP HINGE — pelvis tips forward, legs stay vertical. This is
      // the new compound rig capability (pelvis rotates + thighs
      // counter-rotate). 90° puts the trunk roughly horizontal.
      'region:hip-hinge__x': 95,
      // Mild lumbar rounding into the deeper fold
      'region:lumbar__x': 15,
      'region:thoracic__x': 10,
      // Head hangs heavy
      'region:cervical__x': 30,
      // Arms hang relaxed (gravity carries them)
      'UpperArm_r__x': 15,
      'UpperArm_l__x': 15,
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

  // ============================================================
  // 10. PADANGUSTHASANA — Standing Forward Fold with Toe Grip
  // Like Uttanasana but with index fingers under the big toes.
  // Same shape as Uttanasana with index fingers hooked under the
  // big toes. Uses the hip-hinge compound to fold the trunk forward
  // over straight legs.
  // ============================================================
  {
    id: 'padangusthasana',
    english: 'Standing Forward Fold with Toe Grip',
    sanskrit: 'Padangusthasana',
    angles: {
      // Hip hinge — deeper than plain Uttanasana since the toe-grip
      // pulls the practitioner further into the fold
      'region:hip-hinge__x': 100,
      // Slight spinal rounding completes the line
      'region:lumbar__x': 12,
      'region:thoracic__x': 8,
      'region:cervical__x': 15,
      // Arms reach down to grip toes — slight shoulder extension
      // (in folded position, "down to the toes" means arms continue
      // along the line of the now-horizontal trunk)
      'UpperArm_r__x': 5,
      'UpperArm_l__x': 5,
      // Elbows slightly bent — index fingers hooked under toes
      'Forearm_r__x': -15,
      'Forearm_l__x': -15,
    },
  },

  // ============================================================
  // 11. UTTHITA TRIKONASANA — Extended Triangle Pose
  // Wide stance. Front (right) leg straight, foot turned out.
  // Back (left) leg straight, foot at 45°. Torso side-bends over
  // the front leg; bottom hand reaches floor/shin/block, top hand
  // reaches sky. Gaze up at the top hand.
  //
  // Asymmetric — right-side lead (front leg = right, body
  // side-bends to the right).
  // ============================================================
  {
    id: 'trikonasana',
    english: 'Extended Triangle Pose',
    sanskrit: 'Utthita Trikonasana',
    angles: {
      // WIDE STANCE — abduction at the hip (legs out to the sides).
      // Modest values since real Trikonasana stance is wide but legs
      // remain near vertical in world space (the abduction here is
      // just enough to widen the base; the feet are visibly apart
      // but the legs aren't sticking out horizontally).
      'Thigh_r__z': -20,
      'Thigh_l__z': 20,
      // RIGHT (FRONT) HIP — externally rotated 90° so the foot points
      // to the side (toward the front of the mat in classical setup).
      'Thigh_r__y': 60,
      // LEFT (BACK) HIP — at ~45° foot angle
      'Thigh_l__y': -15,
      // TORSO — strong side-bend to the right.
      // Most of the lateral flexion sensation comes from the lumbar
      // and lower thoracic in real Trikonasana.
      'region:lumbar-side__z': 22,
      'region:thoracic-side__z': 25,
      // Very mild rotation as the chest opens toward the ceiling
      'region:thoracic-twist__y': -20,
      // ARMS — both abducted to a T, then the side-bend tips the line
      // to vertical. We just abduct here; the spinal side-bend does
      // the rest of the work.
      'UpperArm_r__z': -90,
      'UpperArm_l__z': 90,
      // GAZE — look up at the top hand
      'region:cervical-twist__y': -45,
    },
  },

  // ============================================================
  // 12. PARIVRTTA TRIKONASANA — Revolved Triangle Pose
  // Same wide stance as Trikonasana, but the torso TWISTS — left
  // (opposite) hand crosses to the outside of the right foot, right
  // hand reaches up. The challenge is keeping the hips relatively
  // square while the upper body rotates around the spine.
  // ============================================================
  {
    id: 'parivrtta-trikonasana',
    english: 'Revolved Triangle Pose',
    sanskrit: 'Parivrtta Trikonasana',
    angles: {
      // STANCE — narrower than Trikonasana in many lineages, both
      // feet face roughly forward. Hips stay relatively square.
      'Thigh_r__z': -15,
      'Thigh_l__z': 15,
      'Thigh_r__y': 5,
      'Thigh_l__y': -15,
      // HIP HINGE — fold forward over the front leg (rather than
      // rounding the spine as we used to). The hinge tilts the
      // pelvis with the legs staying vertical.
      'region:hip-hinge__x': 75,
      // TWIST to the left — bottom arm (left hand) crosses down to
      // outside of right foot, top arm (right) reaches up. The
      // thoracic does most of the twist; lumbar adds a small amount.
      'region:thoracic-twist__y': -35,
      'region:lumbar-twist__y': -8,
      'region:cervical-twist__y': -45,
      // ARMS — bottom arm down across the body, top arm straight up
      'UpperArm_l__x': 10,
      'UpperArm_r__x': 5,
      'UpperArm_r__z': -180,  // straight up
    },
  },

  // ============================================================
  // 13. UTTHITA PARSVAKONASANA — Extended Side Angle Pose
  // Wide stance with the front (right) knee bent 90° (like Warrior
  // II). The torso side-bends over the front thigh; bottom (right)
  // forearm rests on the thigh or hand reaches floor; top (left)
  // arm reaches over the ear in a long line from back heel to
  // fingertips.
  // ============================================================
  {
    id: 'parsvakonasana',
    english: 'Extended Side Angle Pose',
    sanskrit: 'Utthita Parsvakonasana',
    angles: {
      // FRONT (right) leg — Warrior II setup, 90° knee bend, hip
      // abducted and externally rotated
      'Thigh_r__x': 25,
      'Thigh_r__z': -45,
      'Thigh_r__y': 30,
      'Shin_r__x': -90,
      // BACK (left) leg straight, abducted
      'Thigh_l__x': 0,
      'Thigh_l__z': 45,
      'Shin_l__x': 0,
      // TORSO — real lateral flexion to the right over the front
      // thigh, plus a mild rotation as the chest opens upward
      'region:lumbar-side__z': 18,
      'region:thoracic-side__z': 25,
      'region:thoracic-twist__y': -15,
      // ARMS — bottom (right) reaches down toward the floor outside
      // the front foot; top (left) reaches over the ear in the long
      // diagonal that defines Side Angle.
      'UpperArm_r__x': 30,
      'UpperArm_r__z': -100,
      'UpperArm_l__z': 160,
      // Head turns/tilts up under the top arm
      'Neck_C2_Axis__y': -25,
    },
  },

  // ============================================================
  // 14. PARSVOTTANASANA — Intense Side Stretch / Pyramid Pose
  // Both feet face forward in a lunge-style stance. Front (right)
  // leg straight, back (left) leg also straight but with the back
  // foot at ~45°. Hips face squarely toward the front. Torso folds
  // deeply over the front leg; hands often in reverse prayer behind
  // the back, or framing the front foot on blocks.
  // ============================================================
  {
    id: 'parsvottanasana',
    english: 'Intense Side Stretch Pose',
    sanskrit: 'Parsvottanasana',
    angles: {
      // FRONT (right) leg — straight, hip square to the front of the mat
      'Thigh_r__x': 0,
      'Thigh_r__z': 0,
      // BACK (left) leg — straight, back foot turned out ~45° at the hip
      'Thigh_l__x': 0,
      'Thigh_l__y': -25,
      'Thigh_l__z': 10,
      // HIP HINGE — deep fold over the front leg. Pelvis tips forward
      // while legs stay vertical; the trunk ends up horizontal.
      'region:hip-hinge__x': 95,
      // Mild spinal rounding to complete the line
      'region:lumbar__x': 10,
      'region:thoracic__x': 10,
      'region:cervical__x': 15,
      // ARMS — reverse-prayer-ish position behind the back: shoulders
      // internally rotated, slight extension. (The rig can't model
      // true reverse prayer; this is closest.)
      'UpperArm_r__x': -10,
      'UpperArm_l__x': -10,
      'UpperArm_r__y': -45,
      'UpperArm_l__y': 45,
    },
  },

  // ============================================================
  // 15. UTTHITA HASTA PADANGUSTHASANA — Extended Hand-to-Big-Toe
  // Standing on the left leg, right leg lifted with the right hand
  // gripping the big toe. The classical Ashtanga version progresses
  // through three positions: leg extended forward, leg out to the
  // side (right hip externally rotated), and finally the lifted leg
  // back to center with the gaze beyond the toe. We render
  // Position A (leg extended forward).
  // ============================================================
  {
    id: 'utthita-hasta-padangusthasana',
    english: 'Extended Hand-to-Big-Toe Pose (A)',
    sanskrit: 'Utthita Hasta Padangusthasana',
    angles: {
      // Standing (left) leg straight, neutral
      'Thigh_l__x': 0,
      'Shin_l__x': 0,
      // Lifted (right) leg — hip flexed sharply, knee straight
      'Thigh_r__x': 95,
      'Shin_r__x': 0,
      // Right arm reaches forward and down slightly to grip the toe
      'UpperArm_r__x': 75,
      // Elbow slightly bent
      'Forearm_r__x': -20,
      // Left arm on the left hip in the classical version — slight
      // shoulder rotation rather than a clean angle to express it
      'UpperArm_l__x': -5,
      'UpperArm_l__y': 25,
      // Spine stays mostly upright with a small forward lean to
      // counterbalance the lifted leg
      'region:lumbar__x': 8,
      // Gaze toward the lifted toe
      'region:cervical__x': 8,
    },
  },
];

export function getPoseAngles(id: string): PoseAngles | undefined {
  return POSE_ANGLES.find((p) => p.id === id);
}
