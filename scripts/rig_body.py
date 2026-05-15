"""
Auto-rig the anatomical body model by binding each muscle/bone mesh to
the nearest armature bone from the skeleton.

PIPELINE:
  1. Load skeleton.glb (already has a 45-bone armature with skin-weighted
     bone meshes — that's how /skeleton works).
  2. Extract just the armature object (without the skin meshes).
  3. Load body.glb (305 separate muscle/bone meshes, no armature).
  4. For each body mesh, find the nearest armature bone (by mesh centroid
     to bone-head distance) and assign 100% vertex weight to that bone.
     This is "rigid binding" — each muscle/bone follows exactly one
     armature bone with no blending.
  5. Parent every body mesh to the armature.
  6. Export the combined scene as body_rigged.glb.

LIMITATIONS:
  - Multi-joint muscles (biceps brachii, rectus femoris, gastrocnemius,
    sartorius, hamstrings) get rigidly bound to one bone. They'll
    stretch unnaturally at the other joint they cross. A human rigger
    can later re-weight them with proper blended weights for the joints
    they cross.
  - Bone-meshes (calcaneus, femur head, etc.) are bound to the
    closest armature bone — generally correct, but a few small bones
    (carpals, tarsals) may end up bound to the wrong adjacent bone.
  - Anatomical bone-name → armature-bone overrides are listed below
    for the ones I want to get right by name rather than by proximity.

USAGE:
  blender --background --python scripts/rig_body.py

OUTPUT:
  public/models/body_rigged.glb
"""

import bpy
import mathutils
from pathlib import Path

PROJECT_ROOT = Path('/Users/williammushkin/projects/active/brain-atlas')
SKELETON_PATH = PROJECT_ROOT / 'public' / 'models' / 'skeleton.glb'
BODY_PATH = PROJECT_ROOT / 'public' / 'models' / 'body.glb'
OUTPUT_PATH = PROJECT_ROOT / 'public' / 'models' / 'body_rigged.glb'


# ============================================================
# ANATOMICAL OVERRIDES — explicit muscle → bone assignments.
#
# These are muscles whose centroid would auto-assign incorrectly,
# OR muscles where I want a specific assignment regardless of distance.
# Pattern matching is by substring on the muscle name.
#
# Format: substring_to_match → armature_bone_name
# For side-specific overrides, use '__l' or '__r' suffix on the match.
# ============================================================
MUSCLE_OVERRIDES = {
    # Upper arm muscles — bind to UpperArm
    'biceps_brachii__l': 'UpperArm_l',
    'biceps_brachii__r': 'UpperArm_r',
    'triceps_brachii__l': 'UpperArm_l',
    'triceps_brachii__r': 'UpperArm_r',
    'brachialis__l': 'UpperArm_l',
    'brachialis__r': 'UpperArm_r',
    'deltoid__l': 'UpperArm_l',
    'deltoid__r': 'UpperArm_r',
    'coracobrachialis__l': 'UpperArm_l',
    'coracobrachialis__r': 'UpperArm_r',
    # Forearm muscles — Forearm
    'brachioradialis__l': 'Forearm_l',
    'brachioradialis__r': 'Forearm_r',
    'pronator__l': 'Forearm_l',
    'pronator__r': 'Forearm_r',
    'supinator__l': 'Forearm_l',
    'supinator__r': 'Forearm_r',
    # Thigh muscles — Thigh
    'rectus_femoris__l': 'Thigh_l',
    'rectus_femoris__r': 'Thigh_r',
    'vastus__l': 'Thigh_l',
    'vastus__r': 'Thigh_r',
    'biceps_femoris__l': 'Thigh_l',
    'biceps_femoris__r': 'Thigh_r',
    'semimembranosus__l': 'Thigh_l',
    'semimembranosus__r': 'Thigh_r',
    'semitendinosus__l': 'Thigh_l',
    'semitendinosus__r': 'Thigh_r',
    'adductor__l': 'Thigh_l',
    'adductor__r': 'Thigh_r',
    'sartorius__l': 'Thigh_l',
    'sartorius__r': 'Thigh_r',
    'gracilis__l': 'Thigh_l',
    'gracilis__r': 'Thigh_r',
    'tensor_fasciae_latae__l': 'Thigh_l',
    'tensor_fasciae_latae__r': 'Thigh_r',
    # Glutes — Pelvis
    'gluteus__l': 'Pelvis',
    'gluteus__r': 'Pelvis',
    'piriformis__l': 'Pelvis',
    'piriformis__r': 'Pelvis',
    # Calf — Shin
    'gastrocnemius__l': 'Shin_l',
    'gastrocnemius__r': 'Shin_r',
    'soleus__l': 'Shin_l',
    'soleus__r': 'Shin_r',
    'tibialis__l': 'Shin_l',
    'tibialis__r': 'Shin_r',
    'fibularis__l': 'Shin_l',
    'fibularis__r': 'Shin_r',
    'peroneus__l': 'Shin_l',
    'peroneus__r': 'Shin_r',
    # Abdomen — Spine_L3 (rough center of the lumbar spine)
    'rectus_abdominis': 'Spine_L3',
    'external_abdominal_oblique__l': 'Spine_L2',
    'external_abdominal_oblique__r': 'Spine_L2',
    'internal_abdominal_oblique__l': 'Spine_L2',
    'internal_abdominal_oblique__r': 'Spine_L2',
    'transversus_abdominis': 'Spine_L3',
    # Back — Spine_T7 / Spine_L1 depending on which part
    'latissimus_dorsi__l': 'Spine_T9',
    'latissimus_dorsi__r': 'Spine_T9',
    'longissimus_thoracis__l': 'Spine_T7',
    'longissimus_thoracis__r': 'Spine_T7',
    'longissimus_lumborum__l': 'Spine_L3',
    'longissimus_lumborum__r': 'Spine_L3',
    'iliocostalis_thoracis': 'Spine_T9',
    'iliocostalis_lumborum': 'Spine_L3',
    'spinalis_thoracis': 'Spine_T7',
    'multifidus_thoracis': 'Spine_T9',
    'multifidus_lumborum': 'Spine_L3',
    'quadratus_lumborum__l': 'Spine_L3',
    'quadratus_lumborum__r': 'Spine_L3',
    # Chest — Spine_T3 (roughly the manubrium level)
    'pectoralis_major__l': 'Spine_T3',
    'pectoralis_major__r': 'Spine_T3',
    'pectoralis_minor__l': 'Spine_T3',
    'pectoralis_minor__r': 'Spine_T3',
    # Upper back / scapular — Scapula
    'trapezius__l': 'Scapula_l',
    'trapezius__r': 'Scapula_r',
    'rhomboid__l': 'Scapula_l',
    'rhomboid__r': 'Scapula_r',
    'serratus_anterior__l': 'Scapula_l',
    'serratus_anterior__r': 'Scapula_r',
    'infraspinatus__l': 'Scapula_l',
    'infraspinatus__r': 'Scapula_r',
    'supraspinatus__l': 'Scapula_l',
    'supraspinatus__r': 'Scapula_r',
    'subscapularis__l': 'Scapula_l',
    'subscapularis__r': 'Scapula_r',
    'teres__l': 'Scapula_l',
    'teres__r': 'Scapula_r',
    # Neck — Neck_C4 (rough mid-cervical)
    'sternocleidomastoid__l': 'Neck_C4',
    'sternocleidomastoid__r': 'Neck_C4',
    'scalene__l': 'Neck_C4',
    'scalene__r': 'Neck_C4',
    # Hip flexors — Spine_L3 (psoas originates from lumbar)
    'psoas__l': 'Spine_L3',
    'psoas__r': 'Spine_L3',
    'iliacus__l': 'Pelvis',
    'iliacus__r': 'Pelvis',
}

# ============================================================
# BONE MESHES — bone meshes (skull, vertebrae, ribs, etc.) get bound
# to their corresponding armature bone by name pattern.
# ============================================================
BONE_PATTERNS = [
    # Pelvis & sacrum
    ('hip_bone', 'Pelvis'),
    ('pelvic', 'Pelvis'),
    ('sacrum', 'Sacrum'),
    ('coccyx', 'Coccyx'),
    # Spine
    ('first_lumbar', 'Spine_L1'),
    ('second_lumbar', 'Spine_L2'),
    ('third_lumbar', 'Spine_L3'),
    ('fourth_lumbar', 'Spine_L4'),
    ('fifth_lumbar', 'Spine_L5'),
    # Thoracic — vertebrae T1-T12
    ('first_thoracic', 'Spine_T1'),
    ('second_thoracic', 'Spine_T2'),
    ('third_thoracic', 'Spine_T3'),
    ('fourth_thoracic', 'Spine_T4'),
    ('fifth_thoracic', 'Spine_T5'),
    ('sixth_thoracic', 'Spine_T6'),
    ('seventh_thoracic', 'Spine_T7'),
    ('eighth_thoracic', 'Spine_T8'),
    ('ninth_thoracic', 'Spine_T9'),
    ('tenth_thoracic', 'Spine_T10'),
    ('eleventh_thoracic', 'Spine_T11'),
    ('twelfth_thoracic', 'Spine_T12'),
    # Ribs — bind each rib to its corresponding thoracic vertebra
    ('first_rib', 'Spine_T1'),
    ('second_rib', 'Spine_T2'),
    ('third_rib', 'Spine_T3'),
    ('fourth_rib', 'Spine_T4'),
    ('fifth_rib', 'Spine_T5'),
    ('sixth_rib', 'Spine_T6'),
    ('seventh_rib', 'Spine_T7'),
    ('eighth_rib', 'Spine_T8'),
    ('ninth_rib', 'Spine_T9'),
    ('tenth_rib', 'Spine_T10'),
    ('eleventh_rib', 'Spine_T11'),
    ('twelfth_rib', 'Spine_T12'),
    ('sternum', 'Spine_T4'),
    ('costal_cartilage', 'Spine_T6'),
    # Cervical
    ('atlas', 'Neck_C1_Atlas'),
    ('axis', 'Neck_C2_Axis'),
    ('third_cervical', 'Neck_C3'),
    ('fourth_cervical', 'Neck_C4'),
    ('fifth_cervical', 'Neck_C5'),
    ('sixth_cervical', 'Neck_C6'),
    ('seventh_cervical', 'Neck_C7'),
    # Skull
    ('skull', 'Head'),
    ('cranium', 'Head'),
    ('frontal_bone', 'Head'),
    ('parietal', 'Head'),
    ('occipital', 'Head'),
    ('temporal', 'Head'),
    ('mandible', 'Mandible'),
    ('maxilla', 'Head'),
    ('hyoid', 'Neck_C4'),
    ('teeth', 'Head'),
    ('tongue', 'Head'),
    # Upper limb
    ('clavicle__l', 'Clavicle_l'),
    ('clavicle__r', 'Clavicle_r'),
    ('scapula__l', 'Scapula_l'),
    ('scapula__r', 'Scapula_r'),
    ('humerus__l', 'UpperArm_l'),
    ('humerus__r', 'UpperArm_r'),
    ('radius__l', 'Forearm_l'),
    ('radius__r', 'Forearm_r'),
    ('ulna__l', 'Forearm_l'),
    ('ulna__r', 'Forearm_r'),
    # Hand bones — bind to Hand
    ('carpal__l', 'Hand_l'),
    ('carpal__r', 'Hand_r'),
    ('scaphoid__l', 'Hand_l'),
    ('scaphoid__r', 'Hand_r'),
    ('lunate__l', 'Hand_l'),
    ('lunate__r', 'Hand_r'),
    ('triquetral__l', 'Hand_l'),
    ('triquetral__r', 'Hand_r'),
    ('pisiform__l', 'Hand_l'),
    ('pisiform__r', 'Hand_r'),
    ('trapezium__l', 'Hand_l'),
    ('trapezium__r', 'Hand_r'),
    ('trapezoid_bone__l', 'Hand_l'),
    ('trapezoid_bone__r', 'Hand_r'),
    ('capitate__l', 'Hand_l'),
    ('capitate__r', 'Hand_r'),
    ('hamate__l', 'Hand_l'),
    ('hamate__r', 'Hand_r'),
    ('metacarpal__l', 'Hand_l'),
    ('metacarpal__r', 'Hand_r'),
    ('phalanx__l', 'Hand_l'),
    ('phalanx__r', 'Hand_r'),
    ('finger__l', 'Hand_l'),
    ('finger__r', 'Hand_r'),
    # Lower limb
    ('femur__l', 'Thigh_l'),
    ('femur__r', 'Thigh_r'),
    ('patella__l', 'Thigh_l'),
    ('patella__r', 'Thigh_r'),
    ('tibia__l', 'Shin_l'),
    ('tibia__r', 'Shin_r'),
    ('fibula__l', 'Shin_l'),
    ('fibula__r', 'Shin_r'),
    # Foot — bind to Foot
    ('calcaneus__l', 'Foot_l'),
    ('calcaneus__r', 'Foot_r'),
    ('talus__l', 'Foot_l'),
    ('talus__r', 'Foot_r'),
    ('navicular__l', 'Foot_l'),
    ('navicular__r', 'Foot_r'),
    ('cuboid__l', 'Foot_l'),
    ('cuboid__r', 'Foot_r'),
    ('cuneiform__l', 'Foot_l'),
    ('cuneiform__r', 'Foot_r'),
    ('metatarsal__l', 'Foot_l'),
    ('metatarsal__r', 'Foot_r'),
    ('tarsal__l', 'Foot_l'),
    ('tarsal__r', 'Foot_r'),
    ('phalanx_of_foot__l', 'Foot_l'),
    ('phalanx_of_foot__r', 'Foot_r'),
    ('toe__l', 'Foot_l'),
    ('toe__r', 'Foot_r'),
]


def find_bone_for_mesh(mesh_name: str, armature_bones: list[str]) -> str | None:
    """
    Return the armature bone this mesh should be weighted to.
    Tries overrides first, then bone-pattern matching, then None
    (caller falls back to nearest-bone-by-distance).
    """
    name_lower = mesh_name.lower()
    # Side-suffix-aware: 'rectus_femoris_l' should match 'rectus_femoris__l'
    side_l = name_lower.endswith('_l') or '_l_' in name_lower
    side_r = name_lower.endswith('_r') or '_r_' in name_lower

    if name_lower.startswith('muscle_'):
        slug = name_lower[len('muscle_'):]
        for key, bone in MUSCLE_OVERRIDES.items():
            if '__l' in key and not side_l:
                continue
            if '__r' in key and not side_r:
                continue
            substr = key.replace('__l', '').replace('__r', '')
            if substr in slug:
                return bone if bone in armature_bones else None

    if name_lower.startswith('bone_'):
        slug = name_lower[len('bone_'):]
        for pattern, bone in BONE_PATTERNS:
            if '__l' in pattern and not side_l:
                continue
            if '__r' in pattern and not side_r:
                continue
            substr = pattern.replace('__l', '').replace('__r', '')
            if substr in slug:
                return bone if bone in armature_bones else None

    return None


def nearest_bone(mesh_centroid: mathutils.Vector, armature_obj, bones: list[str]) -> str:
    """Fallback: find the armature bone whose head is closest to the mesh centroid."""
    best_bone = None
    best_dist = float('inf')
    for bone_name in bones:
        bone = armature_obj.data.bones.get(bone_name)
        if bone is None:
            continue
        # head position in world space
        head = armature_obj.matrix_world @ bone.head_local
        d = (mesh_centroid - head).length
        if d < best_dist:
            best_dist = d
            best_bone = bone_name
    return best_bone


def main():
    # Start clean
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # ============ Load skeleton armature ============
    bpy.ops.import_scene.gltf(filepath=str(SKELETON_PATH))

    # Find the armature
    armature_obj = None
    for obj in bpy.data.objects:
        if obj.type == 'ARMATURE':
            armature_obj = obj
            break

    if armature_obj is None:
        print("ERROR: No armature in skeleton.glb — can't proceed")
        return 1

    bones = [b.name for b in armature_obj.data.bones]
    print(f"Found armature '{armature_obj.name}' with {len(bones)} bones")

    # Remove the skeleton's mesh objects — we only want its armature
    # (the body's meshes will replace them)
    skeleton_meshes_removed = 0
    for obj in list(bpy.data.objects):
        if obj.type == 'MESH':
            bpy.data.objects.remove(obj, do_unlink=True)
            skeleton_meshes_removed += 1
    print(f"Removed {skeleton_meshes_removed} skeleton meshes (keeping armature only)")

    # ============ Load body ============
    bpy.ops.import_scene.gltf(filepath=str(BODY_PATH))

    body_meshes = [obj for obj in bpy.data.objects if obj.type == 'MESH']
    print(f"Loaded {len(body_meshes)} body meshes")

    # ============ Parent meshes to armature ============
    # Use Blender's automatic weighting (Parent with Automatic Weights).
    # This computes vertex weights based on bone-envelope falloff —
    # vertices near a bone get weighted to it, with smooth transitions
    # between bones. Far better than rigid binding for muscles that
    # cross joints.

    print("Parenting meshes to armature with automatic weights…")

    # Deselect all
    bpy.ops.object.select_all(action='DESELECT')

    # Select all body meshes
    valid_meshes = [m for m in body_meshes if m.data and len(m.data.vertices) > 0]
    for m in valid_meshes:
        m.select_set(True)
    # Make the armature the active object (parent target)
    armature_obj.select_set(True)
    bpy.context.view_layer.objects.active = armature_obj

    # Parent with automatic weights — Blender computes vertex weights
    # by distance-from-bone falloff. This handles multi-joint muscles
    # correctly by blending weights across the bones the mesh spans.
    try:
        bpy.ops.object.parent_set(type='ARMATURE_AUTO')
        print(f"  Auto-weighted {len(valid_meshes)} meshes")
    except RuntimeError as e:
        print(f"  parent_set failed: {e}")
        print("  Falling back to rigid binding…")
        return 1

    stats = {'override': 0, 'pattern': 0, 'nearest': 0, 'empty': len(body_meshes) - len(valid_meshes), 'failed': 0, 'auto': len(valid_meshes)}
    assignments: dict[str, list[str]] = {}

    for mesh in valid_meshes:
        # The auto-weighting put weights on several vertex groups per mesh.
        # For reporting purposes, find the bone with the highest total
        # weight (the "dominant" bone for that mesh).
        total_weights: dict[str, float] = {}
        for vg in mesh.vertex_groups:
            total = 0.0
            for v in mesh.data.vertices:
                for g in v.groups:
                    if g.group == vg.index:
                        total += g.weight
                        break
            total_weights[vg.name] = total
        if total_weights:
            dominant = max(total_weights.items(), key=lambda kv: kv[1])[0]
            assignments.setdefault(dominant, []).append(mesh.name)

    # ============ Report ============
    print("\n=== BINDING REPORT ===")
    print(f"Total body meshes: {len(body_meshes)}")
    print(f"  Auto-weighted: {stats['auto']}")
    print(f"  Skipped (empty mesh): {stats['empty']}")
    print()
    print("Dominant bone per mesh (most-weighted vertex group):")
    for bone_name in sorted(assignments.keys()):
        meshes = assignments[bone_name]
        sample = ', '.join(meshes[:3])
        more = f' (+{len(meshes)-3} more)' if len(meshes) > 3 else ''
        print(f"  {bone_name:25s}: {len(meshes):3d} meshes  [{sample}{more}]")

    # ============ Export ============
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
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
