// Body atlas — muscles, bones, and (eventually) yoga-pose state.
//
// 3D meshes come from Z-Anatomy (Gauthier Kervyn / Lluís Vinent), itself
// derived from BodyParts3D. CC BY-SA 4.0. The combined model lives at
// /models/body.glb with one named node per muscle and per bone.
//
// Mesh ids follow the convention used by the build pipeline:
//   muscle_{slug}_{l|r}   for muscles (left and right sides)
//   bone_{slug}           for bones (some are unsided, some have _l/_r)

import manifestRaw from '@/public/models/body_manifest.json';

export type BodyKind = 'muscle' | 'bone';
export type Side = 'l' | 'r' | null;
export type BodyRegion =
  | 'head-neck'
  | 'shoulder-girdle'
  | 'arm'
  | 'chest'
  | 'back'
  | 'core'
  | 'pelvis-hip'
  | 'thigh'
  | 'lower-leg-foot'
  | 'skeleton';

export interface BodyPart {
  id: string;
  /** Display name. Often left/right is implicit in the mesh, so this is the base name. */
  name: string;
  shortName?: string;
  kind: BodyKind;
  side: Side;
  /** Which anatomical region — used to group in the UI. */
  region: BodyRegion;
  /** Plain-English summary — what this is, in one or two sentences. */
  summary?: string;
  /** Anatomical origin (proximal attachment) — typically on a bone. */
  origin?: string;
  /** Anatomical insertion (distal attachment). */
  insertion?: string;
  /** Joint(s) the muscle crosses and acts on. */
  joints?: string[];
  /** The primary actions the muscle produces when it contracts. */
  actions?: string[];
  /** Muscles that oppose its action. */
  antagonists?: string[];
  /** Notes specifically about yoga practice — how this muscle shows up
   *  in poses, what stretches it, what strengthens it. */
  yoga?: string;
  /** Asana ids in which this muscle plays a leading role (see lib/poses.ts). */
  prominentInPoses?: string[];
}

export interface BodyAttachment {
  origin?: [number, number, number];
  insertion?: [number, number, number];
}

interface ManifestMeshEntry {
  id: string;
  kind: 'muscle' | 'bone';
  name: string;
  side: 'l' | 'r' | null;
  verts: number;
}

interface ManifestRaw {
  meshes: ManifestMeshEntry[];
  attachments: Record<string, BodyAttachment>;
}

const manifest = manifestRaw as unknown as ManifestRaw;
export const ATTACHMENTS: Record<string, BodyAttachment> = manifest.attachments;

// ---------- Curated muscle data ----------
//
// For each muscle that appears in /models/body.glb, we have an entry here.
// Yoga-specific notes are drafted by the AI; the human teacher reviews and
// corrects them over time. Source for the anatomy: standard kinesiology
// references; for the yoga relevance: drafted by Claude with deference to
// the Ashtanga Vinyasa tradition.

const REGION_OF_MUSCLE: Record<string, BodyRegion> = {
  rectus_abdominis_muscle: 'core',
  external_abdominal_oblique_muscle: 'core',
  internal_abdominal_oblique_muscle: 'core',
  transversus_abdominis_muscle: 'core',
  quadratus_lumborum_muscle: 'core',
  multifidus_thoracis_muscle: 'core',
  multifidus_lumborum_muscle: 'core',
  diaphragm: 'core',
  psoas_major: 'pelvis-hip',
  iliacus_muscle: 'pelvis-hip',
  longissimus_thoracis_muscle: 'back',
  longissimus_lumborum_muscle: 'back',
  spinalis_thoracis_muscle: 'back',
  iliocostalis_lumborum_muscle: 'back',
  iliocostalis_thoracis_muscle: 'back',
  ascending_part_of_trapezius_muscle: 'back',
  descending_part_of_trapezius_muscle: 'back',
  transverse_part_of_trapezius_muscle: 'back',
  latissimus_dorsi_muscle: 'back',
  rhomboid_major_muscle: 'back',
  rhomboid_minor_muscle: 'back',
  levator_scapulae: 'shoulder-girdle',
  clavicular_head_of_pectoralis_major_muscle: 'chest',
  sternocostal_head_of_pectoralis_major_muscle: 'chest',
  abdominal_part_of_pectoralis_major_muscle: 'chest',
  pectoralis_minor_muscle: 'chest',
  serratus_anterior_muscle: 'chest',
  acromial_part_of_deltoid_muscle: 'shoulder-girdle',
  clavicular_part_of_deltoid_muscle: 'shoulder-girdle',
  scapular_spinal_part_of_deltoid_muscle: 'shoulder-girdle',
  supraspinatus_muscle: 'shoulder-girdle',
  infraspinatus_muscle: 'shoulder-girdle',
  teres_minor_muscle: 'shoulder-girdle',
  teres_major_muscle: 'shoulder-girdle',
  subscapularis_muscle: 'shoulder-girdle',
  long_head_of_biceps_brachii: 'arm',
  short_head_of_biceps_brachii: 'arm',
  brachialis_muscle: 'arm',
  brachioradialis_muscle: 'arm',
  long_head_of_triceps_brachii: 'arm',
  lateral_head_of_triceps_brachii: 'arm',
  medial_head_of_triceps_brachii: 'arm',
  anconeus_muscle: 'arm',
  gluteus_maximus_muscle: 'pelvis-hip',
  gluteus_medius_muscle: 'pelvis-hip',
  gluteus_minimus_muscle: 'pelvis-hip',
  piriformis_muscle: 'pelvis-hip',
  sartorius_muscle: 'thigh',
  rectus_femoris_muscle: 'thigh',
  vastus_lateralis_muscle: 'thigh',
  vastus_medialis_muscle: 'thigh',
  vastus_intermedius_muscle: 'thigh',
  long_head_of_biceps_femoris: 'thigh',
  short_head_of_biceps_femoris: 'thigh',
  semitendinosus_muscle: 'thigh',
  semimembranosus_muscle: 'thigh',
  adductor_longus: 'thigh',
  adductor_brevis: 'thigh',
  adductor_magnus: 'thigh',
  gracilis_muscle: 'thigh',
  pectineus_muscle: 'thigh',
  lateral_head_of_gastrocnemius: 'lower-leg-foot',
  medial_head_of_gastrocnemius: 'lower-leg-foot',
  soleus_muscle: 'lower-leg-foot',
  tibialis_anterior_muscle: 'lower-leg-foot',
  tibialis_posterior_muscle: 'lower-leg-foot',
  fibularis_longus_muscle: 'lower-leg-foot',
  fibularis_brevis_muscle: 'lower-leg-foot',
  sternocleidomastoid_muscle: 'head-neck',
  scalenus_anterior_muscle: 'head-neck',
  scalenus_medius_muscle: 'head-neck',
  scalenus_posterior_muscle: 'head-neck',
};

interface MuscleInfo {
  name: string;
  shortName?: string;
  summary: string;
  origin: string;
  insertion: string;
  joints: string[];
  actions: string[];
  antagonists: string[];
  yoga: string;
}

/** Curated anatomical + yoga notes for the major muscles. Keyed by slug. */
const MUSCLE_INFO: Record<string, MuscleInfo> = {
  // ===== CORE =====
  rectus_abdominis_muscle: {
    name: 'Rectus Abdominis',
    summary: "The 'six-pack' muscle. A long strap running down the front of the abdomen from the lower ribs to the pubic bone. Powerful trunk flexor.",
    origin: 'Pubic crest and pubic symphysis.',
    insertion: 'Xiphoid process of the sternum and costal cartilages of the 5th, 6th, and 7th ribs.',
    joints: ['Lumbar spine'],
    actions: ['Flexes the trunk (curls the ribs toward the pubis)', 'Compresses abdominal contents', 'Stabilizes the pelvis against the pull of hip flexors'],
    antagonists: ['Erector spinae', 'Multifidus'],
    yoga: "In Boat (Navasana) and the deep-core lifts of jump-throughs, this muscle does the obvious flexion. But its more important yoga job is *eccentric* — controlling the descent of the trunk in Chaturanga lowering, and resisting hyperextension in backbends like Urdhva Dhanurasana. In Ashtanga, gripping it shortens the front body and collapses the breath — most teachers ask for engagement of the deeper transversus abdominis and pelvic floor first.",
  },
  external_abdominal_oblique_muscle: {
    name: 'External Oblique',
    summary: 'The outermost layer of the side abdominal wall. Fibers run diagonally downward and forward, like hands in front pockets.',
    origin: 'Lower 8 ribs (5th–12th), interdigitating with serratus anterior and latissimus dorsi.',
    insertion: 'Linea alba, pubic tubercle, and anterior half of the iliac crest.',
    joints: ['Lumbar spine', 'Thoracolumbar junction'],
    actions: ['Trunk flexion (bilateral)', 'Trunk rotation to the *opposite* side (unilateral)', 'Trunk lateral flexion to the same side', 'Increases intra-abdominal pressure'],
    antagonists: ['Internal oblique on the opposite side', 'Erector spinae'],
    yoga: 'The primary rotator in twists. In Marichyasana C the right external oblique engages strongly to twist the trunk to the left. In side-bends (Parighasana), the external oblique on the side you bend toward contracts; on the lengthening side it stretches. Strong, well-organized external obliques protect the lumbar spine from the shearing forces of deep twists.',
  },
  internal_abdominal_oblique_muscle: {
    name: 'Internal Oblique',
    summary: 'The middle layer of the side abdominal wall. Fibers run perpendicular to the external oblique, like hands in back pockets.',
    origin: 'Inguinal ligament, iliac crest, and thoracolumbar fascia.',
    insertion: 'Lower 3–4 ribs and linea alba.',
    joints: ['Lumbar spine'],
    actions: ['Trunk flexion (bilateral)', 'Trunk rotation to the *same* side (works with the opposite-side external oblique)', 'Lateral flexion to the same side'],
    antagonists: ['External oblique on the same side', 'Erector spinae'],
    yoga: 'In any twist the internal oblique on one side and the external oblique on the other side form a diagonal contraction couple. Strengthens through Navasana, side plank (Vasisthasana), and twists. Together with the transversus abdominis it generates the deep "uddiyana" tone many traditions value.',
  },
  transversus_abdominis_muscle: {
    name: 'Transversus Abdominis',
    shortName: 'TVA',
    summary: 'The deepest layer of the abdominal wall. Fibers run horizontally, wrapping the trunk like a corset. Primarily a stabilizer, not a mover.',
    origin: 'Inguinal ligament, iliac crest, thoracolumbar fascia, costal cartilages of lower 6 ribs.',
    insertion: 'Linea alba and pubic crest.',
    joints: ['Lumbar spine'],
    actions: ['Compresses abdominal contents', 'Stabilizes the lumbar spine and pelvis', 'Generates intra-abdominal pressure with the diaphragm and pelvic floor'],
    antagonists: ['Diaphragm (in breathing — they expand against each other)'],
    yoga: 'This is *the* muscle of uddiyana bandha — the abdominal lift. A subtle, deep, continuous tone in the TVA stabilizes the pelvis through every transition. In a strong jump-back, the TVA fires first; without it, the lumbar spine takes the load. The TVA also coordinates with the pelvic floor (mula bandha) and the diaphragm in the bandha system as a single pressure-generating unit.',
  },
  quadratus_lumborum_muscle: {
    name: 'Quadratus Lumborum',
    shortName: 'QL',
    summary: 'A deep, square-shaped muscle of the lower back. Connects the pelvis to the lower ribs and lumbar spine.',
    origin: 'Posterior iliac crest and iliolumbar ligament.',
    insertion: '12th rib and transverse processes of L1–L4.',
    joints: ['Lumbar spine'],
    actions: ['Lateral flexion of the trunk to the same side', 'Stabilization of the 12th rib during forced expiration', 'Hip-hike (elevates the pelvis on one side)'],
    antagonists: ['Quadratus lumborum on the opposite side'],
    yoga: 'The QL is a frequent source of "tight low back" complaints. Chronic standing on one leg or sitting with weight shifted to one hip tightens it asymmetrically. Side bends like Parighasana stretch one QL and contract the other. In standing poses, the QL on the front-leg side often grips to "hike" the hip — releasing it allows the pelvis to level.',
  },
  diaphragm: {
    name: 'Diaphragm',
    summary: 'The dome-shaped muscle of breathing. Separates the chest cavity from the abdomen.',
    origin: 'Lower ribs, xiphoid process, lumbar vertebrae (via the crura).',
    insertion: 'Central tendon.',
    joints: ['(none — drives the rib cage and viscera)'],
    actions: ['Contracts and flattens during inhalation, expanding the chest and pushing the abdominal contents down', 'Generates intra-abdominal pressure with the TVA and pelvic floor'],
    antagonists: ['Abdominal wall (during exhalation)'],
    yoga: 'The diaphragm is the engine of pranayama. Three-part breath (dirgha) emphasizes the diaphragm leading the inhale; ujjayi creates a slight resistance at the glottis that lets the diaphragm work more strongly. The "bandha" lift of uddiyana on a complete exhalation lifts the diaphragm vacuum-style into the chest. Chronically gripped abdominals tether the diaphragm and shallow the breath — often the first thing to release in practice.',
  },
  multifidus_thoracis_muscle: {
    name: 'Multifidus (Thoracic)',
    summary: 'Deep small muscles spanning 2–4 vertebrae each, on either side of the spinous processes. Spine stabilizers.',
    origin: 'Transverse processes of vertebrae.',
    insertion: 'Spinous processes 2–4 vertebrae above.',
    joints: ['Thoracic spine (segment by segment)'],
    actions: ['Local spinal stabilization', 'Slight extension and contralateral rotation'],
    antagonists: [],
    yoga: 'Multifidus is one of the segmental spine stabilizers; weakness here is a major factor in chronic low back pain. Slow practice, particularly Surya Namaskar A done with attention to the spine articulating bone by bone, recruits multifidus more than fast practice does. Backbends like Ustrasana require multifidus to organize the lumbar extension safely.',
  },
  multifidus_lumborum_muscle: {
    name: 'Multifidus (Lumbar)',
    summary: 'The lumbar segment of multifidus. The thickest of the multifidi and a major lumbar stabilizer.',
    origin: 'Mammillary processes of lumbar vertebrae and posterior sacrum.',
    insertion: 'Spinous processes 2–4 vertebrae above.',
    joints: ['Lumbar spine'],
    actions: ['Lumbar stabilization', 'Slight lumbar extension'],
    antagonists: [],
    yoga: 'Loss of lumbar multifidus tone is one of the clearest markers of chronic low back pain. Held lumbar-stabilizing poses — plank, side plank, locust (Salabhasana) — rebuild it. In Ashtanga, the lumbar multifidus engages on every inhale of standing poses to keep the spine long.',
  },

  // ===== HIP FLEXORS / PSOAS =====
  psoas_major: {
    name: 'Psoas Major',
    summary: 'The deepest hip flexor. Originates inside the abdomen on the lumbar spine, travels through the pelvis, and inserts on the inner femur. Crosses both the lumbar spine and the hip.',
    origin: 'Bodies and transverse processes of T12 and L1–L5 vertebrae.',
    insertion: 'Lesser trochanter of the femur.',
    joints: ['Hip', 'Lumbar spine'],
    actions: ['Flexes the hip', 'Externally rotates the hip (controversial — depends on position)', 'Acts on the lumbar spine — can flex or extend depending on pelvic position'],
    antagonists: ['Gluteus maximus', 'Hamstrings'],
    yoga: 'The psoas is the muscle most discussed in modern yoga anatomy — and the one most often *over-engaged*. In poses where the front leg lifts (Navasana, Utthita Hasta Padangusthasana), the psoas powers the lift. In long-held back bends, a tight psoas can pull the lumbar spine into excess lordosis. Stretching the psoas requires hip extension *with* a neutral lumbar — low lunge (Anjaneyasana) is the canonical psoas stretch, done well it lengthens psoas without compressing the back.',
  },
  iliacus_muscle: {
    name: 'Iliacus',
    summary: 'A fan-shaped muscle filling the inside of the pelvis. Joins with the psoas to form the iliopsoas.',
    origin: 'Inner surface of the ilium (iliac fossa).',
    insertion: 'Joins with psoas tendon at the lesser trochanter of the femur.',
    joints: ['Hip'],
    actions: ['Flexes the hip', 'Anteriorly tilts the pelvis'],
    antagonists: ['Gluteus maximus', 'Hamstrings'],
    yoga: "The iliacus is the iliopsoas' second half — when people say 'psoas,' they often mean the whole iliopsoas. Iliacus contributes to anterior pelvic tilt, which is why a chronically flexed hip (a desk worker's hip) often produces an overly arched lower back. Lengthens in any deep lunge, particularly when the pelvis is reaching forward and down, not lifting up.",
  },

  // ===== GLUTES =====
  gluteus_maximus_muscle: {
    name: 'Gluteus Maximus',
    summary: 'The largest muscle in the body. The major hip extensor and external rotator.',
    origin: 'Posterior ilium, sacrum, coccyx, sacrotuberous ligament.',
    insertion: 'Iliotibial tract (upper fibers) and gluteal tuberosity of the femur (lower fibers).',
    joints: ['Hip'],
    actions: ['Extends the hip (drives the thigh back)', 'Externally rotates the hip', 'Posteriorly tilts the pelvis', 'Stabilizes the pelvis in standing'],
    antagonists: ['Iliopsoas', 'Rectus femoris'],
    yoga: 'The most underused muscle in modern bodies. In Locust (Salabhasana), Bridge (Setu Bandha), and Wheel (Urdhva Dhanurasana), gluteus maximus is the engine. In Warrior I, the back-leg gluteus maximus extends the hip and posteriorly tilts that side of the pelvis — releasing the deep hip flexor on the same side. Many backbend issues trace to glutes not firing; the lumbar spine compensates instead.',
  },
  gluteus_medius_muscle: {
    name: 'Gluteus Medius',
    summary: 'Lies underneath the gluteus maximus on the outer hip. Critical for lateral pelvic stability.',
    origin: 'Outer surface of the ilium, between the anterior and posterior gluteal lines.',
    insertion: 'Greater trochanter of the femur.',
    joints: ['Hip'],
    actions: ['Abducts the hip', 'Stabilizes the pelvis in single-leg stance — prevents the opposite hip from dropping', 'Anterior fibers internally rotate; posterior fibers externally rotate'],
    antagonists: ['Adductor longus, brevis, magnus'],
    yoga: 'Gluteus medius is what holds the pelvis level in Tree (Vrksasana) and Standing-Hand-to-Foot (Utthita Hasta Padangusthasana). When weak — the classic Trendelenburg sign — the standing-leg hip lifts and the opposite hip drops. Side-plank (Vasisthasana) is one of the strongest gluteus medius strengtheners in the practice.',
  },
  gluteus_minimus_muscle: {
    name: 'Gluteus Minimus',
    summary: 'The smallest and deepest of the three glutes. A fan-shaped muscle deep to gluteus medius.',
    origin: 'Outer surface of the ilium, between the anterior and inferior gluteal lines.',
    insertion: 'Anterior facet of the greater trochanter.',
    joints: ['Hip'],
    actions: ['Abducts the hip', 'Internally rotates the hip', 'Stabilizes the pelvis in single-leg stance'],
    antagonists: ['Adductors', 'External rotators'],
    yoga: 'Works alongside gluteus medius for single-leg balance. Sometimes referred to clinically as the most-often-asymmetrically-weak muscle in adults.',
  },
  piriformis_muscle: {
    name: 'Piriformis',
    summary: "A small, pear-shaped muscle deep in the buttock. The most famous of the deep external rotators of the hip. Sits on top of the sciatic nerve in most people.",
    origin: 'Anterior surface of the sacrum.',
    insertion: 'Greater trochanter of the femur.',
    joints: ['Hip'],
    actions: ['Externally rotates the hip when the hip is extended', 'Abducts the hip when flexed (its role flips)'],
    antagonists: ['Internal hip rotators (anterior gluteus medius/minimus, adductors)'],
    yoga: 'Pigeon (Eka Pada Rajakapotasana) is the canonical piriformis stretch. The front-leg piriformis lengthens as the hip is externally rotated and the knee comes forward. Chronic piriformis tightness — common in cyclists and runners — can impinge the sciatic nerve and produce buttock pain that radiates down the leg ("piriformis syndrome"). Releasing piriformis often unlocks deep folds and seated poses.',
  },

  // ===== QUADS =====
  rectus_femoris_muscle: {
    name: 'Rectus Femoris',
    summary: "The one quadriceps muscle that crosses both the hip and the knee. The straight upper portion of the quad group.",
    origin: 'Anterior inferior iliac spine (AIIS).',
    insertion: 'Patella, then via patellar tendon to the tibial tuberosity.',
    joints: ['Hip', 'Knee'],
    actions: ['Flexes the hip', 'Extends the knee'],
    antagonists: ['Hamstrings', 'Gluteus maximus'],
    yoga: 'Because it crosses both hip and knee, rectus femoris is fully lengthened only when the hip is extended *and* the knee is flexed simultaneously — exactly the position of a deep lunge with the back knee bent, or the back-leg position in Eka Pada Rajakapotasana with the foot drawn toward the buttock. Tight rectus femoris is a major cause of anterior knee pain and an obstacle to lifting in jump-throughs.',
  },
  vastus_lateralis_muscle: {
    name: 'Vastus Lateralis',
    summary: 'The outer quad. The largest of the four quadriceps muscles. Only acts on the knee, not the hip.',
    origin: 'Greater trochanter, intertrochanteric line, and linea aspera of the femur.',
    insertion: 'Patella, then patellar tendon to tibial tuberosity.',
    joints: ['Knee'],
    actions: ['Extends the knee'],
    antagonists: ['Hamstrings'],
    yoga: 'Powers knee extension in any squat-rising motion, including standing up from Malasana. Overuse contributes to lateral knee pain and IT-band issues in runners; in yoga it sometimes pulls the patella laterally if the medial side (VMO) is comparatively weak.',
  },
  vastus_medialis_muscle: {
    name: 'Vastus Medialis',
    shortName: 'VMO',
    summary: 'The inner quad. The teardrop-shaped muscle above and inside the knee. Crucial for patellar tracking.',
    origin: 'Intertrochanteric line, spiral line, medial supracondylar ridge of femur.',
    insertion: 'Patella, then patellar tendon to tibial tuberosity.',
    joints: ['Knee'],
    actions: ['Extends the knee, especially the last 15°', 'Stabilizes the patella medially'],
    antagonists: ['Hamstrings'],
    yoga: 'Yoga at its best teaches students to engage the inner quad in standing poses — "lift the kneecap" cues the VMO. In Trikonasana, engaging the front-leg VMO protects the knee from hyperextension; in Warrior II, both VMOs hold the knees aligned with the toes.',
  },
  vastus_intermedius_muscle: {
    name: 'Vastus Intermedius',
    summary: 'The deepest quad muscle. Sits between vastus lateralis and vastus medialis under the rectus femoris.',
    origin: 'Anterior and lateral surfaces of the femur.',
    insertion: 'Patella, then patellar tendon to tibial tuberosity.',
    joints: ['Knee'],
    actions: ['Extends the knee'],
    antagonists: ['Hamstrings'],
    yoga: 'Functions alongside the other vasti. Generally not addressed separately in yoga teaching.',
  },

  // ===== HAMSTRINGS =====
  long_head_of_biceps_femoris: {
    name: 'Biceps Femoris (Long Head)',
    summary: 'The outer hamstring. Crosses both the hip and the knee. The long head originates on the sit bone; the short head originates on the femur.',
    origin: 'Ischial tuberosity (sit bone), shared with semitendinosus.',
    insertion: 'Head of the fibula.',
    joints: ['Hip', 'Knee'],
    actions: ['Extends the hip', 'Flexes the knee', 'Externally rotates the knee when flexed'],
    antagonists: ['Quadriceps', 'Iliopsoas'],
    yoga: "Powers the descent in Uttanasana and Paschimottanasana, where the long head of biceps femoris is lengthened across both joints. In standing poses with a straight front leg, this muscle is under maximum stretch. Yoga's classic hamstring complaint — that sharp sit-bone tension — is biceps femoris long head being pulled at its origin.",
  },
  short_head_of_biceps_femoris: {
    name: 'Biceps Femoris (Short Head)',
    summary: 'The deeper part of the outer hamstring. Unlike the long head, only crosses the knee.',
    origin: 'Linea aspera and lateral supracondylar line of femur.',
    insertion: 'Head of the fibula (with long head).',
    joints: ['Knee'],
    actions: ['Flexes the knee', 'Externally rotates the knee when flexed'],
    antagonists: ['Quadriceps'],
    yoga: 'Because it only crosses the knee, the short head of biceps femoris is fully stretched by any movement that combines knee extension with hip flexion — same as standing forward folds. Its lateral position means that internally rotating the femur slightly (a common alignment cue: "turn the inner thigh up") intensifies its stretch.',
  },
  semitendinosus_muscle: {
    name: 'Semitendinosus',
    summary: 'One of the two inner hamstrings. Long tendon that contributes to the pes anserinus on the medial knee.',
    origin: 'Ischial tuberosity.',
    insertion: 'Pes anserinus on medial proximal tibia.',
    joints: ['Hip', 'Knee'],
    actions: ['Extends the hip', 'Flexes the knee', 'Internally rotates the knee when flexed'],
    antagonists: ['Quadriceps', 'Iliopsoas'],
    yoga: 'The medial hamstrings (semi-tendinosus and semimembranosus) bring the lower leg slightly inward when contracted with the knee flexed. In forward folds with the hip externally rotated (Janu Sirsasana, Marichyasana), the medial hamstrings stretch more intensely than the biceps femoris.',
  },
  semimembranosus_muscle: {
    name: 'Semimembranosus',
    summary: 'The other inner hamstring. Sits deep to semitendinosus.',
    origin: 'Ischial tuberosity.',
    insertion: 'Medial condyle of the tibia.',
    joints: ['Hip', 'Knee'],
    actions: ['Extends the hip', 'Flexes the knee', 'Internally rotates the knee when flexed'],
    antagonists: ['Quadriceps', 'Iliopsoas'],
    yoga: 'Same functional group as semitendinosus. Together these two are the hamstrings most stretched in seated folds with knees together (Paschimottanasana) and least in straight-leg lateral stretches (Parsvottanasana).',
  },

  // ===== ADDUCTORS =====
  adductor_magnus: {
    name: 'Adductor Magnus',
    summary: 'The largest of the inner-thigh adductors. Functionally has two parts: the upper adducts, the lower acts like a hamstring (extends the hip).',
    origin: 'Inferior pubic ramus, ischial ramus, ischial tuberosity (the hamstring-like lower part).',
    insertion: 'Linea aspera and adductor tubercle of the femur.',
    joints: ['Hip'],
    actions: ['Adducts the thigh', 'The "hamstring" portion extends the hip'],
    antagonists: ['Gluteus medius', 'Gluteus minimus'],
    yoga: 'In wide-legged standing poses (Prasarita Padottanasana, Upavishta Konasana) the adductor magnus is the major muscle being stretched. The "hamstring portion" of magnus is one of the reasons forward folds with legs wide feel different from forward folds with legs together — different parts of the adductor are loaded.',
  },
  adductor_longus: {
    name: 'Adductor Longus',
    summary: 'One of the shorter inner-thigh adductors. Originates near the pubic bone.',
    origin: 'Anterior surface of the pubic body.',
    insertion: 'Middle third of the linea aspera of the femur.',
    joints: ['Hip'],
    actions: ['Adducts the thigh', 'Slight hip flexion'],
    antagonists: ['Gluteus medius'],
    yoga: 'Stretched in any wide-leg pose. Often overuses in cyclists; tightness contributes to "groin pulls" in suddenly-wide poses.',
  },
  adductor_brevis: {
    name: 'Adductor Brevis',
    summary: 'A small triangular adductor, deeper than adductor longus.',
    origin: 'Body and inferior ramus of the pubis.',
    insertion: 'Upper third of the linea aspera of the femur.',
    joints: ['Hip'],
    actions: ['Adducts the thigh', 'Slight hip flexion'],
    antagonists: ['Gluteus medius'],
    yoga: 'Functions with the longer adductors. Generally not addressed separately in teaching.',
  },
  gracilis_muscle: {
    name: 'Gracilis',
    summary: "The most superficial inner-thigh muscle. Long, thin, strap-like — runs from pubic bone to the inside of the knee. The only adductor that crosses the knee.",
    origin: 'Inferior pubic ramus.',
    insertion: 'Pes anserinus on the medial proximal tibia.',
    joints: ['Hip', 'Knee'],
    actions: ['Adducts the thigh', 'Flexes the knee', 'Internally rotates the leg when the knee is flexed'],
    antagonists: ['Gluteus medius', 'Quadriceps'],
    yoga: 'Because it crosses both joints, gracilis is fully stretched in poses that abduct the hip *and* extend the knee — exactly Upavishta Konasana or wide-leg seated folds. Inner-leg sensation in those poses often comes from gracilis first.',
  },
  pectineus_muscle: {
    name: 'Pectineus',
    summary: 'A short, flat adductor at the top of the inner thigh. Often considered a hip flexor too.',
    origin: 'Superior pubic ramus.',
    insertion: 'Pectineal line of femur, just below the lesser trochanter.',
    joints: ['Hip'],
    actions: ['Adducts the hip', 'Flexes the hip'],
    antagonists: ['Gluteus medius', 'Gluteus maximus'],
    yoga: 'A small but frequently tight muscle at the front of the inner-thigh-and-groin meeting point. Tightness contributes to limited range in Baddha Konasana (bound-angle pose).',
  },

  // ===== CALF =====
  medial_head_of_gastrocnemius: {
    name: 'Gastrocnemius (Medial Head)',
    summary: 'The inner part of the calf muscle. The large, two-headed muscle of the upper calf. Crosses both the knee and the ankle.',
    origin: 'Medial condyle of the femur.',
    insertion: 'Calcaneus via the Achilles tendon (shared with lateral head and soleus).',
    joints: ['Knee', 'Ankle'],
    actions: ['Plantarflexes the ankle (points the foot)', 'Flexes the knee'],
    antagonists: ['Tibialis anterior', 'Quadriceps (at the knee)'],
    yoga: "Adho Mukha Svanasana — Downward Dog — is the classic gastrocnemius stretch, when the heels reach toward the floor with the knees straight. Because gastrocnemius crosses the knee, *bending the knee disengages it*: try Down Dog with the knees bent and the calves feel slack; straighten and the stretch returns. That's gastrocnemius coming back online.",
  },
  lateral_head_of_gastrocnemius: {
    name: 'Gastrocnemius (Lateral Head)',
    summary: 'The outer part of the calf muscle.',
    origin: 'Lateral condyle of the femur.',
    insertion: 'Calcaneus via the Achilles tendon.',
    joints: ['Knee', 'Ankle'],
    actions: ['Plantarflexes the ankle', 'Flexes the knee'],
    antagonists: ['Tibialis anterior'],
    yoga: 'Same functional role as the medial head; the lateral head is generally smaller.',
  },
  soleus_muscle: {
    name: 'Soleus',
    summary: 'The deeper calf muscle, sitting underneath gastrocnemius. Only crosses the ankle, not the knee.',
    origin: 'Posterior surfaces of the tibia and fibula.',
    insertion: 'Calcaneus via the Achilles tendon.',
    joints: ['Ankle'],
    actions: ['Plantarflexes the ankle'],
    antagonists: ['Tibialis anterior'],
    yoga: 'Because it only crosses the ankle, soleus is stretched even when the knee is bent — that "deeper calf" feeling in low-lunge with the back heel down. In Down Dog with a bent knee, gastrocnemius unloads but soleus continues to lengthen.',
  },

  // ===== UPPER BACK / SHOULDER GIRDLE =====
  descending_part_of_trapezius_muscle: {
    name: 'Upper Trapezius',
    summary: 'The upper, descending fibers of the trapezius. Elevates the shoulder and tilts the head.',
    origin: 'External occipital protuberance, ligamentum nuchae, spinous processes of C1–C7.',
    insertion: 'Lateral third of the clavicle and acromion.',
    joints: ['Scapulothoracic', 'Cervical spine'],
    actions: ['Elevates the scapula (shrugs the shoulder)', 'Upwardly rotates the scapula', 'Extends and rotates the neck'],
    antagonists: ['Lower trapezius', 'Latissimus dorsi'],
    yoga: 'Chronically over-engaged in most students from sitting with shoulders pulled up. The cue "draw the shoulders away from the ears" is a downregulation of upper trap. In overhead reaching (Urdhva Hastasana), upper trap *should* engage to upwardly rotate the scapula — but only as part of a balanced contraction with lower trap and serratus anterior.',
  },
  transverse_part_of_trapezius_muscle: {
    name: 'Middle Trapezius',
    summary: 'The middle, horizontal fibers of trapezius. Retracts the scapula.',
    origin: 'Spinous processes of C7–T3.',
    insertion: 'Medial border of the acromion and superior lip of the spine of the scapula.',
    joints: ['Scapulothoracic'],
    actions: ['Retracts the scapula (squeezes shoulder blades together)'],
    antagonists: ['Serratus anterior'],
    yoga: 'Engages strongly in chest-opening poses — backbends, Bow (Dhanurasana), Locust (Salabhasana). The opposite action — protracting the scapula — is what plank pose calls for; many students under-protract and over-retract in plank, which collapses the chest forward.',
  },
  ascending_part_of_trapezius_muscle: {
    name: 'Lower Trapezius',
    summary: 'The lower, ascending fibers. Depresses the scapula and contributes to upward rotation.',
    origin: 'Spinous processes of T4–T12.',
    insertion: 'Tubercle on the spine of the scapula.',
    joints: ['Scapulothoracic'],
    actions: ['Depresses the scapula', 'Contributes to upward rotation of the scapula (with serratus anterior)'],
    antagonists: ['Upper trapezius', 'Levator scapulae'],
    yoga: 'Chronically weak in modern bodies. Strengthening lower trap is essential for healthy overhead reaching — in Urdhva Hastasana or handstand preparation, lower trap pulls the scapula down the back, lengthening the neck and supporting the lift. Yoga instruction to "draw the shoulder blades down the back" is a lower-trap engagement cue.',
  },
  latissimus_dorsi_muscle: {
    name: 'Latissimus Dorsi',
    shortName: 'Lats',
    summary: 'The big "wing" muscle of the back. Connects the upper arm to the lower spine and pelvis.',
    origin: 'Spinous processes of T7–L5, sacrum, posterior iliac crest, lower 3–4 ribs.',
    insertion: 'Floor of the bicipital groove of the humerus.',
    joints: ['Glenohumeral (shoulder)'],
    actions: ['Extends the shoulder', 'Adducts the shoulder', 'Internally rotates the shoulder', 'Through its lumbar attachments, can extend or laterally flex the spine'],
    antagonists: ['Deltoid (especially anterior)', 'Pectoralis major (in some actions)'],
    yoga: 'In Downward Dog, the lats are lengthening — arms overhead, shoulders flexed — while simultaneously engaging to push the floor away. In Chaturanga, lats stabilize the shoulders against the press. Tight lats are one of the most common limiters of overhead reaching; in a chronic-text-neck body, lengthening lats often unlocks more cervical and shoulder freedom than working the neck directly.',
  },
  rhomboid_major_muscle: {
    name: 'Rhomboid Major',
    summary: 'A flat muscle between the spine and the scapula. Retracts and downwardly rotates the scapula.',
    origin: 'Spinous processes of T2–T5.',
    insertion: 'Medial border of the scapula below the spine of the scapula.',
    joints: ['Scapulothoracic'],
    actions: ['Retracts the scapula', 'Downwardly rotates the scapula'],
    antagonists: ['Serratus anterior'],
    yoga: 'Squeezing the shoulder blades together — what you feel in Cow Pose or any backbend — is rhomboid activation. In plank, rhomboids should release to allow serratus anterior to fully protract the scapula and "press the earth away."',
  },
  rhomboid_minor_muscle: {
    name: 'Rhomboid Minor',
    summary: 'A smaller, parallel muscle just above rhomboid major. Same functional role.',
    origin: 'Spinous processes of C7–T1.',
    insertion: 'Medial border of the scapula at the level of the spine of the scapula.',
    joints: ['Scapulothoracic'],
    actions: ['Retracts the scapula', 'Downwardly rotates the scapula'],
    antagonists: ['Serratus anterior'],
    yoga: 'Functions with rhomboid major.',
  },
  levator_scapulae: {
    name: 'Levator Scapulae',
    summary: 'A long, strap-like neck muscle. Elevates the scapula and contributes to neck movement.',
    origin: 'Transverse processes of C1–C4.',
    insertion: 'Superior medial border of the scapula.',
    joints: ['Scapulothoracic', 'Cervical spine'],
    actions: ['Elevates the scapula', 'Downwardly rotates the scapula', 'Laterally flexes the cervical spine'],
    antagonists: ['Lower trapezius', 'Serratus anterior'],
    yoga: 'Often chronically tight, especially in students with rounded-shoulder posture. Stretches with the head turned away and slightly down toward the opposite armpit. In overhead poses, levator scapulae fights against the upward rotation we want — releasing it makes overhead reach more comfortable.',
  },

  // ===== ROTATOR CUFF =====
  supraspinatus_muscle: {
    name: 'Supraspinatus',
    summary: 'Sits on top of the scapula, above the spine. Initiates abduction of the shoulder.',
    origin: 'Supraspinous fossa of the scapula.',
    insertion: 'Superior facet of the greater tubercle of the humerus.',
    joints: ['Glenohumeral'],
    actions: ['Abducts the shoulder (first 15–30°)', 'Stabilizes the humeral head in the glenoid'],
    antagonists: ['Latissimus dorsi (for adduction)'],
    yoga: 'Most-commonly-impinged rotator cuff muscle. In poses where the arms reach overhead with internal rotation (Down Dog if shoulders rotate in), supraspinatus can pinch between humerus and acromion. The cue "rotate the upper arms outward" externally rotates the humerus and gives supraspinatus space.',
  },
  infraspinatus_muscle: {
    name: 'Infraspinatus',
    summary: 'A large muscle covering most of the back of the scapula. External rotator of the shoulder.',
    origin: 'Infraspinous fossa of the scapula.',
    insertion: 'Middle facet of the greater tubercle of the humerus.',
    joints: ['Glenohumeral'],
    actions: ['Externally rotates the shoulder', 'Stabilizes the humeral head'],
    antagonists: ['Subscapularis', 'Pectoralis major'],
    yoga: 'Engages in any pose with arms externally rotated — Warrior II, Goddess, any wide-arm posture. Weakness here is a setup for shoulder injury in plank-and-Chaturanga heavy practice.',
  },
  teres_minor_muscle: {
    name: 'Teres Minor',
    summary: 'A small muscle below infraspinatus on the back of the scapula. Works with infraspinatus.',
    origin: 'Upper lateral border of the scapula.',
    insertion: 'Inferior facet of the greater tubercle of the humerus.',
    joints: ['Glenohumeral'],
    actions: ['Externally rotates the shoulder', 'Adducts the shoulder', 'Stabilizes the humeral head'],
    antagonists: ['Subscapularis'],
    yoga: 'Same functional group as infraspinatus.',
  },
  teres_major_muscle: {
    name: 'Teres Major',
    summary: 'Below teres minor. Not a rotator cuff muscle, but easily confused with one.',
    origin: 'Inferior angle of the scapula.',
    insertion: 'Medial lip of the bicipital groove of the humerus.',
    joints: ['Glenohumeral'],
    actions: ['Adducts the shoulder', 'Internally rotates the shoulder', 'Extends the shoulder'],
    antagonists: ['Deltoid', 'Infraspinatus'],
    yoga: 'Frequently tight in tense shoulders. Stretches with arms overhead.',
  },
  subscapularis_muscle: {
    name: 'Subscapularis',
    summary: 'The one rotator cuff muscle on the front of the scapula. Internal rotator of the shoulder.',
    origin: 'Subscapular fossa (anterior surface of the scapula).',
    insertion: 'Lesser tubercle of the humerus.',
    joints: ['Glenohumeral'],
    actions: ['Internally rotates the shoulder', 'Stabilizes the humeral head'],
    antagonists: ['Infraspinatus', 'Teres minor'],
    yoga: 'Tight subscapularis limits external rotation; testing it requires reaching the arm into "I-give-up" position. Stretches in deep external rotation with the arm overhead — Gomukhasana arms or any "cow-face" arm position.',
  },

  // ===== ARM =====
  long_head_of_biceps_brachii: {
    name: 'Biceps Brachii (Long Head)',
    summary: 'The outer of the two heads of biceps. Crosses both the shoulder and the elbow.',
    origin: 'Supraglenoid tubercle of the scapula.',
    insertion: 'Radial tuberosity, via the bicipital aponeurosis.',
    joints: ['Glenohumeral', 'Elbow', 'Radioulnar'],
    actions: ['Flexes the elbow', 'Supinates the forearm', 'Slight shoulder flexion'],
    antagonists: ['Triceps brachii'],
    yoga: 'Eccentrically engages on the descent into Chaturanga (controlling the lowering). The long head is also a major contributor to shoulder stability under load.',
  },
  short_head_of_biceps_brachii: {
    name: 'Biceps Brachii (Short Head)',
    summary: 'The inner of the two heads of biceps. Originates on the coracoid process.',
    origin: 'Coracoid process of the scapula.',
    insertion: 'Radial tuberosity (with long head).',
    joints: ['Glenohumeral', 'Elbow', 'Radioulnar'],
    actions: ['Flexes the elbow', 'Supinates the forearm', 'Shoulder flexion'],
    antagonists: ['Triceps brachii'],
    yoga: 'Same as long head, though sometimes more involved in shoulder flexion than elbow work.',
  },
  brachialis_muscle: {
    name: 'Brachialis',
    summary: 'Sits underneath biceps and is the real workhorse of elbow flexion.',
    origin: 'Distal half of the anterior humerus.',
    insertion: 'Coronoid process of the ulna.',
    joints: ['Elbow'],
    actions: ['Flexes the elbow regardless of forearm position'],
    antagonists: ['Triceps brachii'],
    yoga: 'Holds you up in any handstand or arm-balance and bears most of the load when biceps is fatigued. Often the muscle that announces it the next morning after a Chaturanga-heavy practice.',
  },
  long_head_of_triceps_brachii: {
    name: 'Triceps Brachii (Long Head)',
    summary: 'The medial of the three heads of triceps. The only head that crosses the shoulder.',
    origin: 'Infraglenoid tubercle of the scapula.',
    insertion: 'Olecranon process of the ulna.',
    joints: ['Glenohumeral', 'Elbow'],
    actions: ['Extends the elbow', 'Extends and adducts the shoulder'],
    antagonists: ['Biceps brachii', 'Brachialis'],
    yoga: 'Powers the press up from Chaturanga to plank and up to high cobra/upward-facing dog. In handstand, the triceps must be fully engaged to keep the elbows extended against gravity.',
  },
  lateral_head_of_triceps_brachii: {
    name: 'Triceps Brachii (Lateral Head)',
    summary: 'The lateral of the three heads. Only crosses the elbow.',
    origin: 'Posterior humerus above the radial groove.',
    insertion: 'Olecranon process of the ulna (shared tendon).',
    joints: ['Elbow'],
    actions: ['Extends the elbow'],
    antagonists: ['Biceps brachii'],
    yoga: 'Same elbow-extension role as the long head.',
  },
  medial_head_of_triceps_brachii: {
    name: 'Triceps Brachii (Medial Head)',
    summary: 'The deepest of the three heads of triceps.',
    origin: 'Posterior humerus below the radial groove.',
    insertion: 'Olecranon process of the ulna.',
    joints: ['Elbow'],
    actions: ['Extends the elbow'],
    antagonists: ['Biceps brachii'],
    yoga: 'Functions with the other two heads. Active in any pose requiring straight arms under load.',
  },

  // ===== CHEST =====
  clavicular_head_of_pectoralis_major_muscle: {
    name: 'Pectoralis Major (Clavicular Head)',
    summary: 'The upper part of pec major. Originates on the clavicle.',
    origin: 'Medial half of the clavicle.',
    insertion: 'Bicipital groove of the humerus.',
    joints: ['Glenohumeral'],
    actions: ['Flexes the shoulder', 'Adducts the shoulder', 'Internally rotates the shoulder'],
    antagonists: ['Latissimus dorsi', 'Posterior deltoid'],
    yoga: 'Stretches in any chest-opening backbend. Tight clavicular pec is one of the main limiters of overhead reach for desk-bound students.',
  },
  sternocostal_head_of_pectoralis_major_muscle: {
    name: 'Pectoralis Major (Sternocostal Head)',
    summary: 'The larger, lower part of pec major. Originates on the sternum and ribs.',
    origin: 'Sternum and costal cartilages of ribs 1–6.',
    insertion: 'Bicipital groove of the humerus.',
    joints: ['Glenohumeral'],
    actions: ['Adducts the shoulder', 'Internally rotates the shoulder', 'Extends the flexed shoulder back to neutral'],
    antagonists: ['Latissimus dorsi', 'Posterior deltoid'],
    yoga: 'The classic "tight chest" muscle. Backbends, fish pose (Matsyasana), and reverse plank are direct stretches. In plank and Chaturanga it engages eccentrically as you lower.',
  },
  pectoralis_minor_muscle: {
    name: 'Pectoralis Minor',
    summary: 'A small triangular muscle under pec major. Connects the upper ribs to the scapula.',
    origin: 'Ribs 3–5.',
    insertion: 'Coracoid process of the scapula.',
    joints: ['Scapulothoracic'],
    actions: ['Depresses, protracts, and downwardly rotates the scapula'],
    antagonists: ['Lower and middle trapezius', 'Serratus anterior (in upward rotation)'],
    yoga: 'Tight pec minor pulls the scapula forward and down — the classic rounded-shoulder posture. Releasing it is essential for healthy overhead reach.',
  },
  serratus_anterior_muscle: {
    name: 'Serratus Anterior',
    summary: 'A fan-shaped muscle on the side of the ribcage. Holds the scapula against the ribs and upwardly rotates it.',
    origin: 'Outer surfaces of ribs 1–9.',
    insertion: 'Anterior surface of the medial border of the scapula.',
    joints: ['Scapulothoracic'],
    actions: ['Protracts the scapula (reaches it forward)', 'Upwardly rotates the scapula', 'Holds the scapula flat against the ribcage'],
    antagonists: ['Rhomboids', 'Middle trapezius'],
    yoga: 'Critical for plank, handstand, and Chaturanga. "Press the floor away" cue activates serratus to protract the scapula. Weak serratus = "winged" scapulae standing out from the back. The strongest progression: plank with the scapulae slightly protracted, then push-ups maintaining that position.',
  },

  // ===== SHOULDER =====
  acromial_part_of_deltoid_muscle: {
    name: 'Middle Deltoid',
    summary: 'The middle, lateral part of the deltoid. Abducts the arm.',
    origin: 'Acromion of the scapula.',
    insertion: 'Deltoid tuberosity of the humerus.',
    joints: ['Glenohumeral'],
    actions: ['Abducts the shoulder (after the first 15° initiated by supraspinatus)'],
    antagonists: ['Latissimus dorsi', 'Pectoralis major'],
    yoga: 'Lifts the arms out to the sides in Warrior II, Star, and any T-position.',
  },
  clavicular_part_of_deltoid_muscle: {
    name: 'Anterior Deltoid',
    summary: 'The front part of the deltoid. Flexes the shoulder.',
    origin: 'Lateral third of the clavicle.',
    insertion: 'Deltoid tuberosity of the humerus.',
    joints: ['Glenohumeral'],
    actions: ['Flexes the shoulder', 'Internally rotates the shoulder', 'Adducts the shoulder (with arm overhead)'],
    antagonists: ['Posterior deltoid', 'Latissimus dorsi'],
    yoga: 'Engages strongly in any arms-forward or arms-overhead position. Lifts the arms in Urdhva Hastasana.',
  },
  scapular_spinal_part_of_deltoid_muscle: {
    name: 'Posterior Deltoid',
    summary: 'The back part of the deltoid. Extends the shoulder.',
    origin: 'Spine of the scapula.',
    insertion: 'Deltoid tuberosity of the humerus.',
    joints: ['Glenohumeral'],
    actions: ['Extends the shoulder', 'Externally rotates the shoulder', 'Abducts the shoulder horizontally'],
    antagonists: ['Anterior deltoid', 'Pectoralis major'],
    yoga: 'Engages in chest-opening backbends and in poses with arms extended backward (Locust, reverse warrior).',
  },

  // ===== LEG, accessory =====
  sartorius_muscle: {
    name: 'Sartorius',
    summary: 'The longest muscle in the body. A thin strap running diagonally from hip to inner knee.',
    origin: 'Anterior superior iliac spine (ASIS).',
    insertion: 'Pes anserinus on the medial proximal tibia.',
    joints: ['Hip', 'Knee'],
    actions: ['Flexes, abducts, and externally rotates the hip', 'Flexes the knee'],
    antagonists: ['Gluteus maximus', 'Adductors'],
    yoga: 'The "tailor\'s muscle" — sartorius crosses the body and assumes exactly the cross-legged position. Active in Padmasana (lotus), Sukhasana (easy seat), and Tree pose.',
  },
  tibialis_anterior_muscle: {
    name: 'Tibialis Anterior',
    summary: 'The shin muscle. Runs along the front-outer side of the lower leg.',
    origin: 'Lateral condyle and upper two-thirds of the lateral surface of the tibia.',
    insertion: 'Medial cuneiform and base of the first metatarsal.',
    joints: ['Ankle', 'Subtalar'],
    actions: ['Dorsiflexes the ankle (lifts the foot)', 'Inverts the foot'],
    antagonists: ['Gastrocnemius', 'Soleus'],
    yoga: 'Engages to pull the foot upward in any pose where the foot reaches toward the shin — Navasana, the lifted-leg work of Utthita Hasta Padangusthasana.',
  },
  tibialis_posterior_muscle: {
    name: 'Tibialis Posterior',
    summary: 'A deep posterior calf muscle. Supports the medial arch of the foot.',
    origin: 'Posterior tibia and fibula and interosseous membrane.',
    insertion: 'Navicular tuberosity and most tarsals.',
    joints: ['Ankle', 'Subtalar'],
    actions: ['Plantarflexes the ankle', 'Inverts the foot', 'Supports the medial longitudinal arch'],
    antagonists: ['Fibularis longus'],
    yoga: 'Supports the inner arch in standing poses. "Lifting the inner arches" in Tadasana is partly a tibialis posterior cue.',
  },
  fibularis_longus_muscle: {
    name: 'Fibularis Longus',
    summary: 'A long muscle on the outside of the lower leg. Sometimes called peroneus longus.',
    origin: 'Head and upper two-thirds of the lateral fibula.',
    insertion: 'Medial cuneiform and base of the first metatarsal (passes under the foot).',
    joints: ['Ankle', 'Subtalar'],
    actions: ['Plantarflexes and everts the ankle', 'Supports both arches'],
    antagonists: ['Tibialis anterior', 'Tibialis posterior'],
    yoga: 'Together with fibularis brevis, prevents the ankle from rolling inward in single-leg poses.',
  },
  fibularis_brevis_muscle: {
    name: 'Fibularis Brevis',
    summary: 'A shorter outside-of-the-lower-leg muscle. Helps evert the foot.',
    origin: 'Lower two-thirds of the lateral fibula.',
    insertion: 'Tuberosity at the base of the 5th metatarsal.',
    joints: ['Ankle', 'Subtalar'],
    actions: ['Plantarflexes and everts the ankle'],
    antagonists: ['Tibialis posterior'],
    yoga: 'Stabilizes the outer ankle.',
  },

  // ===== NECK =====
  sternocleidomastoid_muscle: {
    name: 'Sternocleidomastoid',
    shortName: 'SCM',
    summary: 'A prominent strap muscle on the side of the neck. Most visible neck muscle.',
    origin: 'Sternal head from the manubrium; clavicular head from the medial third of the clavicle.',
    insertion: 'Mastoid process of the temporal bone.',
    joints: ['Cervical spine'],
    actions: ['Rotates the head to the opposite side', 'Laterally flexes the head to the same side', 'Flexes the cervical spine when both sides act together', 'Accessory muscle of breathing'],
    antagonists: ['Upper trapezius', 'Splenius capitis'],
    yoga: 'Engages in any twist of the head and in chin-tucking. Chronic upper-chest breathing over-recruits SCM as an accessory inspirator. In supported neck positions like Sarvangasana (shoulderstand), proper alignment keeps SCM from being compressed.',
  },
  scalenus_anterior_muscle: {
    name: 'Anterior Scalene',
    summary: 'A neck muscle in front of the scalene group. Connects cervical vertebrae to the first rib.',
    origin: 'Transverse processes of C3–C6.',
    insertion: 'Scalene tubercle of the first rib.',
    joints: ['Cervical spine'],
    actions: ['Laterally flexes the neck', 'Elevates the first rib in forced inspiration'],
    antagonists: [],
    yoga: 'Over-engaged in upper-chest breathing patterns and stress. Tightness here can contribute to thoracic outlet syndrome.',
  },
  scalenus_medius_muscle: {
    name: 'Middle Scalene',
    summary: 'The largest of the scalene group.',
    origin: 'Transverse processes of C2–C7.',
    insertion: 'Upper surface of the first rib.',
    joints: ['Cervical spine'],
    actions: ['Laterally flexes the neck', 'Elevates the first rib'],
    antagonists: [],
    yoga: 'Same functional group as anterior scalene.',
  },
  scalenus_posterior_muscle: {
    name: 'Posterior Scalene',
    summary: 'The smallest scalene, behind the middle scalene.',
    origin: 'Transverse processes of C5–C7.',
    insertion: 'Outer surface of the second rib.',
    joints: ['Cervical spine'],
    actions: ['Laterally flexes the neck', 'Elevates the second rib'],
    antagonists: [],
    yoga: 'Same functional group as anterior scalene.',
  },

  // ===== ELBOW EXTENSOR =====
  anconeus_muscle: {
    name: 'Anconeus',
    summary: 'A small triangular muscle at the back of the elbow. Assists triceps.',
    origin: 'Lateral epicondyle of the humerus.',
    insertion: 'Olecranon and posterior ulna.',
    joints: ['Elbow'],
    actions: ['Assists elbow extension', 'Stabilizes the elbow joint'],
    antagonists: ['Biceps brachii'],
    yoga: 'A small but constant contributor to elbow stability in any straight-arm load.',
  },
  brachioradialis_muscle: {
    name: 'Brachioradialis',
    summary: 'A long forearm muscle. Flexes the elbow when the forearm is in a neutral (thumbs-up) position.',
    origin: 'Lateral supracondylar ridge of the humerus.',
    insertion: 'Styloid process of the radius.',
    joints: ['Elbow', 'Radioulnar'],
    actions: ['Flexes the elbow (most effective in neutral forearm position)', 'Pronates a fully supinated forearm and supinates a fully pronated one'],
    antagonists: ['Triceps brachii'],
    yoga: "Helps biceps and brachialis support the body's weight in arm balances and Chaturanga.",
  },
};

// ---------- Build the typed body parts library from the manifest ----------

function inferRegionForBone(name: string): BodyRegion {
  const n = name.toLowerCase();
  if (n.includes('skull') || n.includes('mandible')) return 'head-neck';
  if (n.includes('cervical') || n.includes('hyoid')) return 'head-neck';
  if (n.includes('scapula') || n.includes('clavic')) return 'shoulder-girdle';
  if (n.includes('humer') || n.includes('radius') || n.includes('ulna')) return 'arm';
  if (n.includes('thoracic') || n.includes('rib') || n.includes('sternum')) return 'chest';
  if (n.includes('lumbar') || n.includes('sacrum') || n.includes('coccyx')) return 'core';
  if (n.includes('hip') || n.includes('pelv') || n.includes('ilium') || n.includes('ischium') || n.includes('pubis')) return 'pelvis-hip';
  if (n.includes('femur') || n.includes('patella')) return 'thigh';
  if (n.includes('tibia') || n.includes('fibula') || n.includes('calcaneus') || n.includes('talus') || n.includes('navicular') || n.includes('cuboid') || n.includes('cuneiform') || n.includes('metatars') || n.includes('phalan')) return 'lower-leg-foot';
  return 'skeleton';
}

function muscleSlug(id: string): string {
  // muscle_xxx_l → xxx
  return id.replace(/^muscle_/, '').replace(/_[lr]$/, '');
}

export const BODY_PARTS: BodyPart[] = manifest.meshes.map((entry: ManifestMeshEntry) => {
  if (entry.kind === 'muscle') {
    const slug = muscleSlug(entry.id);
    const info = MUSCLE_INFO[slug];
    return {
      id: entry.id,
      name: info?.name || entry.name,
      shortName: info?.shortName,
      kind: 'muscle' as const,
      side: entry.side,
      region: REGION_OF_MUSCLE[slug] || 'core',
      summary: info?.summary,
      origin: info?.origin,
      insertion: info?.insertion,
      joints: info?.joints,
      actions: info?.actions,
      antagonists: info?.antagonists,
      yoga: info?.yoga,
    };
  }
  return {
    id: entry.id,
    name: entry.name,
    kind: 'bone' as const,
    side: entry.side,
    region: inferRegionForBone(entry.name),
  };
});

export function getBodyPart(id: string): BodyPart | undefined {
  return BODY_PARTS.find((p) => p.id === id);
}

export const REGION_LABELS: Record<BodyRegion, string> = {
  'head-neck': 'Head & Neck',
  'shoulder-girdle': 'Shoulder Girdle',
  arm: 'Arm',
  chest: 'Chest',
  back: 'Back',
  core: 'Core / Trunk',
  'pelvis-hip': 'Pelvis & Hip',
  thigh: 'Thigh',
  'lower-leg-foot': 'Lower Leg & Foot',
  skeleton: 'Skeleton',
};
