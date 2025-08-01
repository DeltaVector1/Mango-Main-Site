
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign$1(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    // Adapted from https://github.com/then/is-promise/blob/master/index.js
    // Distributed under MIT License https://github.com/then/is-promise/blob/master/LICENSE
    function is_promise(value) {
        return !!value && (typeof value === 'object' || typeof value === 'function') && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign$1($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty$2() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    /**
     * List of attributes that should always be set through the attr method,
     * because updating them through the property setter doesn't work reliably.
     * In the example of `width`/`height`, the problem is that the setter only
     * accepts numeric values, but the attribute can also be set to a string like `50%`.
     * If this list becomes too big, rethink this approach.
     */
    const always_set_through_set_attribute = ['width', 'height'];
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init$1(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const LOCATION = {};
    const ROUTER = {};
    const HISTORY = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const PARAM = /^:(.+)/;
    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Split up the URI into segments delimited by `/`
     * Strip starting/ending `/`
     * @param {string} uri
     * @return {string[]}
     */
    const segmentize = (uri) => uri.replace(/(^\/+|\/+$)/g, "").split("/");
    /**
     * Strip `str` of potential start and end `/`
     * @param {string} string
     * @return {string}
     */
    const stripSlashes = (string) => string.replace(/(^\/+|\/+$)/g, "");
    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    const rankRoute = (route, index) => {
        const score = route.default
            ? 0
            : segmentize(route.path).reduce((score, segment) => {
                  score += SEGMENT_POINTS;

                  if (segment === "") {
                      score += ROOT_POINTS;
                  } else if (PARAM.test(segment)) {
                      score += DYNAMIC_POINTS;
                  } else if (segment[0] === "*") {
                      score -= SEGMENT_POINTS + SPLAT_PENALTY;
                  } else {
                      score += STATIC_POINTS;
                  }

                  return score;
              }, 0);

        return { route, score, index };
    };
    /**
     * Give a score to all routes and sort them on that
     * If two routes have the exact same score, we go by index instead
     * @param {object[]} routes
     * @return {object[]}
     */
    const rankRoutes = (routes) =>
        routes
            .map(rankRoute)
            .sort((a, b) =>
                a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
            );
    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    const pick = (routes, uri) => {
        let match;
        let default_;

        const [uriPathname] = uri.split("?");
        const uriSegments = segmentize(uriPathname);
        const isRootUri = uriSegments[0] === "";
        const ranked = rankRoutes(routes);

        for (let i = 0, l = ranked.length; i < l; i++) {
            const route = ranked[i].route;
            let missed = false;

            if (route.default) {
                default_ = {
                    route,
                    params: {},
                    uri,
                };
                continue;
            }

            const routeSegments = segmentize(route.path);
            const params = {};
            const max = Math.max(uriSegments.length, routeSegments.length);
            let index = 0;

            for (; index < max; index++) {
                const routeSegment = routeSegments[index];
                const uriSegment = uriSegments[index];

                if (routeSegment && routeSegment[0] === "*") {
                    // Hit a splat, just grab the rest, and return a match
                    // uri:   /files/documents/work
                    // route: /files/* or /files/*splatname
                    const splatName =
                        routeSegment === "*" ? "*" : routeSegment.slice(1);

                    params[splatName] = uriSegments
                        .slice(index)
                        .map(decodeURIComponent)
                        .join("/");
                    break;
                }

                if (typeof uriSegment === "undefined") {
                    // URI is shorter than the route, no match
                    // uri:   /users
                    // route: /users/:userId
                    missed = true;
                    break;
                }

                const dynamicMatch = PARAM.exec(routeSegment);

                if (dynamicMatch && !isRootUri) {
                    const value = decodeURIComponent(uriSegment);
                    params[dynamicMatch[1]] = value;
                } else if (routeSegment !== uriSegment) {
                    // Current segments don't match, not dynamic, not splat, so no match
                    // uri:   /users/123/settings
                    // route: /users/:id/profile
                    missed = true;
                    break;
                }
            }

            if (!missed) {
                match = {
                    route,
                    params,
                    uri: "/" + uriSegments.slice(0, index).join("/"),
                };
                break;
            }
        }

        return match || default_ || null;
    };
    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) => pathname + (query ? `?${query}` : "");
    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    const resolve = (to, base) => {
        // /foo/bar, /baz/qux => /foo/bar
        if (to.startsWith("/")) return to;

        const [toPathname, toQuery] = to.split("?");
        const [basePathname] = base.split("?");
        const toSegments = segmentize(toPathname);
        const baseSegments = segmentize(basePathname);

        // ?a=b, /users?b=c => /users?a=b
        if (toSegments[0] === "") return addQuery(basePathname, toQuery);

        // profile, /users/789 => /users/789/profile

        if (!toSegments[0].startsWith(".")) {
            const pathname = baseSegments.concat(toSegments).join("/");
            return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
        }

        // ./       , /users/123 => /users/123
        // ../      , /users/123 => /users
        // ../..    , /users/123 => /
        // ../../one, /a/b/c/d   => /a/b/one
        // .././one , /a/b/c/d   => /a/b/c/one
        const allSegments = baseSegments.concat(toSegments);
        const segments = [];

        allSegments.forEach((segment) => {
            if (segment === "..") segments.pop();
            else if (segment !== ".") segments.push(segment);
        });

        return addQuery("/" + segments.join("/"), toQuery);
    };
    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    const combinePaths = (basepath, path) =>
        `${stripSlashes(
        path === "/"
            ? basepath
            : `${stripSlashes(basepath)}/${stripSlashes(path)}`
    )}/`;
    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    const shouldNavigate = (event) =>
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

    const canUseDOM = () =>
        typeof window !== "undefined" &&
        "document" in window &&
        "location" in window;

    /* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.59.2 */
    const file$c = "node_modules/svelte-routing/src/Link.svelte";
    const get_default_slot_changes$2 = dirty => ({ active: dirty & /*ariaCurrent*/ 4 });
    const get_default_slot_context$2 = ctx => ({ active: !!/*ariaCurrent*/ ctx[2] });

    function create_fragment$e(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], get_default_slot_context$2);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign$1(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$c, 40, 0, 1384);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, ariaCurrent*/ 32772)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, get_default_slot_changes$2),
    						get_default_slot_context$2
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let ariaCurrent;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let $base;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const location = getContext(LOCATION);
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const { base } = getContext(ROUTER);
    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const { navigate } = getContext(HISTORY);
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	const onClick = event => {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign$1(assign$1({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		getContext,
    		HISTORY,
    		LOCATION,
    		ROUTER,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		base,
    		navigate,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		ariaCurrent,
    		$location,
    		$base
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('to' in $$props) $$invalidate(7, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(9, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('isCurrent' in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16512) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			$$invalidate(11, isPartiallyCurrent = $location.pathname.startsWith(href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		$$invalidate(1, props = getProps({
    			location: $location,
    			href,
    			isPartiallyCurrent,
    			isCurrent,
    			existingProps: $$restProps
    		}));
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		base,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$location,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.59.2 */
    const get_default_slot_changes$1 = dirty => ({ params: dirty & /*routeParams*/ 4 });
    const get_default_slot_context$1 = ctx => ({ params: /*routeParams*/ ctx[2] });

    // (42:0) {#if $activeRoute && $activeRoute.route === route}
    function create_if_block$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$4, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$2();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(42:0) {#if $activeRoute && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (51:4) {:else}
    function create_else_block$6(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, routeParams*/ 132)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(51:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:4) {#if component}
    function create_if_block_1$4(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 12,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*component*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty$2();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*component*/ 1 && promise !== (promise = /*component*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(43:4) {#if component}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     import { getContext, onDestroy }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>     import { getContext, onDestroy }",
    		ctx
    	});

    	return block;
    }

    // (44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}
    function create_then_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*routeParams*/ ctx[2], /*routeProps*/ ctx[3]];
    	var switch_value = /*resolvedComponent*/ ctx[12]?.default || /*resolvedComponent*/ ctx[12];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign$1(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty$2();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*routeParams, routeProps*/ 12)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*resolvedComponent*/ ctx[12]?.default || /*resolvedComponent*/ ctx[12])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script>     import { getContext, onDestroy }
    function create_pending_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(1:0) <script>     import { getContext, onDestroy }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$2();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let routeParams = {};
    	let routeProps = {};
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	registerRoute(route);

    	onDestroy(() => {
    		unregisterRoute(route);
    	});

    	$$self.$$set = $$new_props => {
    		$$invalidate(11, $$props = assign$1(assign$1({}, $$props), exclude_internal_props($$new_props)));
    		if ('path' in $$new_props) $$invalidate(6, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		canUseDOM,
    		path,
    		component,
    		routeParams,
    		routeProps,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		route,
    		$activeRoute
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(11, $$props = assign$1(assign$1({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(6, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('routeParams' in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ('routeProps' in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($activeRoute && $activeRoute.route === route) {
    			$$invalidate(2, routeParams = $activeRoute.params);
    			const { component: c, path, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);

    			if (c) {
    				if (c.toString().startsWith("class ")) $$invalidate(0, component = c); else $$invalidate(0, component = c());
    			}

    			canUseDOM() && window?.scrollTo(0, 0);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		activeRoute,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$d, create_fragment$d, safe_not_equal, { path: 6, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier} [start]
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let started = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (started) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            started = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
                // We need to set this to false because callbacks can still happen despite having unsubscribed:
                // Callbacks might already be placed in the queue which doesn't know it should no longer
                // invoke this derived store.
                started = false;
            };
        });
    }

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const getLocation = (source) => {
        return {
            ...source.location,
            state: source.history.state,
            key: (source.history.state && source.history.state.key) || "initial",
        };
    };
    const createHistory = (source) => {
        const listeners = [];
        let location = getLocation(source);

        return {
            get location() {
                return location;
            },

            listen(listener) {
                listeners.push(listener);

                const popstateListener = () => {
                    location = getLocation(source);
                    listener({ location, action: "POP" });
                };

                source.addEventListener("popstate", popstateListener);

                return () => {
                    source.removeEventListener("popstate", popstateListener);
                    const index = listeners.indexOf(listener);
                    listeners.splice(index, 1);
                };
            },

            navigate(to, { state, replace = false } = {}) {
                state = { ...state, key: Date.now() + "" };
                // try...catch iOS Safari limits to 100 pushState calls
                try {
                    if (replace) source.history.replaceState(state, "", to);
                    else source.history.pushState(state, "", to);
                } catch (e) {
                    source.location[replace ? "replace" : "assign"](to);
                }
                location = getLocation(source);
                listeners.forEach((listener) =>
                    listener({ location, action: "PUSH" })
                );
                document.activeElement.blur();
            },
        };
    };
    // Stores history entries in memory for testing or other platforms like Native
    const createMemorySource = (initialPathname = "/") => {
        let index = 0;
        const stack = [{ pathname: initialPathname, search: "" }];
        const states = [];

        return {
            get location() {
                return stack[index];
            },
            addEventListener(name, fn) {},
            removeEventListener(name, fn) {},
            history: {
                get entries() {
                    return stack;
                },
                get index() {
                    return index;
                },
                get state() {
                    return states[index];
                },
                pushState(state, _, uri) {
                    const [pathname, search = ""] = uri.split("?");
                    index++;
                    stack.push({ pathname, search });
                    states.push(state);
                },
                replaceState(state, _, uri) {
                    const [pathname, search = ""] = uri.split("?");
                    stack[index] = { pathname, search };
                    states[index] = state;
                },
            },
        };
    };
    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const globalHistory = createHistory(
        canUseDOM() ? window : createMemorySource()
    );

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.59.2 */

    const { Object: Object_1 } = globals;

    const get_default_slot_changes = dirty => ({
    	route: dirty & /*$activeRoute*/ 2,
    	location: dirty & /*$location*/ 1
    });

    const get_default_slot_context = ctx => ({
    	route: /*$activeRoute*/ ctx[1] && /*$activeRoute*/ ctx[1].uri,
    	location: /*$location*/ ctx[0]
    });

    function create_fragment$c(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/ 2051)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $base;
    	let $activeRoute;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	setContext(HISTORY, history);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(9, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : history.location);

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(0, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, 'base');
    	component_subscribe($$self, base, value => $$invalidate(10, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (!activeRoute) return base;

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	const registerRoute = route => {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) return;

    			const matchingRoute = pick([route], $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => [...rs, route]);
    		}
    	};

    	const unregisterRoute = route => {
    		routes.update(rs => rs.filter(r => r !== route));
    	};

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(event => {
    				location.set(event.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ['basepath', 'url', 'history'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(6, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(7, url = $$props.url);
    		if ('history' in $$props) $$invalidate(8, history = $$props.history);
    		if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onMount,
    		setContext,
    		derived,
    		writable,
    		HISTORY,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		combinePaths,
    		pick,
    		basepath,
    		url,
    		history,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$routes,
    		$base,
    		$activeRoute
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(6, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(7, url = $$props.url);
    		if ('history' in $$props) $$invalidate(8, history = $$props.history);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 1024) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;
    				routes.update(rs => rs.map(r => Object.assign(r, { path: combinePaths(basepath, r._path) })));
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 513) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		$location,
    		$activeRoute,
    		routes,
    		activeRoute,
    		location,
    		base,
    		basepath,
    		url,
    		history,
    		$routes,
    		$base,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$c, create_fragment$c, safe_not_equal, { basepath: 6, url: 7, history: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * marked v4.3.0 - a markdown parser
     * Copyright (c) 2011-2023, Christopher Jeffrey. (MIT Licensed)
     * https://github.com/markedjs/marked
     */

    /**
     * DO NOT EDIT THIS FILE
     * The code in this file is generated from files in ./src/
     */

    function getDefaults() {
      return {
        async: false,
        baseUrl: null,
        breaks: false,
        extensions: null,
        gfm: true,
        headerIds: true,
        headerPrefix: '',
        highlight: null,
        hooks: null,
        langPrefix: 'language-',
        mangle: true,
        pedantic: false,
        renderer: null,
        sanitize: false,
        sanitizer: null,
        silent: false,
        smartypants: false,
        tokenizer: null,
        walkTokens: null,
        xhtml: false
      };
    }

    let defaults$5 = getDefaults();

    function changeDefaults(newDefaults) {
      defaults$5 = newDefaults;
    }

    /**
     * Helpers
     */
    const escapeTest = /[&<>"']/;
    const escapeReplace = new RegExp(escapeTest.source, 'g');
    const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
    const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');
    const escapeReplacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    const getEscapeReplacement = (ch) => escapeReplacements[ch];
    function escape(html, encode) {
      if (encode) {
        if (escapeTest.test(html)) {
          return html.replace(escapeReplace, getEscapeReplacement);
        }
      } else {
        if (escapeTestNoEncode.test(html)) {
          return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
        }
      }

      return html;
    }

    const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

    /**
     * @param {string} html
     */
    function unescape(html) {
      // explicitly match decimal, hex, and named HTML entities
      return html.replace(unescapeTest, (_, n) => {
        n = n.toLowerCase();
        if (n === 'colon') return ':';
        if (n.charAt(0) === '#') {
          return n.charAt(1) === 'x'
            ? String.fromCharCode(parseInt(n.substring(2), 16))
            : String.fromCharCode(+n.substring(1));
        }
        return '';
      });
    }

    const caret = /(^|[^\[])\^/g;

    /**
     * @param {string | RegExp} regex
     * @param {string} opt
     */
    function edit(regex, opt) {
      regex = typeof regex === 'string' ? regex : regex.source;
      opt = opt || '';
      const obj = {
        replace: (name, val) => {
          val = val.source || val;
          val = val.replace(caret, '$1');
          regex = regex.replace(name, val);
          return obj;
        },
        getRegex: () => {
          return new RegExp(regex, opt);
        }
      };
      return obj;
    }

    const nonWordAndColonTest = /[^\w:]/g;
    const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

    /**
     * @param {boolean} sanitize
     * @param {string} base
     * @param {string} href
     */
    function cleanUrl(sanitize, base, href) {
      if (sanitize) {
        let prot;
        try {
          prot = decodeURIComponent(unescape(href))
            .replace(nonWordAndColonTest, '')
            .toLowerCase();
        } catch (e) {
          return null;
        }
        if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
          return null;
        }
      }
      if (base && !originIndependentUrl.test(href)) {
        href = resolveUrl(base, href);
      }
      try {
        href = encodeURI(href).replace(/%25/g, '%');
      } catch (e) {
        return null;
      }
      return href;
    }

    const baseUrls = {};
    const justDomain = /^[^:]+:\/*[^/]*$/;
    const protocol = /^([^:]+:)[\s\S]*$/;
    const domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

    /**
     * @param {string} base
     * @param {string} href
     */
    function resolveUrl(base, href) {
      if (!baseUrls[' ' + base]) {
        // we can ignore everything in base after the last slash of its path component,
        // but we might need to add _that_
        // https://tools.ietf.org/html/rfc3986#section-3
        if (justDomain.test(base)) {
          baseUrls[' ' + base] = base + '/';
        } else {
          baseUrls[' ' + base] = rtrim(base, '/', true);
        }
      }
      base = baseUrls[' ' + base];
      const relativeBase = base.indexOf(':') === -1;

      if (href.substring(0, 2) === '//') {
        if (relativeBase) {
          return href;
        }
        return base.replace(protocol, '$1') + href;
      } else if (href.charAt(0) === '/') {
        if (relativeBase) {
          return href;
        }
        return base.replace(domain, '$1') + href;
      } else {
        return base + href;
      }
    }

    const noopTest = { exec: function noopTest() {} };

    function splitCells(tableRow, count) {
      // ensure that every cell-delimiting pipe has a space
      // before it to distinguish it from an escaped pipe
      const row = tableRow.replace(/\|/g, (match, offset, str) => {
          let escaped = false,
            curr = offset;
          while (--curr >= 0 && str[curr] === '\\') escaped = !escaped;
          if (escaped) {
            // odd number of slashes means | is escaped
            // so we leave it alone
            return '|';
          } else {
            // add space before unescaped |
            return ' |';
          }
        }),
        cells = row.split(/ \|/);
      let i = 0;

      // First/last cell in a row cannot be empty if it has no leading/trailing pipe
      if (!cells[0].trim()) { cells.shift(); }
      if (cells.length > 0 && !cells[cells.length - 1].trim()) { cells.pop(); }

      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count) cells.push('');
      }

      for (; i < cells.length; i++) {
        // leading or trailing whitespace is ignored per the gfm spec
        cells[i] = cells[i].trim().replace(/\\\|/g, '|');
      }
      return cells;
    }

    /**
     * Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
     * /c*$/ is vulnerable to REDOS.
     *
     * @param {string} str
     * @param {string} c
     * @param {boolean} invert Remove suffix of non-c chars instead. Default falsey.
     */
    function rtrim(str, c, invert) {
      const l = str.length;
      if (l === 0) {
        return '';
      }

      // Length of suffix matching the invert condition.
      let suffLen = 0;

      // Step left until we fail to match the invert condition.
      while (suffLen < l) {
        const currChar = str.charAt(l - suffLen - 1);
        if (currChar === c && !invert) {
          suffLen++;
        } else if (currChar !== c && invert) {
          suffLen++;
        } else {
          break;
        }
      }

      return str.slice(0, l - suffLen);
    }

    function findClosingBracket(str, b) {
      if (str.indexOf(b[1]) === -1) {
        return -1;
      }
      const l = str.length;
      let level = 0,
        i = 0;
      for (; i < l; i++) {
        if (str[i] === '\\') {
          i++;
        } else if (str[i] === b[0]) {
          level++;
        } else if (str[i] === b[1]) {
          level--;
          if (level < 0) {
            return i;
          }
        }
      }
      return -1;
    }

    function checkSanitizeDeprecation(opt) {
      if (opt && opt.sanitize && !opt.silent) {
        console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
      }
    }

    // copied from https://stackoverflow.com/a/5450113/806777
    /**
     * @param {string} pattern
     * @param {number} count
     */
    function repeatString(pattern, count) {
      if (count < 1) {
        return '';
      }
      let result = '';
      while (count > 1) {
        if (count & 1) {
          result += pattern;
        }
        count >>= 1;
        pattern += pattern;
      }
      return result + pattern;
    }

    function outputLink(cap, link, raw, lexer) {
      const href = link.href;
      const title = link.title ? escape(link.title) : null;
      const text = cap[1].replace(/\\([\[\]])/g, '$1');

      if (cap[0].charAt(0) !== '!') {
        lexer.state.inLink = true;
        const token = {
          type: 'link',
          raw,
          href,
          title,
          text,
          tokens: lexer.inlineTokens(text)
        };
        lexer.state.inLink = false;
        return token;
      }
      return {
        type: 'image',
        raw,
        href,
        title,
        text: escape(text)
      };
    }

    function indentCodeCompensation(raw, text) {
      const matchIndentToCode = raw.match(/^(\s+)(?:```)/);

      if (matchIndentToCode === null) {
        return text;
      }

      const indentToCode = matchIndentToCode[1];

      return text
        .split('\n')
        .map(node => {
          const matchIndentInNode = node.match(/^\s+/);
          if (matchIndentInNode === null) {
            return node;
          }

          const [indentInNode] = matchIndentInNode;

          if (indentInNode.length >= indentToCode.length) {
            return node.slice(indentToCode.length);
          }

          return node;
        })
        .join('\n');
    }

    /**
     * Tokenizer
     */
    class Tokenizer {
      constructor(options) {
        this.options = options || defaults$5;
      }

      space(src) {
        const cap = this.rules.block.newline.exec(src);
        if (cap && cap[0].length > 0) {
          return {
            type: 'space',
            raw: cap[0]
          };
        }
      }

      code(src) {
        const cap = this.rules.block.code.exec(src);
        if (cap) {
          const text = cap[0].replace(/^ {1,4}/gm, '');
          return {
            type: 'code',
            raw: cap[0],
            codeBlockStyle: 'indented',
            text: !this.options.pedantic
              ? rtrim(text, '\n')
              : text
          };
        }
      }

      fences(src) {
        const cap = this.rules.block.fences.exec(src);
        if (cap) {
          const raw = cap[0];
          const text = indentCodeCompensation(raw, cap[3] || '');

          return {
            type: 'code',
            raw,
            lang: cap[2] ? cap[2].trim().replace(this.rules.inline._escapes, '$1') : cap[2],
            text
          };
        }
      }

      heading(src) {
        const cap = this.rules.block.heading.exec(src);
        if (cap) {
          let text = cap[2].trim();

          // remove trailing #s
          if (/#$/.test(text)) {
            const trimmed = rtrim(text, '#');
            if (this.options.pedantic) {
              text = trimmed.trim();
            } else if (!trimmed || / $/.test(trimmed)) {
              // CommonMark requires space before trailing #s
              text = trimmed.trim();
            }
          }

          return {
            type: 'heading',
            raw: cap[0],
            depth: cap[1].length,
            text,
            tokens: this.lexer.inline(text)
          };
        }
      }

      hr(src) {
        const cap = this.rules.block.hr.exec(src);
        if (cap) {
          return {
            type: 'hr',
            raw: cap[0]
          };
        }
      }

      blockquote(src) {
        const cap = this.rules.block.blockquote.exec(src);
        if (cap) {
          const text = cap[0].replace(/^ *>[ \t]?/gm, '');
          const top = this.lexer.state.top;
          this.lexer.state.top = true;
          const tokens = this.lexer.blockTokens(text);
          this.lexer.state.top = top;
          return {
            type: 'blockquote',
            raw: cap[0],
            tokens,
            text
          };
        }
      }

      list(src) {
        let cap = this.rules.block.list.exec(src);
        if (cap) {
          let raw, istask, ischecked, indent, i, blankLine, endsWithBlankLine,
            line, nextLine, rawLine, itemContents, endEarly;

          let bull = cap[1].trim();
          const isordered = bull.length > 1;

          const list = {
            type: 'list',
            raw: '',
            ordered: isordered,
            start: isordered ? +bull.slice(0, -1) : '',
            loose: false,
            items: []
          };

          bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;

          if (this.options.pedantic) {
            bull = isordered ? bull : '[*+-]';
          }

          // Get next list item
          const itemRegex = new RegExp(`^( {0,3}${bull})((?:[\t ][^\\n]*)?(?:\\n|$))`);

          // Check if current bullet point can start a new List Item
          while (src) {
            endEarly = false;
            if (!(cap = itemRegex.exec(src))) {
              break;
            }

            if (this.rules.block.hr.test(src)) { // End list if bullet was actually HR (possibly move into itemRegex?)
              break;
            }

            raw = cap[0];
            src = src.substring(raw.length);

            line = cap[2].split('\n', 1)[0].replace(/^\t+/, (t) => ' '.repeat(3 * t.length));
            nextLine = src.split('\n', 1)[0];

            if (this.options.pedantic) {
              indent = 2;
              itemContents = line.trimLeft();
            } else {
              indent = cap[2].search(/[^ ]/); // Find first non-space char
              indent = indent > 4 ? 1 : indent; // Treat indented code blocks (> 4 spaces) as having only 1 indent
              itemContents = line.slice(indent);
              indent += cap[1].length;
            }

            blankLine = false;

            if (!line && /^ *$/.test(nextLine)) { // Items begin with at most one blank line
              raw += nextLine + '\n';
              src = src.substring(nextLine.length + 1);
              endEarly = true;
            }

            if (!endEarly) {
              const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`);
              const hrRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);
              const fencesBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`);
              const headingBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`);

              // Check if following lines should be included in List Item
              while (src) {
                rawLine = src.split('\n', 1)[0];
                nextLine = rawLine;

                // Re-align to follow commonmark nesting rules
                if (this.options.pedantic) {
                  nextLine = nextLine.replace(/^ {1,4}(?=( {4})*[^ ])/g, '  ');
                }

                // End list item if found code fences
                if (fencesBeginRegex.test(nextLine)) {
                  break;
                }

                // End list item if found start of new heading
                if (headingBeginRegex.test(nextLine)) {
                  break;
                }

                // End list item if found start of new bullet
                if (nextBulletRegex.test(nextLine)) {
                  break;
                }

                // Horizontal rule found
                if (hrRegex.test(src)) {
                  break;
                }

                if (nextLine.search(/[^ ]/) >= indent || !nextLine.trim()) { // Dedent if possible
                  itemContents += '\n' + nextLine.slice(indent);
                } else {
                  // not enough indentation
                  if (blankLine) {
                    break;
                  }

                  // paragraph continuation unless last line was a different block level element
                  if (line.search(/[^ ]/) >= 4) { // indented code block
                    break;
                  }
                  if (fencesBeginRegex.test(line)) {
                    break;
                  }
                  if (headingBeginRegex.test(line)) {
                    break;
                  }
                  if (hrRegex.test(line)) {
                    break;
                  }

                  itemContents += '\n' + nextLine;
                }

                if (!blankLine && !nextLine.trim()) { // Check if current line is blank
                  blankLine = true;
                }

                raw += rawLine + '\n';
                src = src.substring(rawLine.length + 1);
                line = nextLine.slice(indent);
              }
            }

            if (!list.loose) {
              // If the previous item ended with a blank line, the list is loose
              if (endsWithBlankLine) {
                list.loose = true;
              } else if (/\n *\n *$/.test(raw)) {
                endsWithBlankLine = true;
              }
            }

            // Check for task list items
            if (this.options.gfm) {
              istask = /^\[[ xX]\] /.exec(itemContents);
              if (istask) {
                ischecked = istask[0] !== '[ ] ';
                itemContents = itemContents.replace(/^\[[ xX]\] +/, '');
              }
            }

            list.items.push({
              type: 'list_item',
              raw,
              task: !!istask,
              checked: ischecked,
              loose: false,
              text: itemContents
            });

            list.raw += raw;
          }

          // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic
          list.items[list.items.length - 1].raw = raw.trimRight();
          list.items[list.items.length - 1].text = itemContents.trimRight();
          list.raw = list.raw.trimRight();

          const l = list.items.length;

          // Item child tokens handled here at end because we needed to have the final item to trim it first
          for (i = 0; i < l; i++) {
            this.lexer.state.top = false;
            list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);

            if (!list.loose) {
              // Check if list should be loose
              const spacers = list.items[i].tokens.filter(t => t.type === 'space');
              const hasMultipleLineBreaks = spacers.length > 0 && spacers.some(t => /\n.*\n/.test(t.raw));

              list.loose = hasMultipleLineBreaks;
            }
          }

          // Set all items to loose if list is loose
          if (list.loose) {
            for (i = 0; i < l; i++) {
              list.items[i].loose = true;
            }
          }

          return list;
        }
      }

      html(src) {
        const cap = this.rules.block.html.exec(src);
        if (cap) {
          const token = {
            type: 'html',
            raw: cap[0],
            pre: !this.options.sanitizer
              && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
            text: cap[0]
          };
          if (this.options.sanitize) {
            const text = this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]);
            token.type = 'paragraph';
            token.text = text;
            token.tokens = this.lexer.inline(text);
          }
          return token;
        }
      }

      def(src) {
        const cap = this.rules.block.def.exec(src);
        if (cap) {
          const tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
          const href = cap[2] ? cap[2].replace(/^<(.*)>$/, '$1').replace(this.rules.inline._escapes, '$1') : '';
          const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline._escapes, '$1') : cap[3];
          return {
            type: 'def',
            tag,
            raw: cap[0],
            href,
            title
          };
        }
      }

      table(src) {
        const cap = this.rules.block.table.exec(src);
        if (cap) {
          const item = {
            type: 'table',
            header: splitCells(cap[1]).map(c => { return { text: c }; }),
            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
            rows: cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, '').split('\n') : []
          };

          if (item.header.length === item.align.length) {
            item.raw = cap[0];

            let l = item.align.length;
            let i, j, k, row;
            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = 'right';
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = 'center';
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = 'left';
              } else {
                item.align[i] = null;
              }
            }

            l = item.rows.length;
            for (i = 0; i < l; i++) {
              item.rows[i] = splitCells(item.rows[i], item.header.length).map(c => { return { text: c }; });
            }

            // parse child tokens inside headers and cells

            // header child tokens
            l = item.header.length;
            for (j = 0; j < l; j++) {
              item.header[j].tokens = this.lexer.inline(item.header[j].text);
            }

            // cell child tokens
            l = item.rows.length;
            for (j = 0; j < l; j++) {
              row = item.rows[j];
              for (k = 0; k < row.length; k++) {
                row[k].tokens = this.lexer.inline(row[k].text);
              }
            }

            return item;
          }
        }
      }

      lheading(src) {
        const cap = this.rules.block.lheading.exec(src);
        if (cap) {
          return {
            type: 'heading',
            raw: cap[0],
            depth: cap[2].charAt(0) === '=' ? 1 : 2,
            text: cap[1],
            tokens: this.lexer.inline(cap[1])
          };
        }
      }

      paragraph(src) {
        const cap = this.rules.block.paragraph.exec(src);
        if (cap) {
          const text = cap[1].charAt(cap[1].length - 1) === '\n'
            ? cap[1].slice(0, -1)
            : cap[1];
          return {
            type: 'paragraph',
            raw: cap[0],
            text,
            tokens: this.lexer.inline(text)
          };
        }
      }

      text(src) {
        const cap = this.rules.block.text.exec(src);
        if (cap) {
          return {
            type: 'text',
            raw: cap[0],
            text: cap[0],
            tokens: this.lexer.inline(cap[0])
          };
        }
      }

      escape(src) {
        const cap = this.rules.inline.escape.exec(src);
        if (cap) {
          return {
            type: 'escape',
            raw: cap[0],
            text: escape(cap[1])
          };
        }
      }

      tag(src) {
        const cap = this.rules.inline.tag.exec(src);
        if (cap) {
          if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
            this.lexer.state.inLink = true;
          } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
            this.lexer.state.inLink = false;
          }
          if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            this.lexer.state.inRawBlock = true;
          } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            this.lexer.state.inRawBlock = false;
          }

          return {
            type: this.options.sanitize
              ? 'text'
              : 'html',
            raw: cap[0],
            inLink: this.lexer.state.inLink,
            inRawBlock: this.lexer.state.inRawBlock,
            text: this.options.sanitize
              ? (this.options.sanitizer
                ? this.options.sanitizer(cap[0])
                : escape(cap[0]))
              : cap[0]
          };
        }
      }

      link(src) {
        const cap = this.rules.inline.link.exec(src);
        if (cap) {
          const trimmedUrl = cap[2].trim();
          if (!this.options.pedantic && /^</.test(trimmedUrl)) {
            // commonmark requires matching angle brackets
            if (!(/>$/.test(trimmedUrl))) {
              return;
            }

            // ending angle bracket cannot be escaped
            const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');
            if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
              return;
            }
          } else {
            // find closing parenthesis
            const lastParenIndex = findClosingBracket(cap[2], '()');
            if (lastParenIndex > -1) {
              const start = cap[0].indexOf('!') === 0 ? 5 : 4;
              const linkLen = start + cap[1].length + lastParenIndex;
              cap[2] = cap[2].substring(0, lastParenIndex);
              cap[0] = cap[0].substring(0, linkLen).trim();
              cap[3] = '';
            }
          }
          let href = cap[2];
          let title = '';
          if (this.options.pedantic) {
            // split pedantic href and title
            const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

            if (link) {
              href = link[1];
              title = link[3];
            }
          } else {
            title = cap[3] ? cap[3].slice(1, -1) : '';
          }

          href = href.trim();
          if (/^</.test(href)) {
            if (this.options.pedantic && !(/>$/.test(trimmedUrl))) {
              // pedantic allows starting angle bracket without ending angle bracket
              href = href.slice(1);
            } else {
              href = href.slice(1, -1);
            }
          }
          return outputLink(cap, {
            href: href ? href.replace(this.rules.inline._escapes, '$1') : href,
            title: title ? title.replace(this.rules.inline._escapes, '$1') : title
          }, cap[0], this.lexer);
        }
      }

      reflink(src, links) {
        let cap;
        if ((cap = this.rules.inline.reflink.exec(src))
            || (cap = this.rules.inline.nolink.exec(src))) {
          let link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
          link = links[link.toLowerCase()];
          if (!link) {
            const text = cap[0].charAt(0);
            return {
              type: 'text',
              raw: text,
              text
            };
          }
          return outputLink(cap, link, cap[0], this.lexer);
        }
      }

      emStrong(src, maskedSrc, prevChar = '') {
        let match = this.rules.inline.emStrong.lDelim.exec(src);
        if (!match) return;

        // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well
        if (match[3] && prevChar.match(/[\p{L}\p{N}]/u)) return;

        const nextChar = match[1] || match[2] || '';

        if (!nextChar || (nextChar && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar)))) {
          const lLength = match[0].length - 1;
          let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;

          const endReg = match[0][0] === '*' ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
          endReg.lastIndex = 0;

          // Clip maskedSrc to same section of string as src (move to lexer?)
          maskedSrc = maskedSrc.slice(-1 * src.length + lLength);

          while ((match = endReg.exec(maskedSrc)) != null) {
            rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];

            if (!rDelim) continue; // skip single * in __abc*abc__

            rLength = rDelim.length;

            if (match[3] || match[4]) { // found another Left Delim
              delimTotal += rLength;
              continue;
            } else if (match[5] || match[6]) { // either Left or Right Delim
              if (lLength % 3 && !((lLength + rLength) % 3)) {
                midDelimTotal += rLength;
                continue; // CommonMark Emphasis Rules 9-10
              }
            }

            delimTotal -= rLength;

            if (delimTotal > 0) continue; // Haven't found enough closing delimiters

            // Remove extra characters. *a*** -> *a*
            rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);

            const raw = src.slice(0, lLength + match.index + (match[0].length - rDelim.length) + rLength);

            // Create `em` if smallest delimiter has odd char count. *a***
            if (Math.min(lLength, rLength) % 2) {
              const text = raw.slice(1, -1);
              return {
                type: 'em',
                raw,
                text,
                tokens: this.lexer.inlineTokens(text)
              };
            }

            // Create 'strong' if smallest delimiter has even char count. **a***
            const text = raw.slice(2, -2);
            return {
              type: 'strong',
              raw,
              text,
              tokens: this.lexer.inlineTokens(text)
            };
          }
        }
      }

      codespan(src) {
        const cap = this.rules.inline.code.exec(src);
        if (cap) {
          let text = cap[2].replace(/\n/g, ' ');
          const hasNonSpaceChars = /[^ ]/.test(text);
          const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
          if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
            text = text.substring(1, text.length - 1);
          }
          text = escape(text, true);
          return {
            type: 'codespan',
            raw: cap[0],
            text
          };
        }
      }

      br(src) {
        const cap = this.rules.inline.br.exec(src);
        if (cap) {
          return {
            type: 'br',
            raw: cap[0]
          };
        }
      }

      del(src) {
        const cap = this.rules.inline.del.exec(src);
        if (cap) {
          return {
            type: 'del',
            raw: cap[0],
            text: cap[2],
            tokens: this.lexer.inlineTokens(cap[2])
          };
        }
      }

      autolink(src, mangle) {
        const cap = this.rules.inline.autolink.exec(src);
        if (cap) {
          let text, href;
          if (cap[2] === '@') {
            text = escape(this.options.mangle ? mangle(cap[1]) : cap[1]);
            href = 'mailto:' + text;
          } else {
            text = escape(cap[1]);
            href = text;
          }

          return {
            type: 'link',
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: 'text',
                raw: text,
                text
              }
            ]
          };
        }
      }

      url(src, mangle) {
        let cap;
        if (cap = this.rules.inline.url.exec(src)) {
          let text, href;
          if (cap[2] === '@') {
            text = escape(this.options.mangle ? mangle(cap[0]) : cap[0]);
            href = 'mailto:' + text;
          } else {
            // do extended autolink path validation
            let prevCapZero;
            do {
              prevCapZero = cap[0];
              cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
            } while (prevCapZero !== cap[0]);
            text = escape(cap[0]);
            if (cap[1] === 'www.') {
              href = 'http://' + cap[0];
            } else {
              href = cap[0];
            }
          }
          return {
            type: 'link',
            raw: cap[0],
            text,
            href,
            tokens: [
              {
                type: 'text',
                raw: text,
                text
              }
            ]
          };
        }
      }

      inlineText(src, smartypants) {
        const cap = this.rules.inline.text.exec(src);
        if (cap) {
          let text;
          if (this.lexer.state.inRawBlock) {
            text = this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0];
          } else {
            text = escape(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
          }
          return {
            type: 'text',
            raw: cap[0],
            text
          };
        }
      }
    }

    /**
     * Block-Level Grammar
     */
    const block = {
      newline: /^(?: *(?:\n|$))+/,
      code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
      fences: /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
      hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
      heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
      blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
      list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
      html: '^ {0,3}(?:' // optional indentation
        + '<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
        + '|comment[^\\n]*(\\n+|$)' // (2)
        + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
        + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
        + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
        + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (6)
        + '|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) open tag
        + '|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) closing tag
        + ')',
      def: /^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
      table: noopTest,
      lheading: /^((?:.|\n(?!\n))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
      // regex template, placeholders will be replaced according to different paragraph
      // interruption rules of commonmark and the original markdown spec:
      _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
      text: /^[^\n]+/
    };

    block._label = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
    block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
    block.def = edit(block.def)
      .replace('label', block._label)
      .replace('title', block._title)
      .getRegex();

    block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
    block.listItemStart = edit(/^( *)(bull) */)
      .replace('bull', block.bullet)
      .getRegex();

    block.list = edit(block.list)
      .replace(/bull/g, block.bullet)
      .replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))')
      .replace('def', '\\n+(?=' + block.def.source + ')')
      .getRegex();

    block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
      + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
      + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
      + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
      + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
      + '|track|ul';
    block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
    block.html = edit(block.html, 'i')
      .replace('comment', block._comment)
      .replace('tag', block._tag)
      .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
      .getRegex();

    block.paragraph = edit(block._paragraph)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
      .replace('|table', '')
      .replace('blockquote', ' {0,3}>')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
      .getRegex();

    block.blockquote = edit(block.blockquote)
      .replace('paragraph', block.paragraph)
      .getRegex();

    /**
     * Normal Block Grammar
     */

    block.normal = { ...block };

    /**
     * GFM Block Grammar
     */

    block.gfm = {
      ...block.normal,
      table: '^ *([^\\n ].*\\|.*)\\n' // Header
        + ' {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?' // Align
        + '(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells
    };

    block.gfm.table = edit(block.gfm.table)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('blockquote', ' {0,3}>')
      .replace('code', ' {4}[^\\n]')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();

    block.gfm.paragraph = edit(block._paragraph)
      .replace('hr', block.hr)
      .replace('heading', ' {0,3}#{1,6} ')
      .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
      .replace('table', block.gfm.table) // interrupt paragraphs with table
      .replace('blockquote', ' {0,3}>')
      .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
      .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
      .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
      .getRegex();
    /**
     * Pedantic grammar (original John Gruber's loose markdown specification)
     */

    block.pedantic = {
      ...block.normal,
      html: edit(
        '^ *(?:comment *(?:\\n|\\s*$)'
        + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
        + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
        .replace('comment', block._comment)
        .replace(/tag/g, '(?!(?:'
          + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
          + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
          + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
        .getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^(#{1,6})(.*)(?:\n+|$)/,
      fences: noopTest, // fences not supported
      lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
      paragraph: edit(block.normal._paragraph)
        .replace('hr', block.hr)
        .replace('heading', ' *#{1,6} *[^\n]')
        .replace('lheading', block.lheading)
        .replace('blockquote', ' {0,3}>')
        .replace('|fences', '')
        .replace('|list', '')
        .replace('|html', '')
        .getRegex()
    };

    /**
     * Inline-Level Grammar
     */
    const inline = {
      escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
      autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
      url: noopTest,
      tag: '^comment'
        + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
        + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
        + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
        + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
        + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
      link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
      reflink: /^!?\[(label)\]\[(ref)\]/,
      nolink: /^!?\[(ref)\](?:\[\])?/,
      reflinkSearch: 'reflink|nolink(?!\\()',
      emStrong: {
        lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
        //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
        //          () Skip orphan inside strong                                      () Consume to delim     (1) #***                (2) a***#, a***                             (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
        rDelimAst: /^(?:[^_*\\]|\\.)*?\_\_(?:[^_*\\]|\\.)*?\*(?:[^_*\\]|\\.)*?(?=\_\_)|(?:[^*\\]|\\.)+(?=[^*])|[punct_](\*+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|(?:[^punct*_\s\\]|\\.)(\*+)(?=[^punct*_\s])/,
        rDelimUnd: /^(?:[^_*\\]|\\.)*?\*\*(?:[^_*\\]|\\.)*?\_(?:[^_*\\]|\\.)*?(?=\*\*)|(?:[^_\\]|\\.)+(?=[^_])|[punct*](\_+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/ // ^- Not allowed for _
      },
      code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
      br: /^( {2,}|\\)\n(?!\s*$)/,
      del: noopTest,
      text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
      punctuation: /^([\spunctuation])/
    };

    // list of punctuation marks from CommonMark spec
    // without * and _ to handle the different emphasis markers * and _
    inline._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
    inline.punctuation = edit(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();

    // sequences em should skip over [title](link), `code`, <html>
    inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
    // lookbehind is not available on Safari as of version 16
    // inline.escapedEmSt = /(?<=(?:^|[^\\)(?:\\[^])*)\\[*_]/g;
    inline.escapedEmSt = /(?:^|[^\\])(?:\\\\)*\\[*_]/g;

    inline._comment = edit(block._comment).replace('(?:-->|$)', '-->').getRegex();

    inline.emStrong.lDelim = edit(inline.emStrong.lDelim)
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline.emStrong.rDelimAst = edit(inline.emStrong.rDelimAst, 'g')
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline.emStrong.rDelimUnd = edit(inline.emStrong.rDelimUnd, 'g')
      .replace(/punct/g, inline._punctuation)
      .getRegex();

    inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

    inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
    inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
    inline.autolink = edit(inline.autolink)
      .replace('scheme', inline._scheme)
      .replace('email', inline._email)
      .getRegex();

    inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

    inline.tag = edit(inline.tag)
      .replace('comment', inline._comment)
      .replace('attribute', inline._attribute)
      .getRegex();

    inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
    inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
    inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

    inline.link = edit(inline.link)
      .replace('label', inline._label)
      .replace('href', inline._href)
      .replace('title', inline._title)
      .getRegex();

    inline.reflink = edit(inline.reflink)
      .replace('label', inline._label)
      .replace('ref', block._label)
      .getRegex();

    inline.nolink = edit(inline.nolink)
      .replace('ref', block._label)
      .getRegex();

    inline.reflinkSearch = edit(inline.reflinkSearch, 'g')
      .replace('reflink', inline.reflink)
      .replace('nolink', inline.nolink)
      .getRegex();

    /**
     * Normal Inline Grammar
     */

    inline.normal = { ...inline };

    /**
     * Pedantic Inline Grammar
     */

    inline.pedantic = {
      ...inline.normal,
      strong: {
        start: /^__|\*\*/,
        middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        endAst: /\*\*(?!\*)/g,
        endUnd: /__(?!_)/g
      },
      em: {
        start: /^_|\*/,
        middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
        endAst: /\*(?!\*)/g,
        endUnd: /_(?!_)/g
      },
      link: edit(/^!?\[(label)\]\((.*?)\)/)
        .replace('label', inline._label)
        .getRegex(),
      reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
        .replace('label', inline._label)
        .getRegex()
    };

    /**
     * GFM Inline Grammar
     */

    inline.gfm = {
      ...inline.normal,
      escape: edit(inline.escape).replace('])', '~|])').getRegex(),
      _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
      url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
      _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
      del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
      text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
    };

    inline.gfm.url = edit(inline.gfm.url, 'i')
      .replace('email', inline.gfm._extended_email)
      .getRegex();
    /**
     * GFM + Line Breaks Inline Grammar
     */

    inline.breaks = {
      ...inline.gfm,
      br: edit(inline.br).replace('{2,}', '*').getRegex(),
      text: edit(inline.gfm.text)
        .replace('\\b_', '\\b_| {2,}\\n')
        .replace(/\{2,\}/g, '*')
        .getRegex()
    };

    /**
     * smartypants text replacement
     * @param {string} text
     */
    function smartypants(text) {
      return text
        // em-dashes
        .replace(/---/g, '\u2014')
        // en-dashes
        .replace(/--/g, '\u2013')
        // opening singles
        .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
        // closing singles & apostrophes
        .replace(/'/g, '\u2019')
        // opening doubles
        .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
        // closing doubles
        .replace(/"/g, '\u201d')
        // ellipses
        .replace(/\.{3}/g, '\u2026');
    }

    /**
     * mangle email addresses
     * @param {string} text
     */
    function mangle(text) {
      let out = '',
        i,
        ch;

      const l = text.length;
      for (i = 0; i < l; i++) {
        ch = text.charCodeAt(i);
        if (Math.random() > 0.5) {
          ch = 'x' + ch.toString(16);
        }
        out += '&#' + ch + ';';
      }

      return out;
    }

    /**
     * Block Lexer
     */
    class Lexer {
      constructor(options) {
        this.tokens = [];
        this.tokens.links = Object.create(null);
        this.options = options || defaults$5;
        this.options.tokenizer = this.options.tokenizer || new Tokenizer();
        this.tokenizer = this.options.tokenizer;
        this.tokenizer.options = this.options;
        this.tokenizer.lexer = this;
        this.inlineQueue = [];
        this.state = {
          inLink: false,
          inRawBlock: false,
          top: true
        };

        const rules = {
          block: block.normal,
          inline: inline.normal
        };

        if (this.options.pedantic) {
          rules.block = block.pedantic;
          rules.inline = inline.pedantic;
        } else if (this.options.gfm) {
          rules.block = block.gfm;
          if (this.options.breaks) {
            rules.inline = inline.breaks;
          } else {
            rules.inline = inline.gfm;
          }
        }
        this.tokenizer.rules = rules;
      }

      /**
       * Expose Rules
       */
      static get rules() {
        return {
          block,
          inline
        };
      }

      /**
       * Static Lex Method
       */
      static lex(src, options) {
        const lexer = new Lexer(options);
        return lexer.lex(src);
      }

      /**
       * Static Lex Inline Method
       */
      static lexInline(src, options) {
        const lexer = new Lexer(options);
        return lexer.inlineTokens(src);
      }

      /**
       * Preprocessing
       */
      lex(src) {
        src = src
          .replace(/\r\n|\r/g, '\n');

        this.blockTokens(src, this.tokens);

        let next;
        while (next = this.inlineQueue.shift()) {
          this.inlineTokens(next.src, next.tokens);
        }

        return this.tokens;
      }

      /**
       * Lexing
       */
      blockTokens(src, tokens = []) {
        if (this.options.pedantic) {
          src = src.replace(/\t/g, '    ').replace(/^ +$/gm, '');
        } else {
          src = src.replace(/^( *)(\t+)/gm, (_, leading, tabs) => {
            return leading + '    '.repeat(tabs.length);
          });
        }

        let token, lastToken, cutSrc, lastParagraphClipped;

        while (src) {
          if (this.options.extensions
            && this.options.extensions.block
            && this.options.extensions.block.some((extTokenizer) => {
              if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                return true;
              }
              return false;
            })) {
            continue;
          }

          // newline
          if (token = this.tokenizer.space(src)) {
            src = src.substring(token.raw.length);
            if (token.raw.length === 1 && tokens.length > 0) {
              // if there's a single \n as a spacer, it's terminating the last line,
              // so move it there so that we don't get unecessary paragraph tags
              tokens[tokens.length - 1].raw += '\n';
            } else {
              tokens.push(token);
            }
            continue;
          }

          // code
          if (token = this.tokenizer.code(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            // An indented code block cannot interrupt a paragraph.
            if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // fences
          if (token = this.tokenizer.fences(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // heading
          if (token = this.tokenizer.heading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // hr
          if (token = this.tokenizer.hr(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // blockquote
          if (token = this.tokenizer.blockquote(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // list
          if (token = this.tokenizer.list(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // html
          if (token = this.tokenizer.html(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // def
          if (token = this.tokenizer.def(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.raw;
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else if (!this.tokens.links[token.tag]) {
              this.tokens.links[token.tag] = {
                href: token.href,
                title: token.title
              };
            }
            continue;
          }

          // table (gfm)
          if (token = this.tokenizer.table(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // lheading
          if (token = this.tokenizer.lheading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // top-level paragraph
          // prevent paragraph consuming extensions by clipping 'src' to extension start
          cutSrc = src;
          if (this.options.extensions && this.options.extensions.startBlock) {
            let startIndex = Infinity;
            const tempSrc = src.slice(1);
            let tempStart;
            this.options.extensions.startBlock.forEach(function(getStartIndex) {
              tempStart = getStartIndex.call({ lexer: this }, tempSrc);
              if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
            });
            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src.substring(0, startIndex + 1);
            }
          }
          if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
            lastToken = tokens[tokens.length - 1];
            if (lastParagraphClipped && lastToken.type === 'paragraph') {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue.pop();
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            lastParagraphClipped = (cutSrc.length !== src.length);
            src = src.substring(token.raw.length);
            continue;
          }

          // text
          if (token = this.tokenizer.text(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === 'text') {
              lastToken.raw += '\n' + token.raw;
              lastToken.text += '\n' + token.text;
              this.inlineQueue.pop();
              this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          if (src) {
            const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }

        this.state.top = true;
        return tokens;
      }

      inline(src, tokens = []) {
        this.inlineQueue.push({ src, tokens });
        return tokens;
      }

      /**
       * Lexing/Compiling
       */
      inlineTokens(src, tokens = []) {
        let token, lastToken, cutSrc;

        // String with links masked to avoid interference with em and strong
        let maskedSrc = src;
        let match;
        let keepPrevChar, prevChar;

        // Mask out reflinks
        if (this.tokens.links) {
          const links = Object.keys(this.tokens.links);
          if (links.length > 0) {
            while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
              if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
                maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
              }
            }
          }
        }
        // Mask out other blocks
        while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        }

        // Mask out escaped em & strong delimiters
        while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index + match[0].length - 2) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
          this.tokenizer.rules.inline.escapedEmSt.lastIndex--;
        }

        while (src) {
          if (!keepPrevChar) {
            prevChar = '';
          }
          keepPrevChar = false;

          // extensions
          if (this.options.extensions
            && this.options.extensions.inline
            && this.options.extensions.inline.some((extTokenizer) => {
              if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                src = src.substring(token.raw.length);
                tokens.push(token);
                return true;
              }
              return false;
            })) {
            continue;
          }

          // escape
          if (token = this.tokenizer.escape(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // tag
          if (token = this.tokenizer.tag(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && token.type === 'text' && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // link
          if (token = this.tokenizer.link(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // reflink, nolink
          if (token = this.tokenizer.reflink(src, this.tokens.links)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && token.type === 'text' && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          // em & strong
          if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // code
          if (token = this.tokenizer.codespan(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // br
          if (token = this.tokenizer.br(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // del (gfm)
          if (token = this.tokenizer.del(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // autolink
          if (token = this.tokenizer.autolink(src, mangle)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // url (gfm)
          if (!this.state.inLink && (token = this.tokenizer.url(src, mangle))) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }

          // text
          // prevent inlineText consuming extensions by clipping 'src' to extension start
          cutSrc = src;
          if (this.options.extensions && this.options.extensions.startInline) {
            let startIndex = Infinity;
            const tempSrc = src.slice(1);
            let tempStart;
            this.options.extensions.startInline.forEach(function(getStartIndex) {
              tempStart = getStartIndex.call({ lexer: this }, tempSrc);
              if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
            });
            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src.substring(0, startIndex + 1);
            }
          }
          if (token = this.tokenizer.inlineText(cutSrc, smartypants)) {
            src = src.substring(token.raw.length);
            if (token.raw.slice(-1) !== '_') { // Track prevChar before string of ____ started
              prevChar = token.raw.slice(-1);
            }
            keepPrevChar = true;
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === 'text') {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }

          if (src) {
            const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }

        return tokens;
      }
    }

    /**
     * Renderer
     */
    class Renderer {
      constructor(options) {
        this.options = options || defaults$5;
      }

      code(code, infostring, escaped) {
        const lang = (infostring || '').match(/\S*/)[0];
        if (this.options.highlight) {
          const out = this.options.highlight(code, lang);
          if (out != null && out !== code) {
            escaped = true;
            code = out;
          }
        }

        code = code.replace(/\n$/, '') + '\n';

        if (!lang) {
          return '<pre><code>'
            + (escaped ? code : escape(code, true))
            + '</code></pre>\n';
        }

        return '<pre><code class="'
          + this.options.langPrefix
          + escape(lang)
          + '">'
          + (escaped ? code : escape(code, true))
          + '</code></pre>\n';
      }

      /**
       * @param {string} quote
       */
      blockquote(quote) {
        return `<blockquote>\n${quote}</blockquote>\n`;
      }

      html(html) {
        return html;
      }

      /**
       * @param {string} text
       * @param {string} level
       * @param {string} raw
       * @param {any} slugger
       */
      heading(text, level, raw, slugger) {
        if (this.options.headerIds) {
          const id = this.options.headerPrefix + slugger.slug(raw);
          return `<h${level} id="${id}">${text}</h${level}>\n`;
        }

        // ignore IDs
        return `<h${level}>${text}</h${level}>\n`;
      }

      hr() {
        return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
      }

      list(body, ordered, start) {
        const type = ordered ? 'ol' : 'ul',
          startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
        return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
      }

      /**
       * @param {string} text
       */
      listitem(text) {
        return `<li>${text}</li>\n`;
      }

      checkbox(checked) {
        return '<input '
          + (checked ? 'checked="" ' : '')
          + 'disabled="" type="checkbox"'
          + (this.options.xhtml ? ' /' : '')
          + '> ';
      }

      /**
       * @param {string} text
       */
      paragraph(text) {
        return `<p>${text}</p>\n`;
      }

      /**
       * @param {string} header
       * @param {string} body
       */
      table(header, body) {
        if (body) body = `<tbody>${body}</tbody>`;

        return '<table>\n'
          + '<thead>\n'
          + header
          + '</thead>\n'
          + body
          + '</table>\n';
      }

      /**
       * @param {string} content
       */
      tablerow(content) {
        return `<tr>\n${content}</tr>\n`;
      }

      tablecell(content, flags) {
        const type = flags.header ? 'th' : 'td';
        const tag = flags.align
          ? `<${type} align="${flags.align}">`
          : `<${type}>`;
        return tag + content + `</${type}>\n`;
      }

      /**
       * span level renderer
       * @param {string} text
       */
      strong(text) {
        return `<strong>${text}</strong>`;
      }

      /**
       * @param {string} text
       */
      em(text) {
        return `<em>${text}</em>`;
      }

      /**
       * @param {string} text
       */
      codespan(text) {
        return `<code>${text}</code>`;
      }

      br() {
        return this.options.xhtml ? '<br/>' : '<br>';
      }

      /**
       * @param {string} text
       */
      del(text) {
        return `<del>${text}</del>`;
      }

      /**
       * @param {string} href
       * @param {string} title
       * @param {string} text
       */
      link(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }
        let out = '<a href="' + href + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
      }

      /**
       * @param {string} href
       * @param {string} title
       * @param {string} text
       */
      image(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }

        let out = `<img src="${href}" alt="${text}"`;
        if (title) {
          out += ` title="${title}"`;
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
      }

      text(text) {
        return text;
      }
    }

    /**
     * TextRenderer
     * returns only the textual part of the token
     */
    class TextRenderer {
      // no need for block level renderers
      strong(text) {
        return text;
      }

      em(text) {
        return text;
      }

      codespan(text) {
        return text;
      }

      del(text) {
        return text;
      }

      html(text) {
        return text;
      }

      text(text) {
        return text;
      }

      link(href, title, text) {
        return '' + text;
      }

      image(href, title, text) {
        return '' + text;
      }

      br() {
        return '';
      }
    }

    /**
     * Slugger generates header id
     */
    class Slugger {
      constructor() {
        this.seen = {};
      }

      /**
       * @param {string} value
       */
      serialize(value) {
        return value
          .toLowerCase()
          .trim()
          // remove html tags
          .replace(/<[!\/a-z].*?>/ig, '')
          // remove unwanted chars
          .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
          .replace(/\s/g, '-');
      }

      /**
       * Finds the next safe (unique) slug to use
       * @param {string} originalSlug
       * @param {boolean} isDryRun
       */
      getNextSafeSlug(originalSlug, isDryRun) {
        let slug = originalSlug;
        let occurenceAccumulator = 0;
        if (this.seen.hasOwnProperty(slug)) {
          occurenceAccumulator = this.seen[originalSlug];
          do {
            occurenceAccumulator++;
            slug = originalSlug + '-' + occurenceAccumulator;
          } while (this.seen.hasOwnProperty(slug));
        }
        if (!isDryRun) {
          this.seen[originalSlug] = occurenceAccumulator;
          this.seen[slug] = 0;
        }
        return slug;
      }

      /**
       * Convert string to unique id
       * @param {object} [options]
       * @param {boolean} [options.dryrun] Generates the next unique slug without
       * updating the internal accumulator.
       */
      slug(value, options = {}) {
        const slug = this.serialize(value);
        return this.getNextSafeSlug(slug, options.dryrun);
      }
    }

    /**
     * Parsing & Compiling
     */
    class Parser {
      constructor(options) {
        this.options = options || defaults$5;
        this.options.renderer = this.options.renderer || new Renderer();
        this.renderer = this.options.renderer;
        this.renderer.options = this.options;
        this.textRenderer = new TextRenderer();
        this.slugger = new Slugger();
      }

      /**
       * Static Parse Method
       */
      static parse(tokens, options) {
        const parser = new Parser(options);
        return parser.parse(tokens);
      }

      /**
       * Static Parse Inline Method
       */
      static parseInline(tokens, options) {
        const parser = new Parser(options);
        return parser.parseInline(tokens);
      }

      /**
       * Parse Loop
       */
      parse(tokens, top = true) {
        let out = '',
          i,
          j,
          k,
          l2,
          l3,
          row,
          cell,
          header,
          body,
          token,
          ordered,
          start,
          loose,
          itemBody,
          item,
          checked,
          task,
          checkbox,
          ret;

        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];

          // Run any renderer extensions
          if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
            if (ret !== false || !['space', 'hr', 'heading', 'code', 'table', 'blockquote', 'list', 'html', 'paragraph', 'text'].includes(token.type)) {
              out += ret || '';
              continue;
            }
          }

          switch (token.type) {
            case 'space': {
              continue;
            }
            case 'hr': {
              out += this.renderer.hr();
              continue;
            }
            case 'heading': {
              out += this.renderer.heading(
                this.parseInline(token.tokens),
                token.depth,
                unescape(this.parseInline(token.tokens, this.textRenderer)),
                this.slugger);
              continue;
            }
            case 'code': {
              out += this.renderer.code(token.text,
                token.lang,
                token.escaped);
              continue;
            }
            case 'table': {
              header = '';

              // header
              cell = '';
              l2 = token.header.length;
              for (j = 0; j < l2; j++) {
                cell += this.renderer.tablecell(
                  this.parseInline(token.header[j].tokens),
                  { header: true, align: token.align[j] }
                );
              }
              header += this.renderer.tablerow(cell);

              body = '';
              l2 = token.rows.length;
              for (j = 0; j < l2; j++) {
                row = token.rows[j];

                cell = '';
                l3 = row.length;
                for (k = 0; k < l3; k++) {
                  cell += this.renderer.tablecell(
                    this.parseInline(row[k].tokens),
                    { header: false, align: token.align[k] }
                  );
                }

                body += this.renderer.tablerow(cell);
              }
              out += this.renderer.table(header, body);
              continue;
            }
            case 'blockquote': {
              body = this.parse(token.tokens);
              out += this.renderer.blockquote(body);
              continue;
            }
            case 'list': {
              ordered = token.ordered;
              start = token.start;
              loose = token.loose;
              l2 = token.items.length;

              body = '';
              for (j = 0; j < l2; j++) {
                item = token.items[j];
                checked = item.checked;
                task = item.task;

                itemBody = '';
                if (item.task) {
                  checkbox = this.renderer.checkbox(checked);
                  if (loose) {
                    if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
                      item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
                      if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                        item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                      }
                    } else {
                      item.tokens.unshift({
                        type: 'text',
                        text: checkbox
                      });
                    }
                  } else {
                    itemBody += checkbox;
                  }
                }

                itemBody += this.parse(item.tokens, loose);
                body += this.renderer.listitem(itemBody, task, checked);
              }

              out += this.renderer.list(body, ordered, start);
              continue;
            }
            case 'html': {
              // TODO parse inline content if parameter markdown=1
              out += this.renderer.html(token.text);
              continue;
            }
            case 'paragraph': {
              out += this.renderer.paragraph(this.parseInline(token.tokens));
              continue;
            }
            case 'text': {
              body = token.tokens ? this.parseInline(token.tokens) : token.text;
              while (i + 1 < l && tokens[i + 1].type === 'text') {
                token = tokens[++i];
                body += '\n' + (token.tokens ? this.parseInline(token.tokens) : token.text);
              }
              out += top ? this.renderer.paragraph(body) : body;
              continue;
            }

            default: {
              const errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }

        return out;
      }

      /**
       * Parse Inline Tokens
       */
      parseInline(tokens, renderer) {
        renderer = renderer || this.renderer;
        let out = '',
          i,
          token,
          ret;

        const l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];

          // Run any renderer extensions
          if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
            if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(token.type)) {
              out += ret || '';
              continue;
            }
          }

          switch (token.type) {
            case 'escape': {
              out += renderer.text(token.text);
              break;
            }
            case 'html': {
              out += renderer.html(token.text);
              break;
            }
            case 'link': {
              out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
              break;
            }
            case 'image': {
              out += renderer.image(token.href, token.title, token.text);
              break;
            }
            case 'strong': {
              out += renderer.strong(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'em': {
              out += renderer.em(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'codespan': {
              out += renderer.codespan(token.text);
              break;
            }
            case 'br': {
              out += renderer.br();
              break;
            }
            case 'del': {
              out += renderer.del(this.parseInline(token.tokens, renderer));
              break;
            }
            case 'text': {
              out += renderer.text(token.text);
              break;
            }
            default: {
              const errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }
        return out;
      }
    }

    class Hooks {
      constructor(options) {
        this.options = options || defaults$5;
      }

      static passThroughHooks = new Set([
        'preprocess',
        'postprocess'
      ]);

      /**
       * Process markdown before marked
       */
      preprocess(markdown) {
        return markdown;
      }

      /**
       * Process HTML after marked is finished
       */
      postprocess(html) {
        return html;
      }
    }

    function onError(silent, async, callback) {
      return (e) => {
        e.message += '\nPlease report this to https://github.com/markedjs/marked.';

        if (silent) {
          const msg = '<p>An error occurred:</p><pre>'
            + escape(e.message + '', true)
            + '</pre>';
          if (async) {
            return Promise.resolve(msg);
          }
          if (callback) {
            callback(null, msg);
            return;
          }
          return msg;
        }

        if (async) {
          return Promise.reject(e);
        }
        if (callback) {
          callback(e);
          return;
        }
        throw e;
      };
    }

    function parseMarkdown$1(lexer, parser) {
      return (src, opt, callback) => {
        if (typeof opt === 'function') {
          callback = opt;
          opt = null;
        }

        const origOpt = { ...opt };
        opt = { ...marked.defaults, ...origOpt };
        const throwError = onError(opt.silent, opt.async, callback);

        // throw error in case of non string input
        if (typeof src === 'undefined' || src === null) {
          return throwError(new Error('marked(): input parameter is undefined or null'));
        }
        if (typeof src !== 'string') {
          return throwError(new Error('marked(): input parameter is of type '
            + Object.prototype.toString.call(src) + ', string expected'));
        }

        checkSanitizeDeprecation(opt);

        if (opt.hooks) {
          opt.hooks.options = opt;
        }

        if (callback) {
          const highlight = opt.highlight;
          let tokens;

          try {
            if (opt.hooks) {
              src = opt.hooks.preprocess(src);
            }
            tokens = lexer(src, opt);
          } catch (e) {
            return throwError(e);
          }

          const done = function(err) {
            let out;

            if (!err) {
              try {
                if (opt.walkTokens) {
                  marked.walkTokens(tokens, opt.walkTokens);
                }
                out = parser(tokens, opt);
                if (opt.hooks) {
                  out = opt.hooks.postprocess(out);
                }
              } catch (e) {
                err = e;
              }
            }

            opt.highlight = highlight;

            return err
              ? throwError(err)
              : callback(null, out);
          };

          if (!highlight || highlight.length < 3) {
            return done();
          }

          delete opt.highlight;

          if (!tokens.length) return done();

          let pending = 0;
          marked.walkTokens(tokens, function(token) {
            if (token.type === 'code') {
              pending++;
              setTimeout(() => {
                highlight(token.text, token.lang, function(err, code) {
                  if (err) {
                    return done(err);
                  }
                  if (code != null && code !== token.text) {
                    token.text = code;
                    token.escaped = true;
                  }

                  pending--;
                  if (pending === 0) {
                    done();
                  }
                });
              }, 0);
            }
          });

          if (pending === 0) {
            done();
          }

          return;
        }

        if (opt.async) {
          return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src)
            .then(src => lexer(src, opt))
            .then(tokens => opt.walkTokens ? Promise.all(marked.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens)
            .then(tokens => parser(tokens, opt))
            .then(html => opt.hooks ? opt.hooks.postprocess(html) : html)
            .catch(throwError);
        }

        try {
          if (opt.hooks) {
            src = opt.hooks.preprocess(src);
          }
          const tokens = lexer(src, opt);
          if (opt.walkTokens) {
            marked.walkTokens(tokens, opt.walkTokens);
          }
          let html = parser(tokens, opt);
          if (opt.hooks) {
            html = opt.hooks.postprocess(html);
          }
          return html;
        } catch (e) {
          return throwError(e);
        }
      };
    }

    /**
     * Marked
     */
    function marked(src, opt, callback) {
      return parseMarkdown$1(Lexer.lex, Parser.parse)(src, opt, callback);
    }

    /**
     * Options
     */

    marked.options =
    marked.setOptions = function(opt) {
      marked.defaults = { ...marked.defaults, ...opt };
      changeDefaults(marked.defaults);
      return marked;
    };

    marked.getDefaults = getDefaults;

    marked.defaults = defaults$5;

    /**
     * Use Extension
     */

    marked.use = function(...args) {
      const extensions = marked.defaults.extensions || { renderers: {}, childTokens: {} };

      args.forEach((pack) => {
        // copy options to new object
        const opts = { ...pack };

        // set async to true if it was set to true before
        opts.async = marked.defaults.async || opts.async || false;

        // ==-- Parse "addon" extensions --== //
        if (pack.extensions) {
          pack.extensions.forEach((ext) => {
            if (!ext.name) {
              throw new Error('extension name required');
            }
            if (ext.renderer) { // Renderer extensions
              const prevRenderer = extensions.renderers[ext.name];
              if (prevRenderer) {
                // Replace extension with func to run new extension but fall back if false
                extensions.renderers[ext.name] = function(...args) {
                  let ret = ext.renderer.apply(this, args);
                  if (ret === false) {
                    ret = prevRenderer.apply(this, args);
                  }
                  return ret;
                };
              } else {
                extensions.renderers[ext.name] = ext.renderer;
              }
            }
            if (ext.tokenizer) { // Tokenizer Extensions
              if (!ext.level || (ext.level !== 'block' && ext.level !== 'inline')) {
                throw new Error("extension level must be 'block' or 'inline'");
              }
              if (extensions[ext.level]) {
                extensions[ext.level].unshift(ext.tokenizer);
              } else {
                extensions[ext.level] = [ext.tokenizer];
              }
              if (ext.start) { // Function to check for start of token
                if (ext.level === 'block') {
                  if (extensions.startBlock) {
                    extensions.startBlock.push(ext.start);
                  } else {
                    extensions.startBlock = [ext.start];
                  }
                } else if (ext.level === 'inline') {
                  if (extensions.startInline) {
                    extensions.startInline.push(ext.start);
                  } else {
                    extensions.startInline = [ext.start];
                  }
                }
              }
            }
            if (ext.childTokens) { // Child tokens to be visited by walkTokens
              extensions.childTokens[ext.name] = ext.childTokens;
            }
          });
          opts.extensions = extensions;
        }

        // ==-- Parse "overwrite" extensions --== //
        if (pack.renderer) {
          const renderer = marked.defaults.renderer || new Renderer();
          for (const prop in pack.renderer) {
            const prevRenderer = renderer[prop];
            // Replace renderer with func to run extension, but fall back if false
            renderer[prop] = (...args) => {
              let ret = pack.renderer[prop].apply(renderer, args);
              if (ret === false) {
                ret = prevRenderer.apply(renderer, args);
              }
              return ret;
            };
          }
          opts.renderer = renderer;
        }
        if (pack.tokenizer) {
          const tokenizer = marked.defaults.tokenizer || new Tokenizer();
          for (const prop in pack.tokenizer) {
            const prevTokenizer = tokenizer[prop];
            // Replace tokenizer with func to run extension, but fall back if false
            tokenizer[prop] = (...args) => {
              let ret = pack.tokenizer[prop].apply(tokenizer, args);
              if (ret === false) {
                ret = prevTokenizer.apply(tokenizer, args);
              }
              return ret;
            };
          }
          opts.tokenizer = tokenizer;
        }

        // ==-- Parse Hooks extensions --== //
        if (pack.hooks) {
          const hooks = marked.defaults.hooks || new Hooks();
          for (const prop in pack.hooks) {
            const prevHook = hooks[prop];
            if (Hooks.passThroughHooks.has(prop)) {
              hooks[prop] = (arg) => {
                if (marked.defaults.async) {
                  return Promise.resolve(pack.hooks[prop].call(hooks, arg)).then(ret => {
                    return prevHook.call(hooks, ret);
                  });
                }

                const ret = pack.hooks[prop].call(hooks, arg);
                return prevHook.call(hooks, ret);
              };
            } else {
              hooks[prop] = (...args) => {
                let ret = pack.hooks[prop].apply(hooks, args);
                if (ret === false) {
                  ret = prevHook.apply(hooks, args);
                }
                return ret;
              };
            }
          }
          opts.hooks = hooks;
        }

        // ==-- Parse WalkTokens extensions --== //
        if (pack.walkTokens) {
          const walkTokens = marked.defaults.walkTokens;
          opts.walkTokens = function(token) {
            let values = [];
            values.push(pack.walkTokens.call(this, token));
            if (walkTokens) {
              values = values.concat(walkTokens.call(this, token));
            }
            return values;
          };
        }

        marked.setOptions(opts);
      });
    };

    /**
     * Run callback for every token
     */

    marked.walkTokens = function(tokens, callback) {
      let values = [];
      for (const token of tokens) {
        values = values.concat(callback.call(marked, token));
        switch (token.type) {
          case 'table': {
            for (const cell of token.header) {
              values = values.concat(marked.walkTokens(cell.tokens, callback));
            }
            for (const row of token.rows) {
              for (const cell of row) {
                values = values.concat(marked.walkTokens(cell.tokens, callback));
              }
            }
            break;
          }
          case 'list': {
            values = values.concat(marked.walkTokens(token.items, callback));
            break;
          }
          default: {
            if (marked.defaults.extensions && marked.defaults.extensions.childTokens && marked.defaults.extensions.childTokens[token.type]) { // Walk any extensions
              marked.defaults.extensions.childTokens[token.type].forEach(function(childTokens) {
                values = values.concat(marked.walkTokens(token[childTokens], callback));
              });
            } else if (token.tokens) {
              values = values.concat(marked.walkTokens(token.tokens, callback));
            }
          }
        }
      }
      return values;
    };

    /**
     * Parse Inline
     * @param {string} src
     */
    marked.parseInline = parseMarkdown$1(Lexer.lexInline, Parser.parseInline);

    /**
     * Expose
     */
    marked.Parser = Parser;
    marked.parser = Parser.parse;
    marked.Renderer = Renderer;
    marked.TextRenderer = TextRenderer;
    marked.Lexer = Lexer;
    marked.lexer = Lexer.lex;
    marked.Tokenizer = Tokenizer;
    marked.Slugger = Slugger;
    marked.Hooks = Hooks;
    marked.parse = marked;

    marked.options;
    marked.setOptions;
    marked.use;
    marked.walkTokens;
    marked.parseInline;
    Parser.parse;
    Lexer.lex;

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function getAugmentedNamespace(n) {
      if (n.__esModule) return n;
      var f = n.default;
    	if (typeof f == "function") {
    		var a = function a () {
    			if (this instanceof a) {
    				var args = [null];
    				args.push.apply(args, arguments);
    				var Ctor = Function.bind.apply(f, args);
    				return new Ctor();
    			}
    			return f.apply(this, arguments);
    		};
    		a.prototype = f.prototype;
      } else a = {};
      Object.defineProperty(a, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    var empty = {};

    var empty$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        default: empty
    });

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(empty$1);

    var toString$1 = Object.prototype.toString;

    var kindOf = function kindOf(val) {
      if (val === void 0) return 'undefined';
      if (val === null) return 'null';

      var type = typeof val;
      if (type === 'boolean') return 'boolean';
      if (type === 'string') return 'string';
      if (type === 'number') return 'number';
      if (type === 'symbol') return 'symbol';
      if (type === 'function') {
        return isGeneratorFn(val) ? 'generatorfunction' : 'function';
      }

      if (isArray$1(val)) return 'array';
      if (isBuffer$2(val)) return 'buffer';
      if (isArguments(val)) return 'arguments';
      if (isDate(val)) return 'date';
      if (isError(val)) return 'error';
      if (isRegexp(val)) return 'regexp';

      switch (ctorName(val)) {
        case 'Symbol': return 'symbol';
        case 'Promise': return 'promise';

        // Set, Map, WeakSet, WeakMap
        case 'WeakMap': return 'weakmap';
        case 'WeakSet': return 'weakset';
        case 'Map': return 'map';
        case 'Set': return 'set';

        // 8-bit typed arrays
        case 'Int8Array': return 'int8array';
        case 'Uint8Array': return 'uint8array';
        case 'Uint8ClampedArray': return 'uint8clampedarray';

        // 16-bit typed arrays
        case 'Int16Array': return 'int16array';
        case 'Uint16Array': return 'uint16array';

        // 32-bit typed arrays
        case 'Int32Array': return 'int32array';
        case 'Uint32Array': return 'uint32array';
        case 'Float32Array': return 'float32array';
        case 'Float64Array': return 'float64array';
      }

      if (isGeneratorObj(val)) {
        return 'generator';
      }

      // Non-plain objects
      type = toString$1.call(val);
      switch (type) {
        case '[object Object]': return 'object';
        // iterators
        case '[object Map Iterator]': return 'mapiterator';
        case '[object Set Iterator]': return 'setiterator';
        case '[object String Iterator]': return 'stringiterator';
        case '[object Array Iterator]': return 'arrayiterator';
      }

      // other
      return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
    };

    function ctorName(val) {
      return typeof val.constructor === 'function' ? val.constructor.name : null;
    }

    function isArray$1(val) {
      if (Array.isArray) return Array.isArray(val);
      return val instanceof Array;
    }

    function isError(val) {
      return val instanceof Error || (typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number');
    }

    function isDate(val) {
      if (val instanceof Date) return true;
      return typeof val.toDateString === 'function'
        && typeof val.getDate === 'function'
        && typeof val.setDate === 'function';
    }

    function isRegexp(val) {
      if (val instanceof RegExp) return true;
      return typeof val.flags === 'string'
        && typeof val.ignoreCase === 'boolean'
        && typeof val.multiline === 'boolean'
        && typeof val.global === 'boolean';
    }

    function isGeneratorFn(name, val) {
      return ctorName(name) === 'GeneratorFunction';
    }

    function isGeneratorObj(val) {
      return typeof val.throw === 'function'
        && typeof val.return === 'function'
        && typeof val.next === 'function';
    }

    function isArguments(val) {
      try {
        if (typeof val.length === 'number' && typeof val.callee === 'function') {
          return true;
        }
      } catch (err) {
        if (err.message.indexOf('callee') !== -1) {
          return true;
        }
      }
      return false;
    }

    /**
     * If you need to support Safari 5-7 (8-10 yr-old browser),
     * take a look at https://github.com/feross/is-buffer
     */

    function isBuffer$2(val) {
      if (val.constructor && typeof val.constructor.isBuffer === 'function') {
        return val.constructor.isBuffer(val);
      }
      return false;
    }

    /*!
     * is-extendable <https://github.com/jonschlinkert/is-extendable>
     *
     * Copyright (c) 2015, Jon Schlinkert.
     * Licensed under the MIT License.
     */

    var isExtendable = function isExtendable(val) {
      return typeof val !== 'undefined' && val !== null
        && (typeof val === 'object' || typeof val === 'function');
    };

    var isObject$1 = isExtendable;

    var extendShallow = function extend(o/*, objects*/) {
      if (!isObject$1(o)) { o = {}; }

      var len = arguments.length;
      for (var i = 1; i < len; i++) {
        var obj = arguments[i];

        if (isObject$1(obj)) {
          assign(o, obj);
        }
      }
      return o;
    };

    function assign(a, b) {
      for (var key in b) {
        if (hasOwn(b, key)) {
          a[key] = b[key];
        }
      }
    }

    /**
     * Returns true if the given `key` is an own property of `obj`.
     */

    function hasOwn(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
    }

    var typeOf$2 = kindOf;
    var extend$1 = extendShallow;

    /**
     * Parse sections in `input` with the given `options`.
     *
     * ```js
     * var sections = require('{%= name %}');
     * var result = sections(input, options);
     * // { content: 'Content before sections', sections: [] }
     * ```
     * @param {String|Buffer|Object} `input` If input is an object, it's `content` property must be a string or buffer.
     * @param {Object} options
     * @return {Object} Returns an object with a `content` string and an array of `sections` objects.
     * @api public
     */

    var sectionMatter = function(input, options) {
      if (typeof options === 'function') {
        options = { parse: options };
      }

      var file = toObject(input);
      var defaults = {section_delimiter: '---', parse: identity};
      var opts = extend$1({}, defaults, options);
      var delim = opts.section_delimiter;
      var lines = file.content.split(/\r?\n/);
      var sections = null;
      var section = createSection();
      var content = [];
      var stack = [];

      function initSections(val) {
        file.content = val;
        sections = [];
        content = [];
      }

      function closeSection(val) {
        if (stack.length) {
          section.key = getKey(stack[0], delim);
          section.content = val;
          opts.parse(section, sections);
          sections.push(section);
          section = createSection();
          content = [];
          stack = [];
        }
      }

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var len = stack.length;
        var ln = line.trim();

        if (isDelimiter(ln, delim)) {
          if (ln.length === 3 && i !== 0) {
            if (len === 0 || len === 2) {
              content.push(line);
              continue;
            }
            stack.push(ln);
            section.data = content.join('\n');
            content = [];
            continue;
          }

          if (sections === null) {
            initSections(content.join('\n'));
          }

          if (len === 2) {
            closeSection(content.join('\n'));
          }

          stack.push(ln);
          continue;
        }

        content.push(line);
      }

      if (sections === null) {
        initSections(content.join('\n'));
      } else {
        closeSection(content.join('\n'));
      }

      file.sections = sections;
      return file;
    };

    function isDelimiter(line, delim) {
      if (line.slice(0, delim.length) !== delim) {
        return false;
      }
      if (line.charAt(delim.length + 1) === delim.slice(-1)) {
        return false;
      }
      return true;
    }

    function toObject(input) {
      if (typeOf$2(input) !== 'object') {
        input = { content: input };
      }

      if (typeof input.content !== 'string' && !isBuffer$1(input.content)) {
        throw new TypeError('expected a buffer or string');
      }

      input.content = input.content.toString();
      input.sections = [];
      return input;
    }

    function getKey(val, delim) {
      return val ? val.slice(delim.length).trim() : '';
    }

    function createSection() {
      return { key: '', data: '', content: '' };
    }

    function identity(val) {
      return val;
    }

    function isBuffer$1(val) {
      if (val && val.constructor && typeof val.constructor.isBuffer === 'function') {
        return val.constructor.isBuffer(val);
      }
      return false;
    }

    var engines$2 = {exports: {}};

    var jsYaml$1 = {};

    var loader$1 = {};

    var common$6 = {};

    function isNothing(subject) {
      return (typeof subject === 'undefined') || (subject === null);
    }


    function isObject(subject) {
      return (typeof subject === 'object') && (subject !== null);
    }


    function toArray(sequence) {
      if (Array.isArray(sequence)) return sequence;
      else if (isNothing(sequence)) return [];

      return [ sequence ];
    }


    function extend(target, source) {
      var index, length, key, sourceKeys;

      if (source) {
        sourceKeys = Object.keys(source);

        for (index = 0, length = sourceKeys.length; index < length; index += 1) {
          key = sourceKeys[index];
          target[key] = source[key];
        }
      }

      return target;
    }


    function repeat(string, count) {
      var result = '', cycle;

      for (cycle = 0; cycle < count; cycle += 1) {
        result += string;
      }

      return result;
    }


    function isNegativeZero(number) {
      return (number === 0) && (Number.NEGATIVE_INFINITY === 1 / number);
    }


    common$6.isNothing      = isNothing;
    common$6.isObject       = isObject;
    common$6.toArray        = toArray;
    common$6.repeat         = repeat;
    common$6.isNegativeZero = isNegativeZero;
    common$6.extend         = extend;

    function YAMLException$4(reason, mark) {
      // Super constructor
      Error.call(this);

      this.name = 'YAMLException';
      this.reason = reason;
      this.mark = mark;
      this.message = (this.reason || '(unknown reason)') + (this.mark ? ' ' + this.mark.toString() : '');

      // Include stack trace in error object
      if (Error.captureStackTrace) {
        // Chrome and NodeJS
        Error.captureStackTrace(this, this.constructor);
      } else {
        // FF, IE 10+ and Safari 6+. Fallback for others
        this.stack = (new Error()).stack || '';
      }
    }


    // Inherit from Error
    YAMLException$4.prototype = Object.create(Error.prototype);
    YAMLException$4.prototype.constructor = YAMLException$4;


    YAMLException$4.prototype.toString = function toString(compact) {
      var result = this.name + ': ';

      result += this.reason || '(unknown reason)';

      if (!compact && this.mark) {
        result += ' ' + this.mark.toString();
      }

      return result;
    };


    var exception = YAMLException$4;

    var common$5 = common$6;


    function Mark$1(name, buffer, position, line, column) {
      this.name     = name;
      this.buffer   = buffer;
      this.position = position;
      this.line     = line;
      this.column   = column;
    }


    Mark$1.prototype.getSnippet = function getSnippet(indent, maxLength) {
      var head, start, tail, end, snippet;

      if (!this.buffer) return null;

      indent = indent || 4;
      maxLength = maxLength || 75;

      head = '';
      start = this.position;

      while (start > 0 && '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(start - 1)) === -1) {
        start -= 1;
        if (this.position - start > (maxLength / 2 - 1)) {
          head = ' ... ';
          start += 5;
          break;
        }
      }

      tail = '';
      end = this.position;

      while (end < this.buffer.length && '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(end)) === -1) {
        end += 1;
        if (end - this.position > (maxLength / 2 - 1)) {
          tail = ' ... ';
          end -= 5;
          break;
        }
      }

      snippet = this.buffer.slice(start, end);

      return common$5.repeat(' ', indent) + head + snippet + tail + '\n' +
             common$5.repeat(' ', indent + this.position - start + head.length) + '^';
    };


    Mark$1.prototype.toString = function toString(compact) {
      var snippet, where = '';

      if (this.name) {
        where += 'in "' + this.name + '" ';
      }

      where += 'at line ' + (this.line + 1) + ', column ' + (this.column + 1);

      if (!compact) {
        snippet = this.getSnippet();

        if (snippet) {
          where += ':\n' + snippet;
        }
      }

      return where;
    };


    var mark = Mark$1;

    var YAMLException$3 = exception;

    var TYPE_CONSTRUCTOR_OPTIONS = [
      'kind',
      'resolve',
      'construct',
      'instanceOf',
      'predicate',
      'represent',
      'defaultStyle',
      'styleAliases'
    ];

    var YAML_NODE_KINDS = [
      'scalar',
      'sequence',
      'mapping'
    ];

    function compileStyleAliases(map) {
      var result = {};

      if (map !== null) {
        Object.keys(map).forEach(function (style) {
          map[style].forEach(function (alias) {
            result[String(alias)] = style;
          });
        });
      }

      return result;
    }

    function Type$h(tag, options) {
      options = options || {};

      Object.keys(options).forEach(function (name) {
        if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
          throw new YAMLException$3('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
        }
      });

      // TODO: Add tag format check.
      this.tag          = tag;
      this.kind         = options['kind']         || null;
      this.resolve      = options['resolve']      || function () { return true; };
      this.construct    = options['construct']    || function (data) { return data; };
      this.instanceOf   = options['instanceOf']   || null;
      this.predicate    = options['predicate']    || null;
      this.represent    = options['represent']    || null;
      this.defaultStyle = options['defaultStyle'] || null;
      this.styleAliases = compileStyleAliases(options['styleAliases'] || null);

      if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
        throw new YAMLException$3('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
      }
    }

    var type = Type$h;

    /*eslint-disable max-len*/

    var common$4        = common$6;
    var YAMLException$2 = exception;
    var Type$g          = type;


    function compileList(schema, name, result) {
      var exclude = [];

      schema.include.forEach(function (includedSchema) {
        result = compileList(includedSchema, name, result);
      });

      schema[name].forEach(function (currentType) {
        result.forEach(function (previousType, previousIndex) {
          if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
            exclude.push(previousIndex);
          }
        });

        result.push(currentType);
      });

      return result.filter(function (type, index) {
        return exclude.indexOf(index) === -1;
      });
    }


    function compileMap(/* lists... */) {
      var result = {
            scalar: {},
            sequence: {},
            mapping: {},
            fallback: {}
          }, index, length;

      function collectType(type) {
        result[type.kind][type.tag] = result['fallback'][type.tag] = type;
      }

      for (index = 0, length = arguments.length; index < length; index += 1) {
        arguments[index].forEach(collectType);
      }
      return result;
    }


    function Schema$5(definition) {
      this.include  = definition.include  || [];
      this.implicit = definition.implicit || [];
      this.explicit = definition.explicit || [];

      this.implicit.forEach(function (type) {
        if (type.loadKind && type.loadKind !== 'scalar') {
          throw new YAMLException$2('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
        }
      });

      this.compiledImplicit = compileList(this, 'implicit', []);
      this.compiledExplicit = compileList(this, 'explicit', []);
      this.compiledTypeMap  = compileMap(this.compiledImplicit, this.compiledExplicit);
    }


    Schema$5.DEFAULT = null;


    Schema$5.create = function createSchema() {
      var schemas, types;

      switch (arguments.length) {
        case 1:
          schemas = Schema$5.DEFAULT;
          types = arguments[0];
          break;

        case 2:
          schemas = arguments[0];
          types = arguments[1];
          break;

        default:
          throw new YAMLException$2('Wrong number of arguments for Schema.create function');
      }

      schemas = common$4.toArray(schemas);
      types = common$4.toArray(types);

      if (!schemas.every(function (schema) { return schema instanceof Schema$5; })) {
        throw new YAMLException$2('Specified list of super schemas (or a single Schema object) contains a non-Schema object.');
      }

      if (!types.every(function (type) { return type instanceof Type$g; })) {
        throw new YAMLException$2('Specified list of YAML types (or a single Type object) contains a non-Type object.');
      }

      return new Schema$5({
        include: schemas,
        explicit: types
      });
    };


    var schema = Schema$5;

    var Type$f = type;

    var str = new Type$f('tag:yaml.org,2002:str', {
      kind: 'scalar',
      construct: function (data) { return data !== null ? data : ''; }
    });

    var Type$e = type;

    var seq = new Type$e('tag:yaml.org,2002:seq', {
      kind: 'sequence',
      construct: function (data) { return data !== null ? data : []; }
    });

    var Type$d = type;

    var map = new Type$d('tag:yaml.org,2002:map', {
      kind: 'mapping',
      construct: function (data) { return data !== null ? data : {}; }
    });

    var Schema$4 = schema;


    var failsafe = new Schema$4({
      explicit: [
        str,
        seq,
        map
      ]
    });

    var Type$c = type;

    function resolveYamlNull(data) {
      if (data === null) return true;

      var max = data.length;

      return (max === 1 && data === '~') ||
             (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
    }

    function constructYamlNull() {
      return null;
    }

    function isNull(object) {
      return object === null;
    }

    var _null = new Type$c('tag:yaml.org,2002:null', {
      kind: 'scalar',
      resolve: resolveYamlNull,
      construct: constructYamlNull,
      predicate: isNull,
      represent: {
        canonical: function () { return '~';    },
        lowercase: function () { return 'null'; },
        uppercase: function () { return 'NULL'; },
        camelcase: function () { return 'Null'; }
      },
      defaultStyle: 'lowercase'
    });

    var Type$b = type;

    function resolveYamlBoolean(data) {
      if (data === null) return false;

      var max = data.length;

      return (max === 4 && (data === 'true' || data === 'True' || data === 'TRUE')) ||
             (max === 5 && (data === 'false' || data === 'False' || data === 'FALSE'));
    }

    function constructYamlBoolean(data) {
      return data === 'true' ||
             data === 'True' ||
             data === 'TRUE';
    }

    function isBoolean(object) {
      return Object.prototype.toString.call(object) === '[object Boolean]';
    }

    var bool = new Type$b('tag:yaml.org,2002:bool', {
      kind: 'scalar',
      resolve: resolveYamlBoolean,
      construct: constructYamlBoolean,
      predicate: isBoolean,
      represent: {
        lowercase: function (object) { return object ? 'true' : 'false'; },
        uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
        camelcase: function (object) { return object ? 'True' : 'False'; }
      },
      defaultStyle: 'lowercase'
    });

    var common$3 = common$6;
    var Type$a   = type;

    function isHexCode(c) {
      return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) ||
             ((0x41/* A */ <= c) && (c <= 0x46/* F */)) ||
             ((0x61/* a */ <= c) && (c <= 0x66/* f */));
    }

    function isOctCode(c) {
      return ((0x30/* 0 */ <= c) && (c <= 0x37/* 7 */));
    }

    function isDecCode(c) {
      return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */));
    }

    function resolveYamlInteger(data) {
      if (data === null) return false;

      var max = data.length,
          index = 0,
          hasDigits = false,
          ch;

      if (!max) return false;

      ch = data[index];

      // sign
      if (ch === '-' || ch === '+') {
        ch = data[++index];
      }

      if (ch === '0') {
        // 0
        if (index + 1 === max) return true;
        ch = data[++index];

        // base 2, base 8, base 16

        if (ch === 'b') {
          // base 2
          index++;

          for (; index < max; index++) {
            ch = data[index];
            if (ch === '_') continue;
            if (ch !== '0' && ch !== '1') return false;
            hasDigits = true;
          }
          return hasDigits && ch !== '_';
        }


        if (ch === 'x') {
          // base 16
          index++;

          for (; index < max; index++) {
            ch = data[index];
            if (ch === '_') continue;
            if (!isHexCode(data.charCodeAt(index))) return false;
            hasDigits = true;
          }
          return hasDigits && ch !== '_';
        }

        // base 8
        for (; index < max; index++) {
          ch = data[index];
          if (ch === '_') continue;
          if (!isOctCode(data.charCodeAt(index))) return false;
          hasDigits = true;
        }
        return hasDigits && ch !== '_';
      }

      // base 10 (except 0) or base 60

      // value should not start with `_`;
      if (ch === '_') return false;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (ch === ':') break;
        if (!isDecCode(data.charCodeAt(index))) {
          return false;
        }
        hasDigits = true;
      }

      // Should have digits and should not end with `_`
      if (!hasDigits || ch === '_') return false;

      // if !base60 - done;
      if (ch !== ':') return true;

      // base60 almost not used, no needs to optimize
      return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
    }

    function constructYamlInteger(data) {
      var value = data, sign = 1, ch, base, digits = [];

      if (value.indexOf('_') !== -1) {
        value = value.replace(/_/g, '');
      }

      ch = value[0];

      if (ch === '-' || ch === '+') {
        if (ch === '-') sign = -1;
        value = value.slice(1);
        ch = value[0];
      }

      if (value === '0') return 0;

      if (ch === '0') {
        if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
        if (value[1] === 'x') return sign * parseInt(value, 16);
        return sign * parseInt(value, 8);
      }

      if (value.indexOf(':') !== -1) {
        value.split(':').forEach(function (v) {
          digits.unshift(parseInt(v, 10));
        });

        value = 0;
        base = 1;

        digits.forEach(function (d) {
          value += (d * base);
          base *= 60;
        });

        return sign * value;

      }

      return sign * parseInt(value, 10);
    }

    function isInteger(object) {
      return (Object.prototype.toString.call(object)) === '[object Number]' &&
             (object % 1 === 0 && !common$3.isNegativeZero(object));
    }

    var int = new Type$a('tag:yaml.org,2002:int', {
      kind: 'scalar',
      resolve: resolveYamlInteger,
      construct: constructYamlInteger,
      predicate: isInteger,
      represent: {
        binary:      function (obj) { return obj >= 0 ? '0b' + obj.toString(2) : '-0b' + obj.toString(2).slice(1); },
        octal:       function (obj) { return obj >= 0 ? '0'  + obj.toString(8) : '-0'  + obj.toString(8).slice(1); },
        decimal:     function (obj) { return obj.toString(10); },
        /* eslint-disable max-len */
        hexadecimal: function (obj) { return obj >= 0 ? '0x' + obj.toString(16).toUpperCase() :  '-0x' + obj.toString(16).toUpperCase().slice(1); }
      },
      defaultStyle: 'decimal',
      styleAliases: {
        binary:      [ 2,  'bin' ],
        octal:       [ 8,  'oct' ],
        decimal:     [ 10, 'dec' ],
        hexadecimal: [ 16, 'hex' ]
      }
    });

    var common$2 = common$6;
    var Type$9   = type;

    var YAML_FLOAT_PATTERN = new RegExp(
      // 2.5e4, 2.5 and integers
      '^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?' +
      // .2e4, .2
      // special case, seems not from spec
      '|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?' +
      // 20:59
      '|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*' +
      // .inf
      '|[-+]?\\.(?:inf|Inf|INF)' +
      // .nan
      '|\\.(?:nan|NaN|NAN))$');

    function resolveYamlFloat(data) {
      if (data === null) return false;

      if (!YAML_FLOAT_PATTERN.test(data) ||
          // Quick hack to not allow integers end with `_`
          // Probably should update regexp & check speed
          data[data.length - 1] === '_') {
        return false;
      }

      return true;
    }

    function constructYamlFloat(data) {
      var value, sign, base, digits;

      value  = data.replace(/_/g, '').toLowerCase();
      sign   = value[0] === '-' ? -1 : 1;
      digits = [];

      if ('+-'.indexOf(value[0]) >= 0) {
        value = value.slice(1);
      }

      if (value === '.inf') {
        return (sign === 1) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

      } else if (value === '.nan') {
        return NaN;

      } else if (value.indexOf(':') >= 0) {
        value.split(':').forEach(function (v) {
          digits.unshift(parseFloat(v, 10));
        });

        value = 0.0;
        base = 1;

        digits.forEach(function (d) {
          value += d * base;
          base *= 60;
        });

        return sign * value;

      }
      return sign * parseFloat(value, 10);
    }


    var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;

    function representYamlFloat(object, style) {
      var res;

      if (isNaN(object)) {
        switch (style) {
          case 'lowercase': return '.nan';
          case 'uppercase': return '.NAN';
          case 'camelcase': return '.NaN';
        }
      } else if (Number.POSITIVE_INFINITY === object) {
        switch (style) {
          case 'lowercase': return '.inf';
          case 'uppercase': return '.INF';
          case 'camelcase': return '.Inf';
        }
      } else if (Number.NEGATIVE_INFINITY === object) {
        switch (style) {
          case 'lowercase': return '-.inf';
          case 'uppercase': return '-.INF';
          case 'camelcase': return '-.Inf';
        }
      } else if (common$2.isNegativeZero(object)) {
        return '-0.0';
      }

      res = object.toString(10);

      // JS stringifier can build scientific format without dots: 5e-100,
      // while YAML requres dot: 5.e-100. Fix it with simple hack

      return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
    }

    function isFloat(object) {
      return (Object.prototype.toString.call(object) === '[object Number]') &&
             (object % 1 !== 0 || common$2.isNegativeZero(object));
    }

    var float = new Type$9('tag:yaml.org,2002:float', {
      kind: 'scalar',
      resolve: resolveYamlFloat,
      construct: constructYamlFloat,
      predicate: isFloat,
      represent: representYamlFloat,
      defaultStyle: 'lowercase'
    });

    var Schema$3 = schema;


    var json = new Schema$3({
      include: [
        failsafe
      ],
      implicit: [
        _null,
        bool,
        int,
        float
      ]
    });

    var Schema$2 = schema;


    var core = new Schema$2({
      include: [
        json
      ]
    });

    var Type$8 = type;

    var YAML_DATE_REGEXP = new RegExp(
      '^([0-9][0-9][0-9][0-9])'          + // [1] year
      '-([0-9][0-9])'                    + // [2] month
      '-([0-9][0-9])$');                   // [3] day

    var YAML_TIMESTAMP_REGEXP = new RegExp(
      '^([0-9][0-9][0-9][0-9])'          + // [1] year
      '-([0-9][0-9]?)'                   + // [2] month
      '-([0-9][0-9]?)'                   + // [3] day
      '(?:[Tt]|[ \\t]+)'                 + // ...
      '([0-9][0-9]?)'                    + // [4] hour
      ':([0-9][0-9])'                    + // [5] minute
      ':([0-9][0-9])'                    + // [6] second
      '(?:\\.([0-9]*))?'                 + // [7] fraction
      '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
      '(?::([0-9][0-9]))?))?$');           // [11] tz_minute

    function resolveYamlTimestamp(data) {
      if (data === null) return false;
      if (YAML_DATE_REGEXP.exec(data) !== null) return true;
      if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
      return false;
    }

    function constructYamlTimestamp(data) {
      var match, year, month, day, hour, minute, second, fraction = 0,
          delta = null, tz_hour, tz_minute, date;

      match = YAML_DATE_REGEXP.exec(data);
      if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);

      if (match === null) throw new Error('Date resolve error');

      // match: [1] year [2] month [3] day

      year = +(match[1]);
      month = +(match[2]) - 1; // JS month starts with 0
      day = +(match[3]);

      if (!match[4]) { // no hour
        return new Date(Date.UTC(year, month, day));
      }

      // match: [4] hour [5] minute [6] second [7] fraction

      hour = +(match[4]);
      minute = +(match[5]);
      second = +(match[6]);

      if (match[7]) {
        fraction = match[7].slice(0, 3);
        while (fraction.length < 3) { // milli-seconds
          fraction += '0';
        }
        fraction = +fraction;
      }

      // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

      if (match[9]) {
        tz_hour = +(match[10]);
        tz_minute = +(match[11] || 0);
        delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
        if (match[9] === '-') delta = -delta;
      }

      date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

      if (delta) date.setTime(date.getTime() - delta);

      return date;
    }

    function representYamlTimestamp(object /*, style*/) {
      return object.toISOString();
    }

    var timestamp = new Type$8('tag:yaml.org,2002:timestamp', {
      kind: 'scalar',
      resolve: resolveYamlTimestamp,
      construct: constructYamlTimestamp,
      instanceOf: Date,
      represent: representYamlTimestamp
    });

    var Type$7 = type;

    function resolveYamlMerge(data) {
      return data === '<<' || data === null;
    }

    var merge = new Type$7('tag:yaml.org,2002:merge', {
      kind: 'scalar',
      resolve: resolveYamlMerge
    });

    function commonjsRequire(path) {
    	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
    }

    /*eslint-disable no-bitwise*/

    var NodeBuffer;

    try {
      // A trick for browserified version, to not include `Buffer` shim
      var _require$1 = commonjsRequire;
      NodeBuffer = _require$1('buffer').Buffer;
    } catch (__) {}

    var Type$6       = type;


    // [ 64, 65, 66 ] -> [ padding, CR, LF ]
    var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';


    function resolveYamlBinary(data) {
      if (data === null) return false;

      var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;

      // Convert one by one.
      for (idx = 0; idx < max; idx++) {
        code = map.indexOf(data.charAt(idx));

        // Skip CR/LF
        if (code > 64) continue;

        // Fail on illegal characters
        if (code < 0) return false;

        bitlen += 6;
      }

      // If there are any bits left, source was corrupted
      return (bitlen % 8) === 0;
    }

    function constructYamlBinary(data) {
      var idx, tailbits,
          input = data.replace(/[\r\n=]/g, ''), // remove CR/LF & padding to simplify scan
          max = input.length,
          map = BASE64_MAP,
          bits = 0,
          result = [];

      // Collect by 6*4 bits (3 bytes)

      for (idx = 0; idx < max; idx++) {
        if ((idx % 4 === 0) && idx) {
          result.push((bits >> 16) & 0xFF);
          result.push((bits >> 8) & 0xFF);
          result.push(bits & 0xFF);
        }

        bits = (bits << 6) | map.indexOf(input.charAt(idx));
      }

      // Dump tail

      tailbits = (max % 4) * 6;

      if (tailbits === 0) {
        result.push((bits >> 16) & 0xFF);
        result.push((bits >> 8) & 0xFF);
        result.push(bits & 0xFF);
      } else if (tailbits === 18) {
        result.push((bits >> 10) & 0xFF);
        result.push((bits >> 2) & 0xFF);
      } else if (tailbits === 12) {
        result.push((bits >> 4) & 0xFF);
      }

      // Wrap into Buffer for NodeJS and leave Array for browser
      if (NodeBuffer) {
        // Support node 6.+ Buffer API when available
        return NodeBuffer.from ? NodeBuffer.from(result) : new NodeBuffer(result);
      }

      return result;
    }

    function representYamlBinary(object /*, style*/) {
      var result = '', bits = 0, idx, tail,
          max = object.length,
          map = BASE64_MAP;

      // Convert every three bytes to 4 ASCII characters.

      for (idx = 0; idx < max; idx++) {
        if ((idx % 3 === 0) && idx) {
          result += map[(bits >> 18) & 0x3F];
          result += map[(bits >> 12) & 0x3F];
          result += map[(bits >> 6) & 0x3F];
          result += map[bits & 0x3F];
        }

        bits = (bits << 8) + object[idx];
      }

      // Dump tail

      tail = max % 3;

      if (tail === 0) {
        result += map[(bits >> 18) & 0x3F];
        result += map[(bits >> 12) & 0x3F];
        result += map[(bits >> 6) & 0x3F];
        result += map[bits & 0x3F];
      } else if (tail === 2) {
        result += map[(bits >> 10) & 0x3F];
        result += map[(bits >> 4) & 0x3F];
        result += map[(bits << 2) & 0x3F];
        result += map[64];
      } else if (tail === 1) {
        result += map[(bits >> 2) & 0x3F];
        result += map[(bits << 4) & 0x3F];
        result += map[64];
        result += map[64];
      }

      return result;
    }

    function isBinary(object) {
      return NodeBuffer && NodeBuffer.isBuffer(object);
    }

    var binary = new Type$6('tag:yaml.org,2002:binary', {
      kind: 'scalar',
      resolve: resolveYamlBinary,
      construct: constructYamlBinary,
      predicate: isBinary,
      represent: representYamlBinary
    });

    var Type$5 = type;

    var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
    var _toString$2       = Object.prototype.toString;

    function resolveYamlOmap(data) {
      if (data === null) return true;

      var objectKeys = [], index, length, pair, pairKey, pairHasKey,
          object = data;

      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];
        pairHasKey = false;

        if (_toString$2.call(pair) !== '[object Object]') return false;

        for (pairKey in pair) {
          if (_hasOwnProperty$3.call(pair, pairKey)) {
            if (!pairHasKey) pairHasKey = true;
            else return false;
          }
        }

        if (!pairHasKey) return false;

        if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
        else return false;
      }

      return true;
    }

    function constructYamlOmap(data) {
      return data !== null ? data : [];
    }

    var omap = new Type$5('tag:yaml.org,2002:omap', {
      kind: 'sequence',
      resolve: resolveYamlOmap,
      construct: constructYamlOmap
    });

    var Type$4 = type;

    var _toString$1 = Object.prototype.toString;

    function resolveYamlPairs(data) {
      if (data === null) return true;

      var index, length, pair, keys, result,
          object = data;

      result = new Array(object.length);

      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];

        if (_toString$1.call(pair) !== '[object Object]') return false;

        keys = Object.keys(pair);

        if (keys.length !== 1) return false;

        result[index] = [ keys[0], pair[keys[0]] ];
      }

      return true;
    }

    function constructYamlPairs(data) {
      if (data === null) return [];

      var index, length, pair, keys, result,
          object = data;

      result = new Array(object.length);

      for (index = 0, length = object.length; index < length; index += 1) {
        pair = object[index];

        keys = Object.keys(pair);

        result[index] = [ keys[0], pair[keys[0]] ];
      }

      return result;
    }

    var pairs = new Type$4('tag:yaml.org,2002:pairs', {
      kind: 'sequence',
      resolve: resolveYamlPairs,
      construct: constructYamlPairs
    });

    var Type$3 = type;

    var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;

    function resolveYamlSet(data) {
      if (data === null) return true;

      var key, object = data;

      for (key in object) {
        if (_hasOwnProperty$2.call(object, key)) {
          if (object[key] !== null) return false;
        }
      }

      return true;
    }

    function constructYamlSet(data) {
      return data !== null ? data : {};
    }

    var set = new Type$3('tag:yaml.org,2002:set', {
      kind: 'mapping',
      resolve: resolveYamlSet,
      construct: constructYamlSet
    });

    var Schema$1 = schema;


    var default_safe = new Schema$1({
      include: [
        core
      ],
      implicit: [
        timestamp,
        merge
      ],
      explicit: [
        binary,
        omap,
        pairs,
        set
      ]
    });

    var Type$2 = type;

    function resolveJavascriptUndefined() {
      return true;
    }

    function constructJavascriptUndefined() {
      /*eslint-disable no-undefined*/
      return undefined;
    }

    function representJavascriptUndefined() {
      return '';
    }

    function isUndefined(object) {
      return typeof object === 'undefined';
    }

    var _undefined = new Type$2('tag:yaml.org,2002:js/undefined', {
      kind: 'scalar',
      resolve: resolveJavascriptUndefined,
      construct: constructJavascriptUndefined,
      predicate: isUndefined,
      represent: representJavascriptUndefined
    });

    var Type$1 = type;

    function resolveJavascriptRegExp(data) {
      if (data === null) return false;
      if (data.length === 0) return false;

      var regexp = data,
          tail   = /\/([gim]*)$/.exec(data),
          modifiers = '';

      // if regexp starts with '/' it can have modifiers and must be properly closed
      // `/foo/gim` - modifiers tail can be maximum 3 chars
      if (regexp[0] === '/') {
        if (tail) modifiers = tail[1];

        if (modifiers.length > 3) return false;
        // if expression starts with /, is should be properly terminated
        if (regexp[regexp.length - modifiers.length - 1] !== '/') return false;
      }

      return true;
    }

    function constructJavascriptRegExp(data) {
      var regexp = data,
          tail   = /\/([gim]*)$/.exec(data),
          modifiers = '';

      // `/foo/gim` - tail can be maximum 4 chars
      if (regexp[0] === '/') {
        if (tail) modifiers = tail[1];
        regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
      }

      return new RegExp(regexp, modifiers);
    }

    function representJavascriptRegExp(object /*, style*/) {
      var result = '/' + object.source + '/';

      if (object.global) result += 'g';
      if (object.multiline) result += 'm';
      if (object.ignoreCase) result += 'i';

      return result;
    }

    function isRegExp(object) {
      return Object.prototype.toString.call(object) === '[object RegExp]';
    }

    var regexp = new Type$1('tag:yaml.org,2002:js/regexp', {
      kind: 'scalar',
      resolve: resolveJavascriptRegExp,
      construct: constructJavascriptRegExp,
      predicate: isRegExp,
      represent: representJavascriptRegExp
    });

    var esprima;

    // Browserified version does not have esprima
    //
    // 1. For node.js just require module as deps
    // 2. For browser try to require mudule via external AMD system.
    //    If not found - try to fallback to window.esprima. If not
    //    found too - then fail to parse.
    //
    try {
      // workaround to exclude package from browserify list.
      var _require = commonjsRequire;
      esprima = _require('esprima');
    } catch (_) {
      /* eslint-disable no-redeclare */
      /* global window */
      if (typeof window !== 'undefined') esprima = window.esprima;
    }

    var Type = type;

    function resolveJavascriptFunction(data) {
      if (data === null) return false;

      try {
        var source = '(' + data + ')',
            ast    = esprima.parse(source, { range: true });

        if (ast.type                    !== 'Program'             ||
            ast.body.length             !== 1                     ||
            ast.body[0].type            !== 'ExpressionStatement' ||
            (ast.body[0].expression.type !== 'ArrowFunctionExpression' &&
              ast.body[0].expression.type !== 'FunctionExpression')) {
          return false;
        }

        return true;
      } catch (err) {
        return false;
      }
    }

    function constructJavascriptFunction(data) {
      /*jslint evil:true*/

      var source = '(' + data + ')',
          ast    = esprima.parse(source, { range: true }),
          params = [],
          body;

      if (ast.type                    !== 'Program'             ||
          ast.body.length             !== 1                     ||
          ast.body[0].type            !== 'ExpressionStatement' ||
          (ast.body[0].expression.type !== 'ArrowFunctionExpression' &&
            ast.body[0].expression.type !== 'FunctionExpression')) {
        throw new Error('Failed to resolve function');
      }

      ast.body[0].expression.params.forEach(function (param) {
        params.push(param.name);
      });

      body = ast.body[0].expression.body.range;

      // Esprima's ranges include the first '{' and the last '}' characters on
      // function expressions. So cut them out.
      if (ast.body[0].expression.body.type === 'BlockStatement') {
        /*eslint-disable no-new-func*/
        return new Function(params, source.slice(body[0] + 1, body[1] - 1));
      }
      // ES6 arrow functions can omit the BlockStatement. In that case, just return
      // the body.
      /*eslint-disable no-new-func*/
      return new Function(params, 'return ' + source.slice(body[0], body[1]));
    }

    function representJavascriptFunction(object /*, style*/) {
      return object.toString();
    }

    function isFunction(object) {
      return Object.prototype.toString.call(object) === '[object Function]';
    }

    var _function = new Type('tag:yaml.org,2002:js/function', {
      kind: 'scalar',
      resolve: resolveJavascriptFunction,
      construct: constructJavascriptFunction,
      predicate: isFunction,
      represent: representJavascriptFunction
    });

    var Schema = schema;


    var default_full = Schema.DEFAULT = new Schema({
      include: [
        default_safe
      ],
      explicit: [
        _undefined,
        regexp,
        _function
      ]
    });

    /*eslint-disable max-len,no-use-before-define*/

    var common$1              = common$6;
    var YAMLException$1       = exception;
    var Mark                = mark;
    var DEFAULT_SAFE_SCHEMA$1 = default_safe;
    var DEFAULT_FULL_SCHEMA$1 = default_full;


    var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;


    var CONTEXT_FLOW_IN   = 1;
    var CONTEXT_FLOW_OUT  = 2;
    var CONTEXT_BLOCK_IN  = 3;
    var CONTEXT_BLOCK_OUT = 4;


    var CHOMPING_CLIP  = 1;
    var CHOMPING_STRIP = 2;
    var CHOMPING_KEEP  = 3;


    var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
    var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
    var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
    var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


    function _class(obj) { return Object.prototype.toString.call(obj); }

    function is_EOL(c) {
      return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
    }

    function is_WHITE_SPACE(c) {
      return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
    }

    function is_WS_OR_EOL(c) {
      return (c === 0x09/* Tab */) ||
             (c === 0x20/* Space */) ||
             (c === 0x0A/* LF */) ||
             (c === 0x0D/* CR */);
    }

    function is_FLOW_INDICATOR(c) {
      return c === 0x2C/* , */ ||
             c === 0x5B/* [ */ ||
             c === 0x5D/* ] */ ||
             c === 0x7B/* { */ ||
             c === 0x7D/* } */;
    }

    function fromHexCode(c) {
      var lc;

      if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
        return c - 0x30;
      }

      /*eslint-disable no-bitwise*/
      lc = c | 0x20;

      if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
        return lc - 0x61 + 10;
      }

      return -1;
    }

    function escapedHexLen(c) {
      if (c === 0x78/* x */) { return 2; }
      if (c === 0x75/* u */) { return 4; }
      if (c === 0x55/* U */) { return 8; }
      return 0;
    }

    function fromDecimalCode(c) {
      if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
        return c - 0x30;
      }

      return -1;
    }

    function simpleEscapeSequence(c) {
      /* eslint-disable indent */
      return (c === 0x30/* 0 */) ? '\x00' :
            (c === 0x61/* a */) ? '\x07' :
            (c === 0x62/* b */) ? '\x08' :
            (c === 0x74/* t */) ? '\x09' :
            (c === 0x09/* Tab */) ? '\x09' :
            (c === 0x6E/* n */) ? '\x0A' :
            (c === 0x76/* v */) ? '\x0B' :
            (c === 0x66/* f */) ? '\x0C' :
            (c === 0x72/* r */) ? '\x0D' :
            (c === 0x65/* e */) ? '\x1B' :
            (c === 0x20/* Space */) ? ' ' :
            (c === 0x22/* " */) ? '\x22' :
            (c === 0x2F/* / */) ? '/' :
            (c === 0x5C/* \ */) ? '\x5C' :
            (c === 0x4E/* N */) ? '\x85' :
            (c === 0x5F/* _ */) ? '\xA0' :
            (c === 0x4C/* L */) ? '\u2028' :
            (c === 0x50/* P */) ? '\u2029' : '';
    }

    function charFromCodepoint(c) {
      if (c <= 0xFFFF) {
        return String.fromCharCode(c);
      }
      // Encode UTF-16 surrogate pair
      // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
      return String.fromCharCode(
        ((c - 0x010000) >> 10) + 0xD800,
        ((c - 0x010000) & 0x03FF) + 0xDC00
      );
    }

    var simpleEscapeCheck = new Array(256); // integer, for fast access
    var simpleEscapeMap = new Array(256);
    for (var i = 0; i < 256; i++) {
      simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
      simpleEscapeMap[i] = simpleEscapeSequence(i);
    }


    function State$1(input, options) {
      this.input = input;

      this.filename  = options['filename']  || null;
      this.schema    = options['schema']    || DEFAULT_FULL_SCHEMA$1;
      this.onWarning = options['onWarning'] || null;
      this.legacy    = options['legacy']    || false;
      this.json      = options['json']      || false;
      this.listener  = options['listener']  || null;

      this.implicitTypes = this.schema.compiledImplicit;
      this.typeMap       = this.schema.compiledTypeMap;

      this.length     = input.length;
      this.position   = 0;
      this.line       = 0;
      this.lineStart  = 0;
      this.lineIndent = 0;

      this.documents = [];

      /*
      this.version;
      this.checkLineBreaks;
      this.tagMap;
      this.anchorMap;
      this.tag;
      this.anchor;
      this.kind;
      this.result;*/

    }


    function generateError(state, message) {
      return new YAMLException$1(
        message,
        new Mark(state.filename, state.input, state.position, state.line, (state.position - state.lineStart)));
    }

    function throwError(state, message) {
      throw generateError(state, message);
    }

    function throwWarning(state, message) {
      if (state.onWarning) {
        state.onWarning.call(null, generateError(state, message));
      }
    }


    var directiveHandlers = {

      YAML: function handleYamlDirective(state, name, args) {

        var match, major, minor;

        if (state.version !== null) {
          throwError(state, 'duplication of %YAML directive');
        }

        if (args.length !== 1) {
          throwError(state, 'YAML directive accepts exactly one argument');
        }

        match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

        if (match === null) {
          throwError(state, 'ill-formed argument of the YAML directive');
        }

        major = parseInt(match[1], 10);
        minor = parseInt(match[2], 10);

        if (major !== 1) {
          throwError(state, 'unacceptable YAML version of the document');
        }

        state.version = args[0];
        state.checkLineBreaks = (minor < 2);

        if (minor !== 1 && minor !== 2) {
          throwWarning(state, 'unsupported YAML version of the document');
        }
      },

      TAG: function handleTagDirective(state, name, args) {

        var handle, prefix;

        if (args.length !== 2) {
          throwError(state, 'TAG directive accepts exactly two arguments');
        }

        handle = args[0];
        prefix = args[1];

        if (!PATTERN_TAG_HANDLE.test(handle)) {
          throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
        }

        if (_hasOwnProperty$1.call(state.tagMap, handle)) {
          throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
        }

        if (!PATTERN_TAG_URI.test(prefix)) {
          throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
        }

        state.tagMap[handle] = prefix;
      }
    };


    function captureSegment(state, start, end, checkJson) {
      var _position, _length, _character, _result;

      if (start < end) {
        _result = state.input.slice(start, end);

        if (checkJson) {
          for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
            _character = _result.charCodeAt(_position);
            if (!(_character === 0x09 ||
                  (0x20 <= _character && _character <= 0x10FFFF))) {
              throwError(state, 'expected valid JSON character');
            }
          }
        } else if (PATTERN_NON_PRINTABLE.test(_result)) {
          throwError(state, 'the stream contains non-printable characters');
        }

        state.result += _result;
      }
    }

    function mergeMappings(state, destination, source, overridableKeys) {
      var sourceKeys, key, index, quantity;

      if (!common$1.isObject(source)) {
        throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
      }

      sourceKeys = Object.keys(source);

      for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
        key = sourceKeys[index];

        if (!_hasOwnProperty$1.call(destination, key)) {
          destination[key] = source[key];
          overridableKeys[key] = true;
        }
      }
    }

    function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
      var index, quantity;

      // The output is a plain object here, so keys can only be strings.
      // We need to convert keyNode to a string, but doing so can hang the process
      // (deeply nested arrays that explode exponentially using aliases).
      if (Array.isArray(keyNode)) {
        keyNode = Array.prototype.slice.call(keyNode);

        for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
          if (Array.isArray(keyNode[index])) {
            throwError(state, 'nested arrays are not supported inside keys');
          }

          if (typeof keyNode === 'object' && _class(keyNode[index]) === '[object Object]') {
            keyNode[index] = '[object Object]';
          }
        }
      }

      // Avoid code execution in load() via toString property
      // (still use its own toString for arrays, timestamps,
      // and whatever user schema extensions happen to have @@toStringTag)
      if (typeof keyNode === 'object' && _class(keyNode) === '[object Object]') {
        keyNode = '[object Object]';
      }


      keyNode = String(keyNode);

      if (_result === null) {
        _result = {};
      }

      if (keyTag === 'tag:yaml.org,2002:merge') {
        if (Array.isArray(valueNode)) {
          for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
            mergeMappings(state, _result, valueNode[index], overridableKeys);
          }
        } else {
          mergeMappings(state, _result, valueNode, overridableKeys);
        }
      } else {
        if (!state.json &&
            !_hasOwnProperty$1.call(overridableKeys, keyNode) &&
            _hasOwnProperty$1.call(_result, keyNode)) {
          state.line = startLine || state.line;
          state.position = startPos || state.position;
          throwError(state, 'duplicated mapping key');
        }
        _result[keyNode] = valueNode;
        delete overridableKeys[keyNode];
      }

      return _result;
    }

    function readLineBreak(state) {
      var ch;

      ch = state.input.charCodeAt(state.position);

      if (ch === 0x0A/* LF */) {
        state.position++;
      } else if (ch === 0x0D/* CR */) {
        state.position++;
        if (state.input.charCodeAt(state.position) === 0x0A/* LF */) {
          state.position++;
        }
      } else {
        throwError(state, 'a line break is expected');
      }

      state.line += 1;
      state.lineStart = state.position;
    }

    function skipSeparationSpace(state, allowComments, checkIndent) {
      var lineBreaks = 0,
          ch = state.input.charCodeAt(state.position);

      while (ch !== 0) {
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (allowComments && ch === 0x23/* # */) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && ch !== 0);
        }

        if (is_EOL(ch)) {
          readLineBreak(state);

          ch = state.input.charCodeAt(state.position);
          lineBreaks++;
          state.lineIndent = 0;

          while (ch === 0x20/* Space */) {
            state.lineIndent++;
            ch = state.input.charCodeAt(++state.position);
          }
        } else {
          break;
        }
      }

      if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
        throwWarning(state, 'deficient indentation');
      }

      return lineBreaks;
    }

    function testDocumentSeparator(state) {
      var _position = state.position,
          ch;

      ch = state.input.charCodeAt(_position);

      // Condition state.position === state.lineStart is tested
      // in parent on each call, for efficiency. No needs to test here again.
      if ((ch === 0x2D/* - */ || ch === 0x2E/* . */) &&
          ch === state.input.charCodeAt(_position + 1) &&
          ch === state.input.charCodeAt(_position + 2)) {

        _position += 3;

        ch = state.input.charCodeAt(_position);

        if (ch === 0 || is_WS_OR_EOL(ch)) {
          return true;
        }
      }

      return false;
    }

    function writeFoldedLines(state, count) {
      if (count === 1) {
        state.result += ' ';
      } else if (count > 1) {
        state.result += common$1.repeat('\n', count - 1);
      }
    }


    function readPlainScalar(state, nodeIndent, withinFlowCollection) {
      var preceding,
          following,
          captureStart,
          captureEnd,
          hasPendingContent,
          _line,
          _lineStart,
          _lineIndent,
          _kind = state.kind,
          _result = state.result,
          ch;

      ch = state.input.charCodeAt(state.position);

      if (is_WS_OR_EOL(ch)      ||
          is_FLOW_INDICATOR(ch) ||
          ch === 0x23/* # */    ||
          ch === 0x26/* & */    ||
          ch === 0x2A/* * */    ||
          ch === 0x21/* ! */    ||
          ch === 0x7C/* | */    ||
          ch === 0x3E/* > */    ||
          ch === 0x27/* ' */    ||
          ch === 0x22/* " */    ||
          ch === 0x25/* % */    ||
          ch === 0x40/* @ */    ||
          ch === 0x60/* ` */) {
        return false;
      }

      if (ch === 0x3F/* ? */ || ch === 0x2D/* - */) {
        following = state.input.charCodeAt(state.position + 1);

        if (is_WS_OR_EOL(following) ||
            withinFlowCollection && is_FLOW_INDICATOR(following)) {
          return false;
        }
      }

      state.kind = 'scalar';
      state.result = '';
      captureStart = captureEnd = state.position;
      hasPendingContent = false;

      while (ch !== 0) {
        if (ch === 0x3A/* : */) {
          following = state.input.charCodeAt(state.position + 1);

          if (is_WS_OR_EOL(following) ||
              withinFlowCollection && is_FLOW_INDICATOR(following)) {
            break;
          }

        } else if (ch === 0x23/* # */) {
          preceding = state.input.charCodeAt(state.position - 1);

          if (is_WS_OR_EOL(preceding)) {
            break;
          }

        } else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
                   withinFlowCollection && is_FLOW_INDICATOR(ch)) {
          break;

        } else if (is_EOL(ch)) {
          _line = state.line;
          _lineStart = state.lineStart;
          _lineIndent = state.lineIndent;
          skipSeparationSpace(state, false, -1);

          if (state.lineIndent >= nodeIndent) {
            hasPendingContent = true;
            ch = state.input.charCodeAt(state.position);
            continue;
          } else {
            state.position = captureEnd;
            state.line = _line;
            state.lineStart = _lineStart;
            state.lineIndent = _lineIndent;
            break;
          }
        }

        if (hasPendingContent) {
          captureSegment(state, captureStart, captureEnd, false);
          writeFoldedLines(state, state.line - _line);
          captureStart = captureEnd = state.position;
          hasPendingContent = false;
        }

        if (!is_WHITE_SPACE(ch)) {
          captureEnd = state.position + 1;
        }

        ch = state.input.charCodeAt(++state.position);
      }

      captureSegment(state, captureStart, captureEnd, false);

      if (state.result) {
        return true;
      }

      state.kind = _kind;
      state.result = _result;
      return false;
    }

    function readSingleQuotedScalar(state, nodeIndent) {
      var ch,
          captureStart, captureEnd;

      ch = state.input.charCodeAt(state.position);

      if (ch !== 0x27/* ' */) {
        return false;
      }

      state.kind = 'scalar';
      state.result = '';
      state.position++;
      captureStart = captureEnd = state.position;

      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        if (ch === 0x27/* ' */) {
          captureSegment(state, captureStart, state.position, true);
          ch = state.input.charCodeAt(++state.position);

          if (ch === 0x27/* ' */) {
            captureStart = state.position;
            state.position++;
            captureEnd = state.position;
          } else {
            return true;
          }

        } else if (is_EOL(ch)) {
          captureSegment(state, captureStart, captureEnd, true);
          writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
          captureStart = captureEnd = state.position;

        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
          throwError(state, 'unexpected end of the document within a single quoted scalar');

        } else {
          state.position++;
          captureEnd = state.position;
        }
      }

      throwError(state, 'unexpected end of the stream within a single quoted scalar');
    }

    function readDoubleQuotedScalar(state, nodeIndent) {
      var captureStart,
          captureEnd,
          hexLength,
          hexResult,
          tmp,
          ch;

      ch = state.input.charCodeAt(state.position);

      if (ch !== 0x22/* " */) {
        return false;
      }

      state.kind = 'scalar';
      state.result = '';
      state.position++;
      captureStart = captureEnd = state.position;

      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        if (ch === 0x22/* " */) {
          captureSegment(state, captureStart, state.position, true);
          state.position++;
          return true;

        } else if (ch === 0x5C/* \ */) {
          captureSegment(state, captureStart, state.position, true);
          ch = state.input.charCodeAt(++state.position);

          if (is_EOL(ch)) {
            skipSeparationSpace(state, false, nodeIndent);

            // TODO: rework to inline fn with no type cast?
          } else if (ch < 256 && simpleEscapeCheck[ch]) {
            state.result += simpleEscapeMap[ch];
            state.position++;

          } else if ((tmp = escapedHexLen(ch)) > 0) {
            hexLength = tmp;
            hexResult = 0;

            for (; hexLength > 0; hexLength--) {
              ch = state.input.charCodeAt(++state.position);

              if ((tmp = fromHexCode(ch)) >= 0) {
                hexResult = (hexResult << 4) + tmp;

              } else {
                throwError(state, 'expected hexadecimal character');
              }
            }

            state.result += charFromCodepoint(hexResult);

            state.position++;

          } else {
            throwError(state, 'unknown escape sequence');
          }

          captureStart = captureEnd = state.position;

        } else if (is_EOL(ch)) {
          captureSegment(state, captureStart, captureEnd, true);
          writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
          captureStart = captureEnd = state.position;

        } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
          throwError(state, 'unexpected end of the document within a double quoted scalar');

        } else {
          state.position++;
          captureEnd = state.position;
        }
      }

      throwError(state, 'unexpected end of the stream within a double quoted scalar');
    }

    function readFlowCollection(state, nodeIndent) {
      var readNext = true,
          _line,
          _tag     = state.tag,
          _result,
          _anchor  = state.anchor,
          following,
          terminator,
          isPair,
          isExplicitPair,
          isMapping,
          overridableKeys = {},
          keyNode,
          keyTag,
          valueNode,
          ch;

      ch = state.input.charCodeAt(state.position);

      if (ch === 0x5B/* [ */) {
        terminator = 0x5D;/* ] */
        isMapping = false;
        _result = [];
      } else if (ch === 0x7B/* { */) {
        terminator = 0x7D;/* } */
        isMapping = true;
        _result = {};
      } else {
        return false;
      }

      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }

      ch = state.input.charCodeAt(++state.position);

      while (ch !== 0) {
        skipSeparationSpace(state, true, nodeIndent);

        ch = state.input.charCodeAt(state.position);

        if (ch === terminator) {
          state.position++;
          state.tag = _tag;
          state.anchor = _anchor;
          state.kind = isMapping ? 'mapping' : 'sequence';
          state.result = _result;
          return true;
        } else if (!readNext) {
          throwError(state, 'missed comma between flow collection entries');
        }

        keyTag = keyNode = valueNode = null;
        isPair = isExplicitPair = false;

        if (ch === 0x3F/* ? */) {
          following = state.input.charCodeAt(state.position + 1);

          if (is_WS_OR_EOL(following)) {
            isPair = isExplicitPair = true;
            state.position++;
            skipSeparationSpace(state, true, nodeIndent);
          }
        }

        _line = state.line;
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        keyTag = state.tag;
        keyNode = state.result;
        skipSeparationSpace(state, true, nodeIndent);

        ch = state.input.charCodeAt(state.position);

        if ((isExplicitPair || state.line === _line) && ch === 0x3A/* : */) {
          isPair = true;
          ch = state.input.charCodeAt(++state.position);
          skipSeparationSpace(state, true, nodeIndent);
          composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
          valueNode = state.result;
        }

        if (isMapping) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
        } else if (isPair) {
          _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
        } else {
          _result.push(keyNode);
        }

        skipSeparationSpace(state, true, nodeIndent);

        ch = state.input.charCodeAt(state.position);

        if (ch === 0x2C/* , */) {
          readNext = true;
          ch = state.input.charCodeAt(++state.position);
        } else {
          readNext = false;
        }
      }

      throwError(state, 'unexpected end of the stream within a flow collection');
    }

    function readBlockScalar(state, nodeIndent) {
      var captureStart,
          folding,
          chomping       = CHOMPING_CLIP,
          didReadContent = false,
          detectedIndent = false,
          textIndent     = nodeIndent,
          emptyLines     = 0,
          atMoreIndented = false,
          tmp,
          ch;

      ch = state.input.charCodeAt(state.position);

      if (ch === 0x7C/* | */) {
        folding = false;
      } else if (ch === 0x3E/* > */) {
        folding = true;
      } else {
        return false;
      }

      state.kind = 'scalar';
      state.result = '';

      while (ch !== 0) {
        ch = state.input.charCodeAt(++state.position);

        if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
          if (CHOMPING_CLIP === chomping) {
            chomping = (ch === 0x2B/* + */) ? CHOMPING_KEEP : CHOMPING_STRIP;
          } else {
            throwError(state, 'repeat of a chomping mode identifier');
          }

        } else if ((tmp = fromDecimalCode(ch)) >= 0) {
          if (tmp === 0) {
            throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
          } else if (!detectedIndent) {
            textIndent = nodeIndent + tmp - 1;
            detectedIndent = true;
          } else {
            throwError(state, 'repeat of an indentation width identifier');
          }

        } else {
          break;
        }
      }

      if (is_WHITE_SPACE(ch)) {
        do { ch = state.input.charCodeAt(++state.position); }
        while (is_WHITE_SPACE(ch));

        if (ch === 0x23/* # */) {
          do { ch = state.input.charCodeAt(++state.position); }
          while (!is_EOL(ch) && (ch !== 0));
        }
      }

      while (ch !== 0) {
        readLineBreak(state);
        state.lineIndent = 0;

        ch = state.input.charCodeAt(state.position);

        while ((!detectedIndent || state.lineIndent < textIndent) &&
               (ch === 0x20/* Space */)) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }

        if (!detectedIndent && state.lineIndent > textIndent) {
          textIndent = state.lineIndent;
        }

        if (is_EOL(ch)) {
          emptyLines++;
          continue;
        }

        // End of the scalar.
        if (state.lineIndent < textIndent) {

          // Perform the chomping.
          if (chomping === CHOMPING_KEEP) {
            state.result += common$1.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
          } else if (chomping === CHOMPING_CLIP) {
            if (didReadContent) { // i.e. only if the scalar is not empty.
              state.result += '\n';
            }
          }

          // Break this `while` cycle and go to the funciton's epilogue.
          break;
        }

        // Folded style: use fancy rules to handle line breaks.
        if (folding) {

          // Lines starting with white space characters (more-indented lines) are not folded.
          if (is_WHITE_SPACE(ch)) {
            atMoreIndented = true;
            // except for the first content line (cf. Example 8.1)
            state.result += common$1.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

          // End of more-indented block.
          } else if (atMoreIndented) {
            atMoreIndented = false;
            state.result += common$1.repeat('\n', emptyLines + 1);

          // Just one line break - perceive as the same line.
          } else if (emptyLines === 0) {
            if (didReadContent) { // i.e. only if we have already read some scalar content.
              state.result += ' ';
            }

          // Several line breaks - perceive as different lines.
          } else {
            state.result += common$1.repeat('\n', emptyLines);
          }

        // Literal style: just add exact number of line breaks between content lines.
        } else {
          // Keep all line breaks except the header line break.
          state.result += common$1.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
        }

        didReadContent = true;
        detectedIndent = true;
        emptyLines = 0;
        captureStart = state.position;

        while (!is_EOL(ch) && (ch !== 0)) {
          ch = state.input.charCodeAt(++state.position);
        }

        captureSegment(state, captureStart, state.position, false);
      }

      return true;
    }

    function readBlockSequence(state, nodeIndent) {
      var _line,
          _tag      = state.tag,
          _anchor   = state.anchor,
          _result   = [],
          following,
          detected  = false,
          ch;

      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }

      ch = state.input.charCodeAt(state.position);

      while (ch !== 0) {

        if (ch !== 0x2D/* - */) {
          break;
        }

        following = state.input.charCodeAt(state.position + 1);

        if (!is_WS_OR_EOL(following)) {
          break;
        }

        detected = true;
        state.position++;

        if (skipSeparationSpace(state, true, -1)) {
          if (state.lineIndent <= nodeIndent) {
            _result.push(null);
            ch = state.input.charCodeAt(state.position);
            continue;
          }
        }

        _line = state.line;
        composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
        _result.push(state.result);
        skipSeparationSpace(state, true, -1);

        ch = state.input.charCodeAt(state.position);

        if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
          throwError(state, 'bad indentation of a sequence entry');
        } else if (state.lineIndent < nodeIndent) {
          break;
        }
      }

      if (detected) {
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = 'sequence';
        state.result = _result;
        return true;
      }
      return false;
    }

    function readBlockMapping(state, nodeIndent, flowIndent) {
      var following,
          allowCompact,
          _line,
          _pos,
          _tag          = state.tag,
          _anchor       = state.anchor,
          _result       = {},
          overridableKeys = {},
          keyTag        = null,
          keyNode       = null,
          valueNode     = null,
          atExplicitKey = false,
          detected      = false,
          ch;

      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = _result;
      }

      ch = state.input.charCodeAt(state.position);

      while (ch !== 0) {
        following = state.input.charCodeAt(state.position + 1);
        _line = state.line; // Save the current line.
        _pos = state.position;

        //
        // Explicit notation case. There are two separate blocks:
        // first for the key (denoted by "?") and second for the value (denoted by ":")
        //
        if ((ch === 0x3F/* ? */ || ch === 0x3A/* : */) && is_WS_OR_EOL(following)) {

          if (ch === 0x3F/* ? */) {
            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
              keyTag = keyNode = valueNode = null;
            }

            detected = true;
            atExplicitKey = true;
            allowCompact = true;

          } else if (atExplicitKey) {
            // i.e. 0x3A/* : */ === character after the explicit key.
            atExplicitKey = false;
            allowCompact = true;

          } else {
            throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');
          }

          state.position += 1;
          ch = following;

        //
        // Implicit notation case. Flow-style node as the key first, then ":", and the value.
        //
        } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {

          if (state.line === _line) {
            ch = state.input.charCodeAt(state.position);

            while (is_WHITE_SPACE(ch)) {
              ch = state.input.charCodeAt(++state.position);
            }

            if (ch === 0x3A/* : */) {
              ch = state.input.charCodeAt(++state.position);

              if (!is_WS_OR_EOL(ch)) {
                throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
              }

              if (atExplicitKey) {
                storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
                keyTag = keyNode = valueNode = null;
              }

              detected = true;
              atExplicitKey = false;
              allowCompact = false;
              keyTag = state.tag;
              keyNode = state.result;

            } else if (detected) {
              throwError(state, 'can not read an implicit mapping pair; a colon is missed');

            } else {
              state.tag = _tag;
              state.anchor = _anchor;
              return true; // Keep the result of `composeNode`.
            }

          } else if (detected) {
            throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

          } else {
            state.tag = _tag;
            state.anchor = _anchor;
            return true; // Keep the result of `composeNode`.
          }

        } else {
          break; // Reading is done. Go to the epilogue.
        }

        //
        // Common reading code for both explicit and implicit notations.
        //
        if (state.line === _line || state.lineIndent > nodeIndent) {
          if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
            if (atExplicitKey) {
              keyNode = state.result;
            } else {
              valueNode = state.result;
            }
          }

          if (!atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _pos);
            keyTag = keyNode = valueNode = null;
          }

          skipSeparationSpace(state, true, -1);
          ch = state.input.charCodeAt(state.position);
        }

        if (state.lineIndent > nodeIndent && (ch !== 0)) {
          throwError(state, 'bad indentation of a mapping entry');
        } else if (state.lineIndent < nodeIndent) {
          break;
        }
      }

      //
      // Epilogue.
      //

      // Special case: last mapping's node contains only the key in explicit notation.
      if (atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
      }

      // Expose the resulting mapping.
      if (detected) {
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = 'mapping';
        state.result = _result;
      }

      return detected;
    }

    function readTagProperty(state) {
      var _position,
          isVerbatim = false,
          isNamed    = false,
          tagHandle,
          tagName,
          ch;

      ch = state.input.charCodeAt(state.position);

      if (ch !== 0x21/* ! */) return false;

      if (state.tag !== null) {
        throwError(state, 'duplication of a tag property');
      }

      ch = state.input.charCodeAt(++state.position);

      if (ch === 0x3C/* < */) {
        isVerbatim = true;
        ch = state.input.charCodeAt(++state.position);

      } else if (ch === 0x21/* ! */) {
        isNamed = true;
        tagHandle = '!!';
        ch = state.input.charCodeAt(++state.position);

      } else {
        tagHandle = '!';
      }

      _position = state.position;

      if (isVerbatim) {
        do { ch = state.input.charCodeAt(++state.position); }
        while (ch !== 0 && ch !== 0x3E/* > */);

        if (state.position < state.length) {
          tagName = state.input.slice(_position, state.position);
          ch = state.input.charCodeAt(++state.position);
        } else {
          throwError(state, 'unexpected end of the stream within a verbatim tag');
        }
      } else {
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {

          if (ch === 0x21/* ! */) {
            if (!isNamed) {
              tagHandle = state.input.slice(_position - 1, state.position + 1);

              if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
                throwError(state, 'named tag handle cannot contain such characters');
              }

              isNamed = true;
              _position = state.position + 1;
            } else {
              throwError(state, 'tag suffix cannot contain exclamation marks');
            }
          }

          ch = state.input.charCodeAt(++state.position);
        }

        tagName = state.input.slice(_position, state.position);

        if (PATTERN_FLOW_INDICATORS.test(tagName)) {
          throwError(state, 'tag suffix cannot contain flow indicator characters');
        }
      }

      if (tagName && !PATTERN_TAG_URI.test(tagName)) {
        throwError(state, 'tag name cannot contain such characters: ' + tagName);
      }

      if (isVerbatim) {
        state.tag = tagName;

      } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
        state.tag = state.tagMap[tagHandle] + tagName;

      } else if (tagHandle === '!') {
        state.tag = '!' + tagName;

      } else if (tagHandle === '!!') {
        state.tag = 'tag:yaml.org,2002:' + tagName;

      } else {
        throwError(state, 'undeclared tag handle "' + tagHandle + '"');
      }

      return true;
    }

    function readAnchorProperty(state) {
      var _position,
          ch;

      ch = state.input.charCodeAt(state.position);

      if (ch !== 0x26/* & */) return false;

      if (state.anchor !== null) {
        throwError(state, 'duplication of an anchor property');
      }

      ch = state.input.charCodeAt(++state.position);
      _position = state.position;

      while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      if (state.position === _position) {
        throwError(state, 'name of an anchor node must contain at least one character');
      }

      state.anchor = state.input.slice(_position, state.position);
      return true;
    }

    function readAlias(state) {
      var _position, alias,
          ch;

      ch = state.input.charCodeAt(state.position);

      if (ch !== 0x2A/* * */) return false;

      ch = state.input.charCodeAt(++state.position);
      _position = state.position;

      while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      if (state.position === _position) {
        throwError(state, 'name of an alias node must contain at least one character');
      }

      alias = state.input.slice(_position, state.position);

      if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
        throwError(state, 'unidentified alias "' + alias + '"');
      }

      state.result = state.anchorMap[alias];
      skipSeparationSpace(state, true, -1);
      return true;
    }

    function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
      var allowBlockStyles,
          allowBlockScalars,
          allowBlockCollections,
          indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
          atNewLine  = false,
          hasContent = false,
          typeIndex,
          typeQuantity,
          type,
          flowIndent,
          blockIndent;

      if (state.listener !== null) {
        state.listener('open', state);
      }

      state.tag    = null;
      state.anchor = null;
      state.kind   = null;
      state.result = null;

      allowBlockStyles = allowBlockScalars = allowBlockCollections =
        CONTEXT_BLOCK_OUT === nodeContext ||
        CONTEXT_BLOCK_IN  === nodeContext;

      if (allowToSeek) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;

          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        }
      }

      if (indentStatus === 1) {
        while (readTagProperty(state) || readAnchorProperty(state)) {
          if (skipSeparationSpace(state, true, -1)) {
            atNewLine = true;
            allowBlockCollections = allowBlockStyles;

            if (state.lineIndent > parentIndent) {
              indentStatus = 1;
            } else if (state.lineIndent === parentIndent) {
              indentStatus = 0;
            } else if (state.lineIndent < parentIndent) {
              indentStatus = -1;
            }
          } else {
            allowBlockCollections = false;
          }
        }
      }

      if (allowBlockCollections) {
        allowBlockCollections = atNewLine || allowCompact;
      }

      if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
        if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
          flowIndent = parentIndent;
        } else {
          flowIndent = parentIndent + 1;
        }

        blockIndent = state.position - state.lineStart;

        if (indentStatus === 1) {
          if (allowBlockCollections &&
              (readBlockSequence(state, blockIndent) ||
               readBlockMapping(state, blockIndent, flowIndent)) ||
              readFlowCollection(state, flowIndent)) {
            hasContent = true;
          } else {
            if ((allowBlockScalars && readBlockScalar(state, flowIndent)) ||
                readSingleQuotedScalar(state, flowIndent) ||
                readDoubleQuotedScalar(state, flowIndent)) {
              hasContent = true;

            } else if (readAlias(state)) {
              hasContent = true;

              if (state.tag !== null || state.anchor !== null) {
                throwError(state, 'alias node should not have any properties');
              }

            } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
              hasContent = true;

              if (state.tag === null) {
                state.tag = '?';
              }
            }

            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
          }
        } else if (indentStatus === 0) {
          // Special case: block sequences are allowed to have same indentation level as the parent.
          // http://www.yaml.org/spec/1.2/spec.html#id2799784
          hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
        }
      }

      if (state.tag !== null && state.tag !== '!') {
        if (state.tag === '?') {
          // Implicit resolving is not allowed for non-scalar types, and '?'
          // non-specific tag is only automatically assigned to plain scalars.
          //
          // We only need to check kind conformity in case user explicitly assigns '?'
          // tag, for example like this: "!<?> [0]"
          //
          if (state.result !== null && state.kind !== 'scalar') {
            throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
          }

          for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
            type = state.implicitTypes[typeIndex];

            if (type.resolve(state.result)) { // `state.result` updated in resolver if matched
              state.result = type.construct(state.result);
              state.tag = type.tag;
              if (state.anchor !== null) {
                state.anchorMap[state.anchor] = state.result;
              }
              break;
            }
          }
        } else if (_hasOwnProperty$1.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
          type = state.typeMap[state.kind || 'fallback'][state.tag];

          if (state.result !== null && type.kind !== state.kind) {
            throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
          }

          if (!type.resolve(state.result)) { // `state.result` updated in resolver if matched
            throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
          } else {
            state.result = type.construct(state.result);
            if (state.anchor !== null) {
              state.anchorMap[state.anchor] = state.result;
            }
          }
        } else {
          throwError(state, 'unknown tag !<' + state.tag + '>');
        }
      }

      if (state.listener !== null) {
        state.listener('close', state);
      }
      return state.tag !== null ||  state.anchor !== null || hasContent;
    }

    function readDocument(state) {
      var documentStart = state.position,
          _position,
          directiveName,
          directiveArgs,
          hasDirectives = false,
          ch;

      state.version = null;
      state.checkLineBreaks = state.legacy;
      state.tagMap = {};
      state.anchorMap = {};

      while ((ch = state.input.charCodeAt(state.position)) !== 0) {
        skipSeparationSpace(state, true, -1);

        ch = state.input.charCodeAt(state.position);

        if (state.lineIndent > 0 || ch !== 0x25/* % */) {
          break;
        }

        hasDirectives = true;
        ch = state.input.charCodeAt(++state.position);
        _position = state.position;

        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        directiveName = state.input.slice(_position, state.position);
        directiveArgs = [];

        if (directiveName.length < 1) {
          throwError(state, 'directive name must not be less than one character in length');
        }

        while (ch !== 0) {
          while (is_WHITE_SPACE(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }

          if (ch === 0x23/* # */) {
            do { ch = state.input.charCodeAt(++state.position); }
            while (ch !== 0 && !is_EOL(ch));
            break;
          }

          if (is_EOL(ch)) break;

          _position = state.position;

          while (ch !== 0 && !is_WS_OR_EOL(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }

          directiveArgs.push(state.input.slice(_position, state.position));
        }

        if (ch !== 0) readLineBreak(state);

        if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
          directiveHandlers[directiveName](state, directiveName, directiveArgs);
        } else {
          throwWarning(state, 'unknown document directive "' + directiveName + '"');
        }
      }

      skipSeparationSpace(state, true, -1);

      if (state.lineIndent === 0 &&
          state.input.charCodeAt(state.position)     === 0x2D/* - */ &&
          state.input.charCodeAt(state.position + 1) === 0x2D/* - */ &&
          state.input.charCodeAt(state.position + 2) === 0x2D/* - */) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);

      } else if (hasDirectives) {
        throwError(state, 'directives end mark is expected');
      }

      composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
      skipSeparationSpace(state, true, -1);

      if (state.checkLineBreaks &&
          PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
        throwWarning(state, 'non-ASCII line breaks are interpreted as content');
      }

      state.documents.push(state.result);

      if (state.position === state.lineStart && testDocumentSeparator(state)) {

        if (state.input.charCodeAt(state.position) === 0x2E/* . */) {
          state.position += 3;
          skipSeparationSpace(state, true, -1);
        }
        return;
      }

      if (state.position < (state.length - 1)) {
        throwError(state, 'end of the stream or a document separator is expected');
      } else {
        return;
      }
    }


    function loadDocuments(input, options) {
      input = String(input);
      options = options || {};

      if (input.length !== 0) {

        // Add tailing `\n` if not exists
        if (input.charCodeAt(input.length - 1) !== 0x0A/* LF */ &&
            input.charCodeAt(input.length - 1) !== 0x0D/* CR */) {
          input += '\n';
        }

        // Strip BOM
        if (input.charCodeAt(0) === 0xFEFF) {
          input = input.slice(1);
        }
      }

      var state = new State$1(input, options);

      var nullpos = input.indexOf('\0');

      if (nullpos !== -1) {
        state.position = nullpos;
        throwError(state, 'null byte is not allowed in input');
      }

      // Use 0 as string terminator. That significantly simplifies bounds check.
      state.input += '\0';

      while (state.input.charCodeAt(state.position) === 0x20/* Space */) {
        state.lineIndent += 1;
        state.position += 1;
      }

      while (state.position < (state.length - 1)) {
        readDocument(state);
      }

      return state.documents;
    }


    function loadAll(input, iterator, options) {
      if (iterator !== null && typeof iterator === 'object' && typeof options === 'undefined') {
        options = iterator;
        iterator = null;
      }

      var documents = loadDocuments(input, options);

      if (typeof iterator !== 'function') {
        return documents;
      }

      for (var index = 0, length = documents.length; index < length; index += 1) {
        iterator(documents[index]);
      }
    }


    function load(input, options) {
      var documents = loadDocuments(input, options);

      if (documents.length === 0) {
        /*eslint-disable no-undefined*/
        return undefined;
      } else if (documents.length === 1) {
        return documents[0];
      }
      throw new YAMLException$1('expected a single document in the stream, but found more');
    }


    function safeLoadAll(input, iterator, options) {
      if (typeof iterator === 'object' && iterator !== null && typeof options === 'undefined') {
        options = iterator;
        iterator = null;
      }

      return loadAll(input, iterator, common$1.extend({ schema: DEFAULT_SAFE_SCHEMA$1 }, options));
    }


    function safeLoad(input, options) {
      return load(input, common$1.extend({ schema: DEFAULT_SAFE_SCHEMA$1 }, options));
    }


    loader$1.loadAll     = loadAll;
    loader$1.load        = load;
    loader$1.safeLoadAll = safeLoadAll;
    loader$1.safeLoad    = safeLoad;

    var dumper$1 = {};

    /*eslint-disable no-use-before-define*/

    var common              = common$6;
    var YAMLException       = exception;
    var DEFAULT_FULL_SCHEMA = default_full;
    var DEFAULT_SAFE_SCHEMA = default_safe;

    var _toString       = Object.prototype.toString;
    var _hasOwnProperty = Object.prototype.hasOwnProperty;

    var CHAR_TAB                  = 0x09; /* Tab */
    var CHAR_LINE_FEED            = 0x0A; /* LF */
    var CHAR_CARRIAGE_RETURN      = 0x0D; /* CR */
    var CHAR_SPACE                = 0x20; /* Space */
    var CHAR_EXCLAMATION          = 0x21; /* ! */
    var CHAR_DOUBLE_QUOTE         = 0x22; /* " */
    var CHAR_SHARP                = 0x23; /* # */
    var CHAR_PERCENT              = 0x25; /* % */
    var CHAR_AMPERSAND            = 0x26; /* & */
    var CHAR_SINGLE_QUOTE         = 0x27; /* ' */
    var CHAR_ASTERISK             = 0x2A; /* * */
    var CHAR_COMMA                = 0x2C; /* , */
    var CHAR_MINUS                = 0x2D; /* - */
    var CHAR_COLON                = 0x3A; /* : */
    var CHAR_EQUALS               = 0x3D; /* = */
    var CHAR_GREATER_THAN         = 0x3E; /* > */
    var CHAR_QUESTION             = 0x3F; /* ? */
    var CHAR_COMMERCIAL_AT        = 0x40; /* @ */
    var CHAR_LEFT_SQUARE_BRACKET  = 0x5B; /* [ */
    var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
    var CHAR_GRAVE_ACCENT         = 0x60; /* ` */
    var CHAR_LEFT_CURLY_BRACKET   = 0x7B; /* { */
    var CHAR_VERTICAL_LINE        = 0x7C; /* | */
    var CHAR_RIGHT_CURLY_BRACKET  = 0x7D; /* } */

    var ESCAPE_SEQUENCES = {};

    ESCAPE_SEQUENCES[0x00]   = '\\0';
    ESCAPE_SEQUENCES[0x07]   = '\\a';
    ESCAPE_SEQUENCES[0x08]   = '\\b';
    ESCAPE_SEQUENCES[0x09]   = '\\t';
    ESCAPE_SEQUENCES[0x0A]   = '\\n';
    ESCAPE_SEQUENCES[0x0B]   = '\\v';
    ESCAPE_SEQUENCES[0x0C]   = '\\f';
    ESCAPE_SEQUENCES[0x0D]   = '\\r';
    ESCAPE_SEQUENCES[0x1B]   = '\\e';
    ESCAPE_SEQUENCES[0x22]   = '\\"';
    ESCAPE_SEQUENCES[0x5C]   = '\\\\';
    ESCAPE_SEQUENCES[0x85]   = '\\N';
    ESCAPE_SEQUENCES[0xA0]   = '\\_';
    ESCAPE_SEQUENCES[0x2028] = '\\L';
    ESCAPE_SEQUENCES[0x2029] = '\\P';

    var DEPRECATED_BOOLEANS_SYNTAX = [
      'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
      'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
    ];

    function compileStyleMap(schema, map) {
      var result, keys, index, length, tag, style, type;

      if (map === null) return {};

      result = {};
      keys = Object.keys(map);

      for (index = 0, length = keys.length; index < length; index += 1) {
        tag = keys[index];
        style = String(map[tag]);

        if (tag.slice(0, 2) === '!!') {
          tag = 'tag:yaml.org,2002:' + tag.slice(2);
        }
        type = schema.compiledTypeMap['fallback'][tag];

        if (type && _hasOwnProperty.call(type.styleAliases, style)) {
          style = type.styleAliases[style];
        }

        result[tag] = style;
      }

      return result;
    }

    function encodeHex(character) {
      var string, handle, length;

      string = character.toString(16).toUpperCase();

      if (character <= 0xFF) {
        handle = 'x';
        length = 2;
      } else if (character <= 0xFFFF) {
        handle = 'u';
        length = 4;
      } else if (character <= 0xFFFFFFFF) {
        handle = 'U';
        length = 8;
      } else {
        throw new YAMLException('code point within a string may not be greater than 0xFFFFFFFF');
      }

      return '\\' + handle + common.repeat('0', length - string.length) + string;
    }

    function State(options) {
      this.schema        = options['schema'] || DEFAULT_FULL_SCHEMA;
      this.indent        = Math.max(1, (options['indent'] || 2));
      this.noArrayIndent = options['noArrayIndent'] || false;
      this.skipInvalid   = options['skipInvalid'] || false;
      this.flowLevel     = (common.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
      this.styleMap      = compileStyleMap(this.schema, options['styles'] || null);
      this.sortKeys      = options['sortKeys'] || false;
      this.lineWidth     = options['lineWidth'] || 80;
      this.noRefs        = options['noRefs'] || false;
      this.noCompatMode  = options['noCompatMode'] || false;
      this.condenseFlow  = options['condenseFlow'] || false;

      this.implicitTypes = this.schema.compiledImplicit;
      this.explicitTypes = this.schema.compiledExplicit;

      this.tag = null;
      this.result = '';

      this.duplicates = [];
      this.usedDuplicates = null;
    }

    // Indents every line in a string. Empty lines (\n only) are not indented.
    function indentString(string, spaces) {
      var ind = common.repeat(' ', spaces),
          position = 0,
          next = -1,
          result = '',
          line,
          length = string.length;

      while (position < length) {
        next = string.indexOf('\n', position);
        if (next === -1) {
          line = string.slice(position);
          position = length;
        } else {
          line = string.slice(position, next + 1);
          position = next + 1;
        }

        if (line.length && line !== '\n') result += ind;

        result += line;
      }

      return result;
    }

    function generateNextLine(state, level) {
      return '\n' + common.repeat(' ', state.indent * level);
    }

    function testImplicitResolving(state, str) {
      var index, length, type;

      for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
        type = state.implicitTypes[index];

        if (type.resolve(str)) {
          return true;
        }
      }

      return false;
    }

    // [33] s-white ::= s-space | s-tab
    function isWhitespace(c) {
      return c === CHAR_SPACE || c === CHAR_TAB;
    }

    // Returns true if the character can be printed without escaping.
    // From YAML 1.2: "any allowed characters known to be non-printable
    // should also be escaped. [However,] This isn’t mandatory"
    // Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
    function isPrintable(c) {
      return  (0x00020 <= c && c <= 0x00007E)
          || ((0x000A1 <= c && c <= 0x00D7FF) && c !== 0x2028 && c !== 0x2029)
          || ((0x0E000 <= c && c <= 0x00FFFD) && c !== 0xFEFF /* BOM */)
          ||  (0x10000 <= c && c <= 0x10FFFF);
    }

    // [34] ns-char ::= nb-char - s-white
    // [27] nb-char ::= c-printable - b-char - c-byte-order-mark
    // [26] b-char  ::= b-line-feed | b-carriage-return
    // [24] b-line-feed       ::=     #xA    /* LF */
    // [25] b-carriage-return ::=     #xD    /* CR */
    // [3]  c-byte-order-mark ::=     #xFEFF
    function isNsChar(c) {
      return isPrintable(c) && !isWhitespace(c)
        // byte-order-mark
        && c !== 0xFEFF
        // b-char
        && c !== CHAR_CARRIAGE_RETURN
        && c !== CHAR_LINE_FEED;
    }

    // Simplified test for values allowed after the first character in plain style.
    function isPlainSafe(c, prev) {
      // Uses a subset of nb-char - c-flow-indicator - ":" - "#"
      // where nb-char ::= c-printable - b-char - c-byte-order-mark.
      return isPrintable(c) && c !== 0xFEFF
        // - c-flow-indicator
        && c !== CHAR_COMMA
        && c !== CHAR_LEFT_SQUARE_BRACKET
        && c !== CHAR_RIGHT_SQUARE_BRACKET
        && c !== CHAR_LEFT_CURLY_BRACKET
        && c !== CHAR_RIGHT_CURLY_BRACKET
        // - ":" - "#"
        // /* An ns-char preceding */ "#"
        && c !== CHAR_COLON
        && ((c !== CHAR_SHARP) || (prev && isNsChar(prev)));
    }

    // Simplified test for values allowed as the first character in plain style.
    function isPlainSafeFirst(c) {
      // Uses a subset of ns-char - c-indicator
      // where ns-char = nb-char - s-white.
      return isPrintable(c) && c !== 0xFEFF
        && !isWhitespace(c) // - s-white
        // - (c-indicator ::=
        // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
        && c !== CHAR_MINUS
        && c !== CHAR_QUESTION
        && c !== CHAR_COLON
        && c !== CHAR_COMMA
        && c !== CHAR_LEFT_SQUARE_BRACKET
        && c !== CHAR_RIGHT_SQUARE_BRACKET
        && c !== CHAR_LEFT_CURLY_BRACKET
        && c !== CHAR_RIGHT_CURLY_BRACKET
        // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
        && c !== CHAR_SHARP
        && c !== CHAR_AMPERSAND
        && c !== CHAR_ASTERISK
        && c !== CHAR_EXCLAMATION
        && c !== CHAR_VERTICAL_LINE
        && c !== CHAR_EQUALS
        && c !== CHAR_GREATER_THAN
        && c !== CHAR_SINGLE_QUOTE
        && c !== CHAR_DOUBLE_QUOTE
        // | “%” | “@” | “`”)
        && c !== CHAR_PERCENT
        && c !== CHAR_COMMERCIAL_AT
        && c !== CHAR_GRAVE_ACCENT;
    }

    // Determines whether block indentation indicator is required.
    function needIndentIndicator(string) {
      var leadingSpaceRe = /^\n* /;
      return leadingSpaceRe.test(string);
    }

    var STYLE_PLAIN   = 1,
        STYLE_SINGLE  = 2,
        STYLE_LITERAL = 3,
        STYLE_FOLDED  = 4,
        STYLE_DOUBLE  = 5;

    // Determines which scalar styles are possible and returns the preferred style.
    // lineWidth = -1 => no limit.
    // Pre-conditions: str.length > 0.
    // Post-conditions:
    //    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
    //    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
    //    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
    function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
      var i;
      var char, prev_char;
      var hasLineBreak = false;
      var hasFoldableLine = false; // only checked if shouldTrackWidth
      var shouldTrackWidth = lineWidth !== -1;
      var previousLineBreak = -1; // count the first line correctly
      var plain = isPlainSafeFirst(string.charCodeAt(0))
              && !isWhitespace(string.charCodeAt(string.length - 1));

      if (singleLineOnly) {
        // Case: no block styles.
        // Check for disallowed characters to rule out plain and single.
        for (i = 0; i < string.length; i++) {
          char = string.charCodeAt(i);
          if (!isPrintable(char)) {
            return STYLE_DOUBLE;
          }
          prev_char = i > 0 ? string.charCodeAt(i - 1) : null;
          plain = plain && isPlainSafe(char, prev_char);
        }
      } else {
        // Case: block styles permitted.
        for (i = 0; i < string.length; i++) {
          char = string.charCodeAt(i);
          if (char === CHAR_LINE_FEED) {
            hasLineBreak = true;
            // Check if any line can be folded.
            if (shouldTrackWidth) {
              hasFoldableLine = hasFoldableLine ||
                // Foldable line = too long, and not more-indented.
                (i - previousLineBreak - 1 > lineWidth &&
                 string[previousLineBreak + 1] !== ' ');
              previousLineBreak = i;
            }
          } else if (!isPrintable(char)) {
            return STYLE_DOUBLE;
          }
          prev_char = i > 0 ? string.charCodeAt(i - 1) : null;
          plain = plain && isPlainSafe(char, prev_char);
        }
        // in case the end is missing a \n
        hasFoldableLine = hasFoldableLine || (shouldTrackWidth &&
          (i - previousLineBreak - 1 > lineWidth &&
           string[previousLineBreak + 1] !== ' '));
      }
      // Although every style can represent \n without escaping, prefer block styles
      // for multiline, since they're more readable and they don't add empty lines.
      // Also prefer folding a super-long line.
      if (!hasLineBreak && !hasFoldableLine) {
        // Strings interpretable as another type have to be quoted;
        // e.g. the string 'true' vs. the boolean true.
        return plain && !testAmbiguousType(string)
          ? STYLE_PLAIN : STYLE_SINGLE;
      }
      // Edge case: block indentation indicator can only have one digit.
      if (indentPerLevel > 9 && needIndentIndicator(string)) {
        return STYLE_DOUBLE;
      }
      // At this point we know block styles are valid.
      // Prefer literal style unless we want to fold.
      return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
    }

    // Note: line breaking/folding is implemented for only the folded style.
    // NB. We drop the last trailing newline (if any) of a returned block scalar
    //  since the dumper adds its own newline. This always works:
    //    • No ending newline => unaffected; already using strip "-" chomping.
    //    • Ending newline    => removed then restored.
    //  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
    function writeScalar(state, string, level, iskey) {
      state.dump = (function () {
        if (string.length === 0) {
          return "''";
        }
        if (!state.noCompatMode &&
            DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
          return "'" + string + "'";
        }

        var indent = state.indent * Math.max(1, level); // no 0-indent scalars
        // As indentation gets deeper, let the width decrease monotonically
        // to the lower bound min(state.lineWidth, 40).
        // Note that this implies
        //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
        //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
        // This behaves better than a constant minimum width which disallows narrower options,
        // or an indent threshold which causes the width to suddenly increase.
        var lineWidth = state.lineWidth === -1
          ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

        // Without knowing if keys are implicit/explicit, assume implicit for safety.
        var singleLineOnly = iskey
          // No block styles in flow mode.
          || (state.flowLevel > -1 && level >= state.flowLevel);
        function testAmbiguity(string) {
          return testImplicitResolving(state, string);
        }

        switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity)) {
          case STYLE_PLAIN:
            return string;
          case STYLE_SINGLE:
            return "'" + string.replace(/'/g, "''") + "'";
          case STYLE_LITERAL:
            return '|' + blockHeader(string, state.indent)
              + dropEndingNewline(indentString(string, indent));
          case STYLE_FOLDED:
            return '>' + blockHeader(string, state.indent)
              + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
          case STYLE_DOUBLE:
            return '"' + escapeString(string) + '"';
          default:
            throw new YAMLException('impossible error: invalid scalar style');
        }
      }());
    }

    // Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
    function blockHeader(string, indentPerLevel) {
      var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : '';

      // note the special case: the string '\n' counts as a "trailing" empty line.
      var clip =          string[string.length - 1] === '\n';
      var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
      var chomp = keep ? '+' : (clip ? '' : '-');

      return indentIndicator + chomp + '\n';
    }

    // (See the note for writeScalar.)
    function dropEndingNewline(string) {
      return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
    }

    // Note: a long line without a suitable break point will exceed the width limit.
    // Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
    function foldString(string, width) {
      // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
      // unless they're before or after a more-indented line, or at the very
      // beginning or end, in which case $k$ maps to $k$.
      // Therefore, parse each chunk as newline(s) followed by a content line.
      var lineRe = /(\n+)([^\n]*)/g;

      // first line (possibly an empty line)
      var result = (function () {
        var nextLF = string.indexOf('\n');
        nextLF = nextLF !== -1 ? nextLF : string.length;
        lineRe.lastIndex = nextLF;
        return foldLine(string.slice(0, nextLF), width);
      }());
      // If we haven't reached the first content line yet, don't add an extra \n.
      var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
      var moreIndented;

      // rest of the lines
      var match;
      while ((match = lineRe.exec(string))) {
        var prefix = match[1], line = match[2];
        moreIndented = (line[0] === ' ');
        result += prefix
          + (!prevMoreIndented && !moreIndented && line !== ''
            ? '\n' : '')
          + foldLine(line, width);
        prevMoreIndented = moreIndented;
      }

      return result;
    }

    // Greedy line breaking.
    // Picks the longest line under the limit each time,
    // otherwise settles for the shortest line over the limit.
    // NB. More-indented lines *cannot* be folded, as that would add an extra \n.
    function foldLine(line, width) {
      if (line === '' || line[0] === ' ') return line;

      // Since a more-indented line adds a \n, breaks can't be followed by a space.
      var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
      var match;
      // start is an inclusive index. end, curr, and next are exclusive.
      var start = 0, end, curr = 0, next = 0;
      var result = '';

      // Invariants: 0 <= start <= length-1.
      //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
      // Inside the loop:
      //   A match implies length >= 2, so curr and next are <= length-2.
      while ((match = breakRe.exec(line))) {
        next = match.index;
        // maintain invariant: curr - start <= width
        if (next - start > width) {
          end = (curr > start) ? curr : next; // derive end <= length-2
          result += '\n' + line.slice(start, end);
          // skip the space that was output as \n
          start = end + 1;                    // derive start <= length-1
        }
        curr = next;
      }

      // By the invariants, start <= length-1, so there is something left over.
      // It is either the whole string or a part starting from non-whitespace.
      result += '\n';
      // Insert a break if the remainder is too long and there is a break available.
      if (line.length - start > width && curr > start) {
        result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
      } else {
        result += line.slice(start);
      }

      return result.slice(1); // drop extra \n joiner
    }

    // Escapes a double-quoted string.
    function escapeString(string) {
      var result = '';
      var char, nextChar;
      var escapeSeq;

      for (var i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        // Check for surrogate pairs (reference Unicode 3.0 section "3.7 Surrogates").
        if (char >= 0xD800 && char <= 0xDBFF/* high surrogate */) {
          nextChar = string.charCodeAt(i + 1);
          if (nextChar >= 0xDC00 && nextChar <= 0xDFFF/* low surrogate */) {
            // Combine the surrogate pair and store it escaped.
            result += encodeHex((char - 0xD800) * 0x400 + nextChar - 0xDC00 + 0x10000);
            // Advance index one extra since we already used that char here.
            i++; continue;
          }
        }
        escapeSeq = ESCAPE_SEQUENCES[char];
        result += !escapeSeq && isPrintable(char)
          ? string[i]
          : escapeSeq || encodeHex(char);
      }

      return result;
    }

    function writeFlowSequence(state, level, object) {
      var _result = '',
          _tag    = state.tag,
          index,
          length;

      for (index = 0, length = object.length; index < length; index += 1) {
        // Write only valid elements.
        if (writeNode(state, level, object[index], false, false)) {
          if (index !== 0) _result += ',' + (!state.condenseFlow ? ' ' : '');
          _result += state.dump;
        }
      }

      state.tag = _tag;
      state.dump = '[' + _result + ']';
    }

    function writeBlockSequence(state, level, object, compact) {
      var _result = '',
          _tag    = state.tag,
          index,
          length;

      for (index = 0, length = object.length; index < length; index += 1) {
        // Write only valid elements.
        if (writeNode(state, level + 1, object[index], true, true)) {
          if (!compact || index !== 0) {
            _result += generateNextLine(state, level);
          }

          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            _result += '-';
          } else {
            _result += '- ';
          }

          _result += state.dump;
        }
      }

      state.tag = _tag;
      state.dump = _result || '[]'; // Empty sequence if no valid values.
    }

    function writeFlowMapping(state, level, object) {
      var _result       = '',
          _tag          = state.tag,
          objectKeyList = Object.keys(object),
          index,
          length,
          objectKey,
          objectValue,
          pairBuffer;

      for (index = 0, length = objectKeyList.length; index < length; index += 1) {

        pairBuffer = '';
        if (index !== 0) pairBuffer += ', ';

        if (state.condenseFlow) pairBuffer += '"';

        objectKey = objectKeyList[index];
        objectValue = object[objectKey];

        if (!writeNode(state, level, objectKey, false, false)) {
          continue; // Skip this pair because of invalid key;
        }

        if (state.dump.length > 1024) pairBuffer += '? ';

        pairBuffer += state.dump + (state.condenseFlow ? '"' : '') + ':' + (state.condenseFlow ? '' : ' ');

        if (!writeNode(state, level, objectValue, false, false)) {
          continue; // Skip this pair because of invalid value.
        }

        pairBuffer += state.dump;

        // Both key and value are valid.
        _result += pairBuffer;
      }

      state.tag = _tag;
      state.dump = '{' + _result + '}';
    }

    function writeBlockMapping(state, level, object, compact) {
      var _result       = '',
          _tag          = state.tag,
          objectKeyList = Object.keys(object),
          index,
          length,
          objectKey,
          objectValue,
          explicitPair,
          pairBuffer;

      // Allow sorting keys so that the output file is deterministic
      if (state.sortKeys === true) {
        // Default sorting
        objectKeyList.sort();
      } else if (typeof state.sortKeys === 'function') {
        // Custom sort function
        objectKeyList.sort(state.sortKeys);
      } else if (state.sortKeys) {
        // Something is wrong
        throw new YAMLException('sortKeys must be a boolean or a function');
      }

      for (index = 0, length = objectKeyList.length; index < length; index += 1) {
        pairBuffer = '';

        if (!compact || index !== 0) {
          pairBuffer += generateNextLine(state, level);
        }

        objectKey = objectKeyList[index];
        objectValue = object[objectKey];

        if (!writeNode(state, level + 1, objectKey, true, true, true)) {
          continue; // Skip this pair because of invalid key.
        }

        explicitPair = (state.tag !== null && state.tag !== '?') ||
                       (state.dump && state.dump.length > 1024);

        if (explicitPair) {
          if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
            pairBuffer += '?';
          } else {
            pairBuffer += '? ';
          }
        }

        pairBuffer += state.dump;

        if (explicitPair) {
          pairBuffer += generateNextLine(state, level);
        }

        if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
          continue; // Skip this pair because of invalid value.
        }

        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += ':';
        } else {
          pairBuffer += ': ';
        }

        pairBuffer += state.dump;

        // Both key and value are valid.
        _result += pairBuffer;
      }

      state.tag = _tag;
      state.dump = _result || '{}'; // Empty mapping if no valid pairs.
    }

    function detectType(state, object, explicit) {
      var _result, typeList, index, length, type, style;

      typeList = explicit ? state.explicitTypes : state.implicitTypes;

      for (index = 0, length = typeList.length; index < length; index += 1) {
        type = typeList[index];

        if ((type.instanceOf  || type.predicate) &&
            (!type.instanceOf || ((typeof object === 'object') && (object instanceof type.instanceOf))) &&
            (!type.predicate  || type.predicate(object))) {

          state.tag = explicit ? type.tag : '?';

          if (type.represent) {
            style = state.styleMap[type.tag] || type.defaultStyle;

            if (_toString.call(type.represent) === '[object Function]') {
              _result = type.represent(object, style);
            } else if (_hasOwnProperty.call(type.represent, style)) {
              _result = type.represent[style](object, style);
            } else {
              throw new YAMLException('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
            }

            state.dump = _result;
          }

          return true;
        }
      }

      return false;
    }

    // Serializes `object` and writes it to global `result`.
    // Returns true on success, or false on invalid object.
    //
    function writeNode(state, level, object, block, compact, iskey) {
      state.tag = null;
      state.dump = object;

      if (!detectType(state, object, false)) {
        detectType(state, object, true);
      }

      var type = _toString.call(state.dump);

      if (block) {
        block = (state.flowLevel < 0 || state.flowLevel > level);
      }

      var objectOrArray = type === '[object Object]' || type === '[object Array]',
          duplicateIndex,
          duplicate;

      if (objectOrArray) {
        duplicateIndex = state.duplicates.indexOf(object);
        duplicate = duplicateIndex !== -1;
      }

      if ((state.tag !== null && state.tag !== '?') || duplicate || (state.indent !== 2 && level > 0)) {
        compact = false;
      }

      if (duplicate && state.usedDuplicates[duplicateIndex]) {
        state.dump = '*ref_' + duplicateIndex;
      } else {
        if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
          state.usedDuplicates[duplicateIndex] = true;
        }
        if (type === '[object Object]') {
          if (block && (Object.keys(state.dump).length !== 0)) {
            writeBlockMapping(state, level, state.dump, compact);
            if (duplicate) {
              state.dump = '&ref_' + duplicateIndex + state.dump;
            }
          } else {
            writeFlowMapping(state, level, state.dump);
            if (duplicate) {
              state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
            }
          }
        } else if (type === '[object Array]') {
          var arrayLevel = (state.noArrayIndent && (level > 0)) ? level - 1 : level;
          if (block && (state.dump.length !== 0)) {
            writeBlockSequence(state, arrayLevel, state.dump, compact);
            if (duplicate) {
              state.dump = '&ref_' + duplicateIndex + state.dump;
            }
          } else {
            writeFlowSequence(state, arrayLevel, state.dump);
            if (duplicate) {
              state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
            }
          }
        } else if (type === '[object String]') {
          if (state.tag !== '?') {
            writeScalar(state, state.dump, level, iskey);
          }
        } else {
          if (state.skipInvalid) return false;
          throw new YAMLException('unacceptable kind of an object to dump ' + type);
        }

        if (state.tag !== null && state.tag !== '?') {
          state.dump = '!<' + state.tag + '> ' + state.dump;
        }
      }

      return true;
    }

    function getDuplicateReferences(object, state) {
      var objects = [],
          duplicatesIndexes = [],
          index,
          length;

      inspectNode(object, objects, duplicatesIndexes);

      for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
        state.duplicates.push(objects[duplicatesIndexes[index]]);
      }
      state.usedDuplicates = new Array(length);
    }

    function inspectNode(object, objects, duplicatesIndexes) {
      var objectKeyList,
          index,
          length;

      if (object !== null && typeof object === 'object') {
        index = objects.indexOf(object);
        if (index !== -1) {
          if (duplicatesIndexes.indexOf(index) === -1) {
            duplicatesIndexes.push(index);
          }
        } else {
          objects.push(object);

          if (Array.isArray(object)) {
            for (index = 0, length = object.length; index < length; index += 1) {
              inspectNode(object[index], objects, duplicatesIndexes);
            }
          } else {
            objectKeyList = Object.keys(object);

            for (index = 0, length = objectKeyList.length; index < length; index += 1) {
              inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
            }
          }
        }
      }
    }

    function dump(input, options) {
      options = options || {};

      var state = new State(options);

      if (!state.noRefs) getDuplicateReferences(input, state);

      if (writeNode(state, 0, input, true, true)) return state.dump + '\n';

      return '';
    }

    function safeDump(input, options) {
      return dump(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
    }

    dumper$1.dump     = dump;
    dumper$1.safeDump = safeDump;

    var loader = loader$1;
    var dumper = dumper$1;


    function deprecated(name) {
      return function () {
        throw new Error('Function ' + name + ' is deprecated and cannot be used.');
      };
    }


    jsYaml$1.Type                = type;
    jsYaml$1.Schema              = schema;
    jsYaml$1.FAILSAFE_SCHEMA     = failsafe;
    jsYaml$1.JSON_SCHEMA         = json;
    jsYaml$1.CORE_SCHEMA         = core;
    jsYaml$1.DEFAULT_SAFE_SCHEMA = default_safe;
    jsYaml$1.DEFAULT_FULL_SCHEMA = default_full;
    jsYaml$1.load                = loader.load;
    jsYaml$1.loadAll             = loader.loadAll;
    jsYaml$1.safeLoad            = loader.safeLoad;
    jsYaml$1.safeLoadAll         = loader.safeLoadAll;
    jsYaml$1.dump                = dumper.dump;
    jsYaml$1.safeDump            = dumper.safeDump;
    jsYaml$1.YAMLException       = exception;

    // Deprecated schema names from JS-YAML 2.0.x
    jsYaml$1.MINIMAL_SCHEMA = failsafe;
    jsYaml$1.SAFE_SCHEMA    = default_safe;
    jsYaml$1.DEFAULT_SCHEMA = default_full;

    // Deprecated functions from JS-YAML 1.x.x
    jsYaml$1.scan           = deprecated('scan');
    jsYaml$1.parse          = deprecated('parse');
    jsYaml$1.compose        = deprecated('compose');
    jsYaml$1.addConstructor = deprecated('addConstructor');

    var yaml = jsYaml$1;


    var jsYaml = yaml;

    (function (module, exports) {

    	const yaml = jsYaml;

    	/**
    	 * Default engines
    	 */

    	const engines = module.exports;

    	/**
    	 * YAML
    	 */

    	engines.yaml = {
    	  parse: yaml.safeLoad.bind(yaml),
    	  stringify: yaml.safeDump.bind(yaml)
    	};

    	/**
    	 * JSON
    	 */

    	engines.json = {
    	  parse: JSON.parse.bind(JSON),
    	  stringify: function(obj, options) {
    	    const opts = Object.assign({replacer: null, space: 2}, options);
    	    return JSON.stringify(obj, opts.replacer, opts.space);
    	  }
    	};

    	/**
    	 * JavaScript
    	 */

    	engines.javascript = {
    	  parse: function parse(str, options, wrap) {
    	    /* eslint no-eval: 0 */
    	    try {
    	      if (wrap !== false) {
    	        str = '(function() {\nreturn ' + str.trim() + ';\n}());';
    	      }
    	      return eval(str) || {};
    	    } catch (err) {
    	      if (wrap !== false && /(unexpected|identifier)/i.test(err.message)) {
    	        return parse(str, options, false);
    	      }
    	      throw new SyntaxError(err);
    	    }
    	  },
    	  stringify: function() {
    	    throw new Error('stringifying JavaScript is not supported');
    	  }
    	}; 
    } (engines$2));

    var enginesExports = engines$2.exports;

    var global$1 = (typeof global !== "undefined" ? global :
      typeof self !== "undefined" ? self :
      typeof window !== "undefined" ? window : {});

    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
    var inited = false;
    function init () {
      inited = true;
      var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      for (var i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }

      revLookup['-'.charCodeAt(0)] = 62;
      revLookup['_'.charCodeAt(0)] = 63;
    }

    function toByteArray (b64) {
      if (!inited) {
        init();
      }
      var i, j, l, tmp, placeHolders, arr;
      var len = b64.length;

      if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4')
      }

      // the number of equal signs (place holders)
      // if there are two placeholders, than the two characters before it
      // represent one byte
      // if there is only one, then the three characters before it represent 2 bytes
      // this is just a cheap hack to not do indexOf twice
      placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

      // base64 is 4/3 + up to two characters of the original data
      arr = new Arr(len * 3 / 4 - placeHolders);

      // if there are placeholders, only get up to the last complete 4 chars
      l = placeHolders > 0 ? len - 4 : len;

      var L = 0;

      for (i = 0, j = 0; i < l; i += 4, j += 3) {
        tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
        arr[L++] = (tmp >> 16) & 0xFF;
        arr[L++] = (tmp >> 8) & 0xFF;
        arr[L++] = tmp & 0xFF;
      }

      if (placeHolders === 2) {
        tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
        arr[L++] = tmp & 0xFF;
      } else if (placeHolders === 1) {
        tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
        arr[L++] = (tmp >> 8) & 0xFF;
        arr[L++] = tmp & 0xFF;
      }

      return arr
    }

    function tripletToBase64 (num) {
      return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
    }

    function encodeChunk (uint8, start, end) {
      var tmp;
      var output = [];
      for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
        output.push(tripletToBase64(tmp));
      }
      return output.join('')
    }

    function fromByteArray (uint8) {
      if (!inited) {
        init();
      }
      var tmp;
      var len = uint8.length;
      var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
      var output = '';
      var parts = [];
      var maxChunkLength = 16383; // must be multiple of 3

      // go through the array every three bytes, we'll deal with trailing stuff later
      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
        parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
      }

      // pad the end with zeros, but make sure to not forget the extra bytes
      if (extraBytes === 1) {
        tmp = uint8[len - 1];
        output += lookup[tmp >> 2];
        output += lookup[(tmp << 4) & 0x3F];
        output += '==';
      } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
        output += lookup[tmp >> 10];
        output += lookup[(tmp >> 4) & 0x3F];
        output += lookup[(tmp << 2) & 0x3F];
        output += '=';
      }

      parts.push(output);

      return parts.join('')
    }

    function read (buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? (nBytes - 1) : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];

      i += d;

      e = s & ((1 << (-nBits)) - 1);
      s >>= (-nBits);
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

      m = e & ((1 << (-nBits)) - 1);
      e >>= (-nBits);
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : ((s ? -1 : 1) * Infinity)
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
    }

    function write (buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
      var i = isLE ? 0 : (nBytes - 1);
      var d = isLE ? 1 : -1;
      var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

      value = Math.abs(value);

      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }

        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }

      for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

      e = (e << mLen) | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

      buffer[offset + i - d] |= s * 128;
    }

    var toString = {}.toString;

    var isArray = Array.isArray || function (arr) {
      return toString.call(arr) == '[object Array]';
    };

    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
     * @license  MIT
     */

    var INSPECT_MAX_BYTES = 50;

    /**
     * If `Buffer.TYPED_ARRAY_SUPPORT`:
     *   === true    Use Uint8Array implementation (fastest)
     *   === false   Use Object implementation (most compatible, even IE6)
     *
     * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
     * Opera 11.6+, iOS 4.2+.
     *
     * Due to various browser bugs, sometimes the Object implementation will be used even
     * when the browser supports typed arrays.
     *
     * Note:
     *
     *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
     *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
     *
     *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
     *
     *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
     *     incorrect length in some situations.

     * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
     * get the Object implementation, which is slower but behaves correctly.
     */
    Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
      ? global$1.TYPED_ARRAY_SUPPORT
      : true;

    /*
     * Export kMaxLength after typed array support is determined.
     */
    kMaxLength();

    function kMaxLength () {
      return Buffer.TYPED_ARRAY_SUPPORT
        ? 0x7fffffff
        : 0x3fffffff
    }

    function createBuffer (that, length) {
      if (kMaxLength() < length) {
        throw new RangeError('Invalid typed array length')
      }
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        // Return an augmented `Uint8Array` instance, for best performance
        that = new Uint8Array(length);
        that.__proto__ = Buffer.prototype;
      } else {
        // Fallback: Return an object instance of the Buffer class
        if (that === null) {
          that = new Buffer(length);
        }
        that.length = length;
      }

      return that
    }

    /**
     * The Buffer constructor returns instances of `Uint8Array` that have their
     * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
     * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
     * and the `Uint8Array` methods. Square bracket notation works as expected -- it
     * returns a single octet.
     *
     * The `Uint8Array` prototype remains unmodified.
     */

    function Buffer (arg, encodingOrOffset, length) {
      if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
        return new Buffer(arg, encodingOrOffset, length)
      }

      // Common case.
      if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
          throw new Error(
            'If encoding is specified then the first argument must be a string'
          )
        }
        return allocUnsafe(this, arg)
      }
      return from(this, arg, encodingOrOffset, length)
    }

    Buffer.poolSize = 8192; // not used by this implementation

    // TODO: Legacy, not needed anymore. Remove in next major version.
    Buffer._augment = function (arr) {
      arr.__proto__ = Buffer.prototype;
      return arr
    };

    function from (that, value, encodingOrOffset, length) {
      if (typeof value === 'number') {
        throw new TypeError('"value" argument must not be a number')
      }

      if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
        return fromArrayBuffer(that, value, encodingOrOffset, length)
      }

      if (typeof value === 'string') {
        return fromString(that, value, encodingOrOffset)
      }

      return fromObject(that, value)
    }

    /**
     * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
     * if value is a number.
     * Buffer.from(str[, encoding])
     * Buffer.from(array)
     * Buffer.from(buffer)
     * Buffer.from(arrayBuffer[, byteOffset[, length]])
     **/
    Buffer.from = function (value, encodingOrOffset, length) {
      return from(null, value, encodingOrOffset, length)
    };

    if (Buffer.TYPED_ARRAY_SUPPORT) {
      Buffer.prototype.__proto__ = Uint8Array.prototype;
      Buffer.__proto__ = Uint8Array;
    }

    function assertSize (size) {
      if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be a number')
      } else if (size < 0) {
        throw new RangeError('"size" argument must not be negative')
      }
    }

    function alloc (that, size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(that, size)
      }
      if (fill !== undefined) {
        // Only pay attention to encoding if it's a string. This
        // prevents accidentally sending in a number that would
        // be interpretted as a start offset.
        return typeof encoding === 'string'
          ? createBuffer(that, size).fill(fill, encoding)
          : createBuffer(that, size).fill(fill)
      }
      return createBuffer(that, size)
    }

    /**
     * Creates a new filled Buffer instance.
     * alloc(size[, fill[, encoding]])
     **/
    Buffer.alloc = function (size, fill, encoding) {
      return alloc(null, size, fill, encoding)
    };

    function allocUnsafe (that, size) {
      assertSize(size);
      that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
      if (!Buffer.TYPED_ARRAY_SUPPORT) {
        for (var i = 0; i < size; ++i) {
          that[i] = 0;
        }
      }
      return that
    }

    /**
     * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
     * */
    Buffer.allocUnsafe = function (size) {
      return allocUnsafe(null, size)
    };
    /**
     * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
     */
    Buffer.allocUnsafeSlow = function (size) {
      return allocUnsafe(null, size)
    };

    function fromString (that, string, encoding) {
      if (typeof encoding !== 'string' || encoding === '') {
        encoding = 'utf8';
      }

      if (!Buffer.isEncoding(encoding)) {
        throw new TypeError('"encoding" must be a valid string encoding')
      }

      var length = byteLength(string, encoding) | 0;
      that = createBuffer(that, length);

      var actual = that.write(string, encoding);

      if (actual !== length) {
        // Writing a hex string, for example, that contains invalid characters will
        // cause everything after the first invalid character to be ignored. (e.g.
        // 'abxxcd' will be treated as 'ab')
        that = that.slice(0, actual);
      }

      return that
    }

    function fromArrayLike (that, array) {
      var length = array.length < 0 ? 0 : checked(array.length) | 0;
      that = createBuffer(that, length);
      for (var i = 0; i < length; i += 1) {
        that[i] = array[i] & 255;
      }
      return that
    }

    function fromArrayBuffer (that, array, byteOffset, length) {
      array.byteLength; // this throws if `array` is not a valid ArrayBuffer

      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('\'offset\' is out of bounds')
      }

      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('\'length\' is out of bounds')
      }

      if (byteOffset === undefined && length === undefined) {
        array = new Uint8Array(array);
      } else if (length === undefined) {
        array = new Uint8Array(array, byteOffset);
      } else {
        array = new Uint8Array(array, byteOffset, length);
      }

      if (Buffer.TYPED_ARRAY_SUPPORT) {
        // Return an augmented `Uint8Array` instance, for best performance
        that = array;
        that.__proto__ = Buffer.prototype;
      } else {
        // Fallback: Return an object instance of the Buffer class
        that = fromArrayLike(that, array);
      }
      return that
    }

    function fromObject (that, obj) {
      if (internalIsBuffer(obj)) {
        var len = checked(obj.length) | 0;
        that = createBuffer(that, len);

        if (that.length === 0) {
          return that
        }

        obj.copy(that, 0, 0, len);
        return that
      }

      if (obj) {
        if ((typeof ArrayBuffer !== 'undefined' &&
            obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
          if (typeof obj.length !== 'number' || isnan(obj.length)) {
            return createBuffer(that, 0)
          }
          return fromArrayLike(that, obj)
        }

        if (obj.type === 'Buffer' && isArray(obj.data)) {
          return fromArrayLike(that, obj.data)
        }
      }

      throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
    }

    function checked (length) {
      // Note: cannot use `length < kMaxLength()` here because that fails when
      // length is NaN (which is otherwise coerced to zero.)
      if (length >= kMaxLength()) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                             'size: 0x' + kMaxLength().toString(16) + ' bytes')
      }
      return length | 0
    }
    Buffer.isBuffer = isBuffer;
    function internalIsBuffer (b) {
      return !!(b != null && b._isBuffer)
    }

    Buffer.compare = function compare (a, b) {
      if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
        throw new TypeError('Arguments must be Buffers')
      }

      if (a === b) return 0

      var x = a.length;
      var y = b.length;

      for (var i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break
        }
      }

      if (x < y) return -1
      if (y < x) return 1
      return 0
    };

    Buffer.isEncoding = function isEncoding (encoding) {
      switch (String(encoding).toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return true
        default:
          return false
      }
    };

    Buffer.concat = function concat (list, length) {
      if (!isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers')
      }

      if (list.length === 0) {
        return Buffer.alloc(0)
      }

      var i;
      if (length === undefined) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }

      var buffer = Buffer.allocUnsafe(length);
      var pos = 0;
      for (i = 0; i < list.length; ++i) {
        var buf = list[i];
        if (!internalIsBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers')
        }
        buf.copy(buffer, pos);
        pos += buf.length;
      }
      return buffer
    };

    function byteLength (string, encoding) {
      if (internalIsBuffer(string)) {
        return string.length
      }
      if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
          (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
        return string.byteLength
      }
      if (typeof string !== 'string') {
        string = '' + string;
      }

      var len = string.length;
      if (len === 0) return 0

      // Use a for loop to avoid recursion
      var loweredCase = false;
      for (;;) {
        switch (encoding) {
          case 'ascii':
          case 'latin1':
          case 'binary':
            return len
          case 'utf8':
          case 'utf-8':
          case undefined:
            return utf8ToBytes(string).length
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return len * 2
          case 'hex':
            return len >>> 1
          case 'base64':
            return base64ToBytes(string).length
          default:
            if (loweredCase) return utf8ToBytes(string).length // assume utf8
            encoding = ('' + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer.byteLength = byteLength;

    function slowToString (encoding, start, end) {
      var loweredCase = false;

      // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
      // property of a typed array.

      // This behaves neither like String nor Uint8Array in that we set start/end
      // to their upper/lower bounds if the value passed is out of range.
      // undefined is handled specially as per ECMA-262 6th Edition,
      // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
      if (start === undefined || start < 0) {
        start = 0;
      }
      // Return early if start > this.length. Done here to prevent potential uint32
      // coercion fail below.
      if (start > this.length) {
        return ''
      }

      if (end === undefined || end > this.length) {
        end = this.length;
      }

      if (end <= 0) {
        return ''
      }

      // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
      end >>>= 0;
      start >>>= 0;

      if (end <= start) {
        return ''
      }

      if (!encoding) encoding = 'utf8';

      while (true) {
        switch (encoding) {
          case 'hex':
            return hexSlice(this, start, end)

          case 'utf8':
          case 'utf-8':
            return utf8Slice(this, start, end)

          case 'ascii':
            return asciiSlice(this, start, end)

          case 'latin1':
          case 'binary':
            return latin1Slice(this, start, end)

          case 'base64':
            return base64Slice(this, start, end)

          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return utf16leSlice(this, start, end)

          default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
            encoding = (encoding + '').toLowerCase();
            loweredCase = true;
        }
      }
    }

    // The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
    // Buffer instances.
    Buffer.prototype._isBuffer = true;

    function swap (b, n, m) {
      var i = b[n];
      b[n] = b[m];
      b[m] = i;
    }

    Buffer.prototype.swap16 = function swap16 () {
      var len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 16-bits')
      }
      for (var i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this
    };

    Buffer.prototype.swap32 = function swap32 () {
      var len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 32-bits')
      }
      for (var i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this
    };

    Buffer.prototype.swap64 = function swap64 () {
      var len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 64-bits')
      }
      for (var i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this
    };

    Buffer.prototype.toString = function toString () {
      var length = this.length | 0;
      if (length === 0) return ''
      if (arguments.length === 0) return utf8Slice(this, 0, length)
      return slowToString.apply(this, arguments)
    };

    Buffer.prototype.equals = function equals (b) {
      if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
      if (this === b) return true
      return Buffer.compare(this, b) === 0
    };

    Buffer.prototype.inspect = function inspect () {
      var str = '';
      var max = INSPECT_MAX_BYTES;
      if (this.length > 0) {
        str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
        if (this.length > max) str += ' ... ';
      }
      return '<Buffer ' + str + '>'
    };

    Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
      if (!internalIsBuffer(target)) {
        throw new TypeError('Argument must be a Buffer')
      }

      if (start === undefined) {
        start = 0;
      }
      if (end === undefined) {
        end = target ? target.length : 0;
      }
      if (thisStart === undefined) {
        thisStart = 0;
      }
      if (thisEnd === undefined) {
        thisEnd = this.length;
      }

      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError('out of range index')
      }

      if (thisStart >= thisEnd && start >= end) {
        return 0
      }
      if (thisStart >= thisEnd) {
        return -1
      }
      if (start >= end) {
        return 1
      }

      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;

      if (this === target) return 0

      var x = thisEnd - thisStart;
      var y = end - start;
      var len = Math.min(x, y);

      var thisCopy = this.slice(thisStart, thisEnd);
      var targetCopy = target.slice(start, end);

      for (var i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break
        }
      }

      if (x < y) return -1
      if (y < x) return 1
      return 0
    };

    // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
    // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
    //
    // Arguments:
    // - buffer - a Buffer to search
    // - val - a string, Buffer, or number
    // - byteOffset - an index into `buffer`; will be clamped to an int32
    // - encoding - an optional encoding, relevant is val is a string
    // - dir - true for indexOf, false for lastIndexOf
    function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
      // Empty buffer means no match
      if (buffer.length === 0) return -1

      // Normalize byteOffset
      if (typeof byteOffset === 'string') {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 0x7fffffff) {
        byteOffset = 0x7fffffff;
      } else if (byteOffset < -0x80000000) {
        byteOffset = -0x80000000;
      }
      byteOffset = +byteOffset;  // Coerce to Number.
      if (isNaN(byteOffset)) {
        // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
        byteOffset = dir ? 0 : (buffer.length - 1);
      }

      // Normalize byteOffset: negative offsets start from the end of the buffer
      if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir) return -1
        else byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1
      }

      // Normalize val
      if (typeof val === 'string') {
        val = Buffer.from(val, encoding);
      }

      // Finally, search either indexOf (if dir is true) or lastIndexOf
      if (internalIsBuffer(val)) {
        // Special case: looking for empty string/buffer always fails
        if (val.length === 0) {
          return -1
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
      } else if (typeof val === 'number') {
        val = val & 0xFF; // Search for a byte value [0-255]
        if (Buffer.TYPED_ARRAY_SUPPORT &&
            typeof Uint8Array.prototype.indexOf === 'function') {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
          }
        }
        return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
      }

      throw new TypeError('val must be string, number or Buffer')
    }

    function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
      var indexSize = 1;
      var arrLength = arr.length;
      var valLength = val.length;

      if (encoding !== undefined) {
        encoding = String(encoding).toLowerCase();
        if (encoding === 'ucs2' || encoding === 'ucs-2' ||
            encoding === 'utf16le' || encoding === 'utf-16le') {
          if (arr.length < 2 || val.length < 2) {
            return -1
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }

      function read (buf, i) {
        if (indexSize === 1) {
          return buf[i]
        } else {
          return buf.readUInt16BE(i * indexSize)
        }
      }

      var i;
      if (dir) {
        var foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          var found = true;
          for (var j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break
            }
          }
          if (found) return i
        }
      }

      return -1
    }

    Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1
    };

    Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
    };

    Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
    };

    function hexWrite (buf, string, offset, length) {
      offset = Number(offset) || 0;
      var remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }

      // must be an even number of digits
      var strLen = string.length;
      if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

      if (length > strLen / 2) {
        length = strLen / 2;
      }
      for (var i = 0; i < length; ++i) {
        var parsed = parseInt(string.substr(i * 2, 2), 16);
        if (isNaN(parsed)) return i
        buf[offset + i] = parsed;
      }
      return i
    }

    function utf8Write (buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
    }

    function asciiWrite (buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length)
    }

    function latin1Write (buf, string, offset, length) {
      return asciiWrite(buf, string, offset, length)
    }

    function base64Write (buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length)
    }

    function ucs2Write (buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
    }

    Buffer.prototype.write = function write (string, offset, length, encoding) {
      // Buffer#write(string)
      if (offset === undefined) {
        encoding = 'utf8';
        length = this.length;
        offset = 0;
      // Buffer#write(string, encoding)
      } else if (length === undefined && typeof offset === 'string') {
        encoding = offset;
        length = this.length;
        offset = 0;
      // Buffer#write(string, offset[, length][, encoding])
      } else if (isFinite(offset)) {
        offset = offset | 0;
        if (isFinite(length)) {
          length = length | 0;
          if (encoding === undefined) encoding = 'utf8';
        } else {
          encoding = length;
          length = undefined;
        }
      // legacy write(string, encoding, offset, length) - remove in v0.13
      } else {
        throw new Error(
          'Buffer.write(string, encoding, offset[, length]) is no longer supported'
        )
      }

      var remaining = this.length - offset;
      if (length === undefined || length > remaining) length = remaining;

      if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
        throw new RangeError('Attempt to write outside buffer bounds')
      }

      if (!encoding) encoding = 'utf8';

      var loweredCase = false;
      for (;;) {
        switch (encoding) {
          case 'hex':
            return hexWrite(this, string, offset, length)

          case 'utf8':
          case 'utf-8':
            return utf8Write(this, string, offset, length)

          case 'ascii':
            return asciiWrite(this, string, offset, length)

          case 'latin1':
          case 'binary':
            return latin1Write(this, string, offset, length)

          case 'base64':
            // Warning: maxLength not taken into account in base64Write
            return base64Write(this, string, offset, length)

          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            return ucs2Write(this, string, offset, length)

          default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
            encoding = ('' + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };

    Buffer.prototype.toJSON = function toJSON () {
      return {
        type: 'Buffer',
        data: Array.prototype.slice.call(this._arr || this, 0)
      }
    };

    function base64Slice (buf, start, end) {
      if (start === 0 && end === buf.length) {
        return fromByteArray(buf)
      } else {
        return fromByteArray(buf.slice(start, end))
      }
    }

    function utf8Slice (buf, start, end) {
      end = Math.min(buf.length, end);
      var res = [];

      var i = start;
      while (i < end) {
        var firstByte = buf[i];
        var codePoint = null;
        var bytesPerSequence = (firstByte > 0xEF) ? 4
          : (firstByte > 0xDF) ? 3
          : (firstByte > 0xBF) ? 2
          : 1;

        if (i + bytesPerSequence <= end) {
          var secondByte, thirdByte, fourthByte, tempCodePoint;

          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 0x80) {
                codePoint = firstByte;
              }
              break
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
                if (tempCodePoint > 0x7F) {
                  codePoint = tempCodePoint;
                }
              }
              break
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
                if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                  codePoint = tempCodePoint;
                }
              }
              break
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
                tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
                if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }

        if (codePoint === null) {
          // we did not generate a valid codePoint so insert a
          // replacement char (U+FFFD) and advance only 1 byte
          codePoint = 0xFFFD;
          bytesPerSequence = 1;
        } else if (codePoint > 0xFFFF) {
          // encode to utf16 (surrogate pair dance)
          codePoint -= 0x10000;
          res.push(codePoint >>> 10 & 0x3FF | 0xD800);
          codePoint = 0xDC00 | codePoint & 0x3FF;
        }

        res.push(codePoint);
        i += bytesPerSequence;
      }

      return decodeCodePointsArray(res)
    }

    // Based on http://stackoverflow.com/a/22747272/680742, the browser with
    // the lowest limit is Chrome, with 0x10000 args.
    // We go 1 magnitude less, for safety
    var MAX_ARGUMENTS_LENGTH = 0x1000;

    function decodeCodePointsArray (codePoints) {
      var len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
      }

      // Decode in chunks to avoid "call stack size exceeded".
      var res = '';
      var i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res
    }

    function asciiSlice (buf, start, end) {
      var ret = '';
      end = Math.min(buf.length, end);

      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 0x7F);
      }
      return ret
    }

    function latin1Slice (buf, start, end) {
      var ret = '';
      end = Math.min(buf.length, end);

      for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret
    }

    function hexSlice (buf, start, end) {
      var len = buf.length;

      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len) end = len;

      var out = '';
      for (var i = start; i < end; ++i) {
        out += toHex(buf[i]);
      }
      return out
    }

    function utf16leSlice (buf, start, end) {
      var bytes = buf.slice(start, end);
      var res = '';
      for (var i = 0; i < bytes.length; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res
    }

    Buffer.prototype.slice = function slice (start, end) {
      var len = this.length;
      start = ~~start;
      end = end === undefined ? len : ~~end;

      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }

      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }

      if (end < start) end = start;

      var newBuf;
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        newBuf = this.subarray(start, end);
        newBuf.__proto__ = Buffer.prototype;
      } else {
        var sliceLen = end - start;
        newBuf = new Buffer(sliceLen, undefined);
        for (var i = 0; i < sliceLen; ++i) {
          newBuf[i] = this[i + start];
        }
      }

      return newBuf
    };

    /*
     * Need to make sure that buffer isn't trying to write out of bounds.
     */
    function checkOffset (offset, ext, length) {
      if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
      if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
    }

    Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
      offset = offset | 0;
      byteLength = byteLength | 0;
      if (!noAssert) checkOffset(offset, byteLength, this.length);

      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul;
      }

      return val
    };

    Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
      offset = offset | 0;
      byteLength = byteLength | 0;
      if (!noAssert) {
        checkOffset(offset, byteLength, this.length);
      }

      var val = this[offset + --byteLength];
      var mul = 1;
      while (byteLength > 0 && (mul *= 0x100)) {
        val += this[offset + --byteLength] * mul;
      }

      return val
    };

    Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset]
    };

    Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | (this[offset + 1] << 8)
    };

    Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length);
      return (this[offset] << 8) | this[offset + 1]
    };

    Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length);

      return ((this[offset]) |
          (this[offset + 1] << 8) |
          (this[offset + 2] << 16)) +
          (this[offset + 3] * 0x1000000)
    };

    Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length);

      return (this[offset] * 0x1000000) +
        ((this[offset + 1] << 16) |
        (this[offset + 2] << 8) |
        this[offset + 3])
    };

    Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
      offset = offset | 0;
      byteLength = byteLength | 0;
      if (!noAssert) checkOffset(offset, byteLength, this.length);

      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength && (mul *= 0x100)) {
        val += this[offset + i] * mul;
      }
      mul *= 0x80;

      if (val >= mul) val -= Math.pow(2, 8 * byteLength);

      return val
    };

    Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
      offset = offset | 0;
      byteLength = byteLength | 0;
      if (!noAssert) checkOffset(offset, byteLength, this.length);

      var i = byteLength;
      var mul = 1;
      var val = this[offset + --i];
      while (i > 0 && (mul *= 0x100)) {
        val += this[offset + --i] * mul;
      }
      mul *= 0x80;

      if (val >= mul) val -= Math.pow(2, 8 * byteLength);

      return val
    };

    Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 0x80)) return (this[offset])
      return ((0xff - this[offset] + 1) * -1)
    };

    Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length);
      var val = this[offset] | (this[offset + 1] << 8);
      return (val & 0x8000) ? val | 0xFFFF0000 : val
    };

    Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 2, this.length);
      var val = this[offset + 1] | (this[offset] << 8);
      return (val & 0x8000) ? val | 0xFFFF0000 : val
    };

    Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length);

      return (this[offset]) |
        (this[offset + 1] << 8) |
        (this[offset + 2] << 16) |
        (this[offset + 3] << 24)
    };

    Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length);

      return (this[offset] << 24) |
        (this[offset + 1] << 16) |
        (this[offset + 2] << 8) |
        (this[offset + 3])
    };

    Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length);
      return read(this, offset, true, 23, 4)
    };

    Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 4, this.length);
      return read(this, offset, false, 23, 4)
    };

    Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 8, this.length);
      return read(this, offset, true, 52, 8)
    };

    Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
      if (!noAssert) checkOffset(offset, 8, this.length);
      return read(this, offset, false, 52, 8)
    };

    function checkInt (buf, value, offset, ext, max, min) {
      if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
      if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
      if (offset + ext > buf.length) throw new RangeError('Index out of range')
    }

    Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
      value = +value;
      offset = offset | 0;
      byteLength = byteLength | 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
      }

      var mul = 1;
      var i = 0;
      this[offset] = value & 0xFF;
      while (++i < byteLength && (mul *= 0x100)) {
        this[offset + i] = (value / mul) & 0xFF;
      }

      return offset + byteLength
    };

    Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
      value = +value;
      offset = offset | 0;
      byteLength = byteLength | 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
      }

      var i = byteLength - 1;
      var mul = 1;
      this[offset + i] = value & 0xFF;
      while (--i >= 0 && (mul *= 0x100)) {
        this[offset + i] = (value / mul) & 0xFF;
      }

      return offset + byteLength
    };

    Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
      if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
      this[offset] = (value & 0xff);
      return offset + 1
    };

    function objectWriteUInt16 (buf, value, offset, littleEndian) {
      if (value < 0) value = 0xffff + value + 1;
      for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
        buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
          (littleEndian ? i : 1 - i) * 8;
      }
    }

    Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value & 0xff);
        this[offset + 1] = (value >>> 8);
      } else {
        objectWriteUInt16(this, value, offset, true);
      }
      return offset + 2
    };

    Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 8);
        this[offset + 1] = (value & 0xff);
      } else {
        objectWriteUInt16(this, value, offset, false);
      }
      return offset + 2
    };

    function objectWriteUInt32 (buf, value, offset, littleEndian) {
      if (value < 0) value = 0xffffffff + value + 1;
      for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
        buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
      }
    }

    Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset + 3] = (value >>> 24);
        this[offset + 2] = (value >>> 16);
        this[offset + 1] = (value >>> 8);
        this[offset] = (value & 0xff);
      } else {
        objectWriteUInt32(this, value, offset, true);
      }
      return offset + 4
    };

    Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 24);
        this[offset + 1] = (value >>> 16);
        this[offset + 2] = (value >>> 8);
        this[offset + 3] = (value & 0xff);
      } else {
        objectWriteUInt32(this, value, offset, false);
      }
      return offset + 4
    };

    Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1);

        checkInt(this, value, offset, byteLength, limit - 1, -limit);
      }

      var i = 0;
      var mul = 1;
      var sub = 0;
      this[offset] = value & 0xFF;
      while (++i < byteLength && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
      }

      return offset + byteLength
    };

    Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1);

        checkInt(this, value, offset, byteLength, limit - 1, -limit);
      }

      var i = byteLength - 1;
      var mul = 1;
      var sub = 0;
      this[offset + i] = value & 0xFF;
      while (--i >= 0 && (mul *= 0x100)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
      }

      return offset + byteLength
    };

    Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
      if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
      if (value < 0) value = 0xff + value + 1;
      this[offset] = (value & 0xff);
      return offset + 1
    };

    Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value & 0xff);
        this[offset + 1] = (value >>> 8);
      } else {
        objectWriteUInt16(this, value, offset, true);
      }
      return offset + 2
    };

    Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 8);
        this[offset + 1] = (value & 0xff);
      } else {
        objectWriteUInt16(this, value, offset, false);
      }
      return offset + 2
    };

    Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value & 0xff);
        this[offset + 1] = (value >>> 8);
        this[offset + 2] = (value >>> 16);
        this[offset + 3] = (value >>> 24);
      } else {
        objectWriteUInt32(this, value, offset, true);
      }
      return offset + 4
    };

    Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
      if (value < 0) value = 0xffffffff + value + 1;
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        this[offset] = (value >>> 24);
        this[offset + 1] = (value >>> 16);
        this[offset + 2] = (value >>> 8);
        this[offset + 3] = (value & 0xff);
      } else {
        objectWriteUInt32(this, value, offset, false);
      }
      return offset + 4
    };

    function checkIEEE754 (buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length) throw new RangeError('Index out of range')
      if (offset < 0) throw new RangeError('Index out of range')
    }

    function writeFloat (buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4);
      }
      write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4
    }

    Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert)
    };

    Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert)
    };

    function writeDouble (buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8);
      }
      write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8
    }

    Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert)
    };

    Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert)
    };

    // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
    Buffer.prototype.copy = function copy (target, targetStart, start, end) {
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;

      // Copy 0 bytes; we're done
      if (end === start) return 0
      if (target.length === 0 || this.length === 0) return 0

      // Fatal error conditions
      if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds')
      }
      if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
      if (end < 0) throw new RangeError('sourceEnd out of bounds')

      // Are we oob?
      if (end > this.length) end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }

      var len = end - start;
      var i;

      if (this === target && start < targetStart && targetStart < end) {
        // descending copy from end
        for (i = len - 1; i >= 0; --i) {
          target[i + targetStart] = this[i + start];
        }
      } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
        // ascending copy from start
        for (i = 0; i < len; ++i) {
          target[i + targetStart] = this[i + start];
        }
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, start + len),
          targetStart
        );
      }

      return len
    };

    // Usage:
    //    buffer.fill(number[, offset[, end]])
    //    buffer.fill(buffer[, offset[, end]])
    //    buffer.fill(string[, offset[, end]][, encoding])
    Buffer.prototype.fill = function fill (val, start, end, encoding) {
      // Handle string cases:
      if (typeof val === 'string') {
        if (typeof start === 'string') {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === 'string') {
          encoding = end;
          end = this.length;
        }
        if (val.length === 1) {
          var code = val.charCodeAt(0);
          if (code < 256) {
            val = code;
          }
        }
        if (encoding !== undefined && typeof encoding !== 'string') {
          throw new TypeError('encoding must be a string')
        }
        if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
          throw new TypeError('Unknown encoding: ' + encoding)
        }
      } else if (typeof val === 'number') {
        val = val & 255;
      }

      // Invalid ranges are not set to a default, so can range check early.
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError('Out of range index')
      }

      if (end <= start) {
        return this
      }

      start = start >>> 0;
      end = end === undefined ? this.length : end >>> 0;

      if (!val) val = 0;

      var i;
      if (typeof val === 'number') {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        var bytes = internalIsBuffer(val)
          ? val
          : utf8ToBytes(new Buffer(val, encoding).toString());
        var len = bytes.length;
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }

      return this
    };

    // HELPER FUNCTIONS
    // ================

    var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

    function base64clean (str) {
      // Node strips out invalid characters like \n and \t from the string, base64-js does not
      str = stringtrim(str).replace(INVALID_BASE64_RE, '');
      // Node converts strings with length < 2 to ''
      if (str.length < 2) return ''
      // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
      while (str.length % 4 !== 0) {
        str = str + '=';
      }
      return str
    }

    function stringtrim (str) {
      if (str.trim) return str.trim()
      return str.replace(/^\s+|\s+$/g, '')
    }

    function toHex (n) {
      if (n < 16) return '0' + n.toString(16)
      return n.toString(16)
    }

    function utf8ToBytes (string, units) {
      units = units || Infinity;
      var codePoint;
      var length = string.length;
      var leadSurrogate = null;
      var bytes = [];

      for (var i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);

        // is surrogate component
        if (codePoint > 0xD7FF && codePoint < 0xE000) {
          // last char was a lead
          if (!leadSurrogate) {
            // no lead yet
            if (codePoint > 0xDBFF) {
              // unexpected trail
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              continue
            } else if (i + 1 === length) {
              // unpaired lead
              if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
              continue
            }

            // valid lead
            leadSurrogate = codePoint;

            continue
          }

          // 2 leads in a row
          if (codePoint < 0xDC00) {
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
            leadSurrogate = codePoint;
            continue
          }

          // valid surrogate pair
          codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
        } else if (leadSurrogate) {
          // valid bmp char, but last char was a lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
        }

        leadSurrogate = null;

        // encode utf8
        if (codePoint < 0x80) {
          if ((units -= 1) < 0) break
          bytes.push(codePoint);
        } else if (codePoint < 0x800) {
          if ((units -= 2) < 0) break
          bytes.push(
            codePoint >> 0x6 | 0xC0,
            codePoint & 0x3F | 0x80
          );
        } else if (codePoint < 0x10000) {
          if ((units -= 3) < 0) break
          bytes.push(
            codePoint >> 0xC | 0xE0,
            codePoint >> 0x6 & 0x3F | 0x80,
            codePoint & 0x3F | 0x80
          );
        } else if (codePoint < 0x110000) {
          if ((units -= 4) < 0) break
          bytes.push(
            codePoint >> 0x12 | 0xF0,
            codePoint >> 0xC & 0x3F | 0x80,
            codePoint >> 0x6 & 0x3F | 0x80,
            codePoint & 0x3F | 0x80
          );
        } else {
          throw new Error('Invalid code point')
        }
      }

      return bytes
    }

    function asciiToBytes (str) {
      var byteArray = [];
      for (var i = 0; i < str.length; ++i) {
        // Node's code seems to be doing this and not & 0x7F..
        byteArray.push(str.charCodeAt(i) & 0xFF);
      }
      return byteArray
    }

    function utf16leToBytes (str, units) {
      var c, hi, lo;
      var byteArray = [];
      for (var i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break

        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }

      return byteArray
    }


    function base64ToBytes (str) {
      return toByteArray(base64clean(str))
    }

    function blitBuffer (src, dst, offset, length) {
      for (var i = 0; i < length; ++i) {
        if ((i + offset >= dst.length) || (i >= src.length)) break
        dst[i + offset] = src[i];
      }
      return i
    }

    function isnan (val) {
      return val !== val // eslint-disable-line no-self-compare
    }


    // the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
    // The _isBuffer check is for Safari 5-7 support, because it's missing
    // Object.prototype.constructor. Remove this eventually
    function isBuffer(obj) {
      return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
    }

    function isFastBuffer (obj) {
      return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
    }

    // For Node v0.10 support. Remove this eventually.
    function isSlowBuffer (obj) {
      return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
    }

    var utils$3 = {};

    /*!
     * strip-bom-string <https://github.com/jonschlinkert/strip-bom-string>
     *
     * Copyright (c) 2015, 2017, Jon Schlinkert.
     * Released under the MIT License.
     */

    var stripBomString = function(str) {
      if (typeof str === 'string' && str.charAt(0) === '\ufeff') {
        return str.slice(1);
      }
      return str;
    };

    (function (exports) {

    	const stripBom = stripBomString;
    	const typeOf = kindOf;

    	exports.define = function(obj, key, val) {
    	  Reflect.defineProperty(obj, key, {
    	    enumerable: false,
    	    configurable: true,
    	    writable: true,
    	    value: val
    	  });
    	};

    	/**
    	 * Returns true if `val` is a buffer
    	 */

    	exports.isBuffer = function(val) {
    	  return typeOf(val) === 'buffer';
    	};

    	/**
    	 * Returns true if `val` is an object
    	 */

    	exports.isObject = function(val) {
    	  return typeOf(val) === 'object';
    	};

    	/**
    	 * Cast `input` to a buffer
    	 */

    	exports.toBuffer = function(input) {
    	  return typeof input === 'string' ? Buffer.from(input) : input;
    	};

    	/**
    	 * Cast `val` to a string.
    	 */

    	exports.toString = function(input) {
    	  if (exports.isBuffer(input)) return stripBom(String(input));
    	  if (typeof input !== 'string') {
    	    throw new TypeError('expected input to be a string or buffer');
    	  }
    	  return stripBom(input);
    	};

    	/**
    	 * Cast `val` to an array.
    	 */

    	exports.arrayify = function(val) {
    	  return val ? (Array.isArray(val) ? val : [val]) : [];
    	};

    	/**
    	 * Returns true if `str` starts with `substr`.
    	 */

    	exports.startsWith = function(str, substr, len) {
    	  if (typeof len !== 'number') len = substr.length;
    	  return str.slice(0, len) === substr;
    	}; 
    } (utils$3));

    const engines$1 = enginesExports;
    const utils$2 = utils$3;

    var defaults$4 = function(options) {
      const opts = Object.assign({}, options);

      // ensure that delimiters are an array
      opts.delimiters = utils$2.arrayify(opts.delims || opts.delimiters || '---');
      if (opts.delimiters.length === 1) {
        opts.delimiters.push(opts.delimiters[0]);
      }

      opts.language = (opts.language || opts.lang || 'yaml').toLowerCase();
      opts.engines = Object.assign({}, engines$1, opts.parsers, opts.engines);
      return opts;
    };

    var engine = function(name, options) {
      let engine = options.engines[name] || options.engines[aliase(name)];
      if (typeof engine === 'undefined') {
        throw new Error('gray-matter engine "' + name + '" is not registered');
      }
      if (typeof engine === 'function') {
        engine = { parse: engine };
      }
      return engine;
    };

    function aliase(name) {
      switch (name.toLowerCase()) {
        case 'js':
        case 'javascript':
          return 'javascript';
        case 'coffee':
        case 'coffeescript':
        case 'cson':
          return 'coffee';
        case 'yaml':
        case 'yml':
          return 'yaml';
        default: {
          return name;
        }
      }
    }

    const typeOf$1 = kindOf;
    const getEngine$1 = engine;
    const defaults$3 = defaults$4;

    var stringify$2 = function(file, data, options) {
      if (data == null && options == null) {
        switch (typeOf$1(file)) {
          case 'object':
            data = file.data;
            options = {};
            break;
          case 'string':
            return file;
          default: {
            throw new TypeError('expected file to be a string or object');
          }
        }
      }

      const str = file.content;
      const opts = defaults$3(options);
      if (data == null) {
        if (!opts.data) return file;
        data = opts.data;
      }

      const language = file.language || opts.language;
      const engine = getEngine$1(language, opts);
      if (typeof engine.stringify !== 'function') {
        throw new TypeError('expected "' + language + '.stringify" to be a function');
      }

      data = Object.assign({}, file.data, data);
      const open = opts.delimiters[0];
      const close = opts.delimiters[1];
      const matter = engine.stringify(data, options).trim();
      let buf = '';

      if (matter !== '{}') {
        buf = newline(open) + newline(matter) + newline(close);
      }

      if (typeof file.excerpt === 'string' && file.excerpt !== '') {
        if (str.indexOf(file.excerpt.trim()) === -1) {
          buf += newline(file.excerpt) + newline(close);
        }
      }

      return buf + newline(str);
    };

    function newline(str) {
      return str.slice(-1) !== '\n' ? str + '\n' : str;
    }

    const defaults$2 = defaults$4;

    var excerpt$1 = function(file, options) {
      const opts = defaults$2(options);

      if (file.data == null) {
        file.data = {};
      }

      if (typeof opts.excerpt === 'function') {
        return opts.excerpt(file, opts);
      }

      const sep = file.data.excerpt_separator || opts.excerpt_separator;
      if (sep == null && (opts.excerpt === false || opts.excerpt == null)) {
        return file;
      }

      const delimiter = typeof opts.excerpt === 'string'
        ? opts.excerpt
        : (sep || opts.delimiters[0]);

      // if enabled, get the excerpt defined after front-matter
      const idx = file.content.indexOf(delimiter);
      if (idx !== -1) {
        file.excerpt = file.content.slice(0, idx);
      }

      return file;
    };

    const typeOf = kindOf;
    const stringify$1 = stringify$2;
    const utils$1 = utils$3;

    /**
     * Normalize the given value to ensure an object is returned
     * with the expected properties.
     */

    var toFile$1 = function(file) {
      if (typeOf(file) !== 'object') {
        file = { content: file };
      }

      if (typeOf(file.data) !== 'object') {
        file.data = {};
      }

      // if file was passed as an object, ensure that
      // "file.content" is set
      if (file.contents && file.content == null) {
        file.content = file.contents;
      }

      // set non-enumerable properties on the file object
      utils$1.define(file, 'orig', utils$1.toBuffer(file.content));
      utils$1.define(file, 'language', file.language || '');
      utils$1.define(file, 'matter', file.matter || '');
      utils$1.define(file, 'stringify', function(data, options) {
        if (options && options.language) {
          file.language = options.language;
        }
        return stringify$1(file, data, options);
      });

      // strip BOM and ensure that "file.content" is a string
      file.content = utils$1.toString(file.content);
      file.isEmpty = false;
      file.excerpt = '';
      return file;
    };

    const getEngine = engine;
    const defaults$1 = defaults$4;

    var parse$1 = function(language, str, options) {
      const opts = defaults$1(options);
      const engine = getEngine(language, opts);
      if (typeof engine.parse !== 'function') {
        throw new TypeError('expected "' + language + '.parse" to be a function');
      }
      return engine.parse(str, opts);
    };

    const fs = require$$0;
    const sections = sectionMatter;
    const defaults = defaults$4;
    const stringify = stringify$2;
    const excerpt = excerpt$1;
    const engines = enginesExports;
    const toFile = toFile$1;
    const parse = parse$1;
    const utils = utils$3;

    /**
     * Takes a string or object with `content` property, extracts
     * and parses front-matter from the string, then returns an object
     * with `data`, `content` and other [useful properties](#returned-object).
     *
     * ```js
     * const matter = require('gray-matter');
     * console.log(matter('---\ntitle: Home\n---\nOther stuff'));
     * //=> { data: { title: 'Home'}, content: 'Other stuff' }
     * ```
     * @param {Object|String} `input` String, or object with `content` string
     * @param {Object} `options`
     * @return {Object}
     * @api public
     */

    function matter(input, options) {
      if (input === '') {
        return { data: {}, content: input, excerpt: '', orig: input };
      }

      let file = toFile(input);
      const cached = matter.cache[file.content];

      if (!options) {
        if (cached) {
          file = Object.assign({}, cached);
          file.orig = cached.orig;
          return file;
        }

        // only cache if there are no options passed. if we cache when options
        // are passed, we would need to also cache options values, which would
        // negate any performance benefits of caching
        matter.cache[file.content] = file;
      }

      return parseMatter(file, options);
    }

    /**
     * Parse front matter
     */

    function parseMatter(file, options) {
      const opts = defaults(options);
      const open = opts.delimiters[0];
      const close = '\n' + opts.delimiters[1];
      let str = file.content;

      if (opts.language) {
        file.language = opts.language;
      }

      // get the length of the opening delimiter
      const openLen = open.length;
      if (!utils.startsWith(str, open, openLen)) {
        excerpt(file, opts);
        return file;
      }

      // if the next character after the opening delimiter is
      // a character from the delimiter, then it's not a front-
      // matter delimiter
      if (str.charAt(openLen) === open.slice(-1)) {
        return file;
      }

      // strip the opening delimiter
      str = str.slice(openLen);
      const len = str.length;

      // use the language defined after first delimiter, if it exists
      const language = matter.language(str, opts);
      if (language.name) {
        file.language = language.name;
        str = str.slice(language.raw.length);
      }

      // get the index of the closing delimiter
      let closeIndex = str.indexOf(close);
      if (closeIndex === -1) {
        closeIndex = len;
      }

      // get the raw front-matter block
      file.matter = str.slice(0, closeIndex);

      const block = file.matter.replace(/^\s*#[^\n]+/gm, '').trim();
      if (block === '') {
        file.isEmpty = true;
        file.empty = file.content;
        file.data = {};
      } else {

        // create file.data by parsing the raw file.matter block
        file.data = parse(file.language, file.matter, opts);
      }

      // update file.content
      if (closeIndex === len) {
        file.content = '';
      } else {
        file.content = str.slice(closeIndex + close.length);
        if (file.content[0] === '\r') {
          file.content = file.content.slice(1);
        }
        if (file.content[0] === '\n') {
          file.content = file.content.slice(1);
        }
      }

      excerpt(file, opts);

      if (opts.sections === true || typeof opts.section === 'function') {
        sections(file, opts.section);
      }
      return file;
    }

    /**
     * Expose engines
     */

    matter.engines = engines;

    /**
     * Stringify an object to YAML or the specified language, and
     * append it to the given string. By default, only YAML and JSON
     * can be stringified. See the [engines](#engines) section to learn
     * how to stringify other languages.
     *
     * ```js
     * console.log(matter.stringify('foo bar baz', {title: 'Home'}));
     * // results in:
     * // ---
     * // title: Home
     * // ---
     * // foo bar baz
     * ```
     * @param {String|Object} `file` The content string to append to stringified front-matter, or a file object with `file.content` string.
     * @param {Object} `data` Front matter to stringify.
     * @param {Object} `options` [Options](#options) to pass to gray-matter and [js-yaml].
     * @return {String} Returns a string created by wrapping stringified yaml with delimiters, and appending that to the given string.
     * @api public
     */

    matter.stringify = function(file, data, options) {
      if (typeof file === 'string') file = matter(file, options);
      return stringify(file, data, options);
    };

    /**
     * Synchronously read a file from the file system and parse
     * front matter. Returns the same object as the [main function](#matter).
     *
     * ```js
     * const file = matter.read('./content/blog-post.md');
     * ```
     * @param {String} `filepath` file path of the file to read.
     * @param {Object} `options` [Options](#options) to pass to gray-matter.
     * @return {Object} Returns [an object](#returned-object) with `data` and `content`
     * @api public
     */

    matter.read = function(filepath, options) {
      const str = fs.readFileSync(filepath, 'utf8');
      const file = matter(str, options);
      file.path = filepath;
      return file;
    };

    /**
     * Returns true if the given `string` has front matter.
     * @param  {String} `string`
     * @param  {Object} `options`
     * @return {Boolean} True if front matter exists.
     * @api public
     */

    matter.test = function(str, options) {
      return utils.startsWith(str, defaults(options).delimiters[0]);
    };

    /**
     * Detect the language to use, if one is defined after the
     * first front-matter delimiter.
     * @param  {String} `string`
     * @param  {Object} `options`
     * @return {Object} Object with `raw` (actual language string), and `name`, the language with whitespace trimmed
     */

    matter.language = function(str, options) {
      const opts = defaults(options);
      const open = opts.delimiters[0];

      if (matter.test(str)) {
        str = str.slice(open.length);
      }

      const language = str.slice(0, str.search(/\r?\n/));
      return {
        raw: language,
        name: language ? language.trim() : ''
      };
    };

    /**
     * Expose `matter`
     */

    matter.cache = {};
    matter.clearCache = function() {
      matter.cache = {};
    };
    var grayMatter = matter;

    var matter$1 = /*@__PURE__*/getDefaultExportFromCjs(grayMatter);

    /**
     * Parse a markdown file with frontmatter
     * @param {string} markdown - The markdown content
     * @returns {Object} - The parsed markdown with frontmatter and HTML content
     */
    function parseMarkdown(markdown) {
      // Parse frontmatter
      const { data, content } = matter$1(markdown);
      
      // Convert markdown to HTML
      const html = marked(content);
      
      return {
        frontmatter: data,
        content: html
      };
    }

    /**
     * Sort blog posts by date (newest first)
     * @param {Array} posts - Array of blog posts with frontmatter
     * @returns {Array} - Sorted array of blog posts
     */
    function sortPostsByDate(posts) {
      return posts.sort((a, b) => {
        const dateA = new Date(a.frontmatter.date);
        const dateB = new Date(b.frontmatter.date);
        return dateB - dateA;
      });
    }

    /**
     * Format a date string
     * @param {string} dateString - The date string to format
     * @returns {string} - The formatted date string
     */
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Get the base URL for the current environment
    function getBaseUrl() {
      // Check if we're running in a browser environment
      if (typeof window !== 'undefined') {
        // For GitHub Pages, the base URL might be the repository name
        // Extract the base path from the current URL
        const pathSegments = window.location.pathname.split('/');
        // If we're on GitHub Pages with a custom domain, use root path
        if (window.location.hostname === 'mango.anthra.site') {
          return '';
        }
        // If we're on github.io domain, the first segment after the domain would be the repo name
        else if (window.location.hostname.includes('github.io')) {
          return pathSegments[1] ? `/${pathSegments[1]}` : '';
        }
        // For local development or other environments, use root path
        return '';
      }
      // Fallback to root path if not in browser
      return '';
    }

    // Use relative path instead of absolute path for blog directory
    const BLOG_DIR = `${getBaseUrl()}/blogs`;

    /**
     * Get all blog posts
     * @returns {Promise<Array>} - Promise resolving to array of blog posts with frontmatter and content
     */
    async function getAllPosts() {
      // Known blog posts - in a real app, you might fetch a list from an API
      const knownPosts = [
        'first-blog-post',
        'learning-to-dequantise',
        'the-new-xor-problem'
      ];
      
      // Fetch each post in parallel
      const postsPromises = knownPosts.map(async (slug) => {
        try {
          const post = await getPostBySlug(slug);
          return post;
        } catch (error) {
          console.error(`Error loading post ${slug}:`, error);
          return null;
        }
      });
      
      // Wait for all posts to be fetched
      const posts = await Promise.all(postsPromises);
      
      // Filter out any failed posts and sort by date
      return sortPostsByDate(posts.filter(Boolean));
    }

    /**
     * Get a single blog post by slug
     * @param {string} slug - The post slug
     * @returns {Promise<Object|null>} - Promise resolving to the blog post or null if not found
     */
    async function getPostBySlug(slug) {
      try {
        // Fetch the markdown file
        const response = await fetch(`${BLOG_DIR}/${slug}.md`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.status}`);
        }
        
        // Get the file contents
        const fileContents = await response.text();
        
        // Parse the markdown
        const { frontmatter, content } = parseMarkdown(fileContents);
        
        // Skip about page or other special pages
        if (frontmatter.type === 'about') return null;
        
        // Return the post data
        return {
          slug,
          frontmatter,
          content
        };
      } catch (error) {
        console.error(`Error fetching post ${slug}:`, error);
        return null;
      }
    }

    /**
     * Get the about page content
     * @returns {Promise<Object|null>} - Promise resolving to the about page content or null if not found
     */
    async function getAboutPage() {
      try {
        // Fetch the about markdown file
        const response = await fetch(`${BLOG_DIR}/about.md`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch about page: ${response.status}`);
        }
        
        // Get the file contents
        const fileContents = await response.text();
        
        // Parse the markdown
        const { frontmatter, content } = parseMarkdown(fileContents);
        
        return {
          frontmatter,
          content
        };
      } catch (error) {
        console.error('Error fetching about page:', error);
        return null;
      }
    }

    /* src/routes/Home.svelte generated by Svelte v3.59.2 */

    const { console: console_1$4 } = globals;
    const file$b = "src/routes/Home.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (46:4) {:else}
    function create_else_block$5(ctx) {
    	let div0;
    	let t;
    	let div1;
    	let link;
    	let current;
    	let each_value = /*posts*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	link = new Link({
    			props: {
    				to: "/blog",
    				class: "view-all-link",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			div1 = element("div");
    			create_component(link.$$.fragment);
    			attr_dev(div0, "class", "blog-list");
    			add_location(div0, file$b, 46, 6, 1252);
    			attr_dev(div1, "class", "view-all svelte-be4qqh");
    			add_location(div1, file$b, 58, 6, 1698);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div0, null);
    				}
    			}

    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(link, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*posts, formatDate*/ 1) {
    				each_value = /*posts*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const link_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(46:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (44:33) 
    function create_if_block_2$2(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No posts found. Check back soon!";
    			add_location(p, file$b, 44, 6, 1194);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(44:33) ",
    		ctx
    	});

    	return block;
    }

    // (42:20) 
    function create_if_block_1$3(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*error*/ ctx[2]);
    			attr_dev(p, "class", "error svelte-be4qqh");
    			add_location(p, file$b, 42, 6, 1125);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 4) set_data_dev(t, /*error*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(42:20) ",
    		ctx
    	});

    	return block;
    }

    // (40:4) {#if loading}
    function create_if_block$6(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading posts...";
    			add_location(p, file$b, 40, 6, 1074);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(40:4) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (49:10) <Link to={`/blog/${post.slug}`} class="blog-card-link">
    function create_default_slot_1$2(ctx) {
    	let div;
    	let h3;
    	let t0_value = /*post*/ ctx[3].frontmatter.title + "";
    	let t0;
    	let t1;
    	let p0;
    	let t2_value = formatDate(/*post*/ ctx[3].frontmatter.date) + "";
    	let t2;
    	let t3;
    	let p1;
    	let t4_value = /*post*/ ctx[3].frontmatter.excerpt + "";
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			p0 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			p1 = element("p");
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(h3, "class", "blog-title");
    			add_location(h3, file$b, 50, 14, 1422);
    			attr_dev(p0, "class", "blog-date");
    			add_location(p0, file$b, 51, 14, 1489);
    			attr_dev(p1, "class", "blog-excerpt");
    			add_location(p1, file$b, 52, 14, 1564);
    			attr_dev(div, "class", "blog-card");
    			add_location(div, file$b, 49, 12, 1384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(div, t3);
    			append_dev(div, p1);
    			append_dev(p1, t4);
    			insert_dev(target, t5, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*posts*/ 1 && t0_value !== (t0_value = /*post*/ ctx[3].frontmatter.title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*posts*/ 1 && t2_value !== (t2_value = formatDate(/*post*/ ctx[3].frontmatter.date) + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*posts*/ 1 && t4_value !== (t4_value = /*post*/ ctx[3].frontmatter.excerpt + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(49:10) <Link to={`/blog/${post.slug}`} class=\\\"blog-card-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (48:8) {#each posts as post}
    function create_each_block$2(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: `/blog/${/*post*/ ctx[3].slug}`,
    				class: "blog-card-link",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*posts*/ 1) link_changes.to = `/blog/${/*post*/ ctx[3].slug}`;

    			if (dirty & /*$$scope, posts*/ 65) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(48:8) {#each posts as post}",
    		ctx
    	});

    	return block;
    }

    // (60:8) <Link to="/blog" class="view-all-link">
    function create_default_slot$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("View all posts →");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(60:8) <Link to=\\\"/blog\\\" class=\\\"view-all-link\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div4;
    	let div2;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let div1;
    	let img;
    	let img_src_value;
    	let t4;
    	let div0;
    	let t6;
    	let div3;
    	let h2;
    	let t8;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$6, create_if_block_1$3, create_if_block_2$2, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[1]) return 0;
    		if (/*error*/ ctx[2]) return 1;
    		if (/*posts*/ ctx[0].length === 0) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "when trees fall...";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Thoughts on AI, machine learning, and more";
    			t3 = space();
    			div1 = element("div");
    			img = element("img");
    			t4 = space();
    			div0 = element("div");
    			div0.textContent = "Welcome to my digital garden!";
    			t6 = space();
    			div3 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Recent Posts";
    			t8 = space();
    			if_block.c();
    			attr_dev(h1, "class", "title svelte-be4qqh");
    			add_location(h1, file$b, 25, 4, 651);
    			attr_dev(p, "class", "subtitle svelte-be4qqh");
    			add_location(p, file$b, 26, 4, 697);
    			if (!src_url_equal(img.src, img_src_value = "./images/mascot.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Site mascot");
    			attr_dev(img, "class", "mascot-image svelte-be4qqh");
    			add_location(img, file$b, 29, 6, 810);
    			attr_dev(div0, "class", "dialogue-box svelte-be4qqh");
    			add_location(div0, file$b, 30, 6, 889);
    			attr_dev(div1, "class", "mascot-container svelte-be4qqh");
    			add_location(div1, file$b, 28, 4, 773);
    			attr_dev(div2, "class", "hero svelte-be4qqh");
    			add_location(div2, file$b, 24, 2, 628);
    			attr_dev(h2, "class", "svelte-be4qqh");
    			add_location(h2, file$b, 37, 4, 1023);
    			attr_dev(div3, "class", "recent-posts svelte-be4qqh");
    			add_location(div3, file$b, 36, 2, 992);
    			attr_dev(div4, "class", "home-container svelte-be4qqh");
    			add_location(div4, file$b, 23, 0, 597);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, h1);
    			append_dev(div2, t1);
    			append_dev(div2, p);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, img);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			append_dev(div3, h2);
    			append_dev(div3, t8);
    			if_blocks[current_block_type_index].m(div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div3, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let posts = [];
    	let loading = true;
    	let error = null;

    	onMount(async () => {
    		try {
    			const allPosts = await getAllPosts();
    			$$invalidate(0, posts = allPosts.slice(0, 3)); // Get the 3 most recent posts
    			$$invalidate(1, loading = false);
    		} catch(err) {
    			console.error('Error loading posts:', err);
    			$$invalidate(2, error = 'Failed to load blog posts. Please try again later.');
    			$$invalidate(1, loading = false);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Link,
    		getAllPosts,
    		formatDate,
    		posts,
    		loading,
    		error
    	});

    	$$self.$inject_state = $$props => {
    		if ('posts' in $$props) $$invalidate(0, posts = $$props.posts);
    		if ('loading' in $$props) $$invalidate(1, loading = $$props.loading);
    		if ('error' in $$props) $$invalidate(2, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [posts, loading, error];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/routes/Blog.svelte generated by Svelte v3.59.2 */

    const { console: console_1$3 } = globals;
    const file$a = "src/routes/Blog.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (38:2) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let current;
    	let each_value = /*posts*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "blog-list");
    			add_location(div, file$a, 38, 4, 940);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*posts, formatDate*/ 1) {
    				each_value = /*posts*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(38:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:31) 
    function create_if_block_2$1(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "No blog posts found.";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "Check back soon for new content!";
    			add_location(p0, file$a, 34, 6, 841);
    			add_location(p1, file$a, 35, 6, 875);
    			attr_dev(div, "class", "empty-state svelte-1mtujtw");
    			add_location(div, file$a, 33, 4, 809);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(33:31) ",
    		ctx
    	});

    	return block;
    }

    // (31:18) 
    function create_if_block_1$2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*error*/ ctx[2]);
    			attr_dev(div, "class", "error svelte-1mtujtw");
    			add_location(div, file$a, 31, 4, 740);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 4) set_data_dev(t, /*error*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(31:18) ",
    		ctx
    	});

    	return block;
    }

    // (29:2) {#if loading}
    function create_if_block$5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loading posts...";
    			attr_dev(div, "class", "loading svelte-1mtujtw");
    			add_location(div, file$a, 29, 4, 673);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(29:2) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (41:8) <Link to={`/blog/${post.slug}`} class="blog-card-link">
    function create_default_slot$6(ctx) {
    	let div;
    	let h2;
    	let t0_value = /*post*/ ctx[3].frontmatter.title + "";
    	let t0;
    	let t1;
    	let p0;
    	let t2_value = formatDate(/*post*/ ctx[3].frontmatter.date) + "";
    	let t2;
    	let t3;
    	let p1;
    	let t4_value = /*post*/ ctx[3].frontmatter.excerpt + "";
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			p0 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			p1 = element("p");
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(h2, "class", "blog-title");
    			add_location(h2, file$a, 42, 12, 1102);
    			attr_dev(p0, "class", "blog-date");
    			add_location(p0, file$a, 43, 12, 1167);
    			attr_dev(p1, "class", "blog-excerpt");
    			add_location(p1, file$a, 44, 12, 1240);
    			attr_dev(div, "class", "blog-card");
    			add_location(div, file$a, 41, 10, 1066);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(div, t3);
    			append_dev(div, p1);
    			append_dev(p1, t4);
    			insert_dev(target, t5, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*posts*/ 1 && t0_value !== (t0_value = /*post*/ ctx[3].frontmatter.title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*posts*/ 1 && t2_value !== (t2_value = formatDate(/*post*/ ctx[3].frontmatter.date) + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*posts*/ 1 && t4_value !== (t4_value = /*post*/ ctx[3].frontmatter.excerpt + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(41:8) <Link to={`/blog/${post.slug}`} class=\\\"blog-card-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (40:6) {#each posts as post}
    function create_each_block$1(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: `/blog/${/*post*/ ctx[3].slug}`,
    				class: "blog-card-link",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*posts*/ 1) link_changes.to = `/blog/${/*post*/ ctx[3].slug}`;

    			if (dirty & /*$$scope, posts*/ 65) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(40:6) {#each posts as post}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div1;
    	let div0;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$5, create_if_block_1$2, create_if_block_2$1, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[1]) return 0;
    		if (/*error*/ ctx[2]) return 1;
    		if (/*posts*/ ctx[0].length === 0) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Blog";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Thoughts, ideas, and explorations";
    			t3 = space();
    			if_block.c();
    			attr_dev(h1, "class", "svelte-1mtujtw");
    			add_location(h1, file$a, 24, 4, 582);
    			attr_dev(p, "class", "svelte-1mtujtw");
    			add_location(p, file$a, 25, 4, 600);
    			attr_dev(div0, "class", "blog-header svelte-1mtujtw");
    			add_location(div0, file$a, 23, 2, 552);
    			attr_dev(div1, "class", "blog-container svelte-1mtujtw");
    			add_location(div1, file$a, 22, 0, 521);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div1, t3);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Blog', slots, []);
    	let posts = [];
    	let loading = true;
    	let error = null;

    	onMount(async () => {
    		try {
    			$$invalidate(0, posts = await getAllPosts());
    			$$invalidate(1, loading = false);
    		} catch(err) {
    			console.error('Error loading posts:', err);
    			$$invalidate(2, error = 'Failed to load blog posts. Please try again later.');
    			$$invalidate(1, loading = false);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Blog> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Link,
    		getAllPosts,
    		formatDate,
    		posts,
    		loading,
    		error
    	});

    	$$self.$inject_state = $$props => {
    		if ('posts' in $$props) $$invalidate(0, posts = $$props.posts);
    		if ('loading' in $$props) $$invalidate(1, loading = $$props.loading);
    		if ('error' in $$props) $$invalidate(2, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [posts, loading, error];
    }

    class Blog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Blog",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src/routes/BlogPost.svelte generated by Svelte v3.59.2 */

    const { console: console_1$2 } = globals;
    const file$9 = "src/routes/BlogPost.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (49:2) {:else}
    function create_else_block$3(ctx) {
    	let article;
    	let header;
    	let h1;
    	let t0_value = /*post*/ ctx[0].frontmatter.title + "";
    	let t0;
    	let t1;
    	let p;
    	let t2_value = formatDate(/*post*/ ctx[0].frontmatter.date) + "";
    	let t2;
    	let t3;
    	let div;
    	let raw_value = /*post*/ ctx[0].content + "";
    	let t4;
    	let footer;
    	let link;
    	let t5;
    	let if_block_anchor;
    	let current;

    	link = new Link({
    			props: {
    				to: "/blog",
    				class: "back-link",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*relatedPosts*/ ctx[3].length > 0 && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			article = element("article");
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			div = element("div");
    			t4 = space();
    			footer = element("footer");
    			create_component(link.$$.fragment);
    			t5 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty$2();
    			attr_dev(h1, "class", "svelte-12n0pyx");
    			add_location(h1, file$9, 51, 8, 1332);
    			attr_dev(p, "class", "post-date svelte-12n0pyx");
    			add_location(p, file$9, 52, 8, 1374);
    			attr_dev(header, "class", "post-header svelte-12n0pyx");
    			add_location(header, file$9, 50, 6, 1295);
    			attr_dev(div, "class", "post-content markdown-content svelte-12n0pyx");
    			add_location(div, file$9, 55, 6, 1464);
    			attr_dev(footer, "class", "post-footer svelte-12n0pyx");
    			add_location(footer, file$9, 59, 6, 1563);
    			attr_dev(article, "class", "blog-post");
    			add_location(article, file$9, 49, 4, 1261);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, header);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(header, t1);
    			append_dev(header, p);
    			append_dev(p, t2);
    			append_dev(article, t3);
    			append_dev(article, div);
    			div.innerHTML = raw_value;
    			append_dev(article, t4);
    			append_dev(article, footer);
    			mount_component(link, footer, null);
    			insert_dev(target, t5, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*post*/ 1) && t0_value !== (t0_value = /*post*/ ctx[0].frontmatter.title + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*post*/ 1) && t2_value !== (t2_value = formatDate(/*post*/ ctx[0].frontmatter.date) + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*post*/ 1) && raw_value !== (raw_value = /*post*/ ctx[0].content + "")) div.innerHTML = raw_value;			const link_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);

    			if (/*relatedPosts*/ ctx[3].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*relatedPosts*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_component(link);
    			if (detaching) detach_dev(t5);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(49:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (44:18) 
    function create_if_block_1$1(ctx) {
    	let div;
    	let p;
    	let t0;
    	let t1;
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: "/blog",
    				class: "back-link",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(/*error*/ ctx[2]);
    			t1 = space();
    			create_component(link.$$.fragment);
    			add_location(p, file$9, 45, 6, 1153);
    			attr_dev(div, "class", "error svelte-12n0pyx");
    			add_location(div, file$9, 44, 4, 1127);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    			mount_component(link, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*error*/ 4) set_data_dev(t0, /*error*/ ctx[2]);
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(44:18) ",
    		ctx
    	});

    	return block;
    }

    // (42:2) {#if loading}
    function create_if_block$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loading post...";
    			attr_dev(div, "class", "loading svelte-12n0pyx");
    			add_location(div, file$9, 42, 4, 1061);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(42:2) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (61:8) <Link to="/blog" class="back-link">
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("← Back to all posts");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(61:8) <Link to=\\\"/blog\\\" class=\\\"back-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (65:4) {#if relatedPosts.length > 0}
    function create_if_block_2(ctx) {
    	let div1;
    	let h2;
    	let t1;
    	let div0;
    	let current;
    	let each_value = /*relatedPosts*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Related Posts";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "svelte-12n0pyx");
    			add_location(h2, file$9, 66, 8, 1774);
    			attr_dev(div0, "class", "blog-list");
    			add_location(div0, file$9, 67, 8, 1805);
    			attr_dev(div1, "class", "related-posts svelte-12n0pyx");
    			add_location(div1, file$9, 65, 6, 1738);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h2);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div0, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*relatedPosts, formatDate*/ 8) {
    				each_value = /*relatedPosts*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(65:4) {#if relatedPosts.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (70:12) <Link to={`/blog/${relatedPost.slug}`} class="blog-card-link">
    function create_default_slot_1$1(ctx) {
    	let div;
    	let h3;
    	let t0_value = /*relatedPost*/ ctx[5].frontmatter.title + "";
    	let t0;
    	let t1;
    	let p0;
    	let t2_value = formatDate(/*relatedPost*/ ctx[5].frontmatter.date) + "";
    	let t2;
    	let t3;
    	let p1;
    	let t4_value = /*relatedPost*/ ctx[5].frontmatter.excerpt + "";
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			p0 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			p1 = element("p");
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(h3, "class", "blog-title");
    			add_location(h3, file$9, 71, 16, 2004);
    			attr_dev(p0, "class", "blog-date");
    			add_location(p0, file$9, 72, 16, 2080);
    			attr_dev(p1, "class", "blog-excerpt");
    			add_location(p1, file$9, 73, 16, 2164);
    			attr_dev(div, "class", "blog-card");
    			add_location(div, file$9, 70, 14, 1964);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(div, t3);
    			append_dev(div, p1);
    			append_dev(p1, t4);
    			insert_dev(target, t5, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*relatedPosts*/ 8 && t0_value !== (t0_value = /*relatedPost*/ ctx[5].frontmatter.title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*relatedPosts*/ 8 && t2_value !== (t2_value = formatDate(/*relatedPost*/ ctx[5].frontmatter.date) + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*relatedPosts*/ 8 && t4_value !== (t4_value = /*relatedPost*/ ctx[5].frontmatter.excerpt + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(70:12) <Link to={`/blog/${relatedPost.slug}`} class=\\\"blog-card-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (69:10) {#each relatedPosts as relatedPost}
    function create_each_block(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: `/blog/${/*relatedPost*/ ctx[5].slug}`,
    				class: "blog-card-link",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*relatedPosts*/ 8) link_changes.to = `/blog/${/*relatedPost*/ ctx[5].slug}`;

    			if (dirty & /*$$scope, relatedPosts*/ 264) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(69:10) {#each relatedPosts as relatedPost}",
    		ctx
    	});

    	return block;
    }

    // (47:6) <Link to="/blog" class="back-link">
    function create_default_slot$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("← Back to all posts");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(47:6) <Link to=\\\"/blog\\\" class=\\\"back-link\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$4, create_if_block_1$1, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[1]) return 0;
    		if (/*error*/ ctx[2]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "blog-post-container svelte-12n0pyx");
    			add_location(div, file$9, 40, 0, 1007);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BlogPost', slots, []);
    	let { slug } = $$props;
    	let post = null;
    	let loading = true;
    	let error = null;
    	let relatedPosts = [];

    	onMount(async () => {
    		try {
    			// Get the post by slug
    			$$invalidate(0, post = await getPostBySlug(slug));

    			if (!post) {
    				$$invalidate(2, error = 'Blog post not found.');
    				$$invalidate(1, loading = false);
    				return;
    			}

    			// Get related posts (excluding the current post)
    			const allPosts = await getAllPosts();

    			$$invalidate(3, relatedPosts = allPosts.filter(p => p.slug !== slug).slice(0, 3)); // Get up to 3 related posts
    			$$invalidate(1, loading = false);
    		} catch(err) {
    			console.error('Error loading post:', err);
    			$$invalidate(2, error = 'Failed to load blog post. Please try again later.');
    			$$invalidate(1, loading = false);
    		}
    	});

    	$$self.$$.on_mount.push(function () {
    		if (slug === undefined && !('slug' in $$props || $$self.$$.bound[$$self.$$.props['slug']])) {
    			console_1$2.warn("<BlogPost> was created without expected prop 'slug'");
    		}
    	});

    	const writable_props = ['slug'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<BlogPost> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('slug' in $$props) $$invalidate(4, slug = $$props.slug);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Link,
    		getPostBySlug,
    		getAllPosts,
    		formatDate,
    		slug,
    		post,
    		loading,
    		error,
    		relatedPosts
    	});

    	$$self.$inject_state = $$props => {
    		if ('slug' in $$props) $$invalidate(4, slug = $$props.slug);
    		if ('post' in $$props) $$invalidate(0, post = $$props.post);
    		if ('loading' in $$props) $$invalidate(1, loading = $$props.loading);
    		if ('error' in $$props) $$invalidate(2, error = $$props.error);
    		if ('relatedPosts' in $$props) $$invalidate(3, relatedPosts = $$props.relatedPosts);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [post, loading, error, relatedPosts, slug];
    }

    class BlogPost extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$9, create_fragment$9, safe_not_equal, { slug: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BlogPost",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get slug() {
    		throw new Error("<BlogPost>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set slug(value) {
    		throw new Error("<BlogPost>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/routes/About.svelte generated by Svelte v3.59.2 */

    const { console: console_1$1 } = globals;
    const file$8 = "src/routes/About.svelte";

    // (31:2) {:else}
    function create_else_block$2(ctx) {
    	let div0;
    	let h1;
    	let t0_value = /*aboutContent*/ ctx[0].frontmatter.title + "";
    	let t0;
    	let t1;
    	let div1;
    	let raw_value = /*aboutContent*/ ctx[0].content + "";

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			attr_dev(h1, "class", "svelte-pc97j9");
    			add_location(h1, file$8, 32, 6, 755);
    			attr_dev(div0, "class", "about-header svelte-pc97j9");
    			add_location(div0, file$8, 31, 4, 722);
    			attr_dev(div1, "class", "about-content markdown-content svelte-pc97j9");
    			add_location(div1, file$8, 35, 4, 817);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			div1.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*aboutContent*/ 1 && t0_value !== (t0_value = /*aboutContent*/ ctx[0].frontmatter.title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*aboutContent*/ 1 && raw_value !== (raw_value = /*aboutContent*/ ctx[0].content + "")) div1.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(31:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:18) 
    function create_if_block_1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*error*/ ctx[2]);
    			attr_dev(div, "class", "error svelte-pc97j9");
    			add_location(div, file$8, 29, 4, 675);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 4) set_data_dev(t, /*error*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(29:18) ",
    		ctx
    	});

    	return block;
    }

    // (27:2) {#if loading}
    function create_if_block$3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loading about page...";
    			attr_dev(div, "class", "loading svelte-pc97j9");
    			add_location(div, file$8, 27, 4, 603);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(27:2) {#if loading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*loading*/ ctx[1]) return create_if_block$3;
    		if (/*error*/ ctx[2]) return create_if_block_1;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "about-container svelte-pc97j9");
    			add_location(div, file$8, 25, 0, 553);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	let aboutContent = null;
    	let loading = true;
    	let error = null;

    	onMount(async () => {
    		try {
    			$$invalidate(0, aboutContent = await getAboutPage());

    			if (!aboutContent) {
    				$$invalidate(2, error = 'About page content not found.');
    			}

    			$$invalidate(1, loading = false);
    		} catch(err) {
    			console.error('Error loading about page:', err);
    			$$invalidate(2, error = 'Failed to load about page. Please try again later.');
    			$$invalidate(1, loading = false);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		getAboutPage,
    		aboutContent,
    		loading,
    		error
    	});

    	$$self.$inject_state = $$props => {
    		if ('aboutContent' in $$props) $$invalidate(0, aboutContent = $$props.aboutContent);
    		if ('loading' in $$props) $$invalidate(1, loading = $$props.loading);
    		if ('error' in $$props) $$invalidate(2, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [aboutContent, loading, error];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/components/Nav.svelte generated by Svelte v3.59.2 */
    const file$7 = "src/components/Nav.svelte";

    // (39:4) <Link to="/">
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("when trees fall...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(39:4) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (43:4) <Link to="/" class="nav-link {path === '/' ? 'active' : ''}" on:click={() => path = '/'}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(43:4) <Link to=\\\"/\\\" class=\\\"nav-link {path === '/' ? 'active' : ''}\\\" on:click={() => path = '/'}>",
    		ctx
    	});

    	return block;
    }

    // (44:4) <Link to="/blog" class="nav-link {path.startsWith('/blog') ? 'active' : ''}" on:click={() => path = '/blog'}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Blog");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(44:4) <Link to=\\\"/blog\\\" class=\\\"nav-link {path.startsWith('/blog') ? 'active' : ''}\\\" on:click={() => path = '/blog'}>",
    		ctx
    	});

    	return block;
    }

    // (45:4) <Link to="/about" class="nav-link {path === '/about' ? 'active' : ''}" on:click={() => path = '/about'}>
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("About");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(45:4) <Link to=\\\"/about\\\" class=\\\"nav-link {path === '/about' ? 'active' : ''}\\\" on:click={() => path = '/about'}>",
    		ctx
    	});

    	return block;
    }

    // (49:6) {:else}
    function create_else_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("🌙");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(49:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (47:6) {#if darkMode}
    function create_if_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("☀️");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(47:6) {#if darkMode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let nav;
    	let div0;
    	let link0;
    	let t0;
    	let div1;
    	let link1;
    	let t1;
    	let link2;
    	let t2;
    	let link3;
    	let t3;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	link0 = new Link({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "/",
    				class: "nav-link " + (/*path*/ ctx[2] === '/' ? 'active' : ''),
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1.$on("click", /*click_handler*/ ctx[3]);

    	link2 = new Link({
    			props: {
    				to: "/blog",
    				class: "nav-link " + (/*path*/ ctx[2].startsWith('/blog') ? 'active' : ''),
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2.$on("click", /*click_handler_1*/ ctx[4]);

    	link3 = new Link({
    			props: {
    				to: "/about",
    				class: "nav-link " + (/*path*/ ctx[2] === '/about' ? 'active' : ''),
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3.$on("click", /*click_handler_2*/ ctx[5]);

    	function select_block_type(ctx, dirty) {
    		if (/*darkMode*/ ctx[0]) return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div0 = element("div");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			create_component(link2.$$.fragment);
    			t2 = space();
    			create_component(link3.$$.fragment);
    			t3 = space();
    			button = element("button");
    			if_block.c();
    			attr_dev(div0, "class", "logo");
    			add_location(div0, file$7, 37, 2, 902);
    			attr_dev(button, "class", "theme-toggle svelte-1nec5ax");
    			attr_dev(button, "aria-label", "Toggle theme");
    			add_location(button, file$7, 45, 4, 1357);
    			attr_dev(div1, "class", "nav-links svelte-1nec5ax");
    			add_location(div1, file$7, 41, 2, 978);
    			attr_dev(nav, "class", "nav svelte-1nec5ax");
    			add_location(nav, file$7, 36, 0, 882);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div0);
    			mount_component(link0, div0, null);
    			append_dev(nav, t0);
    			append_dev(nav, div1);
    			mount_component(link1, div1, null);
    			append_dev(div1, t1);
    			mount_component(link2, div1, null);
    			append_dev(div1, t2);
    			mount_component(link3, div1, null);
    			append_dev(div1, t3);
    			append_dev(div1, button);
    			if_block.m(button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*toggleDarkMode*/ ctx[1])) /*toggleDarkMode*/ ctx[1].apply(this, arguments);
    					},
    					false,
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};
    			if (dirty & /*path*/ 4) link1_changes.class = "nav-link " + (/*path*/ ctx[2] === '/' ? 'active' : '');

    			if (dirty & /*$$scope*/ 64) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};
    			if (dirty & /*path*/ 4) link2_changes.class = "nav-link " + (/*path*/ ctx[2].startsWith('/blog') ? 'active' : '');

    			if (dirty & /*$$scope*/ 64) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};
    			if (dirty & /*path*/ 4) link3_changes.class = "nav-link " + (/*path*/ ctx[2] === '/about' ? 'active' : '');

    			if (dirty & /*$$scope*/ 64) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, []);
    	let { darkMode = true } = $$props;
    	let { toggleDarkMode } = $$props;

    	// Use window.location to get the current path
    	let path = '';

    	onMount(() => {
    		// Set initial path - for hash routing, we need to get the hash part
    		updatePath();

    		// Update path when navigation occurs
    		const handleNavigation = () => {
    			updatePath();
    		};

    		// Function to extract path from hash
    		function updatePath() {
    			// For hash routing, the format is #/path
    			const hash = window.location.hash;

    			$$invalidate(2, path = hash ? hash.substring(1) : '/');
    		}

    		// Listen for navigation events
    		window.addEventListener('hashchange', handleNavigation);

    		return () => {
    			window.removeEventListener('hashchange', handleNavigation);
    		};
    	});

    	$$self.$$.on_mount.push(function () {
    		if (toggleDarkMode === undefined && !('toggleDarkMode' in $$props || $$self.$$.bound[$$self.$$.props['toggleDarkMode']])) {
    			console.warn("<Nav> was created without expected prop 'toggleDarkMode'");
    		}
    	});

    	const writable_props = ['darkMode', 'toggleDarkMode'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(2, path = '/');
    	const click_handler_1 = () => $$invalidate(2, path = '/blog');
    	const click_handler_2 = () => $$invalidate(2, path = '/about');

    	$$self.$$set = $$props => {
    		if ('darkMode' in $$props) $$invalidate(0, darkMode = $$props.darkMode);
    		if ('toggleDarkMode' in $$props) $$invalidate(1, toggleDarkMode = $$props.toggleDarkMode);
    	};

    	$$self.$capture_state = () => ({
    		Link,
    		onMount,
    		darkMode,
    		toggleDarkMode,
    		path
    	});

    	$$self.$inject_state = $$props => {
    		if ('darkMode' in $$props) $$invalidate(0, darkMode = $$props.darkMode);
    		if ('toggleDarkMode' in $$props) $$invalidate(1, toggleDarkMode = $$props.toggleDarkMode);
    		if ('path' in $$props) $$invalidate(2, path = $$props.path);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		darkMode,
    		toggleDarkMode,
    		path,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$7, create_fragment$7, safe_not_equal, { darkMode: 0, toggleDarkMode: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get darkMode() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set darkMode(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toggleDarkMode() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toggleDarkMode(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Footer.svelte generated by Svelte v3.59.2 */

    const file$6 = "src/components/Footer.svelte";

    function create_fragment$6(ctx) {
    	let footer;
    	let div1;
    	let p;
    	let t3;
    	let div0;
    	let a0;
    	let t5;
    	let a1;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div1 = element("div");
    			p = element("p");
    			p.textContent = `© ${/*currentYear*/ ctx[0]} when trees fall... All rights reserved.`;
    			t3 = space();
    			div0 = element("div");
    			a0 = element("a");
    			a0.textContent = "GitHub";
    			t5 = space();
    			a1 = element("a");
    			a1.textContent = "Twitter";
    			add_location(p, file$6, 6, 4, 127);
    			attr_dev(a0, "href", "https://github.com/whenTreesFall");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noopener noreferrer");
    			attr_dev(a0, "class", "svelte-1vrxlwl");
    			add_location(a0, file$6, 8, 6, 227);
    			attr_dev(a1, "href", "https://twitter.com/whenTreesFall");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener noreferrer");
    			attr_dev(a1, "class", "svelte-1vrxlwl");
    			add_location(a1, file$6, 9, 6, 329);
    			attr_dev(div0, "class", "footer-links svelte-1vrxlwl");
    			add_location(div0, file$6, 7, 4, 194);
    			attr_dev(div1, "class", "footer-content svelte-1vrxlwl");
    			add_location(div1, file$6, 5, 2, 94);
    			attr_dev(footer, "class", "footer svelte-1vrxlwl");
    			add_location(footer, file$6, 4, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div1);
    			append_dev(div1, p);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(div0, t5);
    			append_dev(div0, a1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const currentYear = new Date().getFullYear();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ currentYear });
    	return [currentYear];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* node_modules/svelte-icons/components/IconBase.svelte generated by Svelte v3.59.2 */

    const file$5 = "node_modules/svelte-icons/components/IconBase.svelte";

    // (18:2) {#if title}
    function create_if_block$1(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[0]);
    			add_location(title_1, file$5, 18, 4, 298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(18:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let svg;
    	let if_block_anchor;
    	let current;
    	let if_block = /*title*/ ctx[0] && create_if_block$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			if_block_anchor = empty$2();
    			if (default_slot) default_slot.c();
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			attr_dev(svg, "class", "svelte-c8tyih");
    			add_location(svg, file$5, 16, 0, 229);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, if_block_anchor);

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(svg, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*viewBox*/ 2) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconBase', slots, ['default']);
    	let { title = null } = $$props;
    	let { viewBox } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (viewBox === undefined && !('viewBox' in $$props || $$self.$$.bound[$$self.$$.props['viewBox']])) {
    			console.warn("<IconBase> was created without expected prop 'viewBox'");
    		}
    	});

    	const writable_props = ['title', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconBase> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, viewBox, $$scope, slots];
    }

    class IconBase extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, { title: 0, viewBox: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconBase",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get title() {
    		throw new Error("<IconBase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<IconBase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<IconBase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<IconBase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-icons/fa/FaMusic.svelte generated by Svelte v3.59.2 */
    const file$4 = "node_modules/svelte-icons/fa/FaMusic.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$3(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M511.99 32.01c0-21.71-21.1-37.01-41.6-30.51L150.4 96c-13.3 4.2-22.4 16.5-22.4 30.5v261.42c-10.05-2.38-20.72-3.92-32-3.92-53.02 0-96 28.65-96 64s42.98 64 96 64 96-28.65 96-64V214.31l256-75.02v184.63c-10.05-2.38-20.72-3.92-32-3.92-53.02 0-96 28.65-96 64s42.98 64 96 64 96-28.65 96-64l-.01-351.99z");
    			add_location(path, file$4, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign$1(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaMusic', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign$1(assign$1({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign$1(assign$1({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaMusic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaMusic",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* node_modules/svelte-icons/fa/FaVolumeMute.svelte generated by Svelte v3.59.2 */
    const file$3 = "node_modules/svelte-icons/fa/FaVolumeMute.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$2(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM461.64 256l45.64-45.64c6.3-6.3 6.3-16.52 0-22.82l-22.82-22.82c-6.3-6.3-16.52-6.3-22.82 0L416 210.36l-45.64-45.64c-6.3-6.3-16.52-6.3-22.82 0l-22.82 22.82c-6.3 6.3-6.3 16.52 0 22.82L370.36 256l-45.63 45.63c-6.3 6.3-6.3 16.52 0 22.82l22.82 22.82c6.3 6.3 16.52 6.3 22.82 0L416 301.64l45.64 45.64c6.3 6.3 16.52 6.3 22.82 0l22.82-22.82c6.3-6.3 6.3-16.52 0-22.82L461.64 256z");
    			add_location(path, file$3, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign$1(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaVolumeMute', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign$1(assign$1({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign$1(assign$1({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaVolumeMute extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaVolumeMute",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* node_modules/svelte-icons/fa/FaVolumeUp.svelte generated by Svelte v3.59.2 */
    const file$2 = "node_modules/svelte-icons/fa/FaVolumeUp.svelte";

    // (4:8) <IconBase viewBox="0 0 576 512" {...$$props}>
    function create_default_slot$1(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z");
    			add_location(path, file$2, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 576 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 576 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign$1(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaVolumeUp', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign$1(assign$1({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign$1(assign$1({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaVolumeUp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaVolumeUp",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/components/AudioPlayer.svelte generated by Svelte v3.59.2 */

    const { console: console_1 } = globals;
    const file$1 = "src/components/AudioPlayer.svelte";

    // (101:4) {:else}
    function create_else_block(ctx) {
    	let favolumeup;
    	let current;
    	favolumeup = new FaVolumeUp({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(favolumeup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(favolumeup, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(favolumeup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(favolumeup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(favolumeup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(101:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (99:4) {#if muted}
    function create_if_block(ctx) {
    	let favolumemute;
    	let current;
    	favolumemute = new FaVolumeMute({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(favolumemute.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(favolumemute, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(favolumemute.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(favolumemute.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(favolumemute, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(99:4) {#if muted}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let button0;
    	let div0;
    	let famusic;
    	let div0_class_value;
    	let button0_aria_label_value;
    	let t0;
    	let button1;
    	let current_block_type_index;
    	let if_block;
    	let button1_aria_label_value;
    	let t1;
    	let input;
    	let current;
    	let mounted;
    	let dispose;
    	famusic = new FaMusic({ $$inline: true });
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*muted*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button0 = element("button");
    			div0 = element("div");
    			create_component(famusic.$$.fragment);
    			t0 = space();
    			button1 = element("button");
    			if_block.c();
    			t1 = space();
    			input = element("input");
    			attr_dev(div0, "class", div0_class_value = "icon-container " + (/*playing*/ ctx[0] ? 'spin' : '') + " svelte-5fchi6");
    			add_location(div0, file$1, 92, 4, 2212);
    			attr_dev(button0, "class", "music-toggle svelte-5fchi6");
    			attr_dev(button0, "aria-label", button0_aria_label_value = /*playing*/ ctx[0] ? 'Pause music' : 'Play music');
    			add_location(button0, file$1, 91, 2, 2102);
    			attr_dev(button1, "class", "volume-toggle svelte-5fchi6");
    			attr_dev(button1, "aria-label", button1_aria_label_value = /*muted*/ ctx[2] ? 'Unmute' : 'Mute');
    			add_location(button1, file$1, 97, 2, 2311);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "min", "0");
    			attr_dev(input, "max", "1");
    			attr_dev(input, "step", "0.01");
    			attr_dev(input, "class", "volume-slider svelte-5fchi6");
    			input.value = /*volume*/ ctx[1];
    			attr_dev(input, "aria-label", "Volume control");
    			add_location(input, file$1, 105, 2, 2504);
    			attr_dev(div1, "class", "audio-controls svelte-5fchi6");
    			add_location(div1, file$1, 90, 0, 2071);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button0);
    			append_dev(button0, div0);
    			mount_component(famusic, div0, null);
    			append_dev(div1, t0);
    			append_dev(div1, button1);
    			if_blocks[current_block_type_index].m(button1, null);
    			append_dev(div1, t1);
    			append_dev(div1, input);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*togglePlay*/ ctx[3], false, false, false, false),
    					listen_dev(button1, "click", /*toggleMute*/ ctx[5], false, false, false, false),
    					listen_dev(input, "input", /*handleVolumeChange*/ ctx[4], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*playing*/ 1 && div0_class_value !== (div0_class_value = "icon-container " + (/*playing*/ ctx[0] ? 'spin' : '') + " svelte-5fchi6")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty & /*playing*/ 1 && button0_aria_label_value !== (button0_aria_label_value = /*playing*/ ctx[0] ? 'Pause music' : 'Play music')) {
    				attr_dev(button0, "aria-label", button0_aria_label_value);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(button1, null);
    			}

    			if (!current || dirty & /*muted*/ 4 && button1_aria_label_value !== (button1_aria_label_value = /*muted*/ ctx[2] ? 'Unmute' : 'Mute')) {
    				attr_dev(button1, "aria-label", button1_aria_label_value);
    			}

    			if (!current || dirty & /*volume*/ 2) {
    				prop_dev(input, "value", /*volume*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(famusic.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(famusic.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(famusic);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AudioPlayer', slots, []);
    	let audio;
    	let playing = false;
    	let volume = 0.5;
    	let muted = false;

    	onMount(() => {
    		// Create audio element
    		audio = new Audio('./music/tape.mp3');

    		audio.loop = true;
    		audio.volume = volume;

    		// Check if music preference is stored in localStorage
    		const storedPlaying = localStorage.getItem('musicPlaying');

    		if (storedPlaying === 'true') {
    			playAudio();
    		}

    		// Check if volume preference is stored in localStorage
    		const storedVolume = localStorage.getItem('musicVolume');

    		if (storedVolume !== null) {
    			$$invalidate(1, volume = parseFloat(storedVolume));
    			if (audio) audio.volume = volume;
    		}

    		// Check if muted preference is stored in localStorage
    		const storedMuted = localStorage.getItem('musicMuted');

    		if (storedMuted !== null) {
    			$$invalidate(2, muted = storedMuted === 'true');
    			if (audio) audio.muted = muted;
    		}

    		// Clean up on component destruction
    		return () => {
    			if (audio) {
    				audio.pause();
    				audio = null;
    			}
    		};
    	});

    	function togglePlay() {
    		if (playing) {
    			pauseAudio();
    		} else {
    			playAudio();
    		}
    	}

    	function playAudio() {
    		if (audio) {
    			audio.play().then(() => {
    				$$invalidate(0, playing = true);
    				localStorage.setItem('musicPlaying', 'true');
    			}).catch(error => {
    				console.error('Error playing audio:', error);
    			});
    		}
    	}

    	function pauseAudio() {
    		if (audio) {
    			audio.pause();
    			$$invalidate(0, playing = false);
    			localStorage.setItem('musicPlaying', 'false');
    		}
    	}

    	function handleVolumeChange(event) {
    		$$invalidate(1, volume = event.target.value);

    		if (audio) {
    			audio.volume = volume;
    		}

    		localStorage.setItem('musicVolume', volume.toString());
    	}

    	function toggleMute() {
    		$$invalidate(2, muted = !muted);

    		if (audio) {
    			audio.muted = muted;
    		}

    		localStorage.setItem('musicMuted', muted.toString());
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<AudioPlayer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		FaMusic,
    		FaVolumeUp,
    		FaVolumeMute,
    		audio,
    		playing,
    		volume,
    		muted,
    		togglePlay,
    		playAudio,
    		pauseAudio,
    		handleVolumeChange,
    		toggleMute
    	});

    	$$self.$inject_state = $$props => {
    		if ('audio' in $$props) audio = $$props.audio;
    		if ('playing' in $$props) $$invalidate(0, playing = $$props.playing);
    		if ('volume' in $$props) $$invalidate(1, volume = $$props.volume);
    		if ('muted' in $$props) $$invalidate(2, muted = $$props.muted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [playing, volume, muted, togglePlay, handleVolumeChange, toggleMute];
    }

    class AudioPlayer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AudioPlayer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    // (54:0) <Router {url} basepath={basePath} mode="hash">
    function create_default_slot(ctx) {
    	let div;
    	let nav;
    	let t0;
    	let main;
    	let route0;
    	let t1;
    	let route1;
    	let t2;
    	let route2;
    	let t3;
    	let route3;
    	let t4;
    	let footer;
    	let t5;
    	let audioplayer;
    	let current;

    	nav = new Nav({
    			props: {
    				darkMode: /*darkMode*/ ctx[2],
    				toggleDarkMode: /*toggleDarkMode*/ ctx[3]
    			},
    			$$inline: true
    		});

    	route0 = new Route({
    			props: { path: "/", component: Home },
    			$$inline: true
    		});

    	route1 = new Route({
    			props: { path: "/blog", component: Blog },
    			$$inline: true
    		});

    	route2 = new Route({
    			props: { path: "/blog/:slug", component: BlogPost },
    			$$inline: true
    		});

    	route3 = new Route({
    			props: { path: "/about", component: About },
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });
    	audioplayer = new AudioPlayer({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(nav.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t1 = space();
    			create_component(route1.$$.fragment);
    			t2 = space();
    			create_component(route2.$$.fragment);
    			t3 = space();
    			create_component(route3.$$.fragment);
    			t4 = space();
    			create_component(footer.$$.fragment);
    			t5 = space();
    			create_component(audioplayer.$$.fragment);
    			attr_dev(main, "class", "svelte-uutuxy");
    			add_location(main, file, 57, 4, 1634);
    			attr_dev(div, "class", "app-container svelte-uutuxy");
    			add_location(div, file, 54, 2, 1557);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(nav, div, null);
    			append_dev(div, t0);
    			append_dev(div, main);
    			mount_component(route0, main, null);
    			append_dev(main, t1);
    			mount_component(route1, main, null);
    			append_dev(main, t2);
    			mount_component(route2, main, null);
    			append_dev(main, t3);
    			mount_component(route3, main, null);
    			append_dev(div, t4);
    			mount_component(footer, div, null);
    			append_dev(div, t5);
    			mount_component(audioplayer, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const nav_changes = {};
    			if (dirty & /*darkMode*/ 4) nav_changes.darkMode = /*darkMode*/ ctx[2];
    			nav.$set(nav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(nav.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(audioplayer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(nav.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(audioplayer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(nav);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(footer);
    			destroy_component(audioplayer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(54:0) <Router {url} basepath={basePath} mode=\\\"hash\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				basepath: /*basePath*/ ctx[1],
    				mode: "hash",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];
    			if (dirty & /*basePath*/ 2) router_changes.basepath = /*basePath*/ ctx[1];

    			if (dirty & /*$$scope, darkMode*/ 36) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let basePath = '';
    	let { url = '' } = $$props;

    	// Dark mode state
    	let darkMode = true; // Default to dark mode for the black and red theme

    	onMount(() => {
    		// Check if dark mode preference is stored in localStorage
    		const storedDarkMode = localStorage.getItem('darkMode');

    		if (storedDarkMode !== null) {
    			$$invalidate(2, darkMode = storedDarkMode === 'true');
    		}

    		// Apply dark mode class
    		updateDarkMode();

    		// Get the base path from window if available
    		if (typeof window !== 'undefined' && window.basePath !== undefined) {
    			$$invalidate(1, basePath = window.basePath);
    		}
    	});

    	// Toggle dark mode
    	function toggleDarkMode() {
    		$$invalidate(2, darkMode = !darkMode);
    		localStorage.setItem('darkMode', darkMode.toString());
    		updateDarkMode();
    	}

    	// Update dark mode class on body
    	function updateDarkMode() {
    		if (darkMode) {
    			document.body.classList.remove('light-mode');
    		} else {
    			document.body.classList.add('light-mode');
    		}
    	}

    	const writable_props = ['url'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Router,
    		Route,
    		Home,
    		Blog,
    		BlogPost,
    		About,
    		Nav,
    		Footer,
    		AudioPlayer,
    		basePath,
    		url,
    		darkMode,
    		toggleDarkMode,
    		updateDarkMode
    	});

    	$$self.$inject_state = $$props => {
    		if ('basePath' in $$props) $$invalidate(1, basePath = $$props.basePath);
    		if ('url' in $$props) $$invalidate(0, url = $$props.url);
    		if ('darkMode' in $$props) $$invalidate(2, darkMode = $$props.darkMode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url, basePath, darkMode, toggleDarkMode];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance, create_fragment, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
      target: document.getElementById('app')
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
