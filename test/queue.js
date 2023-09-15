'use strict';

const { equal } = require('assert');
const { Queue } = require('../dist/queue');

describe('Queue', function() {

    describe('default', () => {
        const queue = new Queue();
        it('size', function() {
            equal(queue.size(), 0);
        });
        it('isEmpty', function() {
            equal(queue.isEmpty(), true);
        });
    });

    describe('enqueue', function() {
        const queue = new Queue();

        it('enqueue', function() {
            queue.enqueue('a');
            equal(queue.size(), 1);
            equal(queue.isEmpty(), false);
        });

        it('enqueue again', function() {
            queue.enqueue('b');
            equal(queue.size(), 2);
            equal(queue.isEmpty(), false);
        });
    });

    it('dequeue', function() {
        const queue = new Queue();
        equal(queue.dequeue(), undefined);
        equal(queue.size(), 0);
        equal(queue.isEmpty(), true);

        queue.enqueue('a');
        queue.enqueue('b');
        equal(queue.dequeue(), 'a');
        equal(queue.size(), 1);
        equal(queue.isEmpty(), false);

        equal(queue.dequeue(), 'b');
        equal(queue.size(), 0);
        equal(queue.isEmpty(), true);
    });

    it('peek', function() {
        const queue = new Queue();
        equal(queue.peek(), undefined);
        equal(queue.size(), 0);
        equal(queue.isEmpty(), true);

        queue.enqueue('a');
        queue.enqueue('b');
        equal(queue.peek(), 'a');
        equal(queue.size(), 2);
        equal(queue.isEmpty(), false);

        equal(queue.peek(), 'a');
        equal(queue.size(), 2);
        equal(queue.isEmpty(), false);
    });

    it('clear', function() {
        const queue = new Queue();
        queue.enqueue('a');
        queue.enqueue('b');
        queue.clear();

        equal(queue.size(), 0);
        equal(queue.isEmpty(), true);
    });
});