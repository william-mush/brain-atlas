"""
Auto-rig the anatomical body — version 3.

Combines the best of v1 (anatomical override table for ~258 named
muscles) and v2 (armature rebuilt from body-mesh centroids so the
bones sit inside the body where auto-weighting expects them).

Adds two refinements:
  - Synthetic C1/C2 positions (Z-Anatomy's body model doesn't include
    atlas/axis as separate meshes; we interpolate between C3 and the
    head to place them)
  - Multi-joint muscle handling: muscles that cross two joints
    (biceps brachii, rectus femoris, gastrocnemius, hamstrings,
    sartorius, brachialis) get distance-falloff weights blended
    across the two bones they span, instead of being rigidly bound
    to one bone.

PIPELINE:
  1. Load body.glb (305 meshes).
  2. Compute anatomical anchor positions from body-mesh centroids.
  3. Build a 45-bone armature inside the body using those anchors.
  4. For each body mesh:
     a. If listed in MUSCLE_OVERRIDES with explicit single-bone target,
        bind 100% to that bone.
     b. If listed in MULTI_JOINT_MUSCLES, compute vertex weights with
        falloff between the two joint-crossing bones.
     c. If matches a bone-pattern, bind to the corresponding armature bone.
     d. Otherwise, fall back to Blender's automatic weights.
  5. Export as body_rigged.glb.

USAGE:
  blender --background --python scripts/rig_body_v3.py
"""

import bpy
import mathutils
from pathlib import Path

PROJECT_ROOT = Path('/Users/williammushkin/projects/active/brain-atlas')
BODY_PATH = PROJECT_ROOT / 'public' / 'models' / 'body.glb'
OUTPUT_PATH = PROJECT_ROOT / 'public' / 'models' / 'body_rigged.glb'


# ============================================================
# MUSCLE OVERRIDES — single-bone binding for muscles that cross
# at most one joint (or are entirely within one bone's span).
# Pattern: substring on muscle slug → armature bone.
# ============================================================
MUSCLE_OVERRIDES = {
    # Upper arm muscles
    'deltoid__l': 'UpperArm_l', 'deltoid__r': 'UpperArm_r',
    'coracobrachialis__l': 'UpperArm_l', 'coracobrachialis__r': 'UpperArm_r',
    # Forearm
    'brachioradialis__l': 'Forearm_l', 'brachioradialis__r': 'Forearm_r',
    'pronator__l': 'Forearm_l', 'pronator__r': 'Forearm_r',
    'supinator__l': 'Forearm_l', 'supinator__r': 'Forearm_r',
    # Single-joint thigh muscles (the multi-joint ones go in MULTI_JOINT)
    'vastus__l': 'Thigh_l', 'vastus__r': 'Thigh_r',
    'adductor__l': 'Thigh_l', 'adductor__r': 'Thigh_r',
    'tensor_fasciae_latae__l': 'Thigh_l', 'tensor_fasciae_latae__r': 'Thigh_r',
    # Glutes & deep hip rotators (pelvic origin, femoral insertion — could be
    # multi-joint but for our purposes the pelvis bone is dominant)
    'gluteus__l': 'Pelvis', 'gluteus__r': 'Pelvis',
    'piriformis__l': 'Pelvis', 'piriformis__r': 'Pelvis',
    # Single-joint calf muscles (gastroc is multi-joint, listed separately)
    'soleus__l': 'Shin_l', 'soleus__r': 'Shin_r',
    'tibialis__l': 'Shin_l', 'tibialis__r': 'Shin_r',
    'fibularis__l': 'Shin_l', 'fibularis__r': 'Shin_r',
    'peroneus__l': 'Shin_l', 'peroneus__r': 'Shin_r',
    # Abdomen
    'rectus_abdominis': 'Spine_L3',
    'external_abdominal_oblique__l': 'Spine_L2', 'external_abdominal_oblique__r': 'Spine_L2',
    'internal_abdominal_oblique__l': 'Spine_L2', 'internal_abdominal_oblique__r': 'Spine_L2',
    'transversus_abdominis': 'Spine_L3',
    # Back
    'latissimus_dorsi__l': 'Spine_T9', 'latissimus_dorsi__r': 'Spine_T9',
    'longissimus_thoracis__l': 'Spine_T7', 'longissimus_thoracis__r': 'Spine_T7',
    'longissimus_lumborum__l': 'Spine_L3', 'longissimus_lumborum__r': 'Spine_L3',
    'iliocostalis_thoracis': 'Spine_T9',
    'iliocostalis_lumborum': 'Spine_L3',
    'spinalis_thoracis': 'Spine_T7',
    'multifidus_thoracis': 'Spine_T9',
    'multifidus_lumborum': 'Spine_L3',
    'quadratus_lumborum__l': 'Spine_L3', 'quadratus_lumborum__r': 'Spine_L3',
    # Chest
    'pectoralis_major__l': 'Spine_T3', 'pectoralis_major__r': 'Spine_T3',
    'pectoralis_minor__l': 'Spine_T3', 'pectoralis_minor__r': 'Spine_T3',
    # Upper back / scapular
    'trapezius__l': 'Scapula_l', 'trapezius__r': 'Scapula_r',
    'rhomboid__l': 'Scapula_l', 'rhomboid__r': 'Scapula_r',
    'serratus_anterior__l': 'Scapula_l', 'serratus_anterior__r': 'Scapula_r',
    'infraspinatus__l': 'Scapula_l', 'infraspinatus__r': 'Scapula_r',
    'supraspinatus__l': 'Scapula_l', 'supraspinatus__r': 'Scapula_r',
    'subscapularis__l': 'Scapula_l', 'subscapularis__r': 'Scapula_r',
    'teres__l': 'Scapula_l', 'teres__r': 'Scapula_r',
    # Neck
    'sternocleidomastoid__l': 'Neck_C4', 'sternocleidomastoid__r': 'Neck_C4',
    'scalene__l': 'Neck_C4', 'scalene__r': 'Neck_C4',
    # Hip flexors (psoas spans lumbar to femur — gets multi-joint treatment)
    'iliacus__l': 'Pelvis', 'iliacus__r': 'Pelvis',
    'pectineus__l': 'Thigh_l', 'pectineus__r': 'Thigh_r',
}

# ============================================================
# MULTI-JOINT MUSCLES — muscles crossing two joints get weights
# blended between the two bones with distance-based falloff.
# Format: muscle_slug_substring → (origin_bone, insertion_bone)
# Vertices near the origin end get weighted to origin_bone;
# vertices near the insertion get weighted to insertion_bone;
# midline vertices blend evenly.
# ============================================================
MULTI_JOINT_MUSCLES = {
    # Hamstrings: ischial tuberosity (pelvis) → tibia/fibula (shin)
    # Crosses both the hip and the knee.
    'biceps_femoris__l': ('Pelvis', 'Shin_l'),
    'biceps_femoris__r': ('Pelvis', 'Shin_r'),
    'semimembranosus__l': ('Pelvis', 'Shin_l'),
    'semimembranosus__r': ('Pelvis', 'Shin_r'),
    'semitendinosus__l': ('Pelvis', 'Shin_l'),
    'semitendinosus__r': ('Pelvis', 'Shin_r'),
    # Rectus femoris: ilium (pelvis) → patella/tibial tuberosity (shin)
    # Crosses hip and knee. The other quads don't cross the hip.
    'rectus_femoris__l': ('Pelvis', 'Shin_l'),
    'rectus_femoris__r': ('Pelvis', 'Shin_r'),
    # Sartorius: anterior iliac spine (pelvis) → medial tibia (shin)
    'sartorius__l': ('Pelvis', 'Shin_l'),
    'sartorius__r': ('Pelvis', 'Shin_r'),
    # Gracilis: pubis (pelvis) → medial tibia (shin)
    'gracilis__l': ('Pelvis', 'Shin_l'),
    'gracilis__r': ('Pelvis', 'Shin_r'),
    # Gastrocnemius: femoral condyles (thigh) → calcaneus (foot)
    # Crosses both knee and ankle.
    'gastrocnemius__l': ('Thigh_l', 'Foot_l'),
    'gastrocnemius__r': ('Thigh_r', 'Foot_r'),
    # Biceps brachii: scapula → radial tuberosity (forearm). Crosses
    # shoulder and elbow.
    'biceps_brachii__l': ('Scapula_l', 'Forearm_l'),
    'biceps_brachii__r': ('Scapula_r', 'Forearm_r'),
    # Triceps brachii (long head): scapula → ulna. Multi-joint.
    'long_head_of_triceps_brachii__l': ('Scapula_l', 'Forearm_l'),
    'long_head_of_triceps_brachii__r': ('Scapula_r', 'Forearm_r'),
    # The lateral and medial heads of triceps are humerus-only, not multi-joint.
    'lateral_head_of_triceps_brachii__l': ('UpperArm_l', 'Forearm_l'),
    'lateral_head_of_triceps_brachii__r': ('UpperArm_r', 'Forearm_r'),
    'medial_head_of_triceps_brachii__l': ('UpperArm_l', 'Forearm_l'),
    'medial_head_of_triceps_brachii__r': ('UpperArm_r', 'Forearm_r'),
    # Brachialis: humerus → ulna. Single-joint but on the boundary.
    'brachialis__l': ('UpperArm_l', 'Forearm_l'),
    'brachialis__r': ('UpperArm_r', 'Forearm_r'),
    # Psoas major: lumbar spine → lesser trochanter (femur). Multi-joint.
    'psoas__l': ('Spine_L3', 'Thigh_l'),
    'psoas__r': ('Spine_L3', 'Thigh_r'),
}

# ============================================================
# BONE MESHES — bone-name patterns to armature bones.
# ============================================================
BONE_PATTERNS = [
    ('hip_bone', 'Pelvis'), ('pelvic', 'Pelvis'),
    ('sacrum', 'Sacrum'), ('coccyx', 'Coccyx'),
    # Spine (exact-match handled separately below)
    # Skull
    ('skull', 'Head'), ('cranium', 'Head'),
    ('frontal_bone', 'Head'), ('parietal', 'Head'),
    ('occipital', 'Head'), ('temporal', 'Head'),
    ('maxilla', 'Head'), ('teeth', 'Head'), ('tongue', 'Head'),
    ('mandible', 'Mandible'),
    ('hyoid', 'Neck_C4'),
    # Ribs by number (matched against thoracic vertebra)
    ('first_rib', 'Spine_T1'), ('second_rib', 'Spine_T2'),
    ('third_rib', 'Spine_T3'), ('fourth_rib', 'Spine_T4'),
    ('fifth_rib', 'Spine_T5'), ('sixth_rib', 'Spine_T6'),
    ('seventh_rib', 'Spine_T7'), ('eighth_rib', 'Spine_T8'),
    ('ninth_rib', 'Spine_T9'), ('tenth_rib', 'Spine_T10'),
    ('eleventh_rib', 'Spine_T11'), ('twelfth_rib', 'Spine_T12'),
    ('sternum', 'Spine_T4'), ('costal_cartilage', 'Spine_T6'),
    # Upper limb
    ('clavicle__l', 'Clavicle_l'), ('clavicle__r', 'Clavicle_r'),
    ('scapula__l', 'Scapula_l'), ('scapula__r', 'Scapula_r'),
    ('humerus__l', 'UpperArm_l'), ('humerus__r', 'UpperArm_r'),
    ('radius__l', 'Forearm_l'), ('radius__r', 'Forearm_r'),
    ('ulna__l', 'Forearm_l'), ('ulna__r', 'Forearm_r'),
    # Hand bones
    ('scaphoid__l', 'Hand_l'), ('scaphoid__r', 'Hand_r'),
    ('lunate__l', 'Hand_l'), ('lunate__r', 'Hand_r'),
    ('triquetral__l', 'Hand_l'), ('triquetral__r', 'Hand_r'),
    ('pisiform__l', 'Hand_l'), ('pisiform__r', 'Hand_r'),
    ('trapezium__l', 'Hand_l'), ('trapezium__r', 'Hand_r'),
    ('trapezoid__l', 'Hand_l'), ('trapezoid__r', 'Hand_r'),
    ('capitate__l', 'Hand_l'), ('capitate__r', 'Hand_r'),
    ('hamate__l', 'Hand_l'), ('hamate__r', 'Hand_r'),
    ('metacarpal__l', 'Hand_l'), ('metacarpal__r', 'Hand_r'),
    ('phalanx__l', 'Hand_l'), ('phalanx__r', 'Hand_r'),
    ('finger__l', 'Hand_l'), ('finger__r', 'Hand_r'),
    # Lower limb
    ('femur__l', 'Thigh_l'), ('femur__r', 'Thigh_r'),
    ('patella__l', 'Thigh_l'), ('patella__r', 'Thigh_r'),
    ('tibia__l', 'Shin_l'), ('tibia__r', 'Shin_r'),
    ('fibula__l', 'Shin_l'), ('fibula__r', 'Shin_r'),
    # Foot
    ('calcaneus__l', 'Foot_l'), ('calcaneus__r', 'Foot_r'),
    ('talus__l', 'Foot_l'), ('talus__r', 'Foot_r'),
    ('navicular__l', 'Foot_l'), ('navicular__r', 'Foot_r'),
    ('cuboid__l', 'Foot_l'), ('cuboid__r', 'Foot_r'),
    ('cuneiform__l', 'Foot_l'), ('cuneiform__r', 'Foot_r'),
    ('metatarsal__l', 'Foot_l'), ('metatarsal__r', 'Foot_r'),
    ('tarsal__l', 'Foot_l'), ('tarsal__r', 'Foot_r'),
]


def centroid_of(mesh_obj):
    if mesh_obj.data is None or len(mesh_obj.data.vertices) == 0:
        return None
    local = sum((v.co for v in mesh_obj.data.vertices), mathutils.Vector()) / len(mesh_obj.data.vertices)
    return mesh_obj.matrix_world @ local


def average_centroids(centroids):
    pts = [c for c in centroids if c is not None]
    if not pts:
        return None
    return sum(pts, mathutils.Vector()) / len(pts)


def find_meshes_by_name_substr(substr, all_meshes):
    return [m for m in all_meshes if substr in m.name.lower()]


def find_mesh_by_exact_name(name, all_meshes):
    for m in all_meshes:
        if m.name.lower() == name.lower():
            return m
    return None


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # ============ Load body ============
    bpy.ops.import_scene.gltf(filepath=str(BODY_PATH))
    body_meshes = [obj for obj in bpy.data.objects if obj.type == 'MESH']
    valid_meshes = [m for m in body_meshes if m.data and len(m.data.vertices) > 0]
    print(f"Loaded {len(valid_meshes)} body meshes")

    # ============ Anatomical anchors ============
    print("\nComputing anatomical anchor positions…")

    # Vertebral anchors (exact name match prevents the t1-vs-t10 substring bug)
    vertebra_anchors = {}
    for v in ['L1', 'L2', 'L3', 'L4', 'L5',
              'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
              'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
              'C3', 'C4', 'C5', 'C6', 'C7']:
        m = find_mesh_by_exact_name(f'bone_vertebra_{v.lower()}', valid_meshes)
        if m:
            c = centroid_of(m)
            if c:
                vertebra_anchors[v] = c

    # Synthetic C1 and C2 — interpolate between C3 and head
    # The atlas (C1) sits at the base of the skull; the axis (C2)
    # sits between C1 and C3. Z-Anatomy's body mesh doesn't include
    # these as separate vertebrae meshes, but the bones exist in the
    # skeleton armature and we need them in our rig too.
    head_meshes = []
    for m in valid_meshes:
        nl = m.name.lower()
        if any(s in nl for s in ['frontal_bone', 'parietal_bone_l', 'parietal_bone_r', 'occipital_bone']):
            head_meshes.append(m)
    head_center = average_centroids([centroid_of(m) for m in head_meshes]) if head_meshes else None

    if head_center and 'C3' in vertebra_anchors:
        # C1 is just below the head's base; C2 is just above C3.
        # Place them along the line C3 → head_center.
        c3 = vertebra_anchors['C3']
        head_line = head_center - c3
        # C2 sits at 1/3 of the way up from C3 toward head; C1 sits at 2/3
        vertebra_anchors['C2'] = c3 + head_line * 0.33
        vertebra_anchors['C1'] = c3 + head_line * 0.67
        print(f"  spine-C1 (synthetic atlas) = {vertebra_anchors['C1']}")
        print(f"  spine-C2 (synthetic axis)  = {vertebra_anchors['C2']}")

    print(f"Vertebra anchors: {len(vertebra_anchors)} positions")

    # Other anchors
    def avg_anchor(substrs):
        ms = []
        for s in substrs:
            ms.extend(find_meshes_by_name_substr(s, valid_meshes))
        ms = list({m.name: m for m in ms}.values())
        return average_centroids([centroid_of(m) for m in ms]) if ms else None

    pelvis_center = avg_anchor(['hip_bone', 'sacrum'])
    sacrum_c = avg_anchor(['sacrum'])
    coccyx_c = avg_anchor(['coccyx'])

    hip_l = avg_anchor(['hip_bone_l'])
    hip_r = avg_anchor(['hip_bone_r'])
    knee_l = avg_anchor(['tibia_l', 'patella_l'])
    knee_r = avg_anchor(['tibia_r', 'patella_r'])
    ankle_l = avg_anchor(['talus_l', 'calcaneus_l'])
    ankle_r = avg_anchor(['talus_r', 'calcaneus_r'])
    foot_l = avg_anchor(['metatarsal_bone_l'])
    foot_r = avg_anchor(['metatarsal_bone_r'])

    mandible_c = avg_anchor(['mandible'])
    clav_l = avg_anchor(['clavicle_l'])
    clav_r = avg_anchor(['clavicle_r'])
    scap_l = avg_anchor(['scapula_l'])
    scap_r = avg_anchor(['scapula_r'])
    shoulder_l = avg_anchor(['humerus_l'])
    shoulder_r = avg_anchor(['humerus_r'])
    elbow_l = avg_anchor(['radius_l', 'ulna_l'])
    elbow_r = avg_anchor(['radius_r', 'ulna_r'])
    wrist_l = avg_anchor(['scaphoid_bone_l', 'lunate_bone_l', 'capitate_bone_l'])
    wrist_r = avg_anchor(['scaphoid_bone_r', 'lunate_bone_r', 'capitate_bone_r'])
    hand_l = avg_anchor(['metacarpal_bone_l'])
    hand_r = avg_anchor(['metacarpal_bone_r'])

    # ============ Build armature ============
    print("\nBuilding armature…")

    armature_data = bpy.data.armatures.new('BodyArmature')
    armature_obj = bpy.data.objects.new('BodyArmature', armature_data)
    bpy.context.collection.objects.link(armature_obj)
    bpy.context.view_layer.objects.active = armature_obj
    bpy.ops.object.mode_set(mode='EDIT')

    bones_created = []

    def make_bone(name, head, tail, parent=None):
        if head is None or tail is None:
            print(f"  SKIP {name}: missing head/tail")
            return None
        b = armature_data.edit_bones.new(name)
        b.head = head
        b.tail = tail
        if parent:
            pb = armature_data.edit_bones.get(parent)
            if pb:
                b.parent = pb
                b.use_connect = False
        bones_created.append(name)
        return b

    # Pelvis
    if pelvis_center:
        pelvis_tail = vertebra_anchors.get('L5', pelvis_center + mathutils.Vector((0, 0.1, 0)))
        make_bone('Pelvis', pelvis_center, pelvis_tail)
    # Spine chain bottom-to-top
    spine_chain = ['L5', 'L4', 'L3', 'L2', 'L1',
                   'T12', 'T11', 'T10', 'T9', 'T8', 'T7',
                   'T6', 'T5', 'T4', 'T3', 'T2', 'T1']
    parent = 'Pelvis'
    for i, v in enumerate(spine_chain):
        if v not in vertebra_anchors:
            continue
        head = vertebra_anchors[v]
        next_v = spine_chain[i + 1] if i + 1 < len(spine_chain) else 'C7'
        tail = vertebra_anchors.get(next_v, head + mathutils.Vector((0, 0.03, 0)))
        make_bone(f'Spine_{v}', head, tail, parent)
        parent = f'Spine_{v}'

    # Cervical chain (C7 down to C3)
    cervical_chain = ['C7', 'C6', 'C5', 'C4', 'C3']
    parent = 'Spine_T1' if 'Spine_T1' in bones_created else 'Pelvis'
    for i, v in enumerate(cervical_chain):
        if v not in vertebra_anchors:
            continue
        head = vertebra_anchors[v]
        next_v = cervical_chain[i + 1] if i + 1 < len(cervical_chain) else 'C2'
        tail = vertebra_anchors.get(next_v, head + mathutils.Vector((0, 0.02, 0)))
        make_bone(f'Neck_{v}', head, tail, parent)
        parent = f'Neck_{v}'

    # C2 (axis) — synthetic
    if 'C2' in vertebra_anchors:
        head = vertebra_anchors['C2']
        tail = vertebra_anchors.get('C1', head + mathutils.Vector((0, 0.02, 0)))
        make_bone('Neck_C2_Axis', head, tail,
                  parent='Neck_C3' if 'Neck_C3' in bones_created else 'Spine_T1')
    # C1 (atlas) — synthetic
    if 'C1' in vertebra_anchors:
        head = vertebra_anchors['C1']
        tail = head_center if head_center else head + mathutils.Vector((0, 0.05, 0))
        make_bone('Neck_C1_Atlas', head, tail,
                  parent='Neck_C2_Axis' if 'Neck_C2_Axis' in bones_created else 'Neck_C3')

    if head_center:
        head_tail = head_center + mathutils.Vector((0, 0.15, 0))
        make_bone('Head', head_center, head_tail,
                  parent='Neck_C1_Atlas' if 'Neck_C1_Atlas' in bones_created else 'Neck_C3')
    if mandible_c:
        make_bone('Mandible', mandible_c, mandible_c + mathutils.Vector((0, -0.03, 0.03)),
                  parent='Head' if 'Head' in bones_created else None)

    if sacrum_c:
        make_bone('Sacrum', sacrum_c, sacrum_c + mathutils.Vector((0, -0.05, 0)), 'Pelvis')
    if coccyx_c:
        make_bone('Coccyx', coccyx_c, coccyx_c + mathutils.Vector((0, -0.03, 0)),
                  'Sacrum' if 'Sacrum' in bones_created else 'Pelvis')

    spine_t1 = 'Spine_T1' if 'Spine_T1' in bones_created else 'Pelvis'
    for side, clav, scap, sh, el, wr, hd in [
        ('l', clav_l, scap_l, shoulder_l, elbow_l, wrist_l, hand_l),
        ('r', clav_r, scap_r, shoulder_r, elbow_r, wrist_r, hand_r),
    ]:
        if clav and sh:
            make_bone(f'Clavicle_{side}', clav, sh, parent=spine_t1)
        if scap and sh:
            make_bone(f'Scapula_{side}', scap, sh,
                      parent=f'Clavicle_{side}' if f'Clavicle_{side}' in bones_created else spine_t1)
        if sh and el:
            make_bone(f'UpperArm_{side}', sh, el,
                      parent=f'Scapula_{side}' if f'Scapula_{side}' in bones_created else spine_t1)
        if el and wr:
            make_bone(f'Forearm_{side}', el, wr, parent=f'UpperArm_{side}')
        if wr and hd:
            make_bone(f'Hand_{side}', wr, hd, parent=f'Forearm_{side}')

    for side, hip, knee, ank, ft in [
        ('l', hip_l, knee_l, ankle_l, foot_l),
        ('r', hip_r, knee_r, ankle_r, foot_r),
    ]:
        if hip and knee:
            make_bone(f'Thigh_{side}', hip, knee, parent='Pelvis')
        if knee and ank:
            make_bone(f'Shin_{side}', knee, ank, parent=f'Thigh_{side}')
        if ank and ft:
            make_bone(f'Foot_{side}', ank, ft, parent=f'Shin_{side}')

    print(f"  Created {len(bones_created)} bones")

    bpy.ops.object.mode_set(mode='OBJECT')

    # ============ Parent meshes to armature ============
    # Strategy: parent all meshes to the armature with empty groups,
    # then for each mesh decide what weights to assign based on its
    # name (overrides → multi-joint → bone-pattern → fallback).
    for m in valid_meshes:
        m.parent = armature_obj
        m.parent_type = 'OBJECT'
        if not any(mod.type == 'ARMATURE' for mod in m.modifiers):
            mod = m.modifiers.new(name='Armature', type='ARMATURE')
            mod.object = armature_obj

    # ============ Assign weights ============
    print("\nAssigning weights…")
    stats = {'override': 0, 'multi_joint': 0, 'bone_pattern': 0, 'nearest': 0, 'failed': 0}

    def find_muscle_override(slug, side_l, side_r):
        for key, bone in MUSCLE_OVERRIDES.items():
            if '__l' in key and not side_l: continue
            if '__r' in key and not side_r: continue
            substr = key.replace('__l', '').replace('__r', '')
            if substr in slug:
                return bone
        return None

    def find_multi_joint(slug, side_l, side_r):
        for key, bones in MULTI_JOINT_MUSCLES.items():
            if '__l' in key and not side_l: continue
            if '__r' in key and not side_r: continue
            substr = key.replace('__l', '').replace('__r', '')
            if substr in slug:
                return bones
        return None

    def find_bone_pattern(slug, side_l, side_r):
        for pattern, bone in BONE_PATTERNS:
            if '__l' in pattern and not side_l: continue
            if '__r' in pattern and not side_r: continue
            substr = pattern.replace('__l', '').replace('__r', '')
            if substr in slug:
                return bone
        return None

    def nearest_bone_to(world_pos):
        best, best_d = None, float('inf')
        for bn in bones_created:
            b = armature_obj.data.bones.get(bn)
            if not b: continue
            head_world = armature_obj.matrix_world @ b.head_local
            d = (world_pos - head_world).length
            if d < best_d:
                best_d, best = d, bn
        return best

    bones_set = set(bones_created)

    for mesh in valid_meshes:
        nl = mesh.name.lower()
        side_l = nl.endswith('_l') or '_l_' in nl
        side_r = nl.endswith('_r') or '_r_' in nl

        # Try MUSCLE_OVERRIDES first
        target = None
        kind = None
        if nl.startswith('muscle_'):
            slug = nl[len('muscle_'):]
            override_bone = find_muscle_override(slug, side_l, side_r)
            if override_bone and override_bone in bones_set:
                target = override_bone
                kind = 'override'
            else:
                multi = find_multi_joint(slug, side_l, side_r)
                if multi and multi[0] in bones_set and multi[1] in bones_set:
                    # Multi-joint blending
                    origin_bone_name, insertion_bone_name = multi
                    ob = armature_obj.data.bones[origin_bone_name]
                    ib = armature_obj.data.bones[insertion_bone_name]
                    # Origin and insertion in world coords
                    origin_pos = armature_obj.matrix_world @ ob.head_local
                    insertion_pos = armature_obj.matrix_world @ ib.head_local

                    vg_origin = mesh.vertex_groups.new(name=origin_bone_name)
                    vg_insertion = mesh.vertex_groups.new(name=insertion_bone_name)

                    # For each vertex, weight = distance ratio along the
                    # origin → insertion axis.
                    axis = insertion_pos - origin_pos
                    axis_len_sq = axis.length_squared
                    if axis_len_sq < 1e-6:
                        # Degenerate — bind everything to origin
                        vg_origin.add(range(len(mesh.data.vertices)), 1.0, 'REPLACE')
                    else:
                        for v in mesh.data.vertices:
                            world_v = mesh.matrix_world @ v.co
                            # Project onto the origin-insertion axis
                            t = (world_v - origin_pos).dot(axis) / axis_len_sq
                            t = max(0.0, min(1.0, t))
                            # t=0 → origin, t=1 → insertion
                            vg_origin.add([v.index], 1.0 - t, 'REPLACE')
                            vg_insertion.add([v.index], t, 'REPLACE')
                    stats['multi_joint'] += 1
                    continue

        if not target and nl.startswith('bone_'):
            slug = nl[len('bone_'):]
            pattern_bone = find_bone_pattern(slug, side_l, side_r)
            if pattern_bone and pattern_bone in bones_set:
                target = pattern_bone
                kind = 'bone_pattern'

        # Fallback: nearest bone by centroid
        if not target:
            center = centroid_of(mesh)
            if center:
                target = nearest_bone_to(center)
                kind = 'nearest'

        if not target:
            stats['failed'] += 1
            continue

        # Bind 100% to single bone
        vg = mesh.vertex_groups.new(name=target)
        vg.add(range(len(mesh.data.vertices)), 1.0, 'REPLACE')
        stats[kind] += 1

    print(f"\n=== WEIGHTING REPORT ===")
    print(f"Total: {len(valid_meshes)}")
    print(f"  Override (single-bone):    {stats['override']}")
    print(f"  Multi-joint (blended):     {stats['multi_joint']}")
    print(f"  Bone pattern (single-bone): {stats['bone_pattern']}")
    print(f"  Nearest bone (fallback):   {stats['nearest']}")
    print(f"  Failed:                    {stats['failed']}")

    # ============ Export ============
    bpy.ops.export_scene.gltf(
        filepath=str(OUTPUT_PATH),
        export_format='GLB',
        export_apply=False,
        export_skins=True,
        export_yup=True,
    )
    print(f"\nExported to {OUTPUT_PATH}")
    return 0


if __name__ == '__main__':
    import sys
    sys.exit(main())
