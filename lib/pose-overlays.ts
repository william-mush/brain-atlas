// Plain-English overlays + primary-muscle + injury-site annotations for each pose.
//
// Authored as a separate file so the main poses.ts data isn't disrupted.
// At runtime these overlays are merged onto each Pose by id before the
// UI reads them.

import type { PoseInjurySite } from './poses';

export interface PoseOverlay {
  plainLanguage: string;
  primaryMuscles: string[];
  injurySites: PoseInjurySite[];
}

export const POSE_OVERLAYS: Record<string, PoseOverlay> = {
  // ============================================================
  // Tadasana — Mountain Pose
  // ============================================================
  tadasana: {
    plainLanguage:
      "Stand tall and quiet. The reference pose — the body finding its vertical line with as little effort as possible. Almost everything is just maintaining alignment; nothing is straining.",
    primaryMuscles: [
      // The few muscles that actually have a job in standing
      'soleus_muscle',
      'gluteus_medius_muscle',
      'transversus_abdominis_muscle',
      'longissimus_thoracis_muscle',
    ],
    injurySites: [
      {
        region: 'Knees',
        note: "Don't lock the knees into hyperextension. Lift the kneecaps with the quadriceps so the joint is supported, not jammed.",
      },
    ],
  },

  // ============================================================
  // Uttanasana — Standing Forward Fold
  // ============================================================
  uttanasana: {
    plainLanguage:
      "Folding forward from the hips, letting the spine drape down. The big stretch is the back of the legs — hamstrings and calves. The legs stay engaged; the upper body releases.",
    primaryMuscles: [
      'long_head_of_biceps_femoris',
      'semitendinosus_muscle',
      'medial_head_of_gastrocnemius',
      'longissimus_thoracis_muscle',
      'rectus_femoris_muscle',
    ],
    injurySites: [
      {
        region: 'Lower back',
        note: "If hamstrings are tight, the lumbar rounds to compensate — and the discs of the lower back take the load instead of the hamstrings stretching. Better to bend the knees deeply and keep the spine long.",
      },
      {
        muscle: 'long_head_of_biceps_femoris',
        note: "The hamstring origin at the sit bone is the most common site of yoga-induced hamstring tendon injury. Sharp pinpoint pain at the sit bone = back off immediately.",
      },
    ],
  },

  // ============================================================
  // Adho Mukha Svanasana — Downward-Facing Dog
  // ============================================================
  'down-dog': {
    plainLanguage:
      "The all-purpose pose. Heels reach down, hips reach up, hands press the floor away. Big stretch through the back of the legs and the shoulders; real work for the arms and the deep core. A pose you can practice for ten years and still find new in.",
    primaryMuscles: [
      'long_head_of_biceps_femoris',
      'medial_head_of_gastrocnemius',
      'serratus_anterior_muscle',
      'latissimus_dorsi_muscle',
      'long_head_of_triceps_brachii',
    ],
    injurySites: [
      {
        muscle: 'supraspinatus_muscle',
        note: "The supraspinatus can get pinched between the humerus and the acromion when the arms reach overhead. The cue 'externally rotate the upper arms' (biceps face forward) opens this space and protects the shoulder.",
      },
      {
        region: 'Wrists',
        note: "The wrists bear a lot of load. Spread the fingers wide, press through the index-finger knuckle, and gradually build wrist tolerance. If wrists complain, fists or forearms are good alternatives.",
      },
    ],
  },

  // ============================================================
  // Virabhadrasana I — Warrior I
  // ============================================================
  'warrior-1': {
    plainLanguage:
      "Front leg bent, back leg straight, both hips facing forward. The major stretch is the front of the BACK leg's hip — the psoas. Strong work for the front leg's quad and glute. The arms reach overhead.",
    primaryMuscles: [
      'psoas_major',                      // back-leg stretch
      'iliacus_muscle',                   // back-leg stretch
      'vastus_lateralis_muscle',          // front-leg work
      'gluteus_maximus_muscle',           // back-leg hip extension
      'ascending_part_of_trapezius_muscle', // lower trap for overhead arms
    ],
    injurySites: [
      {
        region: 'Front knee',
        note: "Front knee should track over the front foot — NOT collapse inward. Engage the front-leg gluteus medius to rotate the femur externally and keep the knee aligned.",
      },
      {
        region: 'Lower back',
        note: "If the back-leg hip flexor is tight, the lumbar over-arches to compensate. Tuck the tailbone slightly and engage the lower belly to keep the lumbar long.",
      },
    ],
  },

  // ============================================================
  // Virabhadrasana II — Warrior II
  // ============================================================
  'warrior-2': {
    plainLanguage:
      "Wide stance, front knee bent 90°, hips open to the side, arms reach in opposite directions. Looks simple; burns hard. The star is the front-leg outer hip — gluteus medius works to keep the knee tracking over the foot.",
    primaryMuscles: [
      'gluteus_medius_muscle',  // the star of the pose
      'vastus_medialis_muscle',
      'adductor_magnus',
      'acromial_part_of_deltoid_muscle',
      'transversus_abdominis_muscle',
    ],
    injurySites: [
      {
        region: 'Front knee',
        note: "Front knee MUST track over the second and third toes. If it falls inward (medial), the ligaments on the inside of the knee bear shearing force — a common source of knee injury in yoga.",
      },
      {
        muscle: 'descending_part_of_trapezius_muscle',
        note: "Tension in the upper traps as the arms hold up — shoulders creep toward the ears. Active engagement of the lower trap pulls the shoulders down the back.",
      },
    ],
  },

  // ============================================================
  // Plank
  // ============================================================
  plank: {
    plainLanguage:
      "The body held in one straight line above the floor, arms supporting. The deep core works to keep the hips from sinking. Serratus anterior (under the arm pit, around the rib cage) actively pushes the floor away.",
    primaryMuscles: [
      'serratus_anterior_muscle',
      'transversus_abdominis_muscle',
      'rectus_abdominis_muscle',
      'gluteus_maximus_muscle',
      'long_head_of_triceps_brachii',
    ],
    injurySites: [
      {
        region: 'Lower back',
        note: "Most common compensation is the hips sagging — the lumbar drops and the lower back takes the load. Active glutes + lower belly fix it. If you can't hold it, drop the knees.",
      },
      {
        region: 'Wrists',
        note: "Same wrist-loading concern as Down Dog. Spread the fingers; press through the knuckles, not just the heel of the hand.",
      },
    ],
  },

  // ============================================================
  // Chaturanga Dandasana
  // ============================================================
  chaturanga: {
    plainLanguage:
      "Lowering from plank to hover just above the floor, elbows bent 90°, body still in one straight line. The hardest pose in any vinyasa practice — and the single biggest source of yoga shoulder injuries. Elbows hug the ribs, NOT splay out.",
    primaryMuscles: [
      'sternocostal_head_of_pectoralis_major_muscle',
      'long_head_of_triceps_brachii',
      'serratus_anterior_muscle',
      'transversus_abdominis_muscle',
      'latissimus_dorsi_muscle',
    ],
    injurySites: [
      {
        muscle: 'supraspinatus_muscle',
        note: "By far the most-injured site in modern yoga. Elbows splaying out + shoulders sinking below elbow height = the supraspinatus tendon gets impinged and pinched. Going lower than 90° at the elbow is the warning sign — STOP at parallel-to-the-floor.",
      },
      {
        muscle: 'sternocostal_head_of_pectoralis_major_muscle',
        note: "Pec major can tear at its humeral insertion if loaded suddenly past its range. The slow controlled descent is the protection.",
      },
      {
        region: 'Lower back',
        note: "If the hips drop on the way down, the lumbar takes shear force as well. Active core throughout.",
      },
    ],
  },

  // ============================================================
  // Urdhva Mukha Svanasana — Upward-Facing Dog
  // ============================================================
  'up-dog': {
    plainLanguage:
      "Strong front-body opener. Chest lifts forward and up between the arms; thighs lift off the floor; glutes fire hard to lift the legs and protect the lower back. The opposite of all the slouching you do at a desk.",
    primaryMuscles: [
      'gluteus_maximus_muscle',
      'longissimus_thoracis_muscle',
      'sternocostal_head_of_pectoralis_major_muscle',
      'rectus_abdominis_muscle',
      'long_head_of_triceps_brachii',
    ],
    injurySites: [
      {
        region: 'Lower back',
        note: "If the glutes don't fire, the body 'hangs' into the lumbar — the lower vertebrae take the load and compression happens. Glutes ON, thighs OFF the floor, tail toward the heels.",
      },
      {
        muscle: 'sternocostal_head_of_pectoralis_major_muscle',
        note: "Tight pec major is what limits this pose. Forcing the chest open with grip-jaw effort can strain pec major at its sternal attachment. Open gradually.",
      },
    ],
  },

  // ============================================================
  // Padangusthasana / Padahastasana
  // ============================================================
  padangusthasana: {
    plainLanguage:
      "A deeper version of Uttanasana — gripping the big toes (or sliding the hands under the feet) and using the arms to draw the trunk deeper into the fold. Same major stretch as Uttanasana, more intensity.",
    primaryMuscles: [
      'long_head_of_biceps_femoris',
      'semitendinosus_muscle',
      'medial_head_of_gastrocnemius',
      'long_head_of_biceps_brachii',  // biceps actively pull the trunk in
    ],
    injurySites: [
      {
        region: 'Lower back',
        note: "Yanking on the toes while the spine is rounded loads the lumbar discs. Better to bend the knees and keep the spine long than to force the head down with a rounded back.",
      },
      {
        muscle: 'long_head_of_biceps_femoris',
        note: "Sit-bone-area hamstring strain is the classic forward-fold injury. Sharp pain at the sit bone = stop pulling.",
      },
    ],
  },

  // ============================================================
  // Utthita Trikonasana — Triangle
  // ============================================================
  trikonasana: {
    plainLanguage:
      "Wide stance, front leg straight, body reaches laterally over it. The body forms triangles. The pose is about LENGTH — extending out, not collapsing down. Big stretch through the front-leg hamstring and adductors.",
    primaryMuscles: [
      'long_head_of_biceps_femoris',
      'adductor_magnus',
      'gracilis_muscle',
      'quadratus_lumborum_muscle',  // top-side QL stretches
      'gluteus_medius_muscle',      // front-leg external rotation
    ],
    injurySites: [
      {
        region: 'Front knee',
        note: "Hyperextending the front knee is the most common Triangle injury — pushing the kneecap backwards into the joint. Always keep the kneecap engaged and lifted (quads active).",
      },
      {
        muscle: 'long_head_of_biceps_femoris',
        note: "The front-leg hamstring at the sit bone is again at risk for tendon strain. If you feel sharp pinpoint pain at the sit bone, lift up out of the fold.",
      },
    ],
  },

  // ============================================================
  // Parivrtta Trikonasana — Revolved Triangle
  // ============================================================
  'parivrtta-trikonasana': {
    plainLanguage:
      "Triangle with the trunk rotated toward the front leg. Demanding: hamstring stretch + spinal twist + balance on a small base of support. The twist is the spine, NOT a hip swing.",
    primaryMuscles: [
      'external_abdominal_oblique_muscle',  // primary rotator
      'internal_abdominal_oblique_muscle',
      'long_head_of_biceps_femoris',
      'multifidus_thoracis_muscle',
      'gluteus_maximus_muscle',  // back leg squares hips
    ],
    injurySites: [
      {
        region: 'Lower back',
        note: "Forcing rotation while the spine is rounded loads the lumbar discs with both flex and torsion — a high-risk combination. Keep the spine long FIRST, then rotate.",
      },
      {
        region: 'Sacroiliac joint',
        note: "Hip squaring + twisting creates shearing across the SI joint. If you feel a sharp catch in the very low back to one side, back off — that's the SI joint complaining.",
      },
      {
        region: 'Front knee',
        note: "Same hyperextension risk as Triangle. Active kneecap.",
      },
    ],
  },

  // ============================================================
  // Utthita Parsvakonasana — Side Angle
  // ============================================================
  parsvakonasana: {
    plainLanguage:
      "Long diagonal line from back-foot heel through top-arm fingertips. Front knee bent 90°. Powerful work for the front leg; major opening through the side body and inner thigh of the back leg.",
    primaryMuscles: [
      'vastus_lateralis_muscle',
      'gluteus_medius_muscle',
      'adductor_magnus',
      'latissimus_dorsi_muscle',     // top-side lat stretches
      'quadratus_lumborum_muscle',
    ],
    injurySites: [
      {
        region: 'Front knee',
        note: "Same as Warrior II — front knee must track over the second and third toes. Never let it collapse inward.",
      },
      {
        muscle: 'descending_part_of_trapezius_muscle',
        note: "The top arm reaching overhead with the body laterally bent is a setup for upper-trap gripping. Pull the top-arm shoulder blade down the back; reach long through the fingertips, not up to the ears.",
      },
    ],
  },

  // ============================================================
  // Parsvottanasana — Pyramid
  // ============================================================
  parsvottanasana: {
    plainLanguage:
      "Stance shorter than Warrior I; both legs straight; trunk folds forward over the front leg with hips squared. A focused, intense hamstring stretch on one leg at a time. Quieter than the wide-leg standing poses.",
    primaryMuscles: [
      'long_head_of_biceps_femoris',
      'medial_head_of_gastrocnemius',
      'gluteus_maximus_muscle',      // back-leg hip-square
      'pectoralis_minor_muscle',     // if reverse prayer is used
    ],
    injurySites: [
      {
        region: 'Lower back',
        note: "Same as Uttanasana — if hamstrings are very tight, the lumbar rounds. Block under the bottom hand or bend the front knee rather than rounding the spine.",
      },
      {
        muscle: 'long_head_of_biceps_femoris',
        note: "Tendon-at-sit-bone risk is high here because the stretch is so focused. Move into it gradually.",
      },
    ],
  },

  // ============================================================
  // Utthita Hasta Padangusthasana — Standing Hand to Big Toe
  // ============================================================
  'utthita-hasta-padangusthasana': {
    plainLanguage:
      "Standing on one leg, holding the other leg up by the big toe. A balance-and-flexibility test. The standing-leg gluteus medius does most of the unsung work — keeping the pelvis level under one-leg load.",
    primaryMuscles: [
      'gluteus_medius_muscle',       // standing leg
      'gluteus_minimus_muscle',
      'psoas_major',                 // lifted leg
      'long_head_of_biceps_femoris', // lifted-leg stretch
      'transversus_abdominis_muscle',
    ],
    injurySites: [
      {
        region: 'Standing-leg hip',
        note: "If the standing-leg gluteus medius is weak, the standing hip 'hikes' upward as the other leg lifts. Over time this can strain the hip and lower back.",
      },
      {
        muscle: 'long_head_of_biceps_femoris',
        note: "Holding a deep one-leg hamstring stretch while balancing creates a high-tension situation at the sit bone. If you feel pinpoint pain, lower the leg.",
      },
    ],
  },

  // ============================================================
  // Urdhva Dhanurasana — Wheel (the user's example pose)
  // ============================================================
  wheel: {
    plainLanguage:
      "Full backbend. Hands and feet on the floor, body arched up into an upside-down U. Major front-body opening — chest, abdomen, hip flexors all stretched at once. Strong glutes and shoulders required.",
    primaryMuscles: [
      'gluteus_maximus_muscle',
      'longissimus_thoracis_muscle',
      'psoas_major',                              // stretched
      'sternocostal_head_of_pectoralis_major_muscle',  // stretched
      'long_head_of_triceps_brachii',             // arm work
    ],
    injurySites: [
      {
        region: 'Lower back',
        note: "Wheel's biggest risk. Without glute engagement, the body 'hangs' into the lumbar and the lower vertebrae compress. Glutes ON, tail tucks toward the knees, the backbend distributes across the entire spine — not just the bottom.",
      },
      {
        region: 'Wrists',
        note: "Wrists in deep extension under significant body weight. Build up to it gradually; modify or skip if wrists are sensitive.",
      },
      {
        muscle: 'supraspinatus_muscle',
        note: "Shoulders are in extreme flexion (arms past overhead). External rotation of the upper arms is essential to keep the supraspinatus from pinching.",
      },
      {
        region: 'Neck',
        note: "Letting the head drop back uncontrollably loads the cervical spine. Lengthen the back of the neck; the head should follow the rest of the spine's curve, not hinge separately.",
      },
    ],
  },
};
