### GameQuiz Feature

I will require your assistance in developing a new feature for this project.

The upcoming feature is the addition of a Quiz that has to do with Magnetism and Electromagnetism.

It should resemble a Multiple Choice Trivia. I will use the term "GameQuiz" to refer it from now on.

A json file named `magnetism_electromagnetism_quiz.json` will be created in the `src/assets` directory. This file will contain the quiz questions and answers.

Below is a preview of the file's content:

```json
{
  "magnetism": [
    {
      "id": 1,
      "question": "Which part of a magnet has the strongest pull?",
      "options": ["Middle", "Edges", "North Pole", "South Pole"],
      "correctAnswers": [2, 3],
      "type": "multiple"
    },
    {
      "id": 2,
      "question": "What materials are attracted to magnets?",
      "options": ["Plastic", "Iron", "Wood", "Copper"],
      "correctAnswers": [1],
      "type": "single"
    },
    {
      "id": 3,
      "question": "True or False: Magnets can attract all types of metals.",
      "options": ["True", "False"],
      "correctAnswers": [1],
      "type": "single"
    }
  ],
  "electromagnetism": [
    {
      "id": 1,
      "question": "What is needed to create an electromagnet?",
      "options": ["Battery", "Coil of wire", "Iron nail", "All of the above"],
      "correctAnswers": [3],
      "type": "single"
    },
    {
      "id": 2,
      "question": "Which of these can turn an electromagnet off?",
      "options": [
        "Adding more wire",
        "Turning off the electric current",
        "Using a stronger battery",
        "Cooling it down"
      ],
      "correctAnswers": [1],
      "type": "single"
    },
    {
      "id": 3,
      "question": "True or False: Electromagnets are always on.",
      "options": ["True", "False"],
      "correctAnswers": [1],
      "type": "single"
    }
  ]
}
```

### Quiz Score Tracking

Regarding the GameQuiz, database structure, we will need to implement the following: - we need to create a new table in the database to store the score of the player. - So we need a relationship between the player and the quiz table. - the quiz table should have the following fields: - id (primary key) - player_id (foreign key referencing the player table) - score (integer) - date (timestamp)

#### Database Setup Instructions

A Note on how to create the table in the database.
Step 1: Create a new Drizzle Schema.
Step 2: Create a new migration using Drizzle Kit the command should be `npm run gen:migrations`. This will generate a new migration file in the `drizzle/migrations` directory. The migration file will contain the raw SQL code to create the new table.
Step 3: Use the SQLocal's `sql` tagged template string to create the table in SQLite by using the Raw SQL that Drizzle Kit generated in Step 2. The new sql`...` should be added inside a function called `runMigrations` inside a file called `src/db/runMigrations.ts`.

Next, a new service has to be created. IMPORTANT, do not create any tests for this service, we will do that later.

Then, you can follow the instruction found in the project's doc files (README.md and CONTRIBUTING.md) to create the relevant feature directory inside the features directory.

Before you start implementing any code, create a outline/plan of what you are going to do. The steps should be defined in a clear and concise manner. This will help you to stay organized and focused on the task at hand and also for me to understand your thought process.

As always, I prioritize code quality and best practices. Take as much time as needed to ensure everything is implemented correctly and also double check your work.

---

2nd Iteration:

1. I personally added the gameQuiz Reducer to the store Root reducer. I am just telling you for your information, you don't need to do anything about it.

2. in `src\db\services\quiz.service.ts`: I want you to use Drizzle query builder to query the database, not raw SQL through the `sql` template string.

3. update useQuiz() hook to use the new quiz service.

### For Later but Do Not Forget

Game & GameSession Services are implemented but NOT used yet!
