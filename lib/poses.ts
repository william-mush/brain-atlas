// Yoga pose state maps — Phase 2a.
//
// Each pose declares, for every muscle that matters in it, the muscle's
// functional state. The body stays in anatomical standing (we haven't
// rigged the skeleton yet — Phase 2b), but the muscle coloring is
// pedagogically correct.
//
// The state taxonomy is the one teachers and physiotherapists actually use:
//
//   concentric   — actively shortening under load (a muscle "working")
//   eccentric    — actively lengthening under load (controlling a descent)
//   isometric    — engaged without changing length (holding position)
//   passive      — lengthened without engagement (a stretch with the
//                  muscle relaxed)
//   loaded-pass. — lengthened *with* low tone, bearing some load passively
//                  (the hamstrings at the bottom of a deep forward fold)
//   antagonist   — relaxed in a coordinated way so the agonist can act
//   unloaded     — not engaged, no stretch, just along for the ride
//
// We only have to author a state for muscles that matter — muscles we
// don't mention are treated as "unloaded."

import type { BodyPart } from './body';

export type MuscleState =
  | 'concentric'
  | 'eccentric'
  | 'isometric'
  | 'passive'
  | 'loaded-passive'
  | 'antagonist'
  | 'unloaded';

export const STATE_LABELS: Record<MuscleState, string> = {
  concentric: 'Concentric — shortening under load',
  eccentric: 'Eccentric — lengthening under load',
  isometric: 'Isometric — holding length',
  passive: 'Passive stretch — lengthened, relaxed',
  'loaded-passive': 'Loaded passive — stretched, bearing weight',
  antagonist: 'Antagonist — deliberately relaxed',
  unloaded: 'Unloaded',
};

export const STATE_COLORS: Record<MuscleState, string> = {
  concentric: '#d65a3a',      // red-orange — active work
  eccentric: '#e89a4a',       // amber — controlled lengthening
  isometric: '#c4b04a',       // mustard — holding
  passive: '#5fa1c4',         // blue — a stretch
  'loaded-passive': '#7a8acc', // deeper blue-violet
  antagonist: '#5a5a6f',      // muted slate — quiet
  unloaded: '#574d36',        // ink — neutral
};

export const STATE_DESCRIPTIONS: Record<MuscleState, string> = {
  concentric:
    "The muscle is shortening while generating force. This is what most people picture as 'working.' Lifting the leg, pressing the floor away.",
  eccentric:
    "The muscle is engaged, generating force, AND lengthening at the same time. Controlling descent. The hamstrings on the way down into a forward fold, the triceps lowering you into Chaturanga.",
  isometric:
    "The muscle generates force without changing length. Holding the body in place. The legs of Warrior II once you've arrived.",
  passive:
    "The muscle is lengthened but not engaged. A pure stretch. The hamstrings in a deep, fully-released seated forward fold.",
  'loaded-passive':
    "Lengthened while bearing weight, with minimal active tone. Common in restorative poses where gravity pulls the body into the stretch.",
  antagonist:
    "Not the muscle doing the work — but engaging would interfere, so it's deliberately quiet. The hamstrings during a deep quad activation.",
  unloaded:
    "Going along for the ride. No specific job in this pose.",
};

/** A muscle key matches the manifest-derived slug — like 'long_head_of_biceps_femoris'
 *  — and applies to BOTH sides (l and r) unless explicitly qualified.
 *  For asymmetric poses (Warrior I/II) you'll see entries with explicit `side`. */
export interface MuscleStateEntry {
  muscle: string;            // slug (the part of the id after 'muscle_' and before '_l/_r')
  side?: 'l' | 'r' | 'both';  // default 'both'
  state: MuscleState;
  /** Short prose: why this state, what to watch for. */
  note?: string;
}

export interface Pose {
  id: string;
  sanskrit: string;
  english: string;
  /** Ashtanga sequence position, if applicable. */
  sequence?: string;
  /** A one-paragraph plain-English description of the pose. */
  description: string;
  /** What the practice *intends* to do — the pose's purpose. */
  intent: string;
  /** Direct, specific guidance — what to feel, what to avoid. */
  cues: string[];
  /** Common compensations / mistakes. */
  watchFor?: string[];
  /** Muscle states. Order doesn't matter; rendering picks the right side. */
  states: MuscleStateEntry[];
}

// ============================================================
// 5 POSES — Drafted carefully. The user should read and correct.
// ============================================================

export const POSES: Pose[] = [
  // --- 1. TADASANA ---
  {
    id: 'tadasana',
    sanskrit: 'Tadasana',
    english: 'Mountain Pose',
    sequence: 'Samasthitih — the neutral standing reference for the practice',
    description:
      "Stand with the feet together (in Ashtanga: big toes touching, heels slightly apart). The body is vertical, weight even across the four corners of each foot, spine long, arms by the sides. This is the reference pose — the shape every other standing pose returns through.",
    intent:
      "Establish neutral alignment. Find the body's vertical axis with the least possible effort. Tadasana is the pose where you stop reaching for the next thing and notice what the body is already doing.",
    cues: [
      "Press evenly through the four corners of each foot — big toe mound, little toe mound, inner heel, outer heel.",
      "Lift the inner arches without gripping the toes.",
      "Engage the quadriceps gently to lift the kneecaps — this protects the joint and signals to the rest of the leg that it's holding.",
      "Find a neutral pelvis — not tucked, not over-arched. The pubic bone and the front of the hip bones live in the same plane.",
      "Lift the crown of the head toward the ceiling, lengthening the back of the neck.",
      "Soften the shoulders down and slightly back so the chest opens without flaring the front ribs.",
    ],
    watchFor: [
      "Locked knees — common in standing poses. Keep the lift through the quads without hyper-extending.",
      "Anterior pelvic tilt (sticking the butt out) — engaging the lower abdominal wall and gluteus maximus neutralizes it.",
      "Shoulders held up around the ears.",
    ],
    states: [
      // The legs hold against gravity — quads and glutes are isometric, mostly low-tone.
      { muscle: 'vastus_lateralis_muscle', state: 'isometric', note: 'Low-tone hold to keep the knee gently extended.' },
      { muscle: 'vastus_medialis_muscle', state: 'isometric', note: "Engaging the inner quad ('lift the kneecap') protects the knee." },
      { muscle: 'vastus_intermedius_muscle', state: 'isometric' },
      { muscle: 'rectus_femoris_muscle', state: 'isometric' },
      { muscle: 'gluteus_maximus_muscle', state: 'isometric', note: 'Subtle engagement to neutralize anterior pelvic tilt — not a clench.' },
      { muscle: 'gluteus_medius_muscle', state: 'isometric', note: "Stabilizes the pelvis side to side. Always working in standing." },
      { muscle: 'gluteus_minimus_muscle', state: 'isometric' },
      // Core — quiet but present
      { muscle: 'transversus_abdominis_muscle', state: 'isometric', note: 'Light continuous tone. The substrate of uddiyana.' },
      { muscle: 'multifidus_lumborum_muscle', state: 'isometric', note: 'Segmental lumbar stabilization.' },
      // Erectors hold the spine upright
      { muscle: 'longissimus_thoracis_muscle', state: 'isometric' },
      { muscle: 'iliocostalis_lumborum_muscle', state: 'isometric' },
      { muscle: 'iliocostalis_thoracis_muscle', state: 'isometric' },
      { muscle: 'spinalis_thoracis_muscle', state: 'isometric' },
      // Calves — the antigravity workhorse
      { muscle: 'soleus_muscle', state: 'isometric', note: "The body's main antigravity stabilizer in standing." },
      { muscle: 'medial_head_of_gastrocnemius', state: 'isometric' },
      { muscle: 'lateral_head_of_gastrocnemius', state: 'isometric' },
      // Foot intrinsics
      { muscle: 'tibialis_anterior_muscle', state: 'isometric', note: 'Light tone to keep the foot from collapsing inward.' },
      { muscle: 'tibialis_posterior_muscle', state: 'isometric', note: 'Holds the medial arch up.' },
      // Shoulder girdle — lower trap engaged to keep shoulders down
      { muscle: 'ascending_part_of_trapezius_muscle', state: 'isometric', note: 'Lower trap holds the shoulders down.' },
      // Upper trap usually OVER-engaged — name it as antagonist to encourage release
      { muscle: 'descending_part_of_trapezius_muscle', state: 'antagonist', note: 'Should release. Most students chronically grip here.' },
      { muscle: 'levator_scapulae', state: 'antagonist' },
    ],
  },

  // --- 2. UTTANASANA ---
  {
    id: 'uttanasana',
    sanskrit: 'Uttanasana',
    english: 'Standing Forward Fold',
    sequence: 'Surya Namaskar A — second movement, exhale fold forward',
    description:
      "From Tadasana, exhale and fold forward from the hip joints. The spine lengthens forward over the legs and then drapes downward as the hands reach for the floor or shins. Legs stay strong and largely straight; the fold is at the hip, not the lower back.",
    intent:
      "Lengthen the entire posterior chain — calves, hamstrings, glutes, erector spinae — in one continuous line. Calm the nervous system through the inverted head position.",
    cues: [
      "Hinge from the hip joints, not the waist. Imagine bowing forward — the pelvis tips over the femurs.",
      "Keep the legs active. Quadriceps engaged, kneecaps lifted. This reciprocally inhibits the hamstrings and lets them lengthen.",
      "Let the head be heavy. The neck releases, the crown of the head reaches toward the floor.",
      "Reach the sit bones up toward the ceiling. This deepens the hip hinge without rounding the lumbar spine.",
      "If the back rounds significantly, bend the knees as much as needed to bring the spine long again.",
    ],
    watchFor: [
      "Rounding the lower back to try to reach the floor — this loads the discs instead of stretching the hamstrings.",
      "Locking out the knees and pushing into hyperextension — keep the knees soft and active.",
      "Holding the breath — exhale should soften the body deeper into the fold.",
    ],
    states: [
      // The big stretch: posterior chain lengthens.
      { muscle: 'long_head_of_biceps_femoris', state: 'loaded-passive', note: 'Hamstring origin at the sit bone — primary site of sensation.' },
      { muscle: 'short_head_of_biceps_femoris', state: 'loaded-passive' },
      { muscle: 'semitendinosus_muscle', state: 'loaded-passive' },
      { muscle: 'semimembranosus_muscle', state: 'loaded-passive' },
      { muscle: 'medial_head_of_gastrocnemius', state: 'loaded-passive', note: 'With straight knees, gastroc stretches in addition to hamstrings.' },
      { muscle: 'lateral_head_of_gastrocnemius', state: 'loaded-passive' },
      { muscle: 'soleus_muscle', state: 'passive', note: 'Only crosses the ankle, so less stretched than gastroc.' },
      { muscle: 'gluteus_maximus_muscle', state: 'passive', note: 'Lengthens with the hip in deep flexion.' },
      // Erectors — controlled descent then released
      { muscle: 'longissimus_thoracis_muscle', state: 'passive' },
      { muscle: 'longissimus_lumborum_muscle', state: 'passive' },
      { muscle: 'iliocostalis_lumborum_muscle', state: 'passive' },
      { muscle: 'iliocostalis_thoracis_muscle', state: 'passive' },
      { muscle: 'multifidus_lumborum_muscle', state: 'passive' },
      { muscle: 'spinalis_thoracis_muscle', state: 'passive' },
      // Quads — actively engaged to inhibit hamstrings
      { muscle: 'vastus_lateralis_muscle', state: 'concentric', note: "Active engagement — 'lift the kneecaps.' Reciprocally inhibits the hamstrings." },
      { muscle: 'vastus_medialis_muscle', state: 'concentric' },
      { muscle: 'vastus_intermedius_muscle', state: 'concentric' },
      { muscle: 'rectus_femoris_muscle', state: 'concentric', note: 'Rectus femoris also crosses the hip, so it actively flexes — it both lifts the kneecap and pulls the pelvis forward.' },
      // Hip flexors firing to drive the fold
      { muscle: 'psoas_major', state: 'concentric', note: 'Active hip flexion brings the trunk down.' },
      { muscle: 'iliacus_muscle', state: 'concentric' },
      // TVA holding the lumbar
      { muscle: 'transversus_abdominis_muscle', state: 'isometric', note: 'Continuous deep tone protects the lumbar spine in the fold.' },
      // Calves stabilize the standing
      { muscle: 'tibialis_anterior_muscle', state: 'isometric', note: 'Stabilizes the ankle.' },
    ],
  },

  // --- 3. ADHO MUKHA SVANASANA ---
  {
    id: 'down-dog',
    sanskrit: 'Adho Mukha Svanasana',
    english: 'Downward-Facing Dog',
    sequence: 'Surya Namaskar A — the inverted-V rest pose returned to between movements',
    description:
      "Hands and feet on the floor, hips lifted high, body forming an inverted V. The arms reach overhead from the perspective of the body; the legs are roughly straight; the spine is long from wrists to tailbone.",
    intent:
      "Lengthen the entire posterior chain (calves, hamstrings, lats), open the shoulders into overhead reach, and build strength in the arms and shoulder girdle. The pose where breath and length meet.",
    cues: [
      "Press the floor away through the index-finger knuckles. Engage serratus anterior to protract the scapulae.",
      "Externally rotate the upper arms — biceps face forward. This gives supraspinatus room and protects the shoulders.",
      "Reach the sit bones up and back. The hip flexors fire to lift the pelvis.",
      "Lengthen through the spine from wrists to tailbone before worrying about the heels.",
      "Heels reach toward the floor without straining. They may not touch — that's fine.",
      "Bend the knees if the spine is rounding. Length matters more than straight legs.",
    ],
    watchFor: [
      "Collapsing into the shoulders — keep serratus anterior pressing the floor away.",
      "Hyperextending the elbows — micro-bend if needed.",
      "Forcing the heels to the floor at the cost of spinal length.",
      "Crunching the lumbar spine — sit bones reach up, lower belly draws in.",
    ],
    states: [
      // The classic posterior-chain stretch
      { muscle: 'medial_head_of_gastrocnemius', state: 'loaded-passive', note: "Heel-reaching action stretches gastroc — but only when the knee is straight." },
      { muscle: 'lateral_head_of_gastrocnemius', state: 'loaded-passive' },
      { muscle: 'soleus_muscle', state: 'passive', note: 'Soleus stretches whether the knee is straight or bent.' },
      { muscle: 'long_head_of_biceps_femoris', state: 'loaded-passive' },
      { muscle: 'short_head_of_biceps_femoris', state: 'loaded-passive' },
      { muscle: 'semitendinosus_muscle', state: 'loaded-passive' },
      { muscle: 'semimembranosus_muscle', state: 'loaded-passive' },
      // Lats — lengthening across the overhead reach AND engaging
      { muscle: 'latissimus_dorsi_muscle', state: 'eccentric', note: 'Lats lengthen as arms go overhead but engage to push the floor away.' },
      // Serratus anterior — the engine of "press the floor away"
      { muscle: 'serratus_anterior_muscle', state: 'concentric', note: '"Press the earth away" — serratus anterior protracts the scapulae against the floor.' },
      // Triceps holding the elbows long
      { muscle: 'long_head_of_triceps_brachii', state: 'isometric', note: 'Maintains elbow extension against the body weight.' },
      { muscle: 'lateral_head_of_triceps_brachii', state: 'isometric' },
      { muscle: 'medial_head_of_triceps_brachii', state: 'isometric' },
      // Lower trap holding shoulders down
      { muscle: 'ascending_part_of_trapezius_muscle', state: 'isometric', note: 'Lower trap pulls the scapulae down the back, lengthening the neck.' },
      { muscle: 'transverse_part_of_trapezius_muscle', state: 'isometric' },
      // Infraspinatus / teres minor — external rotation
      { muscle: 'infraspinatus_muscle', state: 'concentric', note: '"Externally rotate the upper arms" — infraspinatus and teres minor work.' },
      { muscle: 'teres_minor_muscle', state: 'concentric' },
      // Hip flexors active — driving the pelvis up
      { muscle: 'psoas_major', state: 'concentric', note: 'Active hip flexion lifts the pelvis and reaches sit bones up.' },
      { muscle: 'iliacus_muscle', state: 'concentric' },
      // Quads to keep legs straight (and reciprocally inhibit hamstrings)
      { muscle: 'vastus_lateralis_muscle', state: 'concentric' },
      { muscle: 'vastus_medialis_muscle', state: 'concentric' },
      { muscle: 'vastus_intermedius_muscle', state: 'concentric' },
      { muscle: 'rectus_femoris_muscle', state: 'concentric' },
      // Core
      { muscle: 'transversus_abdominis_muscle', state: 'isometric' },
      { muscle: 'rectus_abdominis_muscle', state: 'isometric', note: 'Gentle engagement to keep the lumbar long, not crunched.' },
      // Erectors holding the long spine
      { muscle: 'longissimus_thoracis_muscle', state: 'isometric' },
    ],
  },

  // --- 4. VIRABHADRASANA I — Warrior I ---
  {
    id: 'warrior-1',
    sanskrit: 'Virabhadrasana I',
    english: 'Warrior I',
    sequence: 'Standing sequence — left and right sides',
    description:
      "Front leg bent to a right angle, back leg straight with the heel grounded (foot at ~45° in the Ashtanga version). Both hips rotate forward to face the front of the mat. Arms reach up overhead, palms together. A strong, lifted, fierce pose.",
    intent:
      "Open the hip flexors of the back leg through the combined action of hip extension and a turned-back foot. Build strength in the legs and length in the upper body. Coordinate hip squaring with a deep front-leg bend.",
    cues: [
      "Press evenly through the four corners of the back foot — especially the outer heel.",
      "Front knee tracks over the front ankle — never inside or outside.",
      "Both hips square forward. The back-leg side of the pelvis comes forward; the front-leg side eases back.",
      "Tuck the tailbone slightly under to neutralize the lumbar arch and deepen the back-leg hip stretch.",
      "Reach the arms up overhead — palms together if shoulders allow, or shoulder-width apart.",
      "Lift through the side ribs. The chest is broad; the shoulders melt down the back.",
    ],
    watchFor: [
      "Front knee collapsing in (medial). Engage the front-leg gluteus medius to externally rotate the femur.",
      "Back hip swinging out to the side instead of squaring forward.",
      "Lower back compressing — the tailbone reaches down, the pubic bone reaches up, lengthening the lumbar.",
      "Shoulders climbing up to the ears.",
    ],
    states: [
      // FRONT LEG (let's say the user's right leg for this annotation — we'll
      // duplicate-author for both sides via the pose preview; here we mark
      // muscles that apply to the front leg as 'r' and back leg as 'l')
      // For Phase 2a (standing body, no rigging), we'll just say "both sides"
      // and trust the user to read the cues. A future rigged version will pose
      // the body asymmetrically.

      // FRONT LEG (bent at 90°, quad working hard to hold the squat)
      { muscle: 'vastus_lateralis_muscle', state: 'concentric', side: 'both', note: 'Front leg: vasti hold the deep knee bend against body weight.' },
      { muscle: 'vastus_medialis_muscle', state: 'concentric', side: 'both', note: 'Particularly important — VMO keeps the patella tracking properly through the bent-knee load.' },
      { muscle: 'vastus_intermedius_muscle', state: 'concentric', side: 'both' },
      { muscle: 'rectus_femoris_muscle', state: 'concentric', side: 'both' },
      { muscle: 'gluteus_medius_muscle', state: 'concentric', side: 'both', note: 'Holds the front-leg hip externally rotated so the knee tracks over the foot.' },
      // BACK LEG (straight, hip extended — glute max engaged, psoas lengthened)
      { muscle: 'gluteus_maximus_muscle', state: 'concentric', side: 'both', note: 'Back leg: hip extension is glute max work. This is the engine of the pose.' },
      { muscle: 'psoas_major', state: 'loaded-passive', side: 'both', note: 'Back leg: psoas is the primary muscle being LENGTHENED. Deep hip flexor stretch.' },
      { muscle: 'iliacus_muscle', state: 'loaded-passive', side: 'both' },
      { muscle: 'rectus_femoris_muscle', state: 'loaded-passive', side: 'both', note: 'Back leg: rectus femoris crosses both hip and knee — stretches with hip extension.' },
      // Back-leg adductors
      { muscle: 'adductor_longus', state: 'loaded-passive', side: 'both', note: 'Back-leg inner thigh stretches with the foot turned out.' },
      { muscle: 'adductor_magnus', state: 'loaded-passive', side: 'both' },
      // Back-leg quads holding the knee straight
      { muscle: 'vastus_intermedius_muscle', state: 'concentric', side: 'both', note: 'Back leg: keeps the knee fully extended.' },
      // Back-leg calf grounded — soleus engages to press the heel down
      { muscle: 'soleus_muscle', state: 'isometric', side: 'both' },
      { muscle: 'medial_head_of_gastrocnemius', state: 'loaded-passive', side: 'both', note: 'Back-leg gastroc stretches as the heel presses down with knee extended.' },
      { muscle: 'lateral_head_of_gastrocnemius', state: 'loaded-passive', side: 'both' },
      // Core — tucking the tail, holding the lumbar long
      { muscle: 'transversus_abdominis_muscle', state: 'isometric', note: 'Deep core tone holds the pelvis stable while hips square.' },
      { muscle: 'rectus_abdominis_muscle', state: 'isometric', note: 'Light engagement to keep the lumbar long and prevent excess arching.' },
      // Erectors — holding the upright spine
      { muscle: 'longissimus_thoracis_muscle', state: 'isometric', note: 'Holds the upright spine and the slight backbend of the chest.' },
      { muscle: 'iliocostalis_thoracis_muscle', state: 'isometric' },
      // Multifidus organizing the lumbar
      { muscle: 'multifidus_lumborum_muscle', state: 'isometric' },
      // ARMS overhead
      { muscle: 'ascending_part_of_trapezius_muscle', state: 'concentric', note: 'Lower trap pulls the scapulae down — essential for safe overhead reach.' },
      { muscle: 'serratus_anterior_muscle', state: 'concentric', note: 'Upward-rotates the scapulae as the arms lift overhead.' },
      { muscle: 'descending_part_of_trapezius_muscle', state: 'isometric', note: 'Upper trap helps with upward rotation but should NOT shrug the shoulder.' },
      { muscle: 'clavicular_part_of_deltoid_muscle', state: 'concentric', note: 'Front delts lift the arms.' },
      { muscle: 'acromial_part_of_deltoid_muscle', state: 'concentric' },
      // Latissimus dorsi — lengthening with arms overhead
      { muscle: 'latissimus_dorsi_muscle', state: 'passive', note: 'Lats lengthen with the arms overhead. Tight lats limit this reach.' },
      // Pec major lengthens too
      { muscle: 'sternocostal_head_of_pectoralis_major_muscle', state: 'passive' },
      { muscle: 'pectoralis_minor_muscle', state: 'passive' },
    ],
  },

  // --- 5. VIRABHADRASANA II — Warrior II ---
  {
    id: 'warrior-2',
    sanskrit: 'Virabhadrasana II',
    english: 'Warrior II',
    sequence: 'Standing sequence — left and right sides',
    description:
      "Wide stance, front foot pointing forward, back foot turned in slightly (~10°) in the Ashtanga version. Front knee bends to a right angle directly over the ankle. Hips open to the side (different from Warrior I!). Arms reach out parallel to the floor in a T. Gaze is over the front fingertips.",
    intent:
      "Strength in a wide-legged, externally-rotated stance. Open the hips laterally. Build endurance in the legs (especially the front-leg gluteus medius). Find broadness in the chest with arms reaching in opposite directions.",
    cues: [
      "Front knee tracks over the second and third toes — NOT inside them.",
      "Hips face the long side of the mat. The pelvis is wide, not turned forward.",
      "Front-leg gluteus medius actively externally rotates the femur — this keeps the knee tracking out, not collapsing in.",
      "Reach through both fingertips equally. The arms pull away from each other.",
      "Lift through the crown of the head; soften through the shoulders.",
      "Hold the pose at the breath. Warrior II is endurance, not a moment.",
    ],
    watchFor: [
      "Front knee dropping inside the foot.",
      "Hips rotating toward the front — Warrior II is OPEN, not square.",
      "Lifting the shoulders up to the ears.",
      "Tilting the torso forward over the bent leg.",
      "Hyperextending the back knee.",
    ],
    states: [
      // FRONT LEG — bent, holding the wide squat
      { muscle: 'vastus_lateralis_muscle', state: 'concentric', note: 'Front leg: vasti hold the 90° knee bend against body weight.' },
      { muscle: 'vastus_medialis_muscle', state: 'concentric', note: 'VMO crucial for patellar tracking.' },
      { muscle: 'vastus_intermedius_muscle', state: 'concentric' },
      { muscle: 'rectus_femoris_muscle', state: 'concentric' },
      // GLUTEUS MEDIUS — the star of Warrior II
      { muscle: 'gluteus_medius_muscle', state: 'concentric', note: 'STAR of the pose. Externally rotates the front femur to keep the knee tracking over the foot. Burns within seconds.' },
      { muscle: 'gluteus_minimus_muscle', state: 'isometric' },
      { muscle: 'gluteus_maximus_muscle', state: 'concentric', note: 'Contributes to external rotation alongside gluteus medius.' },
      // FRONT-LEG adductors — lengthening as the leg is abducted and externally rotated
      { muscle: 'adductor_longus', state: 'loaded-passive', note: 'Lengthens as the femur abducts and externally rotates.' },
      { muscle: 'adductor_magnus', state: 'loaded-passive' },
      { muscle: 'gracilis_muscle', state: 'loaded-passive' },
      { muscle: 'pectineus_muscle', state: 'loaded-passive' },
      // BACK LEG — straight, foot less turned than Warrior I
      { muscle: 'vastus_intermedius_muscle', state: 'isometric', note: 'Back leg: keeps the knee fully extended.' },
      { muscle: 'gluteus_maximus_muscle', state: 'isometric', note: 'Back leg: stabilizes the hip extension.' },
      // Back-leg hamstrings - lengthening because of straight knee
      { muscle: 'long_head_of_biceps_femoris', state: 'passive', note: 'Back leg: hamstrings lengthen with the knee fully straight.' },
      { muscle: 'semitendinosus_muscle', state: 'passive' },
      // Back-leg calf — grounded
      { muscle: 'soleus_muscle', state: 'isometric' },
      // Back-leg adductors active to stabilize the wide stance
      { muscle: 'adductor_magnus', state: 'isometric' },
      // CORE - holding the upright torso between two externally-rotated hips
      { muscle: 'transversus_abdominis_muscle', state: 'isometric', note: "The bandha — holds the trunk upright over open hips." },
      { muscle: 'external_abdominal_oblique_muscle', state: 'isometric', note: 'Obliques resist the torso tipping forward.' },
      { muscle: 'internal_abdominal_oblique_muscle', state: 'isometric' },
      { muscle: 'rectus_abdominis_muscle', state: 'isometric' },
      // Quadratus lumborum — keeping the pelvis level
      { muscle: 'quadratus_lumborum_muscle', state: 'isometric', note: 'Holds the pelvis level as the hips open.' },
      // Erectors holding upright
      { muscle: 'longissimus_thoracis_muscle', state: 'isometric' },
      { muscle: 'iliocostalis_thoracis_muscle', state: 'isometric' },
      { muscle: 'multifidus_lumborum_muscle', state: 'isometric' },
      // ARMS in a T
      { muscle: 'acromial_part_of_deltoid_muscle', state: 'concentric', note: 'Middle delt abducts both arms to 90° — burns over time.' },
      { muscle: 'clavicular_part_of_deltoid_muscle', state: 'isometric' },
      { muscle: 'scapular_spinal_part_of_deltoid_muscle', state: 'isometric' },
      { muscle: 'supraspinatus_muscle', state: 'isometric', note: 'Initiated the abduction; now stabilizes.' },
      // Scapular stabilizers
      { muscle: 'serratus_anterior_muscle', state: 'isometric', note: 'Holds the scapulae against the rib cage.' },
      { muscle: 'transverse_part_of_trapezius_muscle', state: 'isometric', note: 'Middle trap stabilizes the scapulae from behind.' },
      { muscle: 'ascending_part_of_trapezius_muscle', state: 'isometric', note: 'Lower trap holds the shoulders down — fights the upper trap urge to shrug.' },
      { muscle: 'descending_part_of_trapezius_muscle', state: 'antagonist', note: 'Upper trap should NOT shrug — common compensation.' },
      // Rotator cuff stabilizing
      { muscle: 'infraspinatus_muscle', state: 'isometric' },
      { muscle: 'teres_minor_muscle', state: 'isometric' },
      { muscle: 'subscapularis_muscle', state: 'isometric' },
      // Neck — gaze over front fingertips
      { muscle: 'sternocleidomastoid_muscle', state: 'concentric', side: 'both', note: 'One SCM rotates the head toward the front hand.' },
    ],
  },
];

// ============================================================
// Sun Salutation A — completing the cycle
// ============================================================

POSES.push(
  {
    id: 'plank',
    sanskrit: 'Phalakasana',
    english: 'Plank',
    sequence: 'Surya Namaskar A — between Down Dog and Chaturanga',
    description:
      "From hands and knees or shifted forward from Down Dog, the body forms one long straight line from heels through crown. Hands directly under the shoulders, fingers spread; the arms straight; the body suspended above the floor with the entire posterior chain engaged. Plank is the deceptively-simple foundation of every arm balance and the gateway to Chaturanga.",
    intent:
      "Build whole-body integration. Plank is where you learn to hold the body as one piece — not letting the hips sink, not letting the upper back collapse, not letting the head drop. The pose where the deep core, the serratus anterior, and the legs are all asked to work together.",
    cues: [
      "Hands directly under the shoulders. Wrist creases parallel to the front edge of the mat.",
      "Press the floor away through the index-finger knuckles — this fires serratus anterior and protects the shoulder joints.",
      "Reach the heels back and the crown of the head forward to make the spine one long line.",
      "Engage the lower abdominal wall to keep the hips from sinking. The pubic bone reaches gently up toward the navel.",
      "The legs are active — quadriceps engaged, lifting the kneecaps; the inner thighs gently rotate up toward the ceiling.",
      "Look at a point a few inches in front of the hands so the back of the neck stays long.",
    ],
    watchFor: [
      "Sagging hips — the most common compensation. Engage the lower belly first, then think 'press the floor down through the hands.'",
      "Hyperextended elbows — keep a micro-bend.",
      "Collapsed scapulae sliding together (pinching) — instead, broaden the upper back and protract the scapulae forward and around the ribcage.",
      "Forward head, dropped chin.",
      "Holding the breath. Plank should be breathed through, not braced through.",
    ],
    states: [
      // SHOULDER GIRDLE — serratus is the star
      { muscle: 'serratus_anterior_muscle', state: 'concentric', note: '"Press the floor away" — serratus protracts the scapulae against the chest wall, holding the shoulder blades flat. The single most important muscle in plank.' },
      { muscle: 'transverse_part_of_trapezius_muscle', state: 'antagonist', note: 'Middle trap should NOT pinch the scapulae together — common mistake.' },
      { muscle: 'ascending_part_of_trapezius_muscle', state: 'isometric', note: 'Lower trap stabilizes the scapulae downward, preventing them from riding up.' },
      { muscle: 'descending_part_of_trapezius_muscle', state: 'antagonist', note: 'Upper trap should release; if it grips, the neck shortens.' },
      // ROTATOR CUFF — stabilizing under load
      { muscle: 'supraspinatus_muscle', state: 'isometric' },
      { muscle: 'infraspinatus_muscle', state: 'isometric', note: 'Externally rotates the upper arm slightly so the elbow points back, not out.' },
      { muscle: 'teres_minor_muscle', state: 'isometric' },
      { muscle: 'subscapularis_muscle', state: 'isometric' },
      // ARM — straight under load
      { muscle: 'long_head_of_triceps_brachii', state: 'isometric', note: 'Triceps hold the elbows extended against gravity.' },
      { muscle: 'lateral_head_of_triceps_brachii', state: 'isometric' },
      { muscle: 'medial_head_of_triceps_brachii', state: 'isometric' },
      { muscle: 'anconeus_muscle', state: 'isometric' },
      { muscle: 'long_head_of_biceps_brachii', state: 'isometric', note: 'Biceps stabilize against the elbow extension force.' },
      { muscle: 'short_head_of_biceps_brachii', state: 'isometric' },
      { muscle: 'brachialis_muscle', state: 'isometric' },
      { muscle: 'brachioradialis_muscle', state: 'isometric' },
      // CHEST
      { muscle: 'pectoralis_minor_muscle', state: 'isometric' },
      { muscle: 'sternocostal_head_of_pectoralis_major_muscle', state: 'isometric', note: 'Pec major stabilizes the front of the shoulder against the load.' },
      // LATS
      { muscle: 'latissimus_dorsi_muscle', state: 'isometric', note: 'Engaged to keep the upper arms close to the ribs and prevent the shoulders from collapsing forward.' },
      // ANTERIOR DELT under load
      { muscle: 'clavicular_part_of_deltoid_muscle', state: 'isometric' },
      { muscle: 'acromial_part_of_deltoid_muscle', state: 'isometric' },
      // CORE — the second star of plank
      { muscle: 'transversus_abdominis_muscle', state: 'concentric', note: 'TVA fires hard to keep the lumbar from sagging. The deep cylindrical core wrap.' },
      { muscle: 'rectus_abdominis_muscle', state: 'isometric', note: 'Engaged to prevent hip-sag; should not over-grip and round the lumbar.' },
      { muscle: 'external_abdominal_oblique_muscle', state: 'isometric' },
      { muscle: 'internal_abdominal_oblique_muscle', state: 'isometric' },
      { muscle: 'multifidus_lumborum_muscle', state: 'isometric', note: 'Segmental lumbar stabilization — works against the rectus to keep the lumbar long.' },
      // BACK — the long line
      { muscle: 'longissimus_thoracis_muscle', state: 'isometric' },
      { muscle: 'iliocostalis_thoracis_muscle', state: 'isometric' },
      { muscle: 'spinalis_thoracis_muscle', state: 'isometric' },
      { muscle: 'quadratus_lumborum_muscle', state: 'isometric' },
      // HIPS — glutes hold the pelvis level
      { muscle: 'gluteus_maximus_muscle', state: 'concentric', note: 'Glute max engagement keeps the pelvis from dropping; subtle but essential.' },
      { muscle: 'gluteus_medius_muscle', state: 'isometric' },
      { muscle: 'gluteus_minimus_muscle', state: 'isometric' },
      // LEGS — straight and active
      { muscle: 'vastus_lateralis_muscle', state: 'concentric', note: '"Lift the kneecaps" — quads hold the legs straight.' },
      { muscle: 'vastus_medialis_muscle', state: 'concentric' },
      { muscle: 'vastus_intermedius_muscle', state: 'concentric' },
      { muscle: 'rectus_femoris_muscle', state: 'concentric' },
      // ADDUCTORS — inner thighs gently rotate up
      { muscle: 'adductor_magnus', state: 'isometric', note: 'Inner thighs hold the legs together; gentle internal rotation lifts the inner ankles.' },
      // CALVES — heels push back
      { muscle: 'soleus_muscle', state: 'concentric', note: 'Pushes the heels back, lengthening the body.' },
      { muscle: 'medial_head_of_gastrocnemius', state: 'isometric' },
      { muscle: 'lateral_head_of_gastrocnemius', state: 'isometric' },
      // FOOT — toes tucked
      { muscle: 'tibialis_anterior_muscle', state: 'isometric' },
    ],
  },

  {
    id: 'chaturanga',
    sanskrit: 'Chaturanga Dandasana',
    english: 'Four-Limbed Staff Pose',
    sequence: 'Surya Namaskar A — the lowering between Plank and Up Dog',
    description:
      "From plank, the entire body lowers as one piece until the elbows form right angles, the upper arms parallel to the floor, the body still in a straight line and hovering just above the ground. The single hardest pose in any vinyasa practice — and the most consequential one for shoulder and elbow health, because it is repeated dozens of times in every class.",
    intent:
      "Develop tightly-controlled eccentric strength through the chest, shoulders, and arms. Chaturanga is not a press-down; it is a controlled descent. When done well it builds extraordinary stability. When done poorly — elbows splayed, shoulders sinking past elbows, hips dropping — it is the source of a high percentage of yoga shoulder injuries.",
    cues: [
      "Shift forward from plank first, so when you lower, the shoulders end up directly over (or just behind) the wrists — not in front of them.",
      "Elbows hug the ribs. Upper arms travel back along the sides of the body, NOT out to the sides like a push-up.",
      "Lower until the upper arms are parallel to the floor — not deeper. Going lower than 90° at the elbow strains the rotator cuff.",
      "Maintain everything that was true in plank: long spine, lifted hips, engaged legs, broad upper back.",
      "Keep serratus engaged — the scapulae stay flat against the ribcage. They do NOT slide together.",
      "If you cannot hold this with control, drop the knees. Honesty here protects the shoulders for the next twenty years of practice.",
    ],
    watchFor: [
      "Elbows splaying out to the sides — by far the most common mistake. Recipe for rotator cuff injury.",
      "Sinking past 90° at the elbow — the shoulder ends up below the elbow joint and the shoulder capsule takes the load.",
      "Shoulders riding up to the ears.",
      "Hips dropping below the line of the body — break the line and you've broken the pose.",
      "Holding the breath. Exhale slowly throughout the descent.",
    ],
    states: [
      // CHEST — sternocostal head of pec major works hardest here
      { muscle: 'sternocostal_head_of_pectoralis_major_muscle', state: 'eccentric', note: 'PRIMARY ENGINE of the descent. Pec major lengthens under load to control the lowering.' },
      { muscle: 'clavicular_head_of_pectoralis_major_muscle', state: 'eccentric' },
      { muscle: 'pectoralis_minor_muscle', state: 'eccentric' },
      // TRICEPS — the elbow brake
      { muscle: 'long_head_of_triceps_brachii', state: 'eccentric', note: 'PRIMARY ENGINE. Triceps lengthen under load to control elbow flexion.' },
      { muscle: 'lateral_head_of_triceps_brachii', state: 'eccentric' },
      { muscle: 'medial_head_of_triceps_brachii', state: 'eccentric' },
      // ANTERIOR DELT — also doing eccentric work
      { muscle: 'clavicular_part_of_deltoid_muscle', state: 'eccentric', note: 'Anterior deltoid lengthens to control shoulder flexion.' },
      { muscle: 'acromial_part_of_deltoid_muscle', state: 'eccentric' },
      // SERRATUS — keeping the scapulae stable
      { muscle: 'serratus_anterior_muscle', state: 'concentric', note: 'Serratus actively holds the scapulae flat as the body descends. Critical for shoulder safety.' },
      // ROTATOR CUFF — stabilizing
      { muscle: 'infraspinatus_muscle', state: 'concentric', note: 'External rotation keeps elbows tracking back, not out — protects the cuff.' },
      { muscle: 'teres_minor_muscle', state: 'concentric' },
      { muscle: 'supraspinatus_muscle', state: 'isometric' },
      { muscle: 'subscapularis_muscle', state: 'isometric' },
      // BICEPS / brachialis stabilizing the elbow
      { muscle: 'long_head_of_biceps_brachii', state: 'eccentric', note: 'Stabilizes the front of the shoulder during the lowering.' },
      { muscle: 'short_head_of_biceps_brachii', state: 'eccentric' },
      { muscle: 'brachialis_muscle', state: 'eccentric' },
      { muscle: 'brachioradialis_muscle', state: 'isometric' },
      { muscle: 'anconeus_muscle', state: 'isometric' },
      // LATS — keep arms close to body
      { muscle: 'latissimus_dorsi_muscle', state: 'concentric', note: 'Lats actively pull the upper arms in toward the body — keeps elbows from splaying.' },
      // BACK — keep the long line
      { muscle: 'transverse_part_of_trapezius_muscle', state: 'antagonist' },
      { muscle: 'ascending_part_of_trapezius_muscle', state: 'isometric' },
      { muscle: 'descending_part_of_trapezius_muscle', state: 'antagonist' },
      // CORE — same as plank, holding the line
      { muscle: 'transversus_abdominis_muscle', state: 'concentric', note: 'Even more important here than in plank — TVA prevents the lumbar from collapsing as the body lowers.' },
      { muscle: 'rectus_abdominis_muscle', state: 'isometric' },
      { muscle: 'external_abdominal_oblique_muscle', state: 'isometric' },
      { muscle: 'internal_abdominal_oblique_muscle', state: 'isometric' },
      { muscle: 'multifidus_lumborum_muscle', state: 'isometric' },
      { muscle: 'longissimus_thoracis_muscle', state: 'isometric' },
      { muscle: 'iliocostalis_thoracis_muscle', state: 'isometric' },
      // HIPS — glutes still holding pelvis level
      { muscle: 'gluteus_maximus_muscle', state: 'concentric' },
      { muscle: 'gluteus_medius_muscle', state: 'isometric' },
      // LEGS — straight and engaged
      { muscle: 'vastus_lateralis_muscle', state: 'concentric' },
      { muscle: 'vastus_medialis_muscle', state: 'concentric' },
      { muscle: 'vastus_intermedius_muscle', state: 'concentric' },
      { muscle: 'rectus_femoris_muscle', state: 'concentric' },
      // CALVES — heels back
      { muscle: 'soleus_muscle', state: 'concentric' },
      { muscle: 'medial_head_of_gastrocnemius', state: 'isometric' },
      { muscle: 'lateral_head_of_gastrocnemius', state: 'isometric' },
      { muscle: 'tibialis_anterior_muscle', state: 'isometric' },
    ],
  },

  {
    id: 'up-dog',
    sanskrit: 'Urdhva Mukha Svanasana',
    english: 'Upward-Facing Dog',
    sequence: 'Surya Namaskar A — the inhale lift after Chaturanga',
    description:
      "From the bottom of Chaturanga, the chest rolls forward and up between the hands as the legs straighten. The thighs lift off the floor; the body is supported only by the hands and the tops of the feet. The arms are straight. The chest lifts up and through. The head is neutral or gently lifted to look up. A backbend you actively make, not one you fall into.",
    intent:
      "Open the front body — pec major, abdomen, hip flexors — through a strong, supported backbend. Strengthen the arms and entire posterior chain. Re-organize the shoulder girdle from the collapsed position of Chaturanga back into broad chest, integrated scapulae.",
    cues: [
      "Press strongly through the hands. The arms are straight and engaged — not just supporting the weight, actively pushing the floor away.",
      "Externally rotate the upper arms so the inner elbows turn forward.",
      "Roll the shoulders down and back — but more importantly, lift the chest UP and FORWARD between the arms.",
      "Strongly engage the gluteals to lift the thighs off the floor and protect the lumbar spine.",
      "Press the tops of the feet into the floor. This activates the entire posterior chain.",
      "Open across the collarbones; the chest is broad. The neck stays long — don't crank the head back.",
    ],
    watchFor: [
      "Sinking into the shoulders — keep pressing the floor away.",
      "Hanging into the lumbar spine — engage the glutes hard to support the lower back.",
      "Forearms rolled in (elbows pointing out). External rotation is essential here.",
      "Chest falling between the shoulders — lift it through and up.",
      "Head crammed back, compressing the neck.",
    ],
    states: [
      // GLUTES — the engine of safe up dog
      { muscle: 'gluteus_maximus_muscle', state: 'concentric', note: 'PRIMARY engine. Glute max contraction lifts the thighs and protects the lumbar from collapsing into compression.' },
      { muscle: 'gluteus_medius_muscle', state: 'isometric' },
      // PSOAS / iliacus — front body STRETCH
      { muscle: 'psoas_major', state: 'loaded-passive', note: 'Hip flexors lengthen as the hips press forward through the arms.' },
      { muscle: 'iliacus_muscle', state: 'loaded-passive' },
      // QUADS — straight legs, lifted thighs
      { muscle: 'rectus_femoris_muscle', state: 'concentric', note: 'Rectus femoris — both crosses the hip (lifting the thigh) and extends the knee. Both work.' },
      { muscle: 'vastus_lateralis_muscle', state: 'concentric' },
      { muscle: 'vastus_medialis_muscle', state: 'concentric' },
      { muscle: 'vastus_intermedius_muscle', state: 'concentric' },
      // ABDOMEN — major stretch
      { muscle: 'rectus_abdominis_muscle', state: 'loaded-passive', note: 'Front abdominal wall stretches across the lift of the chest. Key sensation of the pose.' },
      { muscle: 'external_abdominal_oblique_muscle', state: 'loaded-passive' },
      { muscle: 'internal_abdominal_oblique_muscle', state: 'loaded-passive' },
      { muscle: 'transversus_abdominis_muscle', state: 'isometric', note: 'TVA stays gently engaged — keeps the lumbar from over-collapsing into the backbend.' },
      // CHEST — major stretch
      { muscle: 'sternocostal_head_of_pectoralis_major_muscle', state: 'loaded-passive', note: 'Pec major stretches as the chest lifts and broadens. Big sensation across the front of the shoulders.' },
      { muscle: 'clavicular_head_of_pectoralis_major_muscle', state: 'loaded-passive' },
      { muscle: 'pectoralis_minor_muscle', state: 'loaded-passive' },
      // BACK — actively engaged in backbend
      { muscle: 'longissimus_thoracis_muscle', state: 'concentric', note: 'Erector spinae actively extends the spine. Major work.' },
      { muscle: 'longissimus_lumborum_muscle', state: 'concentric' },
      { muscle: 'iliocostalis_thoracis_muscle', state: 'concentric' },
      { muscle: 'iliocostalis_lumborum_muscle', state: 'concentric' },
      { muscle: 'spinalis_thoracis_muscle', state: 'concentric' },
      { muscle: 'multifidus_lumborum_muscle', state: 'isometric', note: 'Critical — multifidus organizes the segmental extension of the lumbar to prevent crunching.' },
      { muscle: 'multifidus_thoracis_muscle', state: 'concentric' },
      { muscle: 'quadratus_lumborum_muscle', state: 'isometric' },
      // SHOULDER GIRDLE — re-organizing from chaturanga collapse
      { muscle: 'transverse_part_of_trapezius_muscle', state: 'concentric', note: 'Middle trap pulls scapulae back and down — opens the chest.' },
      { muscle: 'ascending_part_of_trapezius_muscle', state: 'concentric', note: 'Lower trap pulls scapulae down. Critical for safe shoulder positioning.' },
      { muscle: 'rhomboid_major_muscle', state: 'concentric' },
      { muscle: 'rhomboid_minor_muscle', state: 'concentric' },
      { muscle: 'descending_part_of_trapezius_muscle', state: 'antagonist', note: 'Upper trap should NOT shrug — common compensation.' },
      // ROTATOR CUFF
      { muscle: 'infraspinatus_muscle', state: 'concentric', note: '"Externally rotate the arms" — infraspinatus and teres minor work hard.' },
      { muscle: 'teres_minor_muscle', state: 'concentric' },
      { muscle: 'supraspinatus_muscle', state: 'isometric' },
      { muscle: 'subscapularis_muscle', state: 'antagonist', note: 'Subscap should release; gripping it would internally rotate and collapse the shoulders.' },
      // ARMS — straight under load
      { muscle: 'long_head_of_triceps_brachii', state: 'concentric', note: '"Push the floor away" — triceps press the body up and through.' },
      { muscle: 'lateral_head_of_triceps_brachii', state: 'concentric' },
      { muscle: 'medial_head_of_triceps_brachii', state: 'concentric' },
      { muscle: 'anconeus_muscle', state: 'isometric' },
      // BICEPS / brachialis — hold the elbow extended
      { muscle: 'long_head_of_biceps_brachii', state: 'isometric' },
      { muscle: 'brachialis_muscle', state: 'isometric' },
      // SERRATUS — keeps scapulae stable
      { muscle: 'serratus_anterior_muscle', state: 'isometric' },
      // LATS — major front-of-shoulder stretch
      { muscle: 'latissimus_dorsi_muscle', state: 'eccentric', note: 'Lats simultaneously stretch (across the lifted chest) and engage (to keep the upper arms back).' },
      // CALVES — top of the foot pressed down
      { muscle: 'tibialis_anterior_muscle', state: 'loaded-passive', note: 'Stretches as the top of the foot presses to the floor — that "shin and front of ankle" sensation.' },
      { muscle: 'soleus_muscle', state: 'concentric' },
      { muscle: 'medial_head_of_gastrocnemius', state: 'concentric' },
      { muscle: 'lateral_head_of_gastrocnemius', state: 'concentric' },
    ],
  },

  // ============================================================
  // Standing sequence
  // ============================================================

  {
    id: 'padangusthasana',
    sanskrit: 'Padangusthasana / Padahastasana',
    english: 'Standing Forward Fold with Toe Grip / Hand Under Foot',
    sequence: 'Standing sequence — first two standing folds in Ashtanga',
    description:
      "From standing with feet hip-width apart, fold forward and grip the big toes with the first two fingers and thumb (Padangusthasana). The intention is the same as Uttanasana but the toe grip provides a lever — the arms can pull the trunk further into the fold while the legs stay strong. In Padahastasana, the hands slide under the feet and the wrists end up under the soles of the feet. Both are deep posterior-chain stretches with an added shoulder element from the arm position.",
    intent:
      "A sustained, more intense version of Uttanasana with the added benefit of using the arms to deepen the fold. Strong stretch through hamstrings, calves, and the entire fascial back-line. Mild traction through the shoulders.",
    cues: [
      "Feet hip-width apart, parallel — not the feet-together stance of Uttanasana.",
      "Hinge from the hip joints. Long spine on the way down.",
      "Once you have the toe grip, on the inhale lift the chest forward and lengthen the spine. On the exhale, fold deeper using the bicep contraction to draw yourself in.",
      "Keep the legs strong — quadriceps engaged, kneecaps lifted.",
      "Crown of the head reaches toward the floor; sit bones reach up.",
      "Shoulders melt away from the ears even as the biceps work.",
    ],
    watchFor: [
      "Yanking on the toes with the spine rounded — the lumbar takes the strain. Better to bend the knees and keep the spine long.",
      "Locking the knees into hyperextension.",
      "Holding the breath. The exhale is what lets you go deeper.",
    ],
    states: [
      // POSTERIOR CHAIN — the main event
      { muscle: 'long_head_of_biceps_femoris', state: 'loaded-passive', note: 'Same hamstring stretch as Uttanasana — but the arm pull adds intensity.' },
      { muscle: 'short_head_of_biceps_femoris', state: 'loaded-passive' },
      { muscle: 'semitendinosus_muscle', state: 'loaded-passive' },
      { muscle: 'semimembranosus_muscle', state: 'loaded-passive' },
      { muscle: 'medial_head_of_gastrocnemius', state: 'loaded-passive' },
      { muscle: 'lateral_head_of_gastrocnemius', state: 'loaded-passive' },
      { muscle: 'soleus_muscle', state: 'passive' },
      { muscle: 'gluteus_maximus_muscle', state: 'passive' },
      // ERECTORS — passive then can be eccentrically engaged on the long-spine inhale
      { muscle: 'longissimus_thoracis_muscle', state: 'passive' },
      { muscle: 'longissimus_lumborum_muscle', state: 'passive' },
      { muscle: 'iliocostalis_lumborum_muscle', state: 'passive' },
      { muscle: 'iliocostalis_thoracis_muscle', state: 'passive' },
      { muscle: 'multifidus_lumborum_muscle', state: 'passive' },
      // QUADS — active to inhibit hamstrings
      { muscle: 'vastus_lateralis_muscle', state: 'concentric' },
      { muscle: 'vastus_medialis_muscle', state: 'concentric' },
      { muscle: 'vastus_intermedius_muscle', state: 'concentric' },
      { muscle: 'rectus_femoris_muscle', state: 'concentric' },
      // HIP FLEXORS — driving deeper
      { muscle: 'psoas_major', state: 'concentric' },
      { muscle: 'iliacus_muscle', state: 'concentric' },
      // BICEPS — actively pulling the trunk deeper
      { muscle: 'long_head_of_biceps_brachii', state: 'concentric', note: 'UNIQUE TO THIS POSE: biceps actively pull on the toes to draw the trunk deeper into the fold.' },
      { muscle: 'short_head_of_biceps_brachii', state: 'concentric' },
      { muscle: 'brachialis_muscle', state: 'concentric' },
      // LATS — engaged to draw the elbows back as biceps pull
      { muscle: 'latissimus_dorsi_muscle', state: 'isometric' },
      // SHOULDER STABILIZERS
      { muscle: 'descending_part_of_trapezius_muscle', state: 'antagonist', note: 'Upper trap should release even as biceps work — the shoulders melt away from the ears.' },
      { muscle: 'ascending_part_of_trapezius_muscle', state: 'isometric' },
      // CORE
      { muscle: 'transversus_abdominis_muscle', state: 'isometric' },
      { muscle: 'rectus_abdominis_muscle', state: 'concentric', note: 'Mild engagement to deepen the fold and protect the lumbar.' },
      // BALANCE — calf and foot stabilizers
      { muscle: 'tibialis_anterior_muscle', state: 'isometric' },
      { muscle: 'tibialis_posterior_muscle', state: 'isometric' },
      { muscle: 'fibularis_longus_muscle', state: 'isometric' },
    ],
  },

  {
    id: 'trikonasana',
    sanskrit: 'Utthita Trikonasana',
    english: 'Extended Triangle Pose',
    sequence: 'Standing sequence — left and right sides',
    description:
      "Wide-legged stance, front foot pointing forward, back foot turned in slightly (~15° in Ashtanga). Hips face the long edge of the mat. The trunk reaches out laterally over the front leg, then descends — the front hand reaches for the front foot or shin, the back arm extends straight up to the ceiling, the gaze goes up. The body forms a series of triangles: legs, arms, side body. A pose of length, not depth.",
    intent:
      "Lateral spinal extension. Strong stretch of the inner front-leg hamstring and adductors, the side body, and the underside of the ribcage. Build precision in foot, knee, and hip alignment under load. Triangle is the pose where alignment habits get formed for every other standing pose.",
    cues: [
      "Wide stance — heel of the front foot in line with the arch of the back foot.",
      "Front knee is fully extended, lifted strongly. The kneecap is engaged — never locked into hyperextension.",
      "Hips remain open (square to the long edge of the mat). The pose is NOT a forward bend over the front leg.",
      "Reach the front arm out over the front leg first, lengthening the side body, BEFORE reaching down.",
      "Press strongly through the outer edge of the back foot. This anchors the pose.",
      "Top arm reaches straight up. Both arms in one vertical line. Gaze up at the top thumb.",
      "Lower ribs broaden — don't let them collapse.",
    ],
    watchFor: [
      "Locking the front knee into hyperextension.",
      "Hips swinging forward (toward the front of the mat) — the pose becomes a hamstring stretch instead of a triangle.",
      "Crashing the front hand to the floor by collapsing the side body — better to use a block.",
      "Top shoulder rolling forward instead of stacking over the bottom one.",
      "Holding the breath in the descent.",
    ],
    states: [
      // FRONT LEG — quads holding it straight
      { muscle: 'vastus_lateralis_muscle', state: 'concentric', note: 'Front leg: vasti hold the knee straight against the lateral lean. Critical — this is what protects the front knee.' },
      { muscle: 'vastus_medialis_muscle', state: 'concentric' },
      { muscle: 'vastus_intermedius_muscle', state: 'concentric' },
      { muscle: 'rectus_femoris_muscle', state: 'concentric' },
      // FRONT-LEG hamstring — strong stretch
      { muscle: 'long_head_of_biceps_femoris', state: 'loaded-passive', note: 'Front leg: hamstrings stretched across hip flexion + knee extension. Major pose sensation.' },
      { muscle: 'semitendinosus_muscle', state: 'loaded-passive' },
      { muscle: 'semimembranosus_muscle', state: 'loaded-passive' },
      // FRONT-LEG adductors — also stretching
      { muscle: 'adductor_longus', state: 'loaded-passive', note: 'Front leg adductors stretched as the leg externally rotates and the trunk laterals.' },
      { muscle: 'adductor_magnus', state: 'loaded-passive' },
      { muscle: 'gracilis_muscle', state: 'loaded-passive', note: 'Gracilis crosses both hip and knee — major stretch.' },
      { muscle: 'pectineus_muscle', state: 'loaded-passive' },
      // FRONT-LEG glute medius — externally rotating the femur
      { muscle: 'gluteus_medius_muscle', state: 'concentric', note: 'Externally rotates the front femur so the knee tracks over the foot.' },
      { muscle: 'gluteus_maximus_muscle', state: 'isometric' },
      { muscle: 'gluteus_minimus_muscle', state: 'isometric' },
      // BACK LEG — strong, foot grounded
      { muscle: 'gluteus_maximus_muscle', state: 'isometric', note: 'Back leg: glute max stabilizes hip in extension.' },
      // Back-leg quads — keep knee extended
      { muscle: 'vastus_intermedius_muscle', state: 'concentric' },
      // Back-leg hamstrings - active to keep the leg straight while bearing weight
      { muscle: 'long_head_of_biceps_femoris', state: 'isometric' },
      // Back-leg adductors - active stabilizers
      { muscle: 'adductor_magnus', state: 'concentric', note: 'Back leg: the "hamstring portion" of magnus extends the hip strongly.' },
      // Back-leg calves
      { muscle: 'fibularis_longus_muscle', state: 'concentric', note: 'Back-leg fibularis — active to press outer edge of foot down. Anchors the pose.' },
      { muscle: 'fibularis_brevis_muscle', state: 'concentric' },
      { muscle: 'soleus_muscle', state: 'isometric' },
      { muscle: 'medial_head_of_gastrocnemius', state: 'isometric' },
      // SIDE BODY — major lengthening
      { muscle: 'quadratus_lumborum_muscle', state: 'loaded-passive', note: 'TOP-side QL stretches dramatically; bottom-side QL contracts to hold the trunk extended over the leg.' },
      { muscle: 'external_abdominal_oblique_muscle', state: 'loaded-passive', note: 'Top-side obliques stretch across the open side body.' },
      { muscle: 'internal_abdominal_oblique_muscle', state: 'loaded-passive' },
      { muscle: 'latissimus_dorsi_muscle', state: 'loaded-passive', note: 'Top-side lat stretches up through the lifted arm.' },
      // CORE
      { muscle: 'transversus_abdominis_muscle', state: 'isometric', note: 'Holds the trunk long and prevents collapse into the side bend.' },
      { muscle: 'rectus_abdominis_muscle', state: 'isometric' },
      // BACK
      { muscle: 'longissimus_thoracis_muscle', state: 'concentric', note: 'Holds the long spine extended laterally.' },
      { muscle: 'multifidus_thoracis_muscle', state: 'isometric' },
      // ARMS — straight, top arm reaching up, bottom arm reaching down
      { muscle: 'acromial_part_of_deltoid_muscle', state: 'concentric', note: 'Both deltoids work to abduct both arms in opposite directions.' },
      { muscle: 'clavicular_part_of_deltoid_muscle', state: 'isometric' },
      { muscle: 'scapular_spinal_part_of_deltoid_muscle', state: 'isometric' },
      { muscle: 'supraspinatus_muscle', state: 'isometric' },
      // External rotation of top arm
      { muscle: 'infraspinatus_muscle', state: 'concentric', note: 'Top-arm shoulder external rotation keeps the arm aligned vertically.' },
      { muscle: 'teres_minor_muscle', state: 'concentric' },
      // SHOULDER STABILIZERS
      { muscle: 'serratus_anterior_muscle', state: 'isometric' },
      { muscle: 'transverse_part_of_trapezius_muscle', state: 'isometric' },
      { muscle: 'ascending_part_of_trapezius_muscle', state: 'isometric' },
      { muscle: 'descending_part_of_trapezius_muscle', state: 'antagonist' },
      // NECK — gaze up
      { muscle: 'sternocleidomastoid_muscle', state: 'isometric' },
    ],
  },

  {
    id: 'parivrtta-trikonasana',
    sanskrit: 'Parivrtta Trikonasana',
    english: 'Revolved Triangle Pose',
    sequence: 'Standing sequence — left and right sides',
    description:
      "From a stance similar to Triangle but with the back foot turned in more (~30°), the torso revolves toward the front leg. The opposite-side hand reaches down to the outside of the front foot; the same-side hand of the front leg reaches up to the ceiling. Hips face forward; the trunk twists over the leg. A demanding combination of standing balance, hamstring stretch, and deep spinal rotation.",
    intent:
      "Combine three things at once: hamstring stretch (front leg), spinal rotation, and the balance challenge of a long lever in a wide stance. Open the thoracic spine through twisting. Train the deep stabilizers of the standing leg.",
    cues: [
      "Stance is slightly shorter than Triangle. Back foot turned in more.",
      "Hips square forward to the front of the mat — completely different from Triangle, where hips stay open.",
      "Lengthen the spine FORWARD over the front leg first; then revolve.",
      "The twist comes from the spine, not from a hip swing. The pelvis stays neutral.",
      "Press strongly through the back-foot outer edge — this is the anchor.",
      "Top arm reaches straight up; both shoulders stack vertically.",
      "If you can't reach the floor with the spine long, use a block under the bottom hand. Length over depth.",
    ],
    watchFor: [
      "Back hip swinging out behind — keep the pelvis squared forward.",
      "Spine rounding to reach the floor — block up the bottom hand.",
      "Front knee dropping in (medial). Engage the front-leg gluteus medius.",
      "Top shoulder rolling forward.",
      "Loss of balance — this pose has a small base of support and strong rotational forces.",
    ],
    states: [
      // FRONT LEG — quads strong, hamstring stretched
      { muscle: 'vastus_lateralis_muscle', state: 'concentric' },
      { muscle: 'vastus_medialis_muscle', state: 'concentric' },
      { muscle: 'vastus_intermedius_muscle', state: 'concentric' },
      { muscle: 'rectus_femoris_muscle', state: 'concentric' },
      // FRONT-LEG hamstrings — major stretch
      { muscle: 'long_head_of_biceps_femoris', state: 'loaded-passive', note: 'Front leg hamstrings stretch deeply, similar to Triangle but with the rotation adding torque.' },
      { muscle: 'semitendinosus_muscle', state: 'loaded-passive' },
      { muscle: 'semimembranosus_muscle', state: 'loaded-passive' },
      // FRONT-LEG glute medius — protecting the knee
      { muscle: 'gluteus_medius_muscle', state: 'concentric', note: 'Holds the front knee tracking over the foot against the rotational forces.' },
      // BACK LEG — straight, anchored
      { muscle: 'gluteus_maximus_muscle', state: 'concentric', note: 'Back leg: glute max squares the back hip forward — the engine that keeps the pelvis level.' },
      { muscle: 'fibularis_longus_muscle', state: 'concentric' },
      { muscle: 'soleus_muscle', state: 'isometric' },
      // SPINAL ROTATORS — the heart of the pose
      { muscle: 'external_abdominal_oblique_muscle', state: 'concentric', note: 'PRIMARY ROTATOR. The opposite-side external oblique fires hard with the same-side internal oblique to rotate the trunk.' },
      { muscle: 'internal_abdominal_oblique_muscle', state: 'concentric', note: 'Same-side internal oblique is the other half of the rotation contraction couple.' },
      { muscle: 'multifidus_thoracis_muscle', state: 'concentric', note: 'Multifidus segments rotate vertebra by vertebra.' },
      { muscle: 'multifidus_lumborum_muscle', state: 'isometric', note: 'Lumbar multifidus stabilizes; the lumbar should NOT rotate much (it has poor rotation capacity by design).' },
      // QL stabilizes
      { muscle: 'quadratus_lumborum_muscle', state: 'isometric', note: 'Stabilizes the pelvis as the trunk rotates above it.' },
      // CORE — deep stabilization
      { muscle: 'transversus_abdominis_muscle', state: 'concentric', note: 'TVA fires hard — the deep cylindrical stabilization that protects the lumbar through the rotation.' },
      { muscle: 'rectus_abdominis_muscle', state: 'isometric' },
      // BACK
      { muscle: 'longissimus_thoracis_muscle', state: 'isometric' },
      { muscle: 'iliocostalis_thoracis_muscle', state: 'isometric' },
      // ARMS extended like Triangle
      { muscle: 'acromial_part_of_deltoid_muscle', state: 'concentric' },
      { muscle: 'clavicular_part_of_deltoid_muscle', state: 'isometric' },
      { muscle: 'scapular_spinal_part_of_deltoid_muscle', state: 'isometric' },
      // Top-arm external rotation
      { muscle: 'infraspinatus_muscle', state: 'concentric' },
      { muscle: 'teres_minor_muscle', state: 'concentric' },
      // PEC MAJOR top-arm side stretches
      { muscle: 'sternocostal_head_of_pectoralis_major_muscle', state: 'loaded-passive' },
      { muscle: 'pectoralis_minor_muscle', state: 'loaded-passive' },
      // LATS top-arm side
      { muscle: 'latissimus_dorsi_muscle', state: 'loaded-passive', note: 'Top-side lat stretches strongly through the rotation + reach.' },
      // Shoulder girdle stabilizers
      { muscle: 'serratus_anterior_muscle', state: 'isometric' },
      { muscle: 'transverse_part_of_trapezius_muscle', state: 'isometric' },
      { muscle: 'ascending_part_of_trapezius_muscle', state: 'isometric' },
      { muscle: 'descending_part_of_trapezius_muscle', state: 'antagonist' },
      // NECK — gaze up
      { muscle: 'sternocleidomastoid_muscle', state: 'concentric' },
    ],
  },

  {
    id: 'parsvakonasana',
    sanskrit: 'Utthita Parsvakonasana',
    english: 'Extended Side Angle Pose',
    sequence: 'Standing sequence — left and right sides',
    description:
      "Wide stance like Warrior II. Front knee bent to a right angle. The forearm rests on the front thigh, OR the hand reaches all the way to the floor outside the front foot. The top arm reaches over the head, palm down, parallel to the floor — making one long line from the back-foot heel through the fingertips. The body is the side of a triangle, leaning over the bent leg.",
    intent:
      "Extreme lengthening through the side body — from the back-leg foot through the top-arm fingertips, one continuous line. Open the side ribs. Strong work for the front-leg quad and gluteus medius. Open the inner thigh of the back leg.",
    cues: [
      "Front knee bent to 90°, tracking over the second toe.",
      "Press the top of the front thigh down — this stabilizes the pelvis.",
      "Reach the top arm OVER the head (not just up like in Warrior II), parallel to the floor.",
      "Both shoulders rotate toward the ceiling — the chest opens to the long edge of the mat.",
      "Bottom hand: if it doesn't easily reach the floor, rest the elbow on the front thigh. Don't crash the hand down.",
      "Press strongly through the back-foot outer edge.",
      "Lengthen from the back heel through the top fingertips. The body is a long diagonal line.",
    ],
    watchFor: [
      "Top arm reaching straight up (Warrior II) instead of forward over the ear.",
      "Front knee collapsing inward.",
      "Bottom shoulder collapsing into the front knee — actively press the shoulder away from the knee.",
      "Hips rotating toward the front of the mat — this is a wide-hipped pose like Warrior II, not a forward-facing one.",
      "Lower back collapsing — engage the bottom-side TVA to hold the lumbar long.",
    ],
    states: [
      // FRONT LEG — heavy quad work
      { muscle: 'vastus_lateralis_muscle', state: 'concentric', note: 'Front leg: 90° knee bend held against body weight. Burns hard.' },
      { muscle: 'vastus_medialis_muscle', state: 'concentric' },
      { muscle: 'vastus_intermedius_muscle', state: 'concentric' },
      { muscle: 'rectus_femoris_muscle', state: 'concentric' },
      // FRONT-LEG glute medius
      { muscle: 'gluteus_medius_muscle', state: 'concentric', note: 'Externally rotates the front femur — keeps the knee tracking out over the foot.' },
      { muscle: 'gluteus_maximus_muscle', state: 'concentric' },
      // FRONT-LEG adductors — stretching
      { muscle: 'adductor_longus', state: 'loaded-passive' },
      { muscle: 'adductor_magnus', state: 'loaded-passive' },
      { muscle: 'gracilis_muscle', state: 'loaded-passive' },
      { muscle: 'pectineus_muscle', state: 'loaded-passive' },
      // BACK LEG — straight, strong
      { muscle: 'vastus_intermedius_muscle', state: 'isometric', note: 'Back leg: keeps knee extended.' },
      { muscle: 'gluteus_maximus_muscle', state: 'isometric' },
      { muscle: 'long_head_of_biceps_femoris', state: 'passive', note: 'Back-leg hamstrings stretch with the knee fully extended.' },
      { muscle: 'semitendinosus_muscle', state: 'passive' },
      // BACK-LEG adductors — major stretch through the wide stance
      { muscle: 'adductor_magnus', state: 'loaded-passive', note: 'Back-leg adductors stretch through the wide stance + hip extension.' },
      { muscle: 'adductor_longus', state: 'loaded-passive' },
      // Back-leg calf
      { muscle: 'fibularis_longus_muscle', state: 'concentric', note: 'Anchors the back foot — outer edge presses down.' },
      { muscle: 'soleus_muscle', state: 'isometric' },
      { muscle: 'medial_head_of_gastrocnemius', state: 'loaded-passive' },
      { muscle: 'lateral_head_of_gastrocnemius', state: 'loaded-passive' },
      // SIDE BODY — the signature stretch
      { muscle: 'quadratus_lumborum_muscle', state: 'loaded-passive', note: 'Top-side QL stretches dramatically along the long diagonal line.' },
      { muscle: 'external_abdominal_oblique_muscle', state: 'loaded-passive', note: 'Top-side obliques stretch through the lateral lean.' },
      { muscle: 'internal_abdominal_oblique_muscle', state: 'loaded-passive' },
      { muscle: 'latissimus_dorsi_muscle', state: 'loaded-passive', note: 'Top-side lat stretches MAJORLY through the overhead arm reach + lateral lean.' },
      { muscle: 'serratus_anterior_muscle', state: 'concentric', note: 'Top-side serratus actively reaches the top arm overhead and forward.' },
      // Bottom-side core CONTRACTING
      { muscle: 'rectus_abdominis_muscle', state: 'isometric', note: 'Bottom-side abdominals concentrically engage to hold the trunk extended laterally; top-side stretches.' },
      // CORE — deep cylinder
      { muscle: 'transversus_abdominis_muscle', state: 'concentric', note: 'Critical — TVA holds the trunk long against the lateral lean and prevents the side body from collapsing.' },
      // BACK extensors — keeping the spine extended
      { muscle: 'longissimus_thoracis_muscle', state: 'concentric' },
      { muscle: 'iliocostalis_thoracis_muscle', state: 'concentric' },
      // SHOULDER GIRDLE — stable, top arm reaching
      { muscle: 'acromial_part_of_deltoid_muscle', state: 'concentric', note: 'Top arm: middle delt holds the arm in line with the body.' },
      { muscle: 'clavicular_part_of_deltoid_muscle', state: 'concentric', note: 'Anterior delt of top arm — reaches it forward over the ear.' },
      // Top-arm external rotation
      { muscle: 'infraspinatus_muscle', state: 'concentric' },
      { muscle: 'teres_minor_muscle', state: 'concentric' },
      { muscle: 'supraspinatus_muscle', state: 'isometric' },
      // Lower trap — pulling top scapula down
      { muscle: 'ascending_part_of_trapezius_muscle', state: 'concentric', note: 'Critical for safe overhead reach — pulls the top-arm scapula down.' },
      { muscle: 'transverse_part_of_trapezius_muscle', state: 'isometric' },
      { muscle: 'descending_part_of_trapezius_muscle', state: 'antagonist' },
    ],
  },

  {
    id: 'parsvottanasana',
    sanskrit: 'Parsvottanasana',
    english: 'Intense Side Stretch Pose / Pyramid',
    sequence: 'Standing sequence — left and right sides',
    description:
      "Stance is shorter than Warrior I — about leg-length. Both legs straight. Hips squared forward. Trunk folds forward over the front leg, ideally with the spine long and parallel to the front shin. Hands often in reverse prayer behind the back (the Ashtanga version), or framing the front foot. A focused, sharp hamstring and shoulder stretch.",
    intent:
      "Targeted hamstring stretch on the front leg with both hips squared. Shoulder opening through reverse prayer. Strong calf stretch. Parsvottanasana is a quieter pose than the wide-leg ones — it asks for precision more than range.",
    cues: [
      "Stance is one leg length — shorter than warrior poses, longer than mountain.",
      "Both hips face the front of the mat. The back-leg-side hip especially wants to swing back; pull it forward.",
      "Press strongly through the back-leg outer heel. The back leg fully extends.",
      "Lengthen the spine FORWARD over the front leg, not down. The spine should be parallel to the front shin.",
      "If hamstrings are tight, the spine will round past horizontal — bend the front knee or use blocks rather than rounding.",
      "Reverse prayer (hands in prayer position behind the back, fingertips pointing up between the shoulder blades) is the full expression — only access if the shoulders allow.",
    ],
    watchFor: [
      "Back hip swinging out — actively pull it forward.",
      "Locking out the front knee — keep a micro-bend if hyperextension is a tendency.",
      "Spine rounding to reach the floor.",
      "Forcing reverse prayer — clasp the elbows behind the back instead if reverse prayer crunches the wrists.",
    ],
    states: [
      // FRONT LEG — major hamstring stretch
      { muscle: 'long_head_of_biceps_femoris', state: 'loaded-passive', note: 'Front leg: deepest hamstring stretch in the standing series. Very focused on this one leg.' },
      { muscle: 'semitendinosus_muscle', state: 'loaded-passive' },
      { muscle: 'semimembranosus_muscle', state: 'loaded-passive' },
      { muscle: 'medial_head_of_gastrocnemius', state: 'loaded-passive', note: 'Front-leg gastroc stretches with the knee straight and the heel grounded.' },
      { muscle: 'lateral_head_of_gastrocnemius', state: 'loaded-passive' },
      { muscle: 'soleus_muscle', state: 'passive' },
      { muscle: 'gluteus_maximus_muscle', state: 'passive' },
      // FRONT-LEG quads — keep knee extended
      { muscle: 'vastus_lateralis_muscle', state: 'concentric' },
      { muscle: 'vastus_medialis_muscle', state: 'concentric' },
      { muscle: 'vastus_intermedius_muscle', state: 'concentric' },
      { muscle: 'rectus_femoris_muscle', state: 'concentric' },
      // BACK LEG — straight, anchored
      { muscle: 'gluteus_maximus_muscle', state: 'concentric', note: 'Back-leg glute max actively squares the back hip forward.' },
      { muscle: 'gluteus_medius_muscle', state: 'isometric' },
      { muscle: 'vastus_intermedius_muscle', state: 'concentric' },
      { muscle: 'vastus_lateralis_muscle', state: 'concentric' },
      // Back-leg adductors stabilize
      { muscle: 'adductor_magnus', state: 'isometric' },
      // Back-leg calf — heel grounded
      { muscle: 'fibularis_longus_muscle', state: 'concentric' },
      { muscle: 'soleus_muscle', state: 'isometric' },
      // HIP FLEXORS — driving deeper
      { muscle: 'psoas_major', state: 'concentric' },
      { muscle: 'iliacus_muscle', state: 'concentric' },
      // CORE — long spine
      { muscle: 'transversus_abdominis_muscle', state: 'isometric' },
      // BACK extensors — actively holding the long spine forward
      { muscle: 'longissimus_thoracis_muscle', state: 'concentric', note: 'Erectors actively engage to hold the spine long over the front leg.' },
      { muscle: 'longissimus_lumborum_muscle', state: 'concentric' },
      { muscle: 'iliocostalis_thoracis_muscle', state: 'concentric' },
      { muscle: 'multifidus_lumborum_muscle', state: 'isometric' },
      { muscle: 'quadratus_lumborum_muscle', state: 'isometric', note: 'Both QLs work to keep the pelvis level over the staggered feet.' },
      // SHOULDERS — reverse prayer position
      { muscle: 'sternocostal_head_of_pectoralis_major_muscle', state: 'loaded-passive', note: 'Pec major stretches strongly to allow shoulder external rotation behind the back.' },
      { muscle: 'pectoralis_minor_muscle', state: 'loaded-passive', note: 'Pec minor stretches major in reverse prayer — chronically tight in most students.' },
      { muscle: 'subscapularis_muscle', state: 'loaded-passive', note: 'Stretches with shoulder external rotation behind the back.' },
      { muscle: 'rhomboid_major_muscle', state: 'concentric', note: 'Squeezes scapulae together to enable reverse prayer.' },
      { muscle: 'rhomboid_minor_muscle', state: 'concentric' },
      { muscle: 'transverse_part_of_trapezius_muscle', state: 'concentric' },
      // External rotators in reverse prayer
      { muscle: 'infraspinatus_muscle', state: 'concentric' },
      { muscle: 'teres_minor_muscle', state: 'concentric' },
      // Anterior delt stretches
      { muscle: 'clavicular_part_of_deltoid_muscle', state: 'loaded-passive' },
      // Lower trap holding scapulae down
      { muscle: 'ascending_part_of_trapezius_muscle', state: 'concentric' },
      { muscle: 'descending_part_of_trapezius_muscle', state: 'antagonist' },
    ],
  },

  {
    id: 'utthita-hasta-padangusthasana',
    sanskrit: 'Utthita Hasta Padangusthasana',
    english: 'Extended Hand-to-Big-Toe Pose',
    sequence: 'Standing sequence — left and right sides',
    description:
      "Standing on one leg, lift the other leg straight up in front of you, gripping the big toe with the first two fingers and thumb. The standing leg is fully extended, weight balanced through all four corners of the foot. Spine long and upright. The lifted leg starts straight forward, then opens out to the side, then returns — three phases of one pose.",
    intent:
      "Build single-leg standing balance. Strong active hamstring stretch on the lifted leg. Hip flexor and quadriceps strength on the lifted leg. Endurance work for the standing-leg gluteus medius. The pose where you discover what 'pelvic stability' actually means.",
    cues: [
      "Standing leg: kneecap engaged and lifted, four corners of the foot active, the entire leg integrated up into the hip.",
      "Standing-leg hip stays level — does not 'hike' upward as the other leg lifts. This is where gluteus medius does most of its work.",
      "Lifted leg: actively extended, quadriceps engaged. Don't just hang on the toe.",
      "Pull the lifted thigh toward the chest using the hip flexors and abdominals.",
      "Spine stays long and upright — the trunk does not fold forward to meet the leg.",
      "When the leg opens to the side, pull the standing-leg hip in the OPPOSITE direction to keep the pelvis level.",
      "Use a strap around the foot if you can't easily reach the toe with a long spine.",
    ],
    watchFor: [
      "Standing-leg hip 'hiking' upward as the other leg lifts — the gluteus medius is failing.",
      "Trunk folding forward to meet the leg.",
      "Lifted leg dangling — must be active.",
      "Loss of balance — pick a fixed gaze point. The eyes are part of the pose.",
      "Locking the standing knee.",
    ],
    states: [
      // STANDING LEG — heavy stabilization
      { muscle: 'gluteus_medius_muscle', state: 'concentric', note: 'PRIMARY WORK of the pose. Standing-leg glute medius keeps the pelvis level. Burns within seconds.' },
      { muscle: 'gluteus_minimus_muscle', state: 'concentric', note: 'Works alongside glute medius for hip stabilization in single-leg stance.' },
      { muscle: 'gluteus_maximus_muscle', state: 'isometric', note: 'Standing leg: holds the hip extended.' },
      // Standing-leg quads
      { muscle: 'vastus_lateralis_muscle', state: 'concentric', note: 'Standing leg: vasti hold the knee extended against the load.' },
      { muscle: 'vastus_medialis_muscle', state: 'concentric' },
      { muscle: 'vastus_intermedius_muscle', state: 'concentric' },
      { muscle: 'rectus_femoris_muscle', state: 'concentric' },
      // Standing-leg adductors
      { muscle: 'adductor_magnus', state: 'isometric', note: 'Standing leg: adductors stabilize the leg medially.' },
      // Standing-leg calf — fine balance
      { muscle: 'soleus_muscle', state: 'isometric', note: 'Constant micro-adjustments for balance.' },
      { muscle: 'tibialis_anterior_muscle', state: 'isometric' },
      { muscle: 'tibialis_posterior_muscle', state: 'isometric' },
      { muscle: 'fibularis_longus_muscle', state: 'isometric' },
      { muscle: 'fibularis_brevis_muscle', state: 'isometric' },
      // LIFTED LEG — hamstring stretch + active extension
      { muscle: 'long_head_of_biceps_femoris', state: 'loaded-passive', note: 'Lifted leg: hamstrings stretched in deep hip flexion + knee extension.' },
      { muscle: 'short_head_of_biceps_femoris', state: 'loaded-passive' },
      { muscle: 'semitendinosus_muscle', state: 'loaded-passive' },
      { muscle: 'semimembranosus_muscle', state: 'loaded-passive' },
      // Lifted-leg quads — actively holding the knee extended
      { muscle: 'vastus_lateralis_muscle', state: 'concentric', note: 'Lifted leg: vasti hold the knee fully extended — reciprocally inhibits the hamstring.' },
      { muscle: 'vastus_medialis_muscle', state: 'concentric' },
      { muscle: 'rectus_femoris_muscle', state: 'concentric', note: 'Lifted leg: rectus femoris BOTH flexes the hip AND extends the knee — both happen.' },
      // Lifted-leg HIP FLEXORS — heavy work
      { muscle: 'psoas_major', state: 'concentric', note: 'PRIMARY: Lifted-leg psoas pulls the thigh up toward the chest. Strong concentric work.' },
      { muscle: 'iliacus_muscle', state: 'concentric' },
      // Lifted-leg calf
      { muscle: 'medial_head_of_gastrocnemius', state: 'loaded-passive', note: 'Lifted-leg gastroc stretches with the knee straight and the foot flexed back toward the body.' },
      { muscle: 'lateral_head_of_gastrocnemius', state: 'loaded-passive' },
      { muscle: 'tibialis_anterior_muscle', state: 'concentric', note: 'Lifted leg: dorsiflexes the foot (pulls toes back toward shin).' },
      // CORE — major stabilization
      { muscle: 'transversus_abdominis_muscle', state: 'concentric', note: 'TVA fires to keep the lumbar from collapsing as the leg lifts.' },
      { muscle: 'rectus_abdominis_muscle', state: 'concentric', note: 'Works with the hip flexors to lift the leg toward the chest.' },
      { muscle: 'external_abdominal_oblique_muscle', state: 'isometric' },
      { muscle: 'internal_abdominal_oblique_muscle', state: 'isometric' },
      // BACK extensors holding upright
      { muscle: 'longissimus_thoracis_muscle', state: 'isometric', note: 'Holds the spine upright against the forward pull of the lifted leg.' },
      { muscle: 'iliocostalis_thoracis_muscle', state: 'isometric' },
      { muscle: 'multifidus_lumborum_muscle', state: 'isometric' },
      { muscle: 'quadratus_lumborum_muscle', state: 'isometric' },
      // ARM doing the toe-grip
      { muscle: 'long_head_of_biceps_brachii', state: 'concentric', note: 'Biceps actively pull on the toe to draw the leg in toward the body.' },
      { muscle: 'short_head_of_biceps_brachii', state: 'concentric' },
      { muscle: 'brachialis_muscle', state: 'concentric' },
      // SHOULDERS quiet
      { muscle: 'descending_part_of_trapezius_muscle', state: 'antagonist' },
      { muscle: 'ascending_part_of_trapezius_muscle', state: 'isometric' },
    ],
  },
);

export function getPose(id: string): Pose | undefined {
  return POSES.find((p) => p.id === id);
}

/**
 * Resolve a muscle slug to a state for a specific body part id.
 * Returns null if this muscle isn't in the pose (= 'unloaded').
 */
export function getStateForPart(pose: Pose | null, part: BodyPart): MuscleState | null {
  if (!pose || part.kind !== 'muscle') return null;
  // The part id is `muscle_{slug}_{l|r}`. Pull the slug.
  const m = part.id.match(/^muscle_(.+?)_([lr])$/);
  if (!m) return null;
  const slug = m[1];
  const side = m[2] as 'l' | 'r';
  // Find the matching state entry. Prefer side-specific over 'both'.
  let match: MuscleStateEntry | undefined;
  for (const entry of pose.states) {
    if (entry.muscle !== slug) continue;
    const entrySide = entry.side || 'both';
    if (entrySide === side) {
      return entry.state;
    }
    if (entrySide === 'both' && !match) {
      match = entry;
    }
  }
  return match ? match.state : null;
}
