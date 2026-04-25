// Godot node "documentation" entries.
// Beginner-friendly: one purpose, one place it's used, one tiny example.

export type NodeCategory = "core" | "2d" | "physics" | "ui";

export interface NodeDoc {
  name: string;
  category: NodeCategory;
  description: string;
  usage: string;
  example: string;
  parent?: string; // what it inherits from (very simple)
}

export const nodeDocs: NodeDoc[] = [
  {
    name: "Node",
    category: "core",
    description:
      "The base of everything in Godot. All other nodes inherit from it.",
    usage: "Grouping, scripts, scene roots that don't need 2D or 3D position.",
    example: `extends Node\n\nfunc _ready():\n    print("Game started")`,
  },
  {
    name: "Node2D",
    category: "2d",
    description:
      "Adds a 2D position, rotation, and scale to any node.",
    usage: "Anything that lives in a 2D world but isn't a sprite or body.",
    example: `extends Node2D\n\nfunc _ready():\n    position = Vector2(100, 50)`,
    parent: "Node",
  },
  {
    name: "CharacterBody2D",
    category: "physics",
    description:
      "A 2D body you move with code — perfect for players and enemies.",
    usage: "Platformer player, top-down hero, walking enemies.",
    example: `extends CharacterBody2D\n\nfunc _physics_process(delta):\n    velocity.x = 100\n    move_and_slide()`,
    parent: "Node2D",
  },
  {
    name: "Sprite2D",
    category: "2d",
    description:
      "Shows a 2D image (texture) on screen.",
    usage: "Player look, enemy art, background pieces.",
    example: `extends Sprite2D\n\nfunc _ready():\n    texture = preload("res://player.png")`,
    parent: "Node2D",
  },
  {
    name: "CollisionShape2D",
    category: "physics",
    description:
      "Gives a body or area a shape so the engine knows when things touch.",
    usage: "Add as a child of CharacterBody2D, Area2D, or RigidBody2D.",
    example: `# In the editor: pick a shape (Rectangle, Circle…)\n# In code:\n$CollisionShape2D.disabled = true`,
    parent: "Node2D",
  },
  {
    name: "Area2D",
    category: "physics",
    description:
      "Detects when other bodies enter or leave a region — no physics push.",
    usage: "Coins, checkpoints, damage zones, triggers.",
    example: `extends Area2D\n\nfunc _on_body_entered(body):\n    print("touched: ", body.name)`,
    parent: "Node2D",
  },
  {
    name: "Camera2D",
    category: "2d",
    description:
      "Decides what part of the 2D world the player sees.",
    usage: "Drop it as a child of the player to follow them around.",
    example: `extends Camera2D\n\nfunc _ready():\n    make_current()`,
    parent: "Node2D",
  },
  {
    name: "Control",
    category: "ui",
    description:
      "The base node for all UI — buttons, panels, labels live inside it.",
    usage: "Menus, HUDs, dialogs, anything with anchors and margins.",
    example: `extends Control\n\nfunc _ready():\n    custom_minimum_size = Vector2(200, 80)`,
    parent: "Node",
  },
  {
    name: "Button",
    category: "ui",
    description:
      "A clickable UI button that emits a 'pressed' signal.",
    usage: "Start game, pause menu, level select, retry button.",
    example: `extends Button\n\nfunc _ready():\n    pressed.connect(_on_pressed)\n\nfunc _on_pressed():\n    print("clicked!")`,
    parent: "Control",
  },
];

export function findNode(name: string): NodeDoc | undefined {
  return nodeDocs.find((n) => n.name === name);
}

export const nodeCategoryLabel: Record<NodeCategory, string> = {
  core: "Core",
  "2d": "2D",
  physics: "Physics",
  ui: "UI",
};
