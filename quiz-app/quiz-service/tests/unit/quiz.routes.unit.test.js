const jwt = require("jsonwebtoken");
const sinon = require("sinon");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../app");
const Quiz = require("../../models/quiz.model");
const Result = require("../../models/result.model");

const { expect } = chai;
chai.use(chaiHttp);

describe("Quiz API", () => {
  let quizStub, resultStub, jwtStub;

  const mockToken = "mocktoken";
  const mockReqUser = { id: "user123" };

  const mockQuiz = {
    _id: "quiz123",
    title: "Sample Quiz",
    questions: [
      {
        _id: "q1",
        text: "What is 2 + 2?",
        options: ["3", "4", "5"],
        correct_option: 1,
      },
    ],
  };

  const mockResult = {
    quiz_id: "quiz123",
    user_id: "user123",
    score: 1,
    passed: true,
    attempt: 1,
    answers: [
      {
        question_id: "q1",
        selected_option: 1,
        is_correct: true,
        correct_option: 1,
      },
    ],
  };

  beforeEach(() => {
    jwtStub = sinon.stub(jwt, "verify").returns(mockReqUser);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should create a quiz (POST /api/quizzes)", async () => {
    quizStub = sinon.stub(Quiz.prototype, "save").resolves(mockQuiz);

    const res = await chai
      .request(app)
      .post("/")
      .set("Authorization", `Bearer ${mockToken}`)
      .send(mockQuiz);
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("title", "Sample Quiz");
  });

  it("should get quiz questions without correct answers", async () => {
    quizStub = sinon.stub(Quiz, "findById").resolves(mockQuiz);

    const res = await chai
      .request(app)
      .get("/quiz123")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(res).to.have.status(200);
    expect(res.body.questions[0]).to.not.have.property("correct_option");
  });

  it("should evaluate submitted quiz and return score", async () => {
    const questions = [
      {
        _id: "q1",
        text: "What is 2 + 2?",
        options: ["3", "4", "5"],
        correct_option: 1,
      },
    ];

    // Patch the questions array with a fake `.id()` like Mongoose
    questions.id = function (id) {
      return this.find((q) => q._id === id);
    };

    const mockQuizWithId = {
      _id: "quiz123",
      title: "Sample Quiz",
      questions: questions,
    };

    sinon.stub(Quiz, "findById").resolves(mockQuizWithId);
    sinon.stub(Result, "countDocuments").resolves(0);
    sinon.stub(Result.prototype, "save").resolves(mockResult);

    const res = await chai
      .request(app)
      .post("/quiz123/submit")
      .set("Authorization", `Bearer mocktoken`)
      .send({
        answers: [
          {
            question_id: "q1",
            selected_option: 1,
          },
        ],
      });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("score", 1);
    expect(res.body).to.have.property("passed", true);
  });

  it("should return all attempt results for user", async () => {
    resultStub = sinon.stub(Result, "find").returns({
      sort: sinon.stub().returns([mockResult]),
    });

    const res = await chai
      .request(app)
      .get("/quiz123/results/user123")
      .set("Authorization", `Bearer ${mockToken}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("attempts", 1);
    expect(res.body.results[0]).to.have.property("score", 1);
  });
});
