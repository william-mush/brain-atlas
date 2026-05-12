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
