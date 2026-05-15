"""
Auto-rig the anatomical body — version 2.

The v1 script ran into the misalignment problem: the skeleton's
armature bones are positioned at the skeleton's bone-meshes (femur,
calcaneus, etc.), but the body's muscle/skin meshes don't lie on top
of those positions. Auto-weighting by bone distance therefore assigns
weights wrong (inner thigh muscle gets bound to clavicle bone, etc.).

v2 fixes this by REBUILDING THE ARMATURE using the body's own
mesh centroids as anchor points. The new bones are positioned
anatomically inside the body, so auto-weighting now sees a properly
embedded skeleton.

PIPELINE:
  1. Load body.glb (305 named meshes).
  2. Compute world-space centroids for each anatomical landmark
     by averaging the centroids of the meshes that belong to that
     region (e.g. "pelvis-center" = average of hip_bone_l + hip_bone_r +
     sacrum centroids).
  3. Build a new armature with 45 bones at the right anatomical
     positions, using the same bone names as the original armature
     so existing pose-angles.ts data still works.
  4. Parent every body mesh to the new armature with automatic weights.
  5. Export as body_rigged.glb.

USAGE:
  blender --background --python scripts/rig_body_v2.py

OUTPUT:
  public/models/body_rigged.glb
"""

import bpy
import mathutils
from pathlib import Path

PROJECT_ROOT = Path('/Users/williammushkin/projects/active/brain-atlas')
BODY_PATH = PROJECT_ROOT / 'public' / 'models' / 'body.glb'
OUTPUT_PATH = PROJECT_ROOT / 'public' / 'models' / 'body_rigged.glb'


def centroid_of(mesh_obj) -> mathutils.Vector:
    """World-space centroid of a mesh's vertices."""
    if mesh_obj.data is None or len(mesh_obj.data.vertices) == 0:
        return None
    local = sum((v.co for v in mesh_obj.data.vertices), mathutils.Vector()) / len(mesh_obj.data.vertices)
    return mesh_obj.matrix_world @ local


def average_centroids(centroids: list[mathutils.Vector]) -> mathutils.Vector:
    """Average of a list of centroids (any None entries skipped)."""
    pts = [c for c in centroids if c is not None]
    if not pts:
        return None
    return sum(pts, mathutils.Vector()) / len(pts)


def find_meshes(name_substrs: list[str], all_meshes: list, requires_all: bool = False):
    """Find meshes whose name contains all (or any) of the given substrings."""
    out = []
    for m in all_meshes:
        n = m.name.lower()
        matches = [s in n for s in name_substrs]
        if requires_all and all(matches):
            out.append(m)
        elif not requires_all and any(matches):
            out.append(m)
    return out


def find_meshes_side(name_substr: str, side: str, all_meshes: list):
    """Find meshes with substring AND a specific side (_l or _r) suffix."""
    out = []
    suffix = f'_{side}'
    for m in all_meshes:
        n = m.name.lower()
        if name_substr in n and (n.endswith(suffix) or f'{suffix}_' in n):
            out.append(m)
    return out


def main():
    # Start clean
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # ============ Load body ============
    bpy.ops.import_scene.gltf(filepath=str(BODY_PATH))
    body_meshes = [obj for obj in bpy.data.objects if obj.type == 'MESH']
    valid_meshes = [m for m in body_meshes if m.data and len(m.data.vertices) > 0]
    print(f"Loaded {len(valid_meshes)} body meshes (skipped {len(body_meshes) - len(valid_meshes)} empty)")

    # ============ Compute anatomical anchor positions ============
    # For each region, find the meshes that define it and take their
    # centroid. These become the positions of the armature bones.

    print("\nComputing anatomical anchor positions…")

    def anchor(label, mesh_substrs, side=None):
        """Compute a centroid from a set of body meshes."""
        ms = []
        for s in mesh_substrs:
            if side:
                ms.extend(find_meshes_side(s, side, valid_meshes))
            else:
                for m in valid_meshes:
                    if s in m.name.lower():
                        ms.append(m)
        # Deduplicate
        ms = list({m.name: m for m in ms}.values())
        if not ms:
            print(f"  WARN: no meshes for {label}")
            return None
        c = average_centroids([centroid_of(m) for m in ms])
        print(f"  {label:20s} = {c.x:.2f}, {c.y:.2f}, {c.z:.2f}  ({len(ms)} meshes)")
        return c

    # ---------- Lower body anchors ----------
    pelvis_center = anchor('pelvis-center', ['hip_bone', 'sacrum'])
    hip_l = anchor('hip-l (greater trochanter)', ['hip_bone_l'])
    hip_r = anchor('hip-r', ['hip_bone_r'])

    knee_l = anchor('knee-l (top of tibia)', ['tibia_l', 'patella_l'])
    knee_r = anchor('knee-r', ['tibia_r', 'patella_r'])

    ankle_l = anchor('ankle-l (talus)', ['talus_l', 'calcaneus_l'])
    ankle_r = anchor('ankle-r', ['talus_r', 'calcaneus_r'])

    # Foot — metatarsals are named like "first_metatarsal_bone_l"
    foot_l = anchor('foot-l (forefoot)', ['metatarsal_bone_l'])
    foot_r = anchor('foot-r', ['metatarsal_bone_r'])

    # ---------- Spine anchors (one per vertebra) ----------
    # Naming convention: bone_vertebra_l1, bone_vertebra_t1, bone_vertebra_c3
    # IMPORTANT: substring match alone fails because "vertebra_t1" is a
    # substring of "vertebra_t10". We require an EXACT name match here.
    def vertebra_anchor(vertebra: str):
        name = f'bone_vertebra_{vertebra.lower()}'
        for m in valid_meshes:
            if m.name.lower() == name:
                c = centroid_of(m)
                if c:
                    print(f'  spine-{vertebra:5s}  = {c.x:.2f}, {c.y:.2f}, {c.z:.2f}  (exact match)')
                return c
        print(f'  spine-{vertebra:5s}  = NOT FOUND ({name})')
        return None

    vertebra_anchors = {}
    for vertebra in ['L1', 'L2', 'L3', 'L4', 'L5',
                     'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
                     'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
                     'C3', 'C4', 'C5', 'C6', 'C7']:
        c = vertebra_anchor(vertebra)
        if c is not None:
            vertebra_anchors[vertebra] = c

    head_center = anchor('head-center', ['skull_l', 'skull_r', 'frontal_bone', 'occipital_bone'])
    if not head_center:
        # Fallback: any bone named with "skull" or "cranium"
        head_center = anchor('head-center (fallback)', ['skull', 'cranium'])
    head_top = mathutils.Vector((head_center.x, head_center.y + 0.15, head_center.z)) if head_center else None
    mandible = anchor('mandible', ['mandible'])

    # ---------- Upper body anchors ----------
    clav_l = anchor('clavicle-l', ['clavicle_l'])
    clav_r = anchor('clavicle-r', ['clavicle_r'])
    scapula_l = anchor('scapula-l', ['scapula_l'])
    scapula_r = anchor('scapula-r', ['scapula_r'])

    # Shoulder = at the head of the humerus (where it meets the scapula)
    shoulder_l = anchor('shoulder-l (humerus head)', ['humerus_l'])
    shoulder_r = anchor('shoulder-r', ['humerus_r'])

    # Elbow = where humerus meets radius/ulna (radial head)
    elbow_l = anchor('elbow-l', ['radius_l', 'ulna_l'])
    elbow_r = anchor('elbow-r', ['radius_r', 'ulna_r'])

    # Wrist = the carpal bones (named "scaphoid_bone_l", "lunate_bone_l", etc.)
    wrist_l = anchor('wrist-l', ['scaphoid_bone_l', 'lunate_bone_l', 'capitate_bone_l'])
    wrist_r = anchor('wrist-r', ['scaphoid_bone_r', 'lunate_bone_r', 'capitate_bone_r'])

    # Hand = the metacarpals
    hand_l = anchor('hand-l', ['metacarpal_bone_l'])
    hand_r = anchor('hand-r', ['metacarpal_bone_r'])

    # ============ Build the new armature ============
    print("\nBuilding new armature with anatomically-positioned bones…")

    # Create armature data and object
    armature_data = bpy.data.armatures.new('BodyArmature')
    armature_obj = bpy.data.objects.new('BodyArmature', armature_data)
    bpy.context.collection.objects.link(armature_obj)

    # Enter edit mode to add bones
    bpy.context.view_layer.objects.active = armature_obj
    bpy.ops.object.mode_set(mode='EDIT')

    bones_created = []

    def make_bone(name: str, head: mathutils.Vector, tail: mathutils.Vector, parent: str = None):
        """Create an edit bone at the given head/tail world positions."""
        if head is None or tail is None:
            print(f"  SKIP {name}: no head/tail anchor")
            return None
        b = armature_data.edit_bones.new(name)
        b.head = head
        b.tail = tail
        if parent:
            parent_bone = armature_data.edit_bones.get(parent)
            if parent_bone:
                b.parent = parent_bone
                # Don't auto-connect — let the bones have their own positions
                b.use_connect = False
        bones_created.append(name)
        return b

    # Spine — chain pelvis up through neck. Tail of each vertebra = head of the next.
    make_bone('Pelvis', pelvis_center,
              vertebra_anchors.get('L5', pelvis_center + mathutils.Vector((0, 0.1, 0))))

    spine_order = ['L5', 'L4', 'L3', 'L2', 'L1',
                   'T12', 'T11', 'T10', 'T9', 'T8', 'T7', 'T6', 'T5', 'T4', 'T3', 'T2', 'T1']
    parent = 'Pelvis'
    for i, v in enumerate(spine_order):
        if v not in vertebra_anchors:
            continue
        head = vertebra_anchors[v]
        # Tail = position of the next vertebra (or top of T1 → C7)
        if i + 1 < len(spine_order) and spine_order[i + 1] in vertebra_anchors:
            tail = vertebra_anchors[spine_order[i + 1]]
        elif v == 'T1' and 'C7' in vertebra_anchors:
            tail = vertebra_anchors['C7']
        else:
            tail = head + mathutils.Vector((0, 0.03, 0))
        make_bone(f'Spine_{v}', head, tail, parent)
        parent = f'Spine_{v}'

    # Cervical (similar chain from T1 up)
    cervical_order = ['C7', 'C6', 'C5', 'C4', 'C3']
    parent = 'Spine_T1' if 'Spine_T1' in bones_created else 'Pelvis'
    for i, v in enumerate(cervical_order):
        if v not in vertebra_anchors:
            continue
        head = vertebra_anchors[v]
        if i + 1 < len(cervical_order) and cervical_order[i + 1] in vertebra_anchors:
            tail = vertebra_anchors[cervical_order[i + 1]]
        elif v == 'C3' and 'C2' in vertebra_anchors:
            tail = vertebra_anchors['C2']
        else:
            tail = head + mathutils.Vector((0, 0.02, 0))
        make_bone(f'Neck_{v}', head, tail, parent)
        parent = f'Neck_{v}'

    # C1, C2 — special names matching the original armature
    if 'C2' in vertebra_anchors:
        head = vertebra_anchors['C2']
        tail = vertebra_anchors.get('C1', head + mathutils.Vector((0, 0.02, 0)))
        make_bone('Neck_C2_Axis', head, tail, parent='Neck_C3' if 'Neck_C3' in bones_created else 'Spine_T1')

    if 'C1' in vertebra_anchors:
        head = vertebra_anchors['C1']
        tail = head_center if head_center else head + mathutils.Vector((0, 0.05, 0))
        make_bone('Neck_C1_Atlas', head, tail, parent='Neck_C2_Axis' if 'Neck_C2_Axis' in bones_created else 'Neck_C3')

    # Head + mandible
    if head_center:
        head_tail = head_top if head_top else head_center + mathutils.Vector((0, 0.1, 0))
        make_bone('Head', head_center, head_tail,
                  parent='Neck_C1_Atlas' if 'Neck_C1_Atlas' in bones_created else 'Neck_C3')
    if mandible:
        mandible_tail = mandible + mathutils.Vector((0, -0.03, 0.03))
        make_bone('Mandible', mandible, mandible_tail, parent='Head' if 'Head' in bones_created else None)

    # Sacrum + Coccyx (chained from Pelvis tail-ish)
    sacrum_c = anchor('sacrum', ['sacrum'])
    coccyx_c = anchor('coccyx', ['coccyx'])
    if sacrum_c:
        make_bone('Sacrum', sacrum_c,
                  sacrum_c + mathutils.Vector((0, -0.05, 0)), 'Pelvis')
    if coccyx_c:
        make_bone('Coccyx', coccyx_c,
                  coccyx_c + mathutils.Vector((0, -0.03, 0)),
                  'Sacrum' if 'Sacrum' in bones_created else 'Pelvis')

    # Arms — Clavicle, Scapula, UpperArm, Forearm, Hand chain
    for side, clav, scap, sh, el, wr, hd in [
        ('l', clav_l, scapula_l, shoulder_l, elbow_l, wrist_l, hand_l),
        ('r', clav_r, scapula_r, shoulder_r, elbow_r, wrist_r, hand_r),
    ]:
        spine_t1 = 'Spine_T1' if 'Spine_T1' in bones_created else 'Pelvis'
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

    # Legs — Thigh, Shin, Foot chain
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

    # Exit edit mode
    bpy.ops.object.mode_set(mode='OBJECT')

    # ============ Parent meshes to new armature with auto weights ============
    print("\nApplying automatic weights…")
    bpy.ops.object.select_all(action='DESELECT')
    for m in valid_meshes:
        m.select_set(True)
    armature_obj.select_set(True)
    bpy.context.view_layer.objects.active = armature_obj

    try:
        bpy.ops.object.parent_set(type='ARMATURE_AUTO')
        print(f"  Auto-weighted {len(valid_meshes)} meshes against {len(bones_created)} bones")
    except RuntimeError as e:
        print(f"  ERROR: parent_set failed: {e}")
        return 1

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
