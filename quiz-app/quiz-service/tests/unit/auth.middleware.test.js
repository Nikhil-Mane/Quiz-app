const { expect } = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../../middleware/auth");

describe("Auth Middleware Unit Tests", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Token Validation", () => {
    it("should call next() with valid token", () => {
      const mockUser = { id: "user123", email: "test@example.com" };
      const mockToken = "valid.jwt.token";

      sinon.stub(jwt, "verify").returns(mockUser);

      req.headers.authorization = `Bearer ${mockToken}`;

      verifyToken(req, res, next);

      expect(jwt.verify.calledWith(mockToken, process.env.JWT_SECRET)).to.be
        .true;
      expect(req.user).to.deep.equal(mockUser);
      expect(next.calledOnce).to.be.true;
      expect(res.status.called).to.be.false;
    });

    it("should return 401 when no authorization header", () => {
      verifyToken(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ message: "Token required" })).to.be.true;
      expect(next.called).to.be.false;
    });

    it("should return 401 when authorization header does not start with Bearer", () => {
      req.headers.authorization = "Invalid token";

      verifyToken(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ message: "Token required" })).to.be.true;
      expect(next.called).to.be.false;
    });

    it("should return 401 when token is invalid", () => {
      const mockToken = "invalid.jwt.token";

      sinon.stub(jwt, "verify").throws(new Error("Invalid token"));

      req.headers.authorization = `Bearer ${mockToken}`;

      verifyToken(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ message: "Invalid or expired token" })).to.be
        .true;
      expect(next.called).to.be.false;
    });

    it("should return 401 when token is expired", () => {
      const mockToken = "expired.jwt.token";

      sinon.stub(jwt, "verify").throws(new Error("jwt expired"));

      req.headers.authorization = `Bearer ${mockToken}`;

      verifyToken(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ message: "Invalid or expired token" })).to.be
        .true;
      expect(next.called).to.be.false;
    });

    it("should handle malformed authorization header", () => {
      req.headers.authorization = "Bearer";

      verifyToken(req, res, next);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWith({ message: "Token required" })).to.be.true;
      expect(next.called).to.be.false;
    });
  });

  describe("JWT Secret Environment Variable", () => {
    it("should use JWT_SECRET from environment", () => {
      const mockUser = { id: "user123" };
      const mockToken = "valid.jwt.token";

      const jwtVerifyStub = sinon.stub(jwt, "verify").returns(mockUser);

      req.headers.authorization = `Bearer ${mockToken}`;

      verifyToken(req, res, next);

      expect(jwtVerifyStub.calledWith(mockToken, process.env.JWT_SECRET)).to.be
        .true;
    });
  });
});
