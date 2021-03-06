module('Component - scroller', {
    setup: function () {
        var self = this;
        this.utilities = {
            common: Crocodoc.getUtilityForTest('common')
        };
        this.scope = Crocodoc.getScopeForTest(this);
        this.clock = sinon.useFakeTimers();
        this.component = Crocodoc.getComponentForTest('scroller', this.scope);
        this.$el = $('<div>');
        this.component.init(this.$el);
        this.SCROLL_EVENT_THROTTLE_INTERVAL = 200;
    },
    teardown: function () {
        // disable fake timers
        this.clock.restore();
        this.component.destroy();
    }
});

test('scroller should broadcast scrollstart and scroll message when scroll event is fired', function () {
    var broadcastSpy = this.spy(this.scope, 'broadcast');
    this.$el.trigger('scroll');
    this.clock.tick(this.SCROLL_EVENT_THROTTLE_INTERVAL);
    ok(broadcastSpy.calledWith('scrollstart', sinon.match.object), 'broadcasted scrollstart message');
    ok(broadcastSpy.calledWith('scroll', sinon.match.object), 'broadcasted scroll message');
});

test('scroller should not broadcast the scrollstart message more than once when scroll event is fired', function () {
    var broadcastSpy = this.spy(this.scope, 'broadcast');
    this.$el.trigger('scroll');
    this.clock.tick(this.SCROLL_EVENT_THROTTLE_INTERVAL);
    this.$el.trigger('scroll');
    this.clock.tick(this.SCROLL_EVENT_THROTTLE_INTERVAL);
    this.$el.trigger('scroll');
    this.clock.tick(this.SCROLL_EVENT_THROTTLE_INTERVAL);
    ok(broadcastSpy.withArgs('scrollstart', sinon.match.object).calledOnce, 'broadcasted scrollstart message');
});

test('scroller should broadcast scrollend message when scroll event is fired', function () {
    this.$el.trigger('scroll');
    // ignore the expected scroll message
    this.clock.tick(this.SCROLL_EVENT_THROTTLE_INTERVAL);
    this.mock(this.scope)
        .expects('broadcast')
        .withArgs('scrollend', sinon.match.object);
    this.clock.tick(this.SCROLL_EVENT_THROTTLE_INTERVAL);
});

test('scroller should broadcast scrollstart and scroll messages when touchstart event is fired', function () {
    var stub = this.stub(this.scope, 'broadcast');
    this.$el.trigger('touchstart');
    this.clock.tick(this.SCROLL_EVENT_THROTTLE_INTERVAL);

    ok(stub.calledWith('scrollstart', sinon.match.object), 'scrollstart should be broadcast');
    ok(stub.calledWith('scroll', sinon.match.object), 'scroll should be broadcast');
});

test('scroller should broadcast scroll message when touchmove event is fired', function () {
    var stub = this.stub(this.scope, 'broadcast');
    this.$el.trigger('touchmove');
    this.clock.tick(this.SCROLL_EVENT_THROTTLE_INTERVAL);
    ok(stub.calledWith('scroll', sinon.match.object), 'scroll should be broadcast');
});

test('scroller should broadcast scroll messages and eventually an scrollend message when touchstart, touchmove, and touchend event is fired', function () {
    var broadcastSpy = sinon.spy(this.scope, 'broadcast');
    this.$el.trigger('touchstart');
    this.$el.trigger('touchmove');
    this.$el.trigger('touchend');
    this.clock.tick(4000); // arbirary large amount of time
    ok(broadcastSpy.calledWith('scroll'), 'broadcasted scroll message');
    ok(broadcastSpy.calledWith('scrollend'), 'broadcasted scrollend message');
});
