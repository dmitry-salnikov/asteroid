import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import * as asteroid from "asteroid";

chai.use(sinonChai);

describe("`createClass` method", () => {

    it("return a class (function with prototype)", () => {
        const Asteroid = asteroid.createClass();
        expect(Asteroid).to.be.a("function");
        expect(Asteroid.prototype).to.be.an("object");
    });

});

describe("The `Asteroid` class returned by `createClass`", () => {

    const ddp = {ddpMethod: sinon.spy()};
    const login = {loginMethod: sinon.spy()};
    const methods = {methodsMethod: sinon.spy()};
    const loginWithPassword = {loginWithPasswordMethod: sinon.spy()};
    const subscriptions = {subscriptionsMethod: sinon.spy()};
    beforeEach(() => {
        asteroid.__Rewire__("ddp", ddp);
        asteroid.__Rewire__("login", login);
        asteroid.__Rewire__("methods", methods);
        asteroid.__Rewire__("loginWithPassword", loginWithPassword);
        asteroid.__Rewire__("subscriptions", subscriptions);
    });
    afterEach(() => {
        asteroid.__ResetDependency__("ddp");
        asteroid.__ResetDependency__("login");
        asteroid.__ResetDependency__("methods");
        asteroid.__ResetDependency__("loginWithPassword");
        asteroid.__ResetDependency__("subscriptions");
    });

    it("should have the methods defined by the 5 base mixins mixed-in", () => {
        const Asteroid = asteroid.createClass();
        expect(Asteroid.prototype).to.have.property("ddpMethod", ddp.ddpMethod);
        expect(Asteroid.prototype).to.have.property("methodsMethod", methods.methodsMethod);
        expect(Asteroid.prototype).to.have.property("subscriptionsMethod", subscriptions.subscriptionsMethod);
        expect(Asteroid.prototype).to.have.property("loginWithPasswordMethod", loginWithPassword.loginWithPasswordMethod);
        expect(Asteroid.prototype).to.have.property("loginMethod", login.loginMethod);
    });

    it("should haven't an init method in prototype", () => {
        const Asteroid = asteroid.createClass();
        expect(Asteroid.prototype.init).to.equal(undefined);
    });

    it("should call all mixins' init functions when constructing the instance", () => {
        const mixin_1 = {init: sinon.spy()};
        const mixin_2 = {init: sinon.spy()};
        const Asteroid = asteroid.createClass([mixin_1, mixin_2]);
        const instance = {};
        Asteroid.call(instance, 0, 1, 2);
        expect(mixin_1.init).to.have.been.calledWith(0, 1, 2);
        expect(mixin_1.init).to.have.been.calledOn(instance);
        expect(mixin_2.init).to.have.been.calledWith(0, 1, 2);
        expect(mixin_2.init).to.have.been.calledOn(instance);
    });

});
