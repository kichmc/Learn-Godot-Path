// Curriculum: Chapters → Lessons → Steps
// Beginner-friendly, mobile-first, very short explanations.

export type StepType =
  | "text"
  | "quiz"
  | "input"
  | "visual"
  | "debug"
  | "prediction";

export interface BaseStep {
  id: string;
  type: StepType;
}

export interface TextStep extends BaseStep {
  type: "text";
  title?: string;
  body: string; // 2-3 lines max
  code?: string; // optional GDScript snippet
}

export interface QuizStep extends BaseStep {
  type: "quiz";
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface InputStep extends BaseStep {
  type: "input";
  prompt: string;
  // Code template with one or more "___" placeholders
  template: string;
  // The accepted answers, one per blank, lowercased trim-compared
  answers: string[];
  hint?: string;
  explanation?: string;
}

export interface DebugStep extends BaseStep {
  type: "debug";
  prompt: string;
  // Each line is presented as a tappable row; the user must pick the buggy line
  lines: string[];
  buggyLineIndex: number;
  fix: string; // the corrected line shown after success
  explanation?: string;
}

export interface PredictionStep extends BaseStep {
  type: "prediction";
  prompt: string;
  code: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

// --- Visual simulation step ---

export type SimulationKind =
  | "move"
  | "jump"
  | "gravity"
  | "signal"
  | "input"
  | "collision"
  | "score"
  | "chase";

export interface SimulationSpec {
  kind: SimulationKind;
  // Generic params; consumed by VisualSimulation
  direction?: "left" | "right" | "up" | "down";
  fromKey?: string; // input simulation
  fromValue?: number; // score
  toValue?: number; // score
  caption?: string;
}

export interface VisualStep extends BaseStep {
  type: "visual";
  title: string;
  description: string; // short
  code?: string;
  simulation: SimulationSpec;
}

export type Step =
  | TextStep
  | QuizStep
  | InputStep
  | VisualStep
  | DebugStep
  | PredictionStep;

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  steps: Step[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  accent: string; // tailwind class for color flavor (kept for compatibility)
  lessons: Lesson[];
}

// =====================================================================
// CONTENT
// =====================================================================

export const curriculum: Chapter[] = [
  // -------------------------------------------------------------------
  // CHAPTER 1: BASICS
  // -------------------------------------------------------------------
  {
    id: "basics",
    title: "Basics",
    description: "Variables, functions, and print()",
    accent: "from-primary to-accent",
    lessons: [
      {
        id: "basics-variables",
        title: "Variables",
        subtitle: "Boxes that hold values",
        steps: [
          {
            id: "b1-1",
            type: "text",
            title: "What is a variable?",
            body: "A variable is a labeled box that stores a value you can use later.",
          },
          {
            id: "b1-2",
            type: "text",
            title: "How to make one",
            body: "Use the keyword var, a name, and a value.",
            code: `var score = 0`,
          },
          {
            id: "b1-3",
            type: "quiz",
            question: "Which line creates a variable?",
            options: [`print("hi")`, `var lives = 3`, `func jump():`],
            correctIndex: 1,
            explanation: "var starts a variable. The name is lives, value is 3.",
          },
          {
            id: "b1-4",
            type: "input",
            prompt: "Make a variable named coins set to 100.",
            template: `var ___ = 100`,
            answers: ["coins"],
            hint: "Type the variable name.",
          },
          {
            id: "b1-5",
            type: "debug",
            prompt: "One line is broken. Tap it.",
            lines: [`var name = "Adwaith"`, `var = 5`, `var hp = 10`],
            buggyLineIndex: 1,
            fix: `var x = 5`,
            explanation: "A variable needs a name between var and =.",
          },
          {
            id: "b1-6",
            type: "prediction",
            prompt: "What gets printed?",
            code: `var lives = 3\nprint(lives)`,
            options: ["lives", "3", "0", "nothing"],
            correctIndex: 1,
            explanation: "print(lives) shows the value stored in lives.",
          },
        ],
      },
      {
        id: "basics-functions",
        title: "Functions",
        subtitle: "Reusable blocks of code",
        steps: [
          {
            id: "b2-1",
            type: "text",
            title: "What is a function?",
            body: "A function is a recipe you can run again and again.",
          },
          {
            id: "b2-2",
            type: "text",
            title: "Make one with func",
            body: "Use func, a name, parentheses, then a colon.",
            code: `func say_hi():\n    print("Hi!")`,
          },
          {
            id: "b2-3",
            type: "quiz",
            question: "Which keyword starts a function?",
            options: ["var", "func", "def", "fn"],
            correctIndex: 1,
            explanation: "GDScript uses func.",
          },
          {
            id: "b2-4",
            type: "input",
            prompt: "Start a function called jump.",
            template: `___ jump():`,
            answers: ["func"],
          },
          {
            id: "b2-5",
            type: "debug",
            prompt: "Find the broken line.",
            lines: [`func start():`, `func jump:`, `func end():`],
            buggyLineIndex: 1,
            fix: `func jump():`,
            explanation: "Functions need () before the colon.",
          },
        ],
      },
      {
        id: "basics-print",
        title: "print()",
        subtitle: "Show messages on screen",
        steps: [
          {
            id: "b3-1",
            type: "text",
            title: "What does print do?",
            body: "print() shows a message in the console. Great for testing.",
            code: `print("Hello, Godot!")`,
          },
          {
            id: "b3-2",
            type: "prediction",
            prompt: "What is the output?",
            code: `print(2 + 3)`,
            options: ["2 + 3", "5", "23", "error"],
            correctIndex: 1,
            explanation: "GDScript adds first, then prints 5.",
          },
          {
            id: "b3-3",
            type: "input",
            prompt: 'Print the message "Game start".',
            template: `print(___)`,
            answers: [`"game start"`],
            hint: 'Use double quotes around the text.',
          },
          {
            id: "b3-4",
            type: "quiz",
            question: "Which is correct?",
            options: [`Print("hi")`, `print("hi")`, `PRINT("hi")`],
            correctIndex: 1,
            explanation: "GDScript is case-sensitive. Use lowercase print.",
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------
  // CHAPTER 2: MOVEMENT
  // -------------------------------------------------------------------
  {
    id: "movement",
    title: "Movement",
    description: "Velocity, slide, and direction",
    accent: "from-accent to-primary",
    lessons: [
      {
        id: "movement-velocity",
        title: "Velocity",
        subtitle: "How fast and where",
        steps: [
          {
            id: "m1-1",
            type: "text",
            title: "Velocity is a Vector2",
            body: "It tells the player two things: speed on X and speed on Y.",
            code: `velocity = Vector2(100, 0)`,
          },
          {
            id: "m1-2",
            type: "visual",
            title: "Watch it move",
            description: "Vector2(100, 0) moves the player to the right.",
            code: `velocity = Vector2(100, 0)`,
            simulation: {
              kind: "move",
              direction: "right",
              caption: "Player moves right",
            },
          },
          {
            id: "m1-3",
            type: "quiz",
            question: "Vector2(100, 0) moves the player which way?",
            options: ["Up", "Right", "Down", "Left"],
            correctIndex: 1,
          },
          {
            id: "m1-4",
            type: "prediction",
            prompt: "Where does this player go?",
            code: `velocity = Vector2(-100, 0)`,
            options: ["Right", "Left", "Up", "Down"],
            correctIndex: 1,
            explanation: "Negative X means moving left.",
          },
          {
            id: "m1-5",
            type: "input",
            prompt: "Make the player move down at speed 100.",
            template: `velocity = Vector2(0, ___)`,
            answers: ["100"],
            hint: "Positive Y = down in 2D.",
          },
        ],
      },
      {
        id: "movement-slide",
        title: "move_and_slide()",
        subtitle: "Apply the velocity",
        steps: [
          {
            id: "m2-1",
            type: "text",
            title: "What it does",
            body: "Call this every frame. It moves the player and slides along walls.",
            code: `func _physics_process(delta):\n    move_and_slide()`,
          },
          {
            id: "m2-2",
            type: "visual",
            title: "Slide in action",
            description: "The body uses velocity and slides along the floor.",
            simulation: {
              kind: "move",
              direction: "right",
              caption: "Sliding to the right",
            },
          },
          {
            id: "m2-3",
            type: "input",
            prompt: "Complete the call.",
            template: `move_and_____()`,
            answers: ["slide"],
          },
          {
            id: "m2-4",
            type: "debug",
            prompt: "Which line is wrong?",
            lines: [`velocity.x = 100`, `move_and_slide`, `pass`],
            buggyLineIndex: 1,
            fix: `move_and_slide()`,
            explanation: "Functions need parentheses to actually run.",
          },
        ],
      },
      {
        id: "movement-direction",
        title: "Direction",
        subtitle: "Read the axes",
        steps: [
          {
            id: "m3-1",
            type: "text",
            title: "X and Y in 2D",
            body: "Positive X is right. Negative X is left. Positive Y is DOWN.",
          },
          {
            id: "m3-2",
            type: "visual",
            title: "Up means negative Y",
            description: "In Godot 2D, up is negative on the Y axis.",
            code: `velocity = Vector2(0, -100)`,
            simulation: {
              kind: "move",
              direction: "up",
              caption: "Player moves up",
            },
          },
          {
            id: "m3-3",
            type: "quiz",
            question: "Which Vector2 moves a player UP?",
            options: [
              "Vector2(0, 100)",
              "Vector2(0, -100)",
              "Vector2(100, 0)",
              "Vector2(-100, 0)",
            ],
            correctIndex: 1,
          },
          {
            id: "m3-4",
            type: "prediction",
            prompt: "Where does this go?",
            code: `velocity = Vector2(0, 100)`,
            options: ["Up", "Down", "Left", "Right"],
            correctIndex: 1,
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------
  // CHAPTER 3: PHYSICS
  // -------------------------------------------------------------------
  {
    id: "physics",
    title: "Physics",
    description: "Gravity, jump, is_on_floor()",
    accent: "from-primary to-warning",
    lessons: [
      {
        id: "physics-gravity",
        title: "Gravity",
        subtitle: "What goes up...",
        steps: [
          {
            id: "p1-1",
            type: "text",
            title: "Gravity pulls down",
            body: "Add gravity to velocity.y every frame so the player falls.",
            code: `velocity.y += gravity * delta`,
          },
          {
            id: "p1-2",
            type: "visual",
            title: "Falling object",
            description: "Without a floor, gravity makes the body fall.",
            simulation: {
              kind: "gravity",
              caption: "Pulled by gravity",
            },
          },
          {
            id: "p1-3",
            type: "quiz",
            question: "Gravity affects which axis?",
            options: ["X", "Y", "Z", "Both"],
            correctIndex: 1,
            explanation: "In 2D, gravity changes Y.",
          },
          {
            id: "p1-4",
            type: "prediction",
            prompt: "With gravity on, where does the player go?",
            code: `velocity.y += gravity * delta`,
            options: ["Up", "Right", "Down", "Stays still"],
            correctIndex: 2,
          },
        ],
      },
      {
        id: "physics-jump",
        title: "Jump",
        subtitle: "Push up to jump",
        steps: [
          {
            id: "p2-1",
            type: "text",
            title: "Set Y to negative",
            body: "Up is negative Y. Set velocity.y to a negative number to jump.",
            code: `velocity.y = -300`,
          },
          {
            id: "p2-2",
            type: "visual",
            title: "Jumping",
            description: "A negative Y velocity launches the player upward.",
            simulation: {
              kind: "jump",
              caption: "Jump!",
            },
          },
          {
            id: "p2-3",
            type: "input",
            prompt: "Make the player jump (push up).",
            template: `velocity.y = ___300`,
            answers: ["-"],
            hint: "Up is negative.",
          },
          {
            id: "p2-4",
            type: "debug",
            prompt: "This jump is wrong. Which line?",
            lines: [
              `func jump():`,
              `    velocity.y = 300`,
              `    move_and_slide()`,
            ],
            buggyLineIndex: 1,
            fix: `    velocity.y = -300`,
            explanation: "Positive Y goes DOWN. Use a negative value to jump.",
          },
        ],
      },
      {
        id: "physics-floor",
        title: "is_on_floor()",
        subtitle: "Only jump when grounded",
        steps: [
          {
            id: "p3-1",
            type: "text",
            title: "Check the ground",
            body: "is_on_floor() returns true when the body touches the floor.",
            code: `if is_on_floor():\n    velocity.y = -300`,
          },
          {
            id: "p3-2",
            type: "quiz",
            question: "When can the player jump?",
            options: ["Anytime", "Only on the floor", "Only in the air"],
            correctIndex: 1,
            explanation: "Checking is_on_floor() prevents mid-air jumps.",
          },
          {
            id: "p3-3",
            type: "visual",
            title: "Grounded jump",
            description: "Player only jumps when standing on the floor.",
            code: `if is_on_floor():\n    velocity.y = -300`,
            simulation: { kind: "jump", caption: "Floor check, then jump" },
          },
          {
            id: "p3-4",
            type: "input",
            prompt: "Complete the floor check.",
            template: `if ___():\n    velocity.y = -300`,
            answers: ["is_on_floor"],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------
  // CHAPTER 4: INPUT
  // -------------------------------------------------------------------
  {
    id: "input",
    title: "Input",
    description: "Keyboard and touch",
    accent: "from-accent to-success",
    lessons: [
      {
        id: "input-keyboard",
        title: "Keyboard",
        subtitle: "Read key presses",
        steps: [
          {
            id: "i1-1",
            type: "text",
            title: "Input actions",
            body: "Godot uses named actions like ui_right. Check them with Input.",
            code: `if Input.is_action_pressed("ui_right"):\n    velocity.x = 100`,
          },
          {
            id: "i1-2",
            type: "visual",
            title: "Press right arrow",
            description: "Pressing right makes the player move right.",
            simulation: {
              kind: "input",
              fromKey: "→",
              direction: "right",
              caption: "Right arrow → move right",
            },
          },
          {
            id: "i1-3",
            type: "quiz",
            question: "Which line reads input?",
            options: [
              `Input.is_action_pressed("ui_right")`,
              `Print.is_action("ui_right")`,
              `Read.action("ui_right")`,
            ],
            correctIndex: 0,
          },
          {
            id: "i1-4",
            type: "input",
            prompt: "Check if the jump action is pressed.",
            template: `Input.is_action_____("jump")`,
            answers: ["pressed"],
            hint: "Method is is_action_pressed.",
          },
          {
            id: "i1-5",
            type: "prediction",
            prompt: "What happens when the player taps left arrow?",
            code: `if Input.is_action_pressed("ui_left"):\n    velocity.x = -100`,
            options: ["Move left", "Move right", "Jump", "Nothing"],
            correctIndex: 0,
          },
        ],
      },
      {
        id: "input-touch",
        title: "Touch",
        subtitle: "Mobile-friendly input",
        steps: [
          {
            id: "i2-1",
            type: "text",
            title: "Touch is just an action",
            body: "Map a touch button to an action like tap. Then check it like a key.",
            code: `if Input.is_action_just_pressed("tap"):\n    jump()`,
          },
          {
            id: "i2-2",
            type: "visual",
            title: "Tap to jump",
            description: "A screen tap triggers the jump action.",
            simulation: {
              kind: "input",
              fromKey: "TAP",
              direction: "up",
              caption: "Tap → jump",
            },
          },
          {
            id: "i2-3",
            type: "quiz",
            question: "Which is best for phones?",
            options: ["Keyboard only", "Touch input", "Mouse drag"],
            correctIndex: 1,
          },
          {
            id: "i2-4",
            type: "input",
            prompt: "Detect a single tap (just pressed).",
            template: `Input.is_action____pressed("tap")`,
            answers: ["_just_"],
            hint: "Pattern: is_action_just_pressed",
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------
  // CHAPTER 5: SIGNALS
  // -------------------------------------------------------------------
  {
    id: "signals",
    title: "Signals",
    description: "Nodes talking to nodes",
    accent: "from-primary to-accent",
    lessons: [
      {
        id: "signals-what",
        title: "What is a Signal?",
        subtitle: "Messages between nodes",
        steps: [
          {
            id: "s1-1",
            type: "text",
            title: "A signal is a message",
            body: "One node shouts an event. Other nodes listen and react.",
          },
          {
            id: "s1-2",
            type: "visual",
            title: "Button → Player",
            description: "The button sends a signal. The player listens.",
            simulation: {
              kind: "signal",
              caption: "Signal travels from button to player",
            },
          },
          {
            id: "s1-3",
            type: "quiz",
            question: "Signals are most like…",
            options: ["Variables", "Messages", "Loops", "Files"],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "signals-connect",
        title: "Connect Signals",
        subtitle: "Wire them in code",
        steps: [
          {
            id: "s2-1",
            type: "text",
            title: "Connect with .connect()",
            body: "Tell the signal which function to call when it fires.",
            code: `button.pressed.connect(on_pressed)`,
          },
          {
            id: "s2-2",
            type: "input",
            prompt: "Connect the pressed signal.",
            template: `button.pressed.___(on_pressed)`,
            answers: ["connect"],
          },
          {
            id: "s2-3",
            type: "debug",
            prompt: "Find the broken line.",
            lines: [
              `func _ready():`,
              `    button.pressed.connect on_pressed`,
              `    print("ready")`,
            ],
            buggyLineIndex: 1,
            fix: `    button.pressed.connect(on_pressed)`,
            explanation: "connect needs () with the function inside.",
          },
          {
            id: "s2-4",
            type: "prediction",
            prompt: "Button is pressed. What happens?",
            code: `button.pressed.connect(on_pressed)\n\nfunc on_pressed():\n    print("clicked!")`,
            options: [
              `Prints "clicked!"`,
              "Prints nothing",
              "Errors out",
              "Prints the word pressed",
            ],
            correctIndex: 0,
          },
        ],
      },
      {
        id: "signals-button",
        title: "Button → Action",
        subtitle: "Make it do something",
        steps: [
          {
            id: "s3-1",
            type: "text",
            title: "The handler runs",
            body: "When the signal fires, your function runs. Put any code there.",
            code: `func _on_button_pressed():\n    print("clicked!")`,
          },
          {
            id: "s3-2",
            type: "visual",
            title: "Click triggers code",
            description: "Pressing the button runs the connected function.",
            simulation: {
              kind: "signal",
              caption: "Press → run handler",
            },
          },
          {
            id: "s3-3",
            type: "quiz",
            question: "What runs when the signal fires?",
            options: [
              "The connected function",
              "Every function in the file",
              "Nothing",
            ],
            correctIndex: 0,
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------
  // CHAPTER 6: GAME LOGIC
  // -------------------------------------------------------------------
  {
    id: "game-logic",
    title: "Game Logic",
    description: "Score, enemies, collisions",
    accent: "from-warning to-primary",
    lessons: [
      {
        id: "logic-score",
        title: "Score System",
        subtitle: "Count the points",
        steps: [
          {
            id: "g1-1",
            type: "text",
            title: "Track a score",
            body: "Use a variable. Add to it when the player earns points.",
            code: `var score = 0\n\nfunc add_point():\n    score += 1`,
          },
          {
            id: "g1-2",
            type: "visual",
            title: "Score ticks up",
            description: "Each event adds to the score counter.",
            simulation: {
              kind: "score",
              fromValue: 0,
              toValue: 5,
              caption: "Score: 0 → 5",
            },
          },
          {
            id: "g1-3",
            type: "input",
            prompt: "Add one to the score.",
            template: `score ___ 1`,
            answers: ["+="],
            hint: "Shorthand for score = score + 1.",
          },
          {
            id: "g1-4",
            type: "prediction",
            prompt: "What does this print?",
            code: `var score = 5\nscore += 2\nprint(score)`,
            options: ["5", "7", "2", "score"],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "logic-enemy",
        title: "Enemy Behavior",
        subtitle: "Chase the player",
        steps: [
          {
            id: "g2-1",
            type: "text",
            title: "Chase logic",
            body: "Subtract positions to get a direction. Normalize it. Multiply by speed.",
            code: `var dir = (player.position - position).normalized()\nvelocity = dir * speed`,
          },
          {
            id: "g2-2",
            type: "visual",
            title: "Enemy chases",
            description: "Enemy moves toward the player every frame.",
            simulation: {
              kind: "chase",
              caption: "Enemy hunts the player",
            },
          },
          {
            id: "g2-3",
            type: "quiz",
            question: "What does .normalized() do to a vector?",
            options: [
              "Doubles its length",
              "Sets its length to 1",
              "Flips it",
              "Removes it",
            ],
            correctIndex: 1,
            explanation: "Normalized vectors have length 1, so speed stays steady.",
          },
        ],
      },
      {
        id: "logic-collision",
        title: "Collisions",
        subtitle: "When bodies touch",
        steps: [
          {
            id: "g3-1",
            type: "text",
            title: "Group + check",
            body: "Add nodes to a group, then check the group on collision.",
            code: `func _on_body_entered(body):\n    if body.is_in_group("enemy"):\n        die()`,
          },
          {
            id: "g3-2",
            type: "visual",
            title: "Player meets enemy",
            description: "When they touch, the collision handler runs.",
            simulation: {
              kind: "collision",
              caption: "Collision detected",
            },
          },
          {
            id: "g3-3",
            type: "quiz",
            question: "How do we know the body is an enemy?",
            options: [
              "Check its color",
              "Check its group",
              "Print it",
              "Guess",
            ],
            correctIndex: 1,
          },
          {
            id: "g3-4",
            type: "input",
            prompt: "Check if the body is in the enemy group.",
            template: `if body.is_in_group(___):`,
            answers: [`"enemy"`],
            hint: "Use double quotes around the group name.",
          },
        ],
      },
    ],
  },
];

// Helpers
export function findChapter(id: string): Chapter | undefined {
  return curriculum.find((c) => c.id === id);
}

export function findLesson(
  chapterId: string,
  lessonId: string,
): Lesson | undefined {
  return findChapter(chapterId)?.lessons.find((l) => l.id === lessonId);
}

export function totalLessons(): number {
  return curriculum.reduce((sum, c) => sum + c.lessons.length, 0);
}

export function totalSteps(): number {
  return curriculum.reduce(
    (sum, c) =>
      sum + c.lessons.reduce((s, l) => s + l.steps.length, 0),
    0,
  );
}
