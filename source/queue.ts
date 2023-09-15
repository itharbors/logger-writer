'use strict';

export class Queue<T>{
    private head: number = 0;
    private tail: number = 0;

    private items: {
        [key: number]: T,
    } = {};

    /**
     * 向队列尾部添加元素
     * @param item 
     */
    enqueue(item: T) {
        this.items[this.tail] = item;
        this.tail += 1;
    }

    /**
     * 从队列头部移除元素，并返回被移除的元素
     * @returns 
     */
    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }
        const item = this.items[this.head];
        delete this.items[this.head];
        this.head += 1;
        return item;
    }

    /**
     * 返回队列头部的元素，但不移除它
     * @returns 
     */
    peek(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.head];
    }

    /**
     * 检查队列是否为空
     * @returns 
     */
    isEmpty(): boolean {
        return this.tail - this.head <= 0;
    }

    /**
     * 返回队列的大小（包含的元素数量）
     * @returns 
     */
    size(): number {
        return this.tail - this.head;
    }

    /**
     * 清空队列
     */
    clear() {
        while (this.head < this.tail) {
            delete this.items[this.head];
            this.head += 1;
        }
    }
}
