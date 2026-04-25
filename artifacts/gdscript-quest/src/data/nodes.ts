// Godot Node library — beginner-friendly, categorized.
// Format matches: { name, category, description, use_case, example, visual_hint }

export type NodeCategoryId =
  | "base"
  | "2d"
  | "ui"
  | "3d"
  | "audio"
  | "anim"
  | "logic"
  | "nav"
  | "special";

export interface NodeDoc {
  name: string;
  category: NodeCategoryId;
  description: string; // 1–2 lines
  use_case: string; // where it is used
  example: string; // tiny GDScript snippet
  visual_hint: string; // what to show visually in the app
  important?: boolean; // beginner-focus badge
  where_used?: string[]; // optional game examples
  parent?: string; // simple inheritance hint
}

export interface NodeCategory {
  id: NodeCategoryId;
  title: string;
  description: string;
  // Sorted in roughly the order a beginner should meet them.
  nodes: NodeDoc[];
}

export const nodeCategories: NodeCategory[] = [
  // -----------------------------------------------------------------
  // BASE NODES
  // -----------------------------------------------------------------
  {
    id: "base",
    title: "Base Nodes",
    description: "The starting point — every other node builds on these.",
    nodes: [
      {
        name: "Node",
        category: "base",
        description:
          "The base of every Godot node. Plain container with no position.",
        use_case:
          "Scene roots that don't need a position, group holders, script-only logic.",
        example: `extends Node\n\nfunc _ready():\n    print("Game started")`,
        visual_hint:
          "A simple gray box icon at the top of a tree — the root of everything.",
      },
      {
        name: "Node2D",
        category: "base",
        description:
          "Adds a 2D position, rotation, and scale to a node.",
        use_case: "Anything that lives in a 2D world but isn't a sprite.",
        example: `extends Node2D\n\nfunc _ready():\n    position = Vector2(100, 50)`,
        visual_hint:
          "A small orange circle with X/Y axes — placed somewhere on the screen.",
        parent: "Node",
      },
    ],
  },

  // -----------------------------------------------------------------
  // 2D NODES
  // -----------------------------------------------------------------
  {
    id: "2d",
    title: "2D Nodes",
    description: "Used for 2D games like platformers, top-downs, and arcade.",
    nodes: [
      {
        name: "CharacterBody2D",
        category: "2d",
        description:
          "A 2D body you move with code — perfect for players and enemies.",
        use_case: "Platformer player, top-down hero, walking enemies.",
        example: `extends CharacterBody2D\n\nfunc _physics_process(delta):\n    velocity.x = 100\n    move_and_slide()`,
        visual_hint:
          "A small character sprite walking right across the screen.",
        important: true,
        where_used: ["Platformer player", "Patrolling enemy", "NPC"],
        parent: "Node2D",
      },
      {
        name: "Sprite2D",
        category: "2d",
        description: "Shows a 2D image (texture) on screen.",
        use_case: "Player look, enemy art, background pieces, items.",
        example: `extends Sprite2D\n\nfunc _ready():\n    texture = preload("res://player.png")`,
        visual_hint:
          "A still image — like a hero portrait — pinned in the level.",
        important: true,
        where_used: ["Coin icon", "Tree decoration", "HUD icon"],
        parent: "Node2D",
      },
      {
        name: "CollisionShape2D",
        category: "2d",
        description:
          "Gives a body or area a shape so the engine knows when things touch.",
        use_case:
          "Add as a child of CharacterBody2D, Area2D, or RigidBody2D.",
        example: `# In code:\n$CollisionShape2D.disabled = true`,
        visual_hint:
          "A blue dashed outline (rectangle or circle) around a sprite.",
        important: true,
        where_used: ["Player hitbox", "Coin pickup zone", "Wall blocker"],
        parent: "Node2D",
      },
      {
        name: "Area2D",
        category: "2d",
        description:
          "Detects when other bodies enter or leave a region — no physics push.",
        use_case: "Coins, checkpoints, damage zones, triggers.",
        example: `extends Area2D\n\nfunc _on_body_entered(body):\n    print("touched: ", body.name)`,
        visual_hint:
          "A glowing green zone — when the player walks into it, it flashes.",
        important: true,
        where_used: ["Coin pickup", "Lava damage zone", "Door trigger"],
        parent: "Node2D",
      },
      {
        name: "Camera2D",
        category: "2d",
        description:
          "Decides what part of the 2D world the player sees.",
        use_case: "Drop it as a child of the player to follow them around.",
        example: `extends Camera2D\n\nfunc _ready():\n    make_current()`,
        visual_hint:
          "A camera frame that smoothly follows the player as they move.",
        important: true,
        where_used: ["Side-scroller follow cam", "Boss zoom-in"],
        parent: "Node2D",
      },
      {
        name: "TileMap",
        category: "2d",
        description:
          "Paints a level out of small repeating tiles instead of single sprites.",
        use_case: "Platformer terrain, top-down dungeons, pixel-art worlds.",
        example: `extends TileMap\n\nfunc _ready():\n    set_cell(0, Vector2i(2, 5), 0, Vector2i(0, 0))`,
        visual_hint:
          "A grid of green grass and brown dirt tiles forming a level.",
        important: true,
        where_used: ["Mario-style ground", "Dungeon walls", "Background"],
        parent: "Node2D",
      },
      {
        name: "RigidBody2D",
        category: "2d",
        description:
          "A 2D body fully driven by physics — gravity, mass, and collisions.",
        use_case:
          "Crates, barrels, bouncy balls — anything that should fall and tumble.",
        example: `extends RigidBody2D\n\nfunc _ready():\n    apply_impulse(Vector2(0, -300))`,
        visual_hint:
          "A wooden crate falling, hitting the ground, and bouncing once.",
        where_used: ["Falling rocks", "Stack of crates", "Pinball"],
        parent: "Node2D",
      },
      {
        name: "StaticBody2D",
        category: "2d",
        description:
          "A solid 2D body that never moves — perfect for floors and walls.",
        use_case: "Ground, platforms, walls, ceilings.",
        example: `extends StaticBody2D\n\n# Just add a CollisionShape2D child in the editor.`,
        visual_hint:
          "A grey platform sitting still while the player walks on top.",
        where_used: ["Ground tiles", "Solid walls", "Pillars"],
        parent: "Node2D",
      },
    ],
  },

  // -----------------------------------------------------------------
  // UI NODES
  // -----------------------------------------------------------------
  {
    id: "ui",
    title: "UI Nodes",
    description: "Buttons, labels, panels — everything the player taps or reads.",
    nodes: [
      {
        name: "Control",
        category: "ui",
        description:
          "The base node for all UI — buttons, panels, labels live inside it.",
        use_case: "Menus, HUDs, dialogs, anything with anchors and margins.",
        example: `extends Control\n\nfunc _ready():\n    custom_minimum_size = Vector2(200, 80)`,
        visual_hint:
          "A transparent rectangle that anchors UI to a screen corner.",
        important: true,
        parent: "Node",
      },
      {
        name: "Button",
        category: "ui",
        description:
          "A clickable UI button that emits a 'pressed' signal.",
        use_case: "Start game, pause menu, level select, retry button.",
        example: `extends Button\n\nfunc _ready():\n    pressed.connect(_on_pressed)\n\nfunc _on_pressed():\n    print("clicked!")`,
        visual_hint:
          "A rounded button labelled 'Play' that highlights when tapped.",
        important: true,
        where_used: ["Main menu", "Pause panel", "Inventory slots"],
        parent: "Control",
      },
      {
        name: "Label",
        category: "ui",
        description:
          "Shows plain text on screen — score, lives, dialog lines.",
        use_case: "Score display, level title, tutorial hints.",
        example: `extends Label\n\nfunc _ready():\n    text = "Score: 0"`,
        visual_hint:
          "Large white text reading 'Score: 1200' in the top corner.",
        important: true,
        where_used: ["Score HUD", "Dialog box", "Game Over banner"],
        parent: "Control",
      },
      {
        name: "ProgressBar",
        category: "ui",
        description:
          "Shows a value between min and max as a filling bar.",
        use_case: "Health bar, mana bar, loading screen.",
        example: `extends ProgressBar\n\nfunc set_health(v: int):\n    value = v`,
        visual_hint:
          "A red bar that shrinks from full to empty as the player takes damage.",
        important: true,
        where_used: ["Health bar", "XP bar", "Boss HP"],
        parent: "Control",
      },
      {
        name: "TextureRect",
        category: "ui",
        description:
          "Shows an image inside the UI — like an icon or portrait.",
        use_case: "Inventory icons, dialog avatars, achievement badges.",
        example: `extends TextureRect\n\nfunc _ready():\n    texture = preload("res://heart.png")`,
        visual_hint:
          "A small heart icon next to the health bar.",
        where_used: ["Inventory icon", "HUD heart", "Avatar"],
        parent: "Control",
      },
      {
        name: "VBoxContainer",
        category: "ui",
        description:
          "Stacks its children vertically with even spacing.",
        use_case: "Menu lists, settings rows, quest log.",
        example: `# In editor: drop Buttons inside a VBoxContainer\n# In code:\n$VBoxContainer.add_child(Button.new())`,
        visual_hint: "Three buttons — Play, Settings, Quit — neatly stacked.",
        where_used: ["Main menu list", "Settings page"],
        parent: "Control",
      },
    ],
  },

  // -----------------------------------------------------------------
  // 3D NODES (basic)
  // -----------------------------------------------------------------
  {
    id: "3d",
    title: "3D Nodes",
    description: "The basics — just enough to start a simple 3D scene.",
    nodes: [
      {
        name: "Node3D",
        category: "3d",
        description:
          "Adds a 3D position, rotation, and scale — the 3D version of Node2D.",
        use_case: "Any object that lives in 3D space.",
        example: `extends Node3D\n\nfunc _ready():\n    position = Vector3(0, 1, 0)`,
        visual_hint: "A tiny gizmo with X/Y/Z arrows in 3D space.",
        parent: "Node",
      },
      {
        name: "MeshInstance3D",
        category: "3d",
        description:
          "Renders a 3D mesh (cube, sphere, custom model) on screen.",
        use_case: "Show any 3D model you import or build.",
        example: `extends MeshInstance3D\n\nfunc _ready():\n    mesh = BoxMesh.new()`,
        visual_hint: "A simple grey cube floating in 3D space.",
        parent: "Node3D",
      },
      {
        name: "CharacterBody3D",
        category: "3d",
        description:
          "A 3D body you move with code — like CharacterBody2D, but in 3D.",
        use_case: "First-person players, third-person heroes, NPCs.",
        example: `extends CharacterBody3D\n\nfunc _physics_process(delta):\n    velocity.z = -2\n    move_and_slide()`,
        visual_hint: "A capsule shape walking forward in a 3D world.",
        parent: "Node3D",
      },
      {
        name: "Camera3D",
        category: "3d",
        description:
          "The 3D camera that decides what the player sees.",
        use_case: "First-person view, third-person follow cam, cutscenes.",
        example: `extends Camera3D\n\nfunc _ready():\n    current = true`,
        visual_hint: "A camera lens looking down a 3D corridor.",
        parent: "Node3D",
      },
    ],
  },

  // -----------------------------------------------------------------
  // AUDIO NODES
  // -----------------------------------------------------------------
  {
    id: "audio",
    title: "Audio Nodes",
    description: "Play music and sound effects.",
    nodes: [
      {
        name: "AudioStreamPlayer",
        category: "audio",
        description:
          "Plays a sound or music clip — heard equally everywhere.",
        use_case: "Background music, UI clicks, jingles.",
        example: `extends AudioStreamPlayer\n\nfunc _ready():\n    stream = preload("res://music.ogg")\n    play()`,
        visual_hint:
          "A speaker icon glowing while music plays in the background.",
        where_used: ["Menu music", "Win jingle", "Click sound"],
        parent: "Node",
      },
      {
        name: "AudioStreamPlayer2D",
        category: "audio",
        description:
          "Plays a sound from a 2D position — louder when the player is near.",
        use_case: "Footsteps, enemy growls, environmental sounds.",
        example: `extends AudioStreamPlayer2D\n\nfunc _ready():\n    stream = preload("res://step.wav")\n    play()`,
        visual_hint:
          "Sound waves rippling out from an enemy and fading with distance.",
        where_used: ["Footsteps", "Waterfall", "Enemy roar"],
        parent: "Node2D",
      },
    ],
  },

  // -----------------------------------------------------------------
  // ANIMATION & EFFECTS
  // -----------------------------------------------------------------
  {
    id: "anim",
    title: "Animation & Effects",
    description: "Bring scenes to life with motion, sprites, and particles.",
    nodes: [
      {
        name: "AnimationPlayer",
        category: "anim",
        description:
          "Records and plays back animations on any property of any node.",
        use_case:
          "Open doors, fade screens, animate characters, scripted cutscenes.",
        example: `extends AnimationPlayer\n\nfunc _ready():\n    play("walk")`,
        visual_hint:
          "A door slowly swinging open from closed to open.",
        important: true,
        where_used: ["Door open", "Fade to black", "Walk cycle"],
        parent: "Node",
      },
      {
        name: "AnimatedSprite2D",
        category: "anim",
        description:
          "Plays a frame-by-frame sprite animation (a sprite sheet).",
        use_case: "Walk, run, jump, attack — any pixel-art animation.",
        example: `extends AnimatedSprite2D\n\nfunc _ready():\n    play("run")`,
        visual_hint:
          "A pixel hero cycling through 4 frames of a running animation.",
        where_used: ["Walking enemy", "Spinning coin", "Idle player"],
        parent: "Node2D",
      },
      {
        name: "GPUParticles2D",
        category: "anim",
        description:
          "Spawns lots of tiny particles fast — sparks, smoke, fire, magic.",
        use_case: "Coin burst, explosion, dust under feet, fireball trail.",
        example: `extends GPUParticles2D\n\nfunc _ready():\n    emitting = true`,
        visual_hint:
          "A burst of yellow sparks shooting outward when a coin is collected.",
        where_used: ["Coin pickup sparks", "Explosion", "Footstep dust"],
        parent: "Node2D",
      },
    ],
  },

  // -----------------------------------------------------------------
  // LOGIC & SYSTEM NODES
  // -----------------------------------------------------------------
  {
    id: "logic",
    title: "Logic & System",
    description: "Helpers that don't draw anything — they just run things.",
    nodes: [
      {
        name: "Timer",
        category: "logic",
        description:
          "Counts down and fires a 'timeout' signal when it reaches zero.",
        use_case:
          "Spawn enemies every X seconds, cooldowns, delayed actions, countdowns.",
        example: `extends Timer\n\nfunc _ready():\n    wait_time = 1.0\n    start()\n    timeout.connect(_on_timeout)\n\nfunc _on_timeout():\n    print("tick")`,
        visual_hint:
          "A circular countdown ring shrinking from full to empty, then ticking.",
        important: true,
        where_used: ["Enemy spawner", "Powerup duration", "Bomb countdown"],
        parent: "Node",
      },
      {
        name: "HTTPRequest",
        category: "logic",
        description:
          "Sends a request to a website or API and reads the response.",
        use_case: "Leaderboards, fetching news, downloading files.",
        example: `extends HTTPRequest\n\nfunc _ready():\n    request("https://example.com/api")`,
        visual_hint:
          "An arrow flying up to a cloud icon and a response coming back.",
        where_used: ["Online leaderboard", "Daily challenge", "News ticker"],
        parent: "Node",
      },
    ],
  },

  // -----------------------------------------------------------------
  // NAVIGATION NODES
  // -----------------------------------------------------------------
  {
    id: "nav",
    title: "Navigation",
    description: "Help characters find paths around walls and obstacles.",
    nodes: [
      {
        name: "NavigationAgent2D",
        category: "nav",
        description:
          "Calculates the shortest path from one point to another in 2D.",
        use_case: "Enemy AI that walks around walls to reach the player.",
        example: `extends NavigationAgent2D\n\nfunc _ready():\n    target_position = Vector2(200, 100)`,
        visual_hint:
          "A dotted line snaking around obstacles toward the player.",
        where_used: ["Chasing enemy", "Auto-pathing pet", "RTS unit"],
        parent: "Node2D",
      },
      {
        name: "NavigationRegion2D",
        category: "nav",
        description:
          "Marks the area of the map where characters are allowed to walk.",
        use_case: "Define floor zones in dungeons, towns, or arenas.",
        example: `extends NavigationRegion2D\n\n# Bake a navigation polygon in the editor.`,
        visual_hint:
          "A blue translucent shape covering all the walkable floor.",
        where_used: ["Dungeon floor", "Town square", "Boss arena"],
        parent: "Node2D",
      },
    ],
  },

  // -----------------------------------------------------------------
  // SPECIAL NODES
  // -----------------------------------------------------------------
  {
    id: "special",
    title: "Special",
    description: "Useful odds and ends every game ends up using.",
    nodes: [
      {
        name: "CanvasLayer",
        category: "special",
        description:
          "Draws its children on top of the world, ignoring the camera.",
        use_case: "HUDs, pause menus, transitions — anything pinned to screen.",
        example: `extends CanvasLayer\n\nfunc _ready():\n    layer = 10`,
        visual_hint: "A score label that stays put while the world scrolls.",
        where_used: ["HUD", "Pause overlay", "Loading screen"],
        parent: "Node",
      },
      {
        name: "Marker2D",
        category: "special",
        description:
          "An invisible point in 2D — used to mark positions like spawns.",
        use_case: "Spawn points, save points, waypoints.",
        example: `extends Marker2D\n\n# In code:\nvar spawn := $SpawnPoint.global_position`,
        visual_hint:
          "A small cross icon marking where the player will respawn.",
        where_used: ["Player spawn", "Enemy spawn", "Item drop point"],
        parent: "Node2D",
      },
    ],
  },
];

// Flat list (used by lookups + the highlighter's "tappable name" detection).
export const nodeDocs: NodeDoc[] = nodeCategories.flatMap((c) => c.nodes);

export function findNode(name: string): NodeDoc | undefined {
  return nodeDocs.find((n) => n.name === name);
}

export function findCategoryOf(name: string): NodeCategory | undefined {
  return nodeCategories.find((c) => c.nodes.some((n) => n.name === name));
}

export function findCategory(id: NodeCategoryId): NodeCategory | undefined {
  return nodeCategories.find((c) => c.id === id);
}
