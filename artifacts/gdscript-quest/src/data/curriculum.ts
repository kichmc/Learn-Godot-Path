export type SlideType = 
  | 'info' 
  | 'code' 
  | 'multiple_choice' 
  | 'fill_in_blank' 
  | 'drag_drop' 
  | 'code_practice';

export interface BaseSlide {
  id: string;
  type: SlideType;
}

export interface InfoSlide extends BaseSlide {
  type: 'info';
  title: string;
  body: string;
  image_caption?: string;
  image_url?: string;
}

export interface CodeSlide extends BaseSlide {
  type: 'code';
  code: string;
  explanation: string;
}

export interface MultipleChoiceSlide extends BaseSlide {
  type: 'multiple_choice';
  question: string;
  code_snippet?: string;
  options: string[];
  correct_option_index: number;
  hint: string;
}

export interface FillInBlankSlide extends BaseSlide {
  type: 'fill_in_blank';
  code_snippet_before: string;
  code_snippet_after: string;
  answer: string;
  hint: string;
  accept_any_number?: boolean;
}

export interface DragDropSlide extends BaseSlide {
  type: 'drag_drop';
  tokens: string[];
  correct_order: string[];
}

export interface CodePracticeSlide extends BaseSlide {
  type: 'code_practice';
  prompt: string;
  target_line: string;
  hint: string;
}

export type Slide = InfoSlide | CodeSlide | MultipleChoiceSlide | FillInBlankSlide | DragDropSlide | CodePracticeSlide;

export interface Chapter {
  id: string;
  title: string;
  description: string;
  goal: string;
  cover_image: string;
  slides: Slide[];
}

export const curriculum: Chapter[] = [
  {
    id: "chapter-1",
    title: "Variables & Data Types",
    description: "The Player's Stats",
    goal: "understand var, int, float, String, bool. Why? Because every game needs to remember things — health, score, the player's name.",
    cover_image: "/images/ch1-cover.png",
    slides: [
      {
        id: "c1-s1",
        type: "info",
        title: "What is a variable?",
        body: "Think of a variable as a labeled box where your game stores information. The player's health, the score, even their name — all of these live inside variables."
      },
      {
        id: "c1-s2",
        type: "code",
        code: "var health = 100",
        explanation: "We just made a box called 'health' and put the number 100 inside it."
      },
      {
        id: "c1-s3",
        type: "info",
        title: "Data types",
        body: "Different boxes for different kinds of information.",
        image_caption: "[Illustration: four boxes labeled int, float, String, bool with example values]",
        image_url: "/images/data-types.png"
      },
      {
        id: "c1-s4",
        type: "code",
        code: "var player_name = \"Hero\"\nvar speed = 5.5\nvar is_alive = true",
        explanation: "Strings are text, floats have decimals, bools are true/false."
      },
      {
        id: "c1-s5",
        type: "multiple_choice",
        question: "Which line correctly stores the player's max health?",
        options: ["var max_health = 100", "max_health == 100", "var = max_health 100", "100 = var max_health"],
        correct_option_index: 0,
        hint: "In GDScript, we declare with the keyword var, then the name, then = and the value."
      },
      {
        id: "c1-s6",
        type: "fill_in_blank",
        code_snippet_before: "var coins = ",
        code_snippet_after: "",
        answer: "50",
        accept_any_number: true,
        hint: "Just type any whole number."
      },
      {
        id: "c1-s7",
        type: "info",
        title: "Why types matter",
        body: "If we try to add a number to a word, the game will get confused. Types help Godot know what's safe to do."
      },
      {
        id: "c1-s8",
        type: "drag_drop",
        tokens: ["var", "enemy_count", "=", "3"],
        correct_order: ["var", "enemy_count", "=", "3"]
      },
      {
        id: "c1-s9",
        type: "multiple_choice",
        question: "Which type would you use for the player's name?",
        options: ["int", "float", "String", "bool"],
        correct_option_index: 2,
        hint: "Names are text — and text is a String."
      },
      {
        id: "c1-s10",
        type: "code_practice",
        prompt: "Type the line that creates a variable called health with value 100.",
        target_line: "var health = 100",
        hint: "Start with 'var', then the name, then = and the value."
      }
    ]
  },
  {
    id: "chapter-2",
    title: "Functions & Methods",
    description: "Making things happen",
    goal: "understand func, parameters, return, and Godot's _ready() and _process(delta) lifecycle hooks.",
    cover_image: "/images/ch2-cover.png",
    slides: [
      {
        id: "c2-s1",
        type: "info",
        title: "What is a function?",
        body: "A function is a recipe — a set of instructions you can run any time by calling its name."
      },
      {
        id: "c2-s2",
        type: "code",
        code: "func say_hello():\n    print(\"Hello, world!\")",
        explanation: "We just made a function called say_hello. The print() line is what runs when we call it."
      },
      {
        id: "c2-s3",
        type: "info",
        title: "_ready() runs once",
        body: "Godot calls _ready() automatically when the node enters the scene.",
        image_caption: "[Diagram: timeline showing _ready() firing once at scene start, then _process() running every frame]",
        image_url: "/images/ready-process.png"
      },
      {
        id: "c2-s4",
        type: "code",
        code: "func _ready():\n    print(\"Game starting!\")",
        explanation: "Godot calls _ready() automatically when the node enters the scene."
      },
      {
        id: "c2-s5",
        type: "info",
        title: "_process(delta) runs every frame",
        body: "delta is the seconds between frames. Multiply movement by delta so it works the same on slow and fast devices."
      },
      {
        id: "c2-s6",
        type: "code",
        code: "func _process(delta):\n    position.x += 100 * delta",
        explanation: "Move 100 pixels per second to the right, smoothly."
      },
      {
        id: "c2-s7",
        type: "multiple_choice",
        question: "Which function runs once when a node first appears?",
        options: ["_process()", "_ready()", "_input()", "_enter()"],
        correct_option_index: 1,
        hint: "Ready as in 'I'm ready to start!'"
      },
      {
        id: "c2-s8",
        type: "fill_in_blank",
        code_snippet_before: "func _ready",
        code_snippet_after: ":\n    print(\"Hi\")",
        answer: "()",
        hint: "Functions need parentheses for their parameters, even when empty."
      },
      {
        id: "c2-s9",
        type: "multiple_choice",
        question: "Why do we multiply movement by delta?",
        options: ["It looks cool", "So movement is consistent across frame rates", "Godot requires it", "To save memory"],
        correct_option_index: 1,
        hint: "Frame rates differ across devices."
      },
      {
        id: "c2-s10",
        type: "code_practice",
        prompt: "Type the start of Godot's ready function.",
        target_line: "func _ready():",
        hint: "func name(): — and the name is _ready"
      }
    ]
  },
  {
    id: "chapter-3",
    title: "If/Else Logic",
    description: "Decision making in-game",
    goal: "if, elif, else, comparison and logical operators. Build instincts for game logic like 'if health <= 0: die'.",
    cover_image: "/images/ch3-cover.png",
    slides: [
      {
        id: "c3-s1",
        type: "info",
        title: "Why decisions?",
        body: "Games are full of choices: did the player win? are they hurt? is the door locked? if/else lets your game react."
      },
      {
        id: "c3-s2",
        type: "code",
        code: "if health <= 0:\n    print(\"Game Over\")",
        explanation: "If health drops to zero or below, we end the game."
      },
      {
        id: "c3-s3",
        type: "info",
        title: "elif and else",
        body: "Handle multiple conditions in order.",
        image_caption: "[Flowchart: health > 50 (Healthy) -> elif > 0 (Hurt) -> else (Dead)]",
        image_url: "/images/health-flow.png"
      },
      {
        id: "c3-s4",
        type: "code",
        code: "if health > 50:\n    print(\"Healthy\")\nelif health > 0:\n    print(\"Hurt\")\nelse:\n    print(\"Dead\")",
        explanation: "Check each condition from top to bottom until one is true."
      },
      {
        id: "c3-s5",
        type: "info",
        title: "Comparison operators",
        body: "==, !=, >, <, >=, <= — note that == is for comparing, = is for assigning."
      },
      {
        id: "c3-s6",
        type: "multiple_choice",
        question: "Which operator checks if two things are equal?",
        options: ["=", "==", "!=", "=>"],
        correct_option_index: 1,
        hint: "Single = assigns; double == compares."
      },
      {
        id: "c3-s7",
        type: "fill_in_blank",
        code_snippet_before: "if score ",
        code_snippet_after: " 100:\n    print(\"You win!\")",
        answer: ">=",
        hint: "Greater than or equal to."
      },
      {
        id: "c3-s8",
        type: "code",
        code: "if has_key and door_locked:\n    print(\"Open the door\")",
        explanation: "Both conditions must be true with 'and'."
      },
      {
        id: "c3-s9",
        type: "multiple_choice",
        question: "What does 'or' do?",
        options: ["Both must be true", "Either can be true", "Neither is true", "Inverts a value"],
        correct_option_index: 1,
        hint: "or = at least one."
      },
      {
        id: "c3-s10",
        type: "drag_drop",
        tokens: ["if", "health", "<=", "0", ":"],
        correct_order: ["if", "health", "<=", "0", ":"]
      },
      {
        id: "c3-s11",
        type: "code_practice",
        prompt: "Write the condition that checks if health is zero or less.",
        target_line: "if health <= 0:",
        hint: "Start with if, then the variable, then <=, then 0, end with :"
      }
    ]
  },
  {
    id: "chapter-4",
    title: "Signals & Inputs",
    description: "Mobile Touch & Buttons",
    goal: "signals (Godot's event system) and Input — including touch for mobile games.",
    cover_image: "/images/ch4-cover.png",
    slides: [
      {
        id: "c4-s1",
        type: "info",
        title: "What is a signal?",
        body: "Signals are Godot's way of saying 'something happened!' A button can shout 'I was pressed!' and your script listens."
      },
      {
        id: "c4-s2",
        type: "code",
        code: "button.pressed.connect(_on_button_pressed)\n\nfunc _on_button_pressed():\n    print(\"Button tapped!\")",
        explanation: "Connect once, react every time."
      },
      {
        id: "c4-s3",
        type: "info",
        title: "Input on mobile",
        body: "Handle touch events to make your game playable on phones.",
        image_caption: "[Mobile phone screenshot showing a finger tapping a Godot game button]",
        image_url: "/images/mobile-touch.png"
      },
      {
        id: "c4-s4",
        type: "code",
        code: "func _input(event):\n    if event is InputEventScreenTouch and event.pressed:\n        print(\"Screen tapped!\")",
        explanation: "This function is called whenever the player touches the screen or presses a key."
      },
      {
        id: "c4-s5",
        type: "info",
        title: "Action map",
        body: "In Project Settings > Input Map, you define actions like 'jump' that work for keyboard, gamepad, and touch."
      },
      {
        id: "c4-s6",
        type: "code",
        code: "if Input.is_action_just_pressed(\"jump\"):\n    velocity.y = -300",
        explanation: "Check for the 'jump' action anywhere."
      },
      {
        id: "c4-s7",
        type: "multiple_choice",
        question: "Signals are best for...",
        options: ["Math operations", "Reacting to events", "Storing data", "Drawing graphics"],
        correct_option_index: 1,
        hint: "They fire when something happens."
      },
      {
        id: "c4-s8",
        type: "fill_in_blank",
        code_snippet_before: "Input.is_action_just_pressed(\"",
        code_snippet_after: "\")",
        answer: "jump",
        hint: "We're checking the action named jump."
      },
      {
        id: "c4-s9",
        type: "multiple_choice",
        question: "Which event fires when the player taps the screen?",
        options: ["InputEventKey", "InputEventScreenTouch", "InputEventMouseMotion", "InputEventJoypad"],
        correct_option_index: 1,
        hint: "Touch starts with 'Screen' on mobile."
      },
      {
        id: "c4-s10",
        type: "drag_drop",
        tokens: ["button", ".pressed", ".connect", "(_on_button_pressed)"],
        correct_order: ["button", ".pressed", ".connect", "(_on_button_pressed)"]
      },
      {
        id: "c4-s11",
        type: "code_practice",
        prompt: "Write the function that handles all input events.",
        target_line: "func _input(event):",
        hint: "It's a special function called _input that takes one parameter: event."
      }
    ]
  },
  {
    id: "chapter-5",
    title: "Nodes & Scenes",
    description: "The Godot Hierarchy",
    goal: "understand Node, Scene, parent/child, and how scripts attach.",
    cover_image: "/images/ch5-cover.png",
    slides: [
      {
        id: "c5-s1",
        type: "info",
        title: "Everything is a Node",
        body: "In Godot, every part of your game — sprites, sounds, even logic — is a Node. Nodes go inside Scenes."
      },
      {
        id: "c5-s2",
        type: "info",
        title: "Scene tree",
        body: "Nodes are organized in a tree structure.",
        image_caption: "[Screenshot: Godot Scene panel showing Player (CharacterBody2D) with Sprite2D and CollisionShape2D children]",
        image_url: "/images/scene-tree.png"
      },
      {
        id: "c5-s3",
        type: "code",
        code: "extends CharacterBody2D\n\nfunc _ready():\n    print(\"Player ready\")",
        explanation: "extends tells Godot 'this script controls a CharacterBody2D node.'"
      },
      {
        id: "c5-s4",
        type: "info",
        title: "Accessing children with $",
        body: "If your Player has a child called Sprite2D, you can grab it with $Sprite2D in code."
      },
      {
        id: "c5-s5",
        type: "code",
        code: "func _ready():\n    $Sprite2D.modulate = Color.RED",
        explanation: "Tint the sprite red on start."
      },
      {
        id: "c5-s6",
        type: "info",
        title: "Scenes are reusable",
        body: "Save a setup as a .tscn scene and reuse it everywhere — like a stamp."
      },
      {
        id: "c5-s7",
        type: "multiple_choice",
        question: "What does 'extends' do?",
        options: ["Imports a library", "Tells the script which Node type it controls", "Creates a new scene", "Runs once on start"],
        correct_option_index: 1,
        hint: "It links a script to a node type."
      },
      {
        id: "c5-s8",
        type: "fill_in_blank",
        code_snippet_before: "extends ",
        code_snippet_after: "2D",
        answer: "CharacterBody",
        hint: "The node type for moving characters in 2D."
      },
      {
        id: "c5-s9",
        type: "multiple_choice",
        question: "How do you grab a child node called Camera2D in code?",
        options: ["Camera2D", "$Camera2D", "get(Camera2D)", "@Camera2D"],
        correct_option_index: 1,
        hint: "Dollar-sign shortcut."
      },
      {
        id: "c5-s10",
        type: "drag_drop",
        tokens: ["extends", "Node2D"],
        correct_order: ["extends", "Node2D"]
      },
      {
        id: "c5-s11",
        type: "code_practice",
        prompt: "Write the line that makes this script control a Node2D.",
        target_line: "extends Node2D",
        hint: "extends followed by the node type."
      }
    ]
  }
];