// Curriculum: Chapters → Lessons → Steps
// Beginner-friendly, mobile-first, very short explanations.

export type StepType =
  | "text"
  | "quiz"
  | "input"
  | "visual"
  | "debug"
  | "prediction"
  | "test"
  | "script_explain";

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

export interface ScriptExplainStep extends BaseStep {
  type: "script_explain";
  title?: string;
  intro?: string; // 1 line above the code
  code: { line: string; explanation: string }[];
}

export interface TestStep extends BaseStep {
  type: "test";
  question: string;
  // Code template containing one or more "___" blanks
  code: string;
  // Accepted answers, one per blank (case-insensitive, trimmed)
  answers: string[];
  // 1-2 line explanation shown after a correct answer
  explanation: string;
  // Optional visual result that plays after the user gets it right
  simulation?: SimulationSpec;
  difficulty?: "easy" | "medium";
  hint?: string;
}

export type Step =
  | TextStep
  | QuizStep
  | InputStep
  | VisualStep
  | DebugStep
  | PredictionStep
  | TestStep
  | ScriptExplainStep;

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
          {
            id: "b1-test",
            type: "test",
            difficulty: "easy",
            question: "Lesson Test: create a variable named score with value 0.",
            code: `var score = ___`,
            answers: ["0"],
            explanation: "var creates the box, the name labels it, and the number is the starting value.",
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
          {
            id: "b2-test",
            type: "test",
            difficulty: "easy",
            question: "Lesson Test: write a function called jump.",
            code: `func ___():\n    velocity.y = -300`,
            answers: ["jump"],
            explanation: "func + name + () + : begins any function in GDScript.",
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
            id: "b3-walk",
            type: "script_explain",
            title: "Read this script line by line",
            intro: "Tap each line to see what it does.",
            code: [
              {
                line: "extends CharacterBody2D",
                explanation:
                  "Tells Godot this script controls a CharacterBody2D node — a movable character.",
              },
              {
                line: "func _ready():",
                explanation:
                  "_ready() runs once, the moment the scene appears.",
              },
              {
                line: '    print("Hello")',
                explanation:
                  'Prints the word "Hello" to the Output console for you to see.',
              },
            ],
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
          {
            id: "b3-test",
            type: "test",
            difficulty: "easy",
            question: 'Lesson Test: print the message "Hello".',
            code: `print("___")`,
            answers: ["Hello"],
            explanation: "Whatever sits inside the quotes is what shows up in the console.",
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
            id: "m1-walk",
            type: "script_explain",
            title: "Read this movement script",
            intro: "Tap each line — see how a player walks right.",
            code: [
              {
                line: "extends CharacterBody2D",
                explanation:
                  "Says this script controls a moving 2D body Godot already knows how to slide.",
              },
              {
                line: "func _physics_process(delta):",
                explanation:
                  "Runs every physics frame — perfect for movement.",
              },
              {
                line: "    velocity = Vector2(100, 0)",
                explanation:
                  "Sets velocity to 100 px/sec on X (right) and 0 on Y.",
              },
              {
                line: "    move_and_slide()",
                explanation:
                  "Actually moves the body using velocity and handles collisions.",
              },
            ],
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
          {
            id: "m1-test",
            type: "test",
            difficulty: "easy",
            question: "Lesson Test: complete the code so the player moves right.",
            code: `velocity.x = ___`,
            answers: ["200"],
            explanation: "A positive number on X moves right. Bigger number = faster.",
            simulation: { kind: "move", direction: "right", caption: "Player moves right" },
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
          {
            id: "m2-test",
            type: "test",
            difficulty: "easy",
            question: "Lesson Test: complete the call that applies velocity.",
            code: `move_and_____()`,
            answers: ["slide"],
            explanation: "move_and_slide() reads velocity, moves the body, and slides along walls.",
            simulation: { kind: "move", direction: "right", caption: "Sliding to the right" },
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
          {
            id: "m3-test",
            type: "test",
            difficulty: "medium",
            question: "Lesson Test: write a velocity that moves the player UP at speed 100.",
            code: `velocity = Vector2(0, ___)`,
            answers: ["-100"],
            explanation: "Up in 2D is the negative Y direction, so use -100.",
            simulation: { kind: "move", direction: "up", caption: "Player moves up" },
            hint: "Up = negative Y.",
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
          {
            id: "p1-test",
            type: "test",
            difficulty: "medium",
            question: "Lesson Test: complete the gravity line so the player falls.",
            code: `velocity.y += ___ * delta`,
            answers: ["gravity"],
            explanation: "gravity is a number you defined; multiplying by delta keeps it framerate-safe.",
            simulation: { kind: "gravity", caption: "Pulled by gravity" },
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
            explanation: "Po